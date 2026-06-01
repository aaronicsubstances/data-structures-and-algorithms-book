const insertionSort = require("../../06 sorting/insertion_sort_2");

// use insights from https://en.wikipedia.org/wiki/Median_of_medians
// which mention that mutual recursion occurs between select helper and
// pivot helper, and this lets pivot helper return exact median, in
// contrast to sicilianQuickSelect below which computes approximate median.

// NB: based on quicksortDijkstra rather than on quicksort, in order to
// help sicilianQuickSelect (below) maintain efficiency in the prescence of duplicates, given
// that it computes approximate rather than exact medians.
const quickSelectHelper = (arr, k, from = 0, to = arr.length - 1, pivotCallback = undefined) => {
    if (from >= to) return;
	
	const iPivot = pivotCallback ? pivotCallback(arr, k, from, to) : Math.floor(from + (to - from + 1) * Math.random());
	
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

	if (k < lt) {
		return quickSelectHelper(arr, k, from, lt - 1, pivotCallback);
	}
	else if (k > gt) {
		return quickSelectHelper(arr, k, gt + 1, to, pivotCallback);
	}
	else {
		return;
	}
}

const simpleMedianHelper = (arr, from, to) => {
	insertionSort(arr, from, to);
	return from + Math.floor((to - from) / 2);
};

const medianOf3 = (arr, from, to) => {
	if (to - from === 2) {
		const c01 = arr[from] > arr[from + 1];
		const c12 = arr[from + 1] > arr[from + 2];
		if (c01 === c12) {
			return from + 1;
		}
		else {
			const c20 = arr[from + 2] > arr[from];
			return c20 === c01 ? from : from + 2;
		}
	}
	else {
		return from;
	}
};

// ../median_of_medians_step.js
const mom5QuickSelect = (arr, k, from = 0, to = arr.length - 1) => {
	const copy = arr.slice(from, to + 1)
	quickSelectHelper(copy, k, 0, copy.length - 1, mom5PivotHelper)
	return copy[k]
};

const mom5PivotHelper = (arr, k, from = 0, to = arr.length - 1) => {
	let mom;
	if (to - from < 5) {
		mom = simpleMedianHelper(arr, from, to);
	}
	else {
		let j = from - 1;
		for (let i = from; i <= to; i += 5) {
			const med = simpleMedianHelper(arr, i, Math.min(i + 4, to));
			j++;
			if (j !== med) {
				[arr[j], arr[med]] = [arr[med], arr[j]];
			}
		}
		mom = Math.floor((from + j) / 2);
		quickSelectHelper(arr, mom, from, j, mom5PivotHelper);
	}
	return mom;
};

// ../repeated_step.js
// NB: superior to mom5QuickSelect
const mom9QuickSelect = (arr, k, from = 0, to = arr.length - 1) => {
	const copy = arr.slice(from, to + 1)
	quickSelectHelper(copy, k, 0, copy.length - 1, mom9PivotHelper)
	return copy[k]
};

const mom9PivotHelper = (arr, k, from = 0, to = arr.length - 1) => {
	let mom;
	if (to - from < 9) {
		mom = simpleMedianHelper(arr, from, to);
	}
	else {
		let j1 = from - 1;
		for (let i = from; i <= to; i += 3) {
			const med = medianOf3(arr, i, Math.min(i + 2, to));
			j1++;
			if (j1 !== med) {
				[arr[j1], arr[med]] = [arr[med], arr[j1]];
			}
		}

		let j2 = from - 1;
		for (let i = from; i <= j1; i += 3) {
			const med = medianOf3(arr, i, Math.min(i + 2, j1));
			j2++;
			if (j2 !== med) {
				[arr[j2], arr[med]] = [arr[med], arr[j2]];
			}
		}

		mom = Math.floor((from + j2) / 2);
		quickSelectHelper(arr, mom, from, j2, mom9PivotHelper);
	}
	return mom;
};

// ../sicilian_selection.js
// NB: superior to mom5QuickSelect and mom9QuickSelect especially when based on
// quicksortDijkstra
const sicilianQuickSelect = (arr, k, from = 0, to = arr.length - 1) => {
	const copy = arr.slice(from, to + 1)
	quickSelectHelper(copy, k, 0, copy.length - 1, sicilianPivotHelper)
	return copy[k]
};

const sicilianPivotHelper = (arr, k, from = 0, to = arr.length - 1) => {
	let rr = to;
	let m3;
	while (rr - from >= 3) {
		let ll = from - 1;
		for (let i = from; i <= rr; i += 3) {
			m3 = medianOf3(arr, i, Math.min(i + 2, rr));
			ll++;
			if (ll !== m3) {
				[arr[ll], arr[m3]] = [arr[m3], arr[ll]];
			}
		}
		rr = ll;
	}
	m3 = medianOf3(arr, from, rr);
	return m3;
};