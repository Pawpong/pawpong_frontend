import apiClient from './api';
import type { ChatRoom, ChatMessageDto, CreateChatRoomRequest } from '@/app/(main)/application/_types/chat';

/** 백엔드가 `id` 또는 `roomId`로 줄 수 있음 — 내부는 항상 `id` 사용 */
function normalizeChatRoom(raw: ChatRoom & { roomId?: string }): ChatRoom {
  const id = raw.id ?? raw.roomId;
  if (!id) {
    throw new Error('채팅방 응답에 id(roomId)가 없습니다.');
  }
  return { ...raw, id };
}

function isChatRoomShape(v: unknown): v is ChatRoom & { roomId?: string } {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return typeof o.id === 'string' || typeof o.roomId === 'string';
}

/**
 * `{ success, data }` 래퍼 또는 본문만 오는 응답 모두 처리
 * (Nest 일부 엔드포인트는 엔티티만 직렬화하는 경우가 있음)
 */
function parseCreateRoomPayload(body: unknown): ChatRoom {
  if (!body || typeof body !== 'object') {
    throw new Error('Failed to create chat room');
  }
  const o = body as Record<string, unknown>;
  if ('success' in o && o.success === false) {
    throw new Error(typeof o.message === 'string' ? o.message : 'Failed to create chat room');
  }
  if ('data' in o && o.data != null && typeof o.data === 'object') {
    const inner = o.data as Record<string, unknown>;
    if (isChatRoomShape(inner)) {
      return normalizeChatRoom(inner as ChatRoom & { roomId?: string });
    }
  }
  if (isChatRoomShape(o)) {
    return normalizeChatRoom(o as ChatRoom & { roomId?: string });
  }
  throw new Error('Failed to create chat room');
}

function parseRoomListPayload(body: unknown): ChatRoom[] {
  if (body == null) return [];

  if (Array.isArray(body)) {
    return body.filter(isChatRoomShape).map((r) => normalizeChatRoom(r));
  }

  if (typeof body !== 'object') return [];

  const o = body as Record<string, unknown>;
  if ('success' in o && o.success === false) {
    return [];
  }
  if ('data' in o && o.data != null) {
    const d = o.data;
    if (Array.isArray(d)) {
      return d.filter(isChatRoomShape).map((r) => normalizeChatRoom(r));
    }
    if (isChatRoomShape(d)) {
      return [normalizeChatRoom(d)];
    }
  }

  if (isChatRoomShape(o)) {
    return [normalizeChatRoom(o as ChatRoom & { roomId?: string })];
  }

  return [];
}

/**
 * 채팅방 생성 또는 기존 방 반환 (adopter 전용)
 * POST /api/chat/rooms
 * 동일 adopter+breeder active 방이 있으면 그 방을 반환 (HTTP 200)
 */
export const createChatRoom = async (req: CreateChatRoomRequest): Promise<ChatRoom> => {
  const response = await apiClient.post<unknown>('/api/chat/rooms', req);
  return parseCreateRoomPayload(response.data);
};

/**
 * 내 채팅방 목록 조회 (adopter/breeder 모두 가능)
 * GET /api/chat/rooms
 * 정렬: lastMessageAt 내림차순
 */
export const getMyChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await apiClient.get<unknown>('/api/chat/rooms');
  return parseRoomListPayload(response.data);
};

function parseMessagesPayload(body: unknown): ChatMessageDto[] {
  if (Array.isArray(body)) {
    return body as ChatMessageDto[];
  }
  if (!body || typeof body !== 'object') {
    throw new Error('Failed to fetch chat messages');
  }
  const o = body as Record<string, unknown>;
  if ('success' in o && o.success === false) {
    throw new Error(typeof o.message === 'string' ? o.message : 'Failed to fetch chat messages');
  }
  if ('data' in o && Array.isArray(o.data)) {
    return o.data as ChatMessageDto[];
  }
  throw new Error('Failed to fetch chat messages');
}

/**
 * 메시지 목록 조회 (최신이 배열 앞)
 * GET /api/chat/rooms/:roomId/messages?limit=50&before=ISO
 */
export const getChatMessages = async (
  roomId: string,
  limit = 50,
  before?: string,
): Promise<ChatMessageDto[]> => {
  const response = await apiClient.get<unknown>(`/api/chat/rooms/${roomId}/messages`, {
    params: { limit, ...(before && { before }) },
  });

  return parseMessagesPayload(response.data);
};

/**
 * 채팅방 닫기 (참가자만)
 * DELETE /api/chat/rooms/:roomId
 */
export const closeChatRoom = async (roomId: string): Promise<{ success: true }> => {
  const response = await apiClient.delete<{ success: true }>(`/api/chat/rooms/${roomId}`);
  return response.data;
};
