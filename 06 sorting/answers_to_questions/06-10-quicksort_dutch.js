const quickSort = (arr, left = 0, right = arr.length - 1) => {
  if (left < right) {
    const iPivot = Math.floor(left + (right + 1 - left) * Math.random());
    if (iPivot !== right) {
      [arr[iPivot], arr[right]] = [arr[right], arr[iPivot]];
    }

    const pivot = arr[right];

    // Partition: pivot will end in arr[p]
    let p = left;
    for (let j = left; j < right; j++) {
      if (pivot > arr[j]) {
        [arr[p], arr[j]] = [arr[j], arr[p]];
        p++;
      }
    }
    [arr[p], arr[right]] = [arr[right], arr[p]];

    // Dutch enhancement: expand p to the left and right
    let pl = p;
    for (let i = p - 1; i >= left; i--) {
      if (arr[i] === pivot) {
        pl--;
        [arr[i], arr[pl]] = [arr[pl], arr[i]];
      }
    }

    let pr = p;
    for (let j = p + 1; j <= right; j++) {
      if (arr[j] === pivot) {
        pr++;
        [arr[j], arr[pr]] = [arr[pr], arr[j]];
      }
    }

    quickSort(arr, left, pl - 1);
    quickSort(arr, pr + 1, right);
  }

  return arr;
};

const quickSortAlt = (arr, from = 0, to = arr.length - 1) => {
  if (from >= to) return arr;
	
	const iPivot = Math.floor(from + (to - from + 1) * Math.random());
	
	if (iPivot !== from) {
		[arr[iPivot], arr[from]] = [arr[from], arr[iPivot]];
	}

	const pivot = arr[from];
    
    let lt = from,
		gt = to
        j = from + 1;
		
    // Loop invariants:
    // 1. arr[from] ... arr[lt-1] are less than pivot
    // 2. arr[lt] ... arr[j-1] are equal to pivot
    // 3. arr[gt+1] ... arr[to] are greater than pivot
    // 4. arr[j] ... arr[gt] have not yet been examined

    while (j <= gt) {
      if (arr[j] < pivot) {
        [arr[j], arr[lt]] = [arr[lt], arr[j]];
        lt++;
        j++;
      }
      else if (arr[j] > pivot) {
        [arr[j], arr[gt]] = [arr[gt], arr[j]];
        gt--;
      }
      else {
        j++; // equal to key, do keep contiguous stretch going
      }
    }

    quickSortAlt(arr, from, lt - 1);
    quickSortAlt(arr, gt + 1, to);
	
	return arr;
}

const data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9];
console.log(quickSort([...data]));
console.log(quickSortAlt([...data]));
