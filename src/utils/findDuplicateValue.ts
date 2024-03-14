export default function findDuplicateValue(arr: string[]) {
    let seen = new Set();
    for (let i = 0; i < arr.length; i++) {
      if (seen.has(arr[i])) {
        return arr[i];
      } else {
        seen.add(arr[i]);
      }
    }
    return null;
  }