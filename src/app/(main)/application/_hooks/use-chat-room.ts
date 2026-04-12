'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { getChatMessages } from '@/app/api/chat';
import { useChatSocket } from './use-chat-socket';
import { getCookie } from '@/app/api/cookie-utils';
import type { ChatMessage, WsChatMessage } from '../_types/chat';

/** WS 페이로드 → 통합 ChatMessage 정규화 */
function normalizeWsMessage(ws: WsChatMessage): ChatMessage {
  return {
    id: ws.messageId,
    roomId: ws.roomId,
    senderId: ws.senderId,
    senderRole: ws.senderRole,
    content: ws.content,
    messageType: ws.messageType,
    isRead: ws.isRead,
    createdAt: typeof ws.createdAt === 'string' ? ws.createdAt : new Date(ws.createdAt).toISOString(),
  };
}

export function useChatRoom(roomId: string | null) {
  const queryClient = useQueryClient();
  const token = getCookie('accessToken');
  const [usePolling, setUsePolling] = useState(false);

  // 소켓 연결 실패 시 폴링 fallback 활성화
  const handleConnectError = useCallback(() => {
    setUsePolling(true);
  }, []);

  // REST: 초기 메시지 로드 (최신이 앞 → reverse로 구→최신 정렬)
  const messagesQuery = useQuery({
    queryKey: ['chat-messages', roomId],
    queryFn: () => getChatMessages(roomId!, 50),
    enabled: !!roomId,
    refetchInterval: usePolling ? 3000 : false,
    select: (data): ChatMessage[] =>
      data
        .slice()
        .reverse()
        .map((m) => ({
          id: m.id,
          roomId: m.roomId,
          senderId: m.senderId,
          senderRole: m.senderRole,
          content: m.content,
          messageType: m.messageType,
          isRead: m.isRead,
          createdAt: m.createdAt,
        })),
  });

  // WS 수신 메시지를 캐시에 즉시 추가
  const handleNewMessage = useCallback(
    (ws: WsChatMessage) => {
      if (ws.roomId !== roomId) return;
      const normalized = normalizeWsMessage(ws);
      queryClient.setQueryData<ChatMessage[]>(['chat-messages', roomId], (prev = []) => {
        if (prev.some((m) => m.id === normalized.id)) return prev;
        return [...prev, normalized];
      });
      void queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
    },
    [roomId, queryClient],
  );

  const { sendMessage: emitSendMessage, markAsRead } = useChatSocket({
    roomId: roomId ?? '',
    token,
    onNewMessage: handleNewMessage,
    onConnectError: handleConnectError,
  });

  const sendMessage = useCallback(
    (content: string) => {
      emitSendMessage(content);
      void queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
    },
    [emitSendMessage, queryClient],
  );

  return {
    messages: messagesQuery.data ?? [],
    isLoadingMessages: messagesQuery.isLoading,
    sendMessage,
    markAsRead,
  };
}
