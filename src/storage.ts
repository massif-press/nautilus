import localforage from 'localforage';

const dbName = 'NAUTILUS Persistent';

const storeRegistry = {
  local_data: localforage.createInstance({
    name: dbName,
    storeName: 'local_data',
    description: 'Stores Local NAUTILUS data',
  }),
};

const Initialize = async function () {
  localforage.config({
    name: dbName,
  });
};

const SetItem = async function (item: any) {
  const id = item.ID ? item.ID : item.id;

  storeRegistry.local_data.setItem(id, JSON.stringify(item));
};

const GetItem = async function (id: string) {
  const item = await storeRegistry.local_data.getItem(id);
  return JSON.parse(item as string);
};

const RemoveItem = async function (id: string) {
  return await storeRegistry.local_data.removeItem(id);
};

const GetAll = async function () {
  const output = [] as any[];
  if (!storeRegistry.local_data) return output;

  await storeRegistry.local_data
    .iterate(function (value: any) {
      output.push(JSON.parse(value));
    })
    .catch(function (err) {
      console.error('Error getting collection data', err);
    });
  return output;
};

const GetLength = async function () {
  const db = await storeRegistry.local_data;

  if (db) return await db.length();
  return 0;
};

const GetKeys = async function () {
  const db = await storeRegistry.local_data;

  if (db) return await db.keys();
  return [];
};
export { Initialize, SetItem, GetItem, RemoveItem, GetAll, GetLength, GetKeys };
