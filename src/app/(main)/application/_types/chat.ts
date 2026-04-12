/** 채팅방 (GET /api/chat/rooms 응답) — 런타임에 `roomId`만 오는 경우 정규화 */
export interface ChatRoom {
  id: string;
  /** Swagger 등 문서상 roomId만 올 때 대비 (정규화 후 제거 가능) */
  roomId?: string;
  adopterId: string;
  breederId: string;
  applicationId?: string;
  status: 'active' | 'closed';
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
}

/** REST 메시지 (GET /api/chat/rooms/:roomId/messages 응답) — 필드명 "id" */
export interface ChatMessageDto {
  id: string;
  roomId: string;
  senderId: string;
  senderRole: 'adopter' | 'breeder' | 'system';
  content: string;
  messageType: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt: string;
}

/** WebSocket new_message 페이로드 — 필드명 "messageId" (REST의 "id"와 동일 값) */
export interface WsChatMessage {
  messageId: string;
  roomId: string;
  senderId: string;
  senderRole: 'adopter' | 'breeder' | 'system';
  receiverId: string;
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
}

/** UI 통합 메시지 타입 (REST + WS 정규화) */
export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderRole: 'adopter' | 'breeder' | 'system';
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
}

/** 채팅방 생성 요청 (adopter 전용) */
export interface CreateChatRoomRequest {
  breederId: string;
  applicationId?: string;
}
