import { Db } from 'mongodb';

import config from '~/config';
import { Auth } from '~/types/auth';
import { PrivateProfile } from '~/types/profile';

export const getDb = async () => {
  const { MongoClient } = await import('mongodb');
  const client = await MongoClient.connect(
    config.MongoURI,
    config.MongoClientOptions,
  );
  return client.db(config.MongoDBName, config.MongoDBOptions);
};

export const formDataToObject = async <T>(formData: FormData) => {
  return Object.fromEntries(formData.entries()) as Partial<T>;
};

export const auth = async (auth: Auth, db: Db) => {
  const collection = db.collection<PrivateProfile>('profiles');
  const profile = await collection.findOne({
    id: auth.id,
  });
  if (profile === null) return false;
  return profile.password === auth.password;
};
