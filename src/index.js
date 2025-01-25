import express from 'express';
import { connectToDatabase, disconnectFromDatabase } from './db.js';
import { ProductModel } from './product.js';

export const app = express();
app.use(express.json());

app.put('/products/:id', async (req, res) => {
  try {
    const product = new ProductModel(req.body);

    await product.validate();
    await ProductModel.updateOne(
      { id: req.params.id },
      { $set: req.body },
      { upsert: true });

    res.status(204).send(`Product ${req.params.id} updated`);
  } catch (err) {
    console.error(err);
    res.status(400).send(`Error updating product ${req.params.id}`);
  }
});

if (process.env.NODE_ENV !== 'test') {
  await connectToDatabase();

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

  process.on('SIGINT', async () => {
    await disconnectFromDatabase();
    process.exit();
  });
}
