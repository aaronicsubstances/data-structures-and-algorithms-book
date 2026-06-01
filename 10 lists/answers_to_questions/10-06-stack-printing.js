const print = (list) => {
  for (let ptr = list; ptr !== null; ptr = ptr.next) {
    console.log(ptr.value);
  }
};
