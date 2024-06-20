import type { DbOptions, MongoClientOptions } from 'mongodb';

const config: {
  name: string;
  slogan: string;
  handler?: string;
  MongoURI: string;
  MongoDBName: string;
  MongoDBOptions?: DbOptions;
  MongoClientOptions?: MongoClientOptions;
} = {
  name: 'Chatter',
  slogan: 'Chat Together!',
  handler: undefined,
  MongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  MongoDBName: process.env.MONGODB_DB || 'chatter',
  MongoDBOptions: {},
  MongoClientOptions: {},
};

export default config;
