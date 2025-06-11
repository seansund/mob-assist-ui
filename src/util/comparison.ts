
export const evaluateComparisons = (comparisons: number[]): number => {

  const results: number[] = comparisons.filter(val => val !== 0);

  if (results.length === 0) {
    return 0;
  }

  return results[0];
}
