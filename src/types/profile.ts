// import { Contacts } from "./contacts";
import { Auth } from './auth';

export type PublicProfile = {
  id: string;
  avatar: string;
  gender: 'Male' | 'Female' | 'Other' | 'Unknown';
  status: string;
  nickname: string;
  username: string;
};

export type PrivateProfile = PublicProfile & {
  password: string;
  email: string;
  contactIds: string[];
};

export type Profile = PublicProfile | PrivateProfile;

export type GetProfilesByIds = {
  ids: string[];
  auth: Auth;
};

export type GetProfileByUsername = {
  username: string;
  auth: Auth;
};

export type GetProfilesByNickname = {
  nickname: string;
  auth: Auth;
};

export type GetProfileByEmail = {
  email: string;
  auth: Auth;
};

export type GetProfile =
  | GetProfilesByIds
  | GetProfileByUsername
  | GetProfilesByNickname
  | GetProfileByEmail;

export type CreateProfile = {
  nickname: string;
  username: string;
  // raw
  password: string;
  email: string;
  // auth: Auth;
};

export type AddProfileToContact = {
  id: string;
  auth: Auth;
};

export type RemoveProfile = {
  id: string;
  auth: Auth;
};
