function getIndex(arr, low, high) {
  let left = low;
  let right = high;
  const temp = arr[left];
  while (left < right) {
    // 找到小于temp的，给左边的元素
    while (left < right && arr[right] >= temp) {
      right = right - 1;
    }
    arr[left] = arr[right];
    // 找到大于temp的，给右边的元素
    while (left < right && arr[left] <= temp) {
      left = left + 1;
    }
    arr[right] = arr[left];
  }
  arr[left] = temp;

  // ！！！错误-1：这里忘记返回值了
  return left;
}

function quickSort(arr, low, high) {
  if (low >= high) {
    return;
  }

  const index = getIndex(arr, low, high);
  quickSort(arr, low, index - 1);
  quickSort(arr, index + 1, high);
}

const N = 100;
const arr = [];
for (let i = 0; i < N; i++) {
  arr.push((Math.random() * N) | 0);
}
console.log(arr);
// ！！！错误-2：这里是直接修改内部数组
quickSort(arr, 0, arr.length - 1);
console.log(arr);
