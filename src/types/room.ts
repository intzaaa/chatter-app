import { Auth } from './auth';
import { Message } from './message';
import { PublicProfile } from './profile';

export type Member = {
  id: string;
  // default to 50
  power: number;
};

export type AddMember = {
  id: string;
  roomId: string;
  auth: Auth;
};

export type Room = {
  id: string;
  avatar: string;
  name: string;
  type: 'public' | 'private';
  members: Member[];
  messageIds: string[];
};

export type GetRoomById = {
  id: string;
  auth: Auth;
};

export type GetRoomsByName = {
  name: string;
  auth: Auth;
};

export type GetRoomsByMemberIds = {
  memberIds: string[];
  auth: Auth;
};

export type GetRoom = GetRoomById | GetRoomsByName;

export type CreateRoom = {
  name: string;
  type: 'public' | 'private';
  otherMemberIds: string[];
  auth: Auth;
};

export type RemoveRoom = {
  id: string;
  auth: Auth;
};
