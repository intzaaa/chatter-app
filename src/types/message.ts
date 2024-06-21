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
  from: number;
  to: number;
  auth: Auth;
};

export type GetMessagesByIds = {
  messageIds: string[];
  auth: Auth;
};

export type GetMessage = GetMessagesByRoomId | GetMessagesByIds;

export type CreateMessage = {
  roomId: string;
  content: string;
  auth: Auth;
};

export type AddMessages = {
  ids: string[];
  roomId: string;
  auth: Auth;
};
