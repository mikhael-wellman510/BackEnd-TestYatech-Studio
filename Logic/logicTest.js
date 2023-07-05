function solution(a, m, k) {
  let count = 0;

  for (let i = 0; i <= a.length - m; i++) {
    const subarray = a.slice(i, i + m);
    let pairFound = false;

    for (let j = 0; j < subarray.length; j++) {
      for (let l = j + 1; l < subarray.length; l++) {
        if (subarray[j] + subarray[l] === k) {
          pairFound = true;
          break;
        }
      }
      if (pairFound) {
        break;
      }
    }

    if (pairFound) {
      count++;
    }
  }

  return count;
}

// Example usage
const a1 = [2, 4, 7, 5, 3, 5, 8, 5, 1, 7];
const m1 = 4;
const k1 = 10;
console.log(solution(a1, m1, k1)); // Output: 5
