// solution to question 5.2
// ported from https://www.geeksforgeeks.org/dsa/iterative-tower-of-hanoi/
//
// 1. Calculate the total number of moves required i.e. "pow(2, n) - 1" here n is number of disks.
// 2. If number of disks (i.e. n) is even then interchange destination pole and auxiliary pole.
// 3. for i = 1 to total number of moves
//
//    if i%3 == 1: legal movement of top disk between source pole and destination pole
//    if i%3 == 2: legal movement of top disk between source pole and auxiliary pole
//    if i%3 == 0: legal movement of top disk between auxiliary pole and destination pole

const towers = (n, origin, extra, destination) => {
  const totalMoves = Math.pow(2, n) - 1;

  const originStack = [];
  for (let i = n; i > 0; i--) {
    originStack.push(i);
  }

  let extraStack = [];
  let destinationStack = [];

  if (n % 2 == 0) {
    [extra, destination] = [destination, extra];
  }

  for (let i = 1; i <= totalMoves; i++) {
    let disk, expected;
    switch (i % 3) {
      case 1:
        [disk, expected] = makeLegalMovement(originStack, destinationStack);
        console.log(
          `Move disk ${disk} from ${expected ? origin : destination} to ${
            expected ? destination : origin
          }`
        );
        break;
      case 2:
        [disk, expected] = makeLegalMovement(originStack, extraStack);
        console.log(
          `Move disk ${disk} from ${expected ? origin : extra} to ${
            expected ? extra : origin
          }`
        );
        break;
      default:
        [disk, expected] = makeLegalMovement(extraStack, destinationStack);
        console.log(
          `Move disk ${disk} from ${expected ? extra : destination} to ${
            expected ? destination : extra
          }`
        );
        break;
    }
  }
};

const makeLegalMovement = (stack1, stack2) => {
  // NB: either stack may be empty
  const disk1 = stack1[stack1.length - 1];
  const disk2 = stack2[stack2.length - 1];
  if (!disk2 || (disk1 && disk1 < disk2)) {
    stack2.push(stack1.pop());
    return [disk1, true];
  } else {
    stack1.push(stack2.pop());
    return [disk2, false];
  }
};

towers(4, "A", "B", "C");

/*
Move disk 1 from A to B
Move disk 2 from A to C
Move disk 1 from B to C
Move disk 3 from A to B
Move disk 1 from C to A
Move disk 2 from C to B
Move disk 1 from A to B
Move disk 4 from A to C
Move disk 1 from B to C
Move disk 2 from B to A
Move disk 1 from C to A
Move disk 3 from B to C
Move disk 1 from A to B
Move disk 2 from A to C
Move disk 1 from B to C
*/
