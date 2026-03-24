import fs from 'node:fs/promises';

export async function getStoredItems() {
  const rawFileContent = await fs.readFile('items.json', {
    encoding: 'utf-8',
  });

  const data = JSON.parse(rawFileContent);
  return data.items ?? [];
}