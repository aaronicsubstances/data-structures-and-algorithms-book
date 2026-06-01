const { newCircularList, add } = require("../circularList");
const { print } = require("./10-14-circular-list-printing");

const joinCircs = (circ1, circ2) => {
    if (!circ1 || !circ2) return circ1 || circ2;

    circ2.prev.next = circ1.next;
    circ1.next.prev = circ2.prev;
    circ1.next = circ2;
    circ2.prev = circ1;

    return circ1;
};

let c1 = newCircularList();
c1 = add(c1, 22);
c1 = add(c1, 9);
c1 = add(c1, 60);
c1 = add(c1, 12);

let c2 = newCircularList();
c2 = add(c2, 56);
c2 = add(c2, 24);
c2 = add(c2, 11);

console.log("c1 only");
print(joinCircs(c1));

console.log("c2 only");
print(joinCircs(null, c2));

console.log("c1 + c2");
print(joinCircs(c1, c2));