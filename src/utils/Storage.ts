// why? Cookies or Session
const storage = localStorage;
const STORAGEKEY = 'lingxiAnalyticsKey';
const getItem = (key = STORAGEKEY) => {
  const data = storage.getItem(key) || `[]`;
  return JSON.parse(data);
};
const setItem = (data: any, key = STORAGEKEY) => {
  if (typeof data == 'string') {
    storage.setItem(key, data);
  } else {
    storage.setItem(key, JSON.stringify(data));
  }
};
const removeItem = (key = STORAGEKEY) => storage.removeItem(key);

export { getItem, setItem, removeItem };
