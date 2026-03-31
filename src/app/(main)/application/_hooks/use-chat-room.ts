'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApplicationChatMessages, sendApplicationChatMessage } from '@/api/breeder';
import type { ChatMessage } from '../_types/chat';

async function fetchChatMessages(applicationId: string): Promise<ChatMessage[]> {
  const messages = await getApplicationChatMessages(applicationId);
  return messages.map((message) => ({
    id: message.messageId,
    senderId: message.senderRole,
    content: message.content,
    timestamp: message.sentAt,
  }));
}

async function sendChatMessage(applicationId: string, content: string): Promise<void> {
  await sendApplicationChatMessage(applicationId, { content });
}

export function useChatRoom(applicationId: string) {
  const queryClient = useQueryClient();

  const messagesQuery = useQuery({
    queryKey: ['chat-messages', applicationId],
    queryFn: () => fetchChatMessages(applicationId),
    enabled: !!applicationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => sendChatMessage(applicationId, content),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['chat-messages', applicationId] });
    },
  });

  // TODO(socket): applicationId room 구독 추가
  // - 소켓 이벤트 수신 시 queryClient.setQueryData로 메시지 캐시 즉시 반영
  // - 연결 해제/재연결 처리 및 unread 카운트 정책 연결

  return {
    messages: messagesQuery.data ?? [],
    isLoadingMessages: messagesQuery.isLoading,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
  };
}

