export interface ChatMessage {
  id: string;
  senderId: 'breeder' | 'adopter' | 'system';
  content: string;
  timestamp: string | Date;
}

