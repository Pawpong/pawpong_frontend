'use client';

import { useCallback } from 'react';
import type { ApplicationItem } from '../../_hooks/use-applications';
import { useChatRoom } from '../../_hooks/use-chat-room';
import { ChatMessageArea } from './chat-message-area';
import { ChatInput } from './chat-input';

interface ChatRoomProps {
  application: ApplicationItem;
}

export function ChatRoom({ application }: ChatRoomProps) {
  const { messages, sendMessage, isSending } = useChatRoom(application.applicationId);

  const handleSend = useCallback(
    async (content: string) => {
      await sendMessage(content);
    },
    [sendMessage],
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-tertiary-500">
      <ChatMessageArea messages={messages} />
      <ChatInput onSend={handleSend} disabled={isSending} />
    </div>
  );
}
