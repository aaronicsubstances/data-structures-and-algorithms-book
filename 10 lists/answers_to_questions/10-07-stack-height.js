const height = (list) => {
  let len = 0;
  for (let ptr = list; ptr !== null; ptr = ptr.next) {
    len++;
  }
  return len;
};
