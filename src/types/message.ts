import { Auth } from './auth';

export type Message = {
  id: string;
  owner: string;
  rooms: string[];
  content: string;
  timestamp: number;
};

export type GetMessagesByRoomId = {
  roomId: string;
  sinceTimestamp: number;
  auth: Auth;
};

export type GetMessagesByMessageIds = {
  messageIds: string[];
  auth: Auth;
};

export type GetMessage = GetMessagesByRoomId | GetMessagesByMessageIds;

export type CreateMessage = Omit<Message, 'timestamp' | 'status'> & {
  auth: Auth;
};

export type AddMessages = {
  ids: string[];
  roomId: string;

  auth: Auth;
};
