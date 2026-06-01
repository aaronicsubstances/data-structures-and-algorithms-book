const { solve: solveFromSquarePuzzle } = require("../squarest_game_puzzle");

/*
  A new algorithm that works with repeatable options
*/
const solve = (goal, rings, score = 0, hit = []) => {
  return solveFromSquarePuzzle(goal, expandRings(goal, rings), score, hit);
};

const expandRings = (goal, rings) =>{
  const rings2 = [];
  for (const v of rings) {
    if (!v) continue;
    for (let i = 0; i < Math.trunc(goal / v); i++) {
      rings2.push(v);
    } 
  }
  return rings2;
};

console.log(expandRings(100, [40, 39, 24, 23, 17, 16]))
/*[
    40, 40,
    39, 39,
    24, 24, 24, 24,
    23, 23, 23, 23,
    17, 17, 17, 17, 17,
    16, 16, 16, 16, 16, 16
  ]*/

console.log(solve(100, [40, 39, 24, 23, 17, 16]));