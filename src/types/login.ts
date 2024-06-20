import { PrivateProfile } from './profile';

export type Login = Pick<PrivateProfile, 'username' | 'password'>;
