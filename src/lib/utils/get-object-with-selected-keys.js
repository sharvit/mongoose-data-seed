export default function getObjectWithSelectedKeys(obj, keys) {
  const newObj = {};

  Object.keys(obj).forEach(k => {
    if (keys.includes(k)) {
      newObj[k] = obj[k];
    }
  });

  return newObj;
}
