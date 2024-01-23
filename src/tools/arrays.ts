export function last<T>(array: Array<T>) {
  return array[array.length - 1];
}

export function loopBackwards<T>(
  arr: Array<T>,
  callback: (input: T) => unknown
) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (callback) {
      const command = callback(arr[i]);
      if (command === "stop") return;
    }
  }
}

export function clean<T>(arr: Array<T>) {
  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== "" && arr[i] !== null && arr[i] !== undefined) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}
