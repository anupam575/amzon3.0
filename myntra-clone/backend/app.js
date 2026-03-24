import express from 'express';
import bodyParser from 'body-parser';

import { getStoredItems } from './data/items.js';

const app = express();

app.use(bodyParser.json());

// CORS setup
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


// 🔹 Get all items
app.get('/items', async (req, res) => {
  const storedItems = await getStoredItems();

  await new Promise((resolve) => setTimeout(resolve, 2000));

  res.json({ items: storedItems });
});


app.listen(8080, () => {
  console.log('Server running on port 8080');
});