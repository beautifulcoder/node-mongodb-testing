import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongodb = await MongoMemoryServer.create();

export async function connectToDatabase() {
  if (process.env.NODE_ENV === 'test') {
    const uri = mongodb.getUri();

    await mongoose.connect(uri);

    console.log('Connected to in-memory database');

    return;
  }

  try {
    await mongoose.connect('mongodb://localhost:27017/myapp');

    console.log('Connected to database');
  } catch (error) {
    console.error('Error connecting to database', error);
  }
}

export async function disconnectFromDatabase() {
  if (process.env.NODE_ENV === 'test') {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongodb.stop();
  }

  await mongoose.disconnect();

  console.log('Disconnected from database');
}

export async function clearCollections() {
  const collections = mongoose.connection.collections;

  if (process.env.NODE_ENV !== 'test') {
    throw new Error('clearCollections can only be used in test environment');
  }

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}
