'use client';

import type { ApplicationItem } from '../../_hooks/use-applications';
import { useResolveRoom } from '../../_hooks/use-resolve-room';
import { useChatRoom } from '../../_hooks/use-chat-room';
import { ChatMessageArea } from './chat-message-area';
import { ChatInput } from './chat-input';
import { LoadingState } from '@/components/loading-state';

interface ChatRoomProps {
  application: ApplicationItem;
}

export function ChatRoom({ application }: ChatRoomProps) {
  const { roomId, isLoading: isResolvingRoom, error } = useResolveRoom(application);
  const { messages, isLoadingMessages, sendMessage } = useChatRoom(roomId);

  if (isResolvingRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-tertiary-500">
        <LoadingState />
      </div>
    );
  }

  if (!roomId && error) {
    const detail = error instanceof Error ? error.message : String(error);
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-tertiary-500 px-4 text-center">
        <p className="text-body-s text-grayscale-gray5">채팅방을 불러올 수 없습니다.</p>
        {detail ? (
          <p className="text-caption text-grayscale-gray4 max-w-md break-words">{detail}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-tertiary-500">
      <ChatMessageArea messages={messages} isLoading={isLoadingMessages} />
      <ChatInput onSend={sendMessage} disabled={!roomId} />
    </div>
  );
}
