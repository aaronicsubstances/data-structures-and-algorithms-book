class Bag {
  count = 0;
  data = {};

  isEmpty() {
    return this.count === 0;
  }

  find(value) {
    return value in this.data;
  }

  greatest() {
    return this.isEmpty() ? undefined : Object.keys(this.data).sort().pop();
  }

  add(value) {
    this.count++;
    if (this.find(value)) {
      this.data[value]++;
    } else {
      this.data[value] = 1;
    }
    return this;
  }

  remove(value) {
    if (this.find(value)) {
      this.count--;
      if (this.data[value] > 1) {
        this.data[value]--;
      } else {
        delete this.data[value];
      }
    }
    return this;
  }
}

module.exports = { Bag };

const b = new Bag();

console.log(b.isEmpty());

b.add("HOME").add("HOME");
b.add("SWEET").add("SWEET").add("HOME");

console.log(b.isEmpty());

console.log(b.remove("NO").remove("HOME").isEmpty());

/*
true
false
false
*/