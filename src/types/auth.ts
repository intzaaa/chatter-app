import { PrivateProfile } from './profile';

export type Auth = Pick<PrivateProfile, 'id' | 'password'>;
