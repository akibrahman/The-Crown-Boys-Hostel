export const CompareTwoArray = (arr1, arr2) => {
  // Check if the lengths of the arrays are the same
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Compare each object in the arrays
  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];

    // Convert objects to strings to compare deeply
    if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
      return false;
    }
  }

  // If no differences are found
  return true;
};

export function hasInvalidValues(array) {
  for (let i = 0; i < array.length; i++) {
    const obj = array[i];
    for (const key in obj) {
      const value = obj[key];
      if (
        value === "" || // Check for empty string
        value === null || // Check for null
        value === undefined || // Check for undefined
        Number.isNaN(value) || // Check for NaN
        value === 0 // Check for 0
      ) {
        return true;
      }
    }
  }
  return false;
}
