import supertest from 'supertest';
import { jest } from '@jest/globals';
import { app } from '../src/index.js';
import {
  connectToDatabase,
  disconnectFromDatabase,
  clearCollections
} from '../src/db.js';

jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Product API PUT', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  beforeEach(async () => {
    await clearCollections();
  });

  it('should update a product', async () => {
    const product = {
      id: 1,
      name: 'Test Product',
      price: 100
    };

    await supertest(app)
      .put('/products/1')
      .send(product)
      .expect(204);
  });

  it('should return 400 if product is invalid', async () => {
    const product = {
      id: 1,
      name: 'Test Product',
      price: 'invalid'
    };

    await supertest(app)
      .put('/products/1')
      .send(product)
      .expect(400);
  });
});
