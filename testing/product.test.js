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
  const productId = 'c3fe7eb8076e4de58d8d87c5';

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
      name: 'Test Product',
      price: 100
    };

    await supertest(app)
      .put(`/products/${productId}`)
      .send(product)
      .expect(204);
  });

  it('should return 400 if product is invalid', async () => {
    const product = {
      name: 'Test Product',
      price: 'invalid'
    };

    await supertest(app)
      .put(`/products/${productId}`)
      .send(product)
      .expect(400);
  });
});
