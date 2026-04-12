'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { WsChatMessage } from '../_types/chat';

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname.includes('dev.pawpong.kr')) return 'https://dev-api.pawpong.kr';
    if (hostname.includes('pawpong.kr')) return 'https://api.pawpong.kr';
    if (hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:8080';
  }
  return 'https://dev-api.pawpong.kr';
}

// 싱글톤 소켓 — 페이지 전환 시 재연결 방지
let socketInstance: Socket | null = null;
let socketToken: string | null = null;

function getSocket(token: string): Socket {
  // 토큰이 바뀌면 기존 소켓 종료 후 재생성
  if (socketInstance && socketToken !== token) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  if (!socketInstance) {
    socketInstance = io(`${getBaseUrl()}/chat`, {
      auth: { token },
      query: { token },
      transports: ['websocket', 'polling'],
      autoConnect: false,
    });
    socketToken = token;
  }

  return socketInstance;
}

interface UseChatSocketOptions {
  roomId: string;
  token: string | null;
  onNewMessage: (msg: WsChatMessage) => void;
  onMessagesRead?: (data: { roomId: string; readBy: string }) => void;
  onConnectError?: () => void;
}

export function useChatSocket({
  roomId,
  token,
  onNewMessage,
  onMessagesRead,
  onConnectError,
}: UseChatSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token || !roomId) return;

    const socket = getSocket(token);
    socketRef.current = socket;

    const handleConnect = () => {
      setIsConnected(true);
      socket.emit('join_room', { roomId });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleConnectError = () => {
      setIsConnected(false);
      onConnectError?.();
    };

    if (socket.connected) {
      setIsConnected(true);
      socket.emit('join_room', { roomId });
    } else {
      socket.connect();
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('new_message', onNewMessage);
    if (onMessagesRead) socket.on('messages_read', onMessagesRead);

    return () => {
      socket.emit('leave_room', { roomId });
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('new_message', onNewMessage);
      if (onMessagesRead) socket.off('messages_read', onMessagesRead);
    };
  }, [roomId, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(
    (content: string, messageType = 'text') => {
      socketRef.current?.emit('send_message', { roomId, content, messageType });
    },
    [roomId],
  );

  const markAsRead = useCallback(() => {
    socketRef.current?.emit('read_messages', { roomId });
  }, [roomId]);

  return { sendMessage, markAsRead, isConnected };
}
