'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import type { ChatMessage } from '../../_types/chat';
import { LoadingState } from '@/components/loading-state';

interface ChatMessageAreaProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function SystemMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-center px-4 py-2">
      <div className="bg-tertiary-600/70 rounded-full px-4 py-2 max-w-[80%]">
        <p className="text-caption text-grayscale-gray6 text-center">{message.content}</p>
      </div>
    </div>
  );
}

function OutgoingBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end gap-2 px-4">
      <div className="max-w-[75%]">
        <div className="bg-primary-500 rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-body-s text-white whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-[11px] text-grayscale-gray4 mt-1 block text-right">
          {formatTime(new Date(message.createdAt))}
        </span>
      </div>
    </div>
  );
}

function IncomingBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-start gap-2 px-4">
      <div className="max-w-[75%]">
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-body-s text-grayscale-gray7 whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-[11px] text-grayscale-gray4 mt-1 block">
          {formatTime(new Date(message.createdAt))}
        </span>
      </div>
    </div>
  );
}

export function ChatMessageArea({ messages, isLoading }: ChatMessageAreaProps) {
  const { user } = useAuthStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
      {messages.map((msg) => {
        if (msg.senderRole === 'system') {
          return <SystemMessage key={msg.id} message={msg} />;
        }

        // senderId(userId)로 내/외 메시지 구분
        const isOutgoing = msg.senderId === user?.userId;

        return isOutgoing ? (
          <OutgoingBubble key={msg.id} message={msg} />
        ) : (
          <IncomingBubble key={msg.id} message={msg} />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
