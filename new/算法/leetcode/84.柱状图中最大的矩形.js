/*
 * @lc app=leetcode.cn id=84 lang=javascript
 *
 * [84] 柱状图中最大的矩形
 */

// @lc code=start
/**
 * @param {number[]} heights
 * @return {number}
 */

class Stack {
  constructor() {
    this.arr = [];
  }

  isEmpty() {
    return this.arr.length === 0;
  }

  peek() {
    return this.arr[this.arr.length - 1];
  }

  pop() {
    return this.arr.pop();
  }

  push(v) {
    this.arr.push(v);
  }
}

// 不填充0的版本
var largestRectangleArea1 = function (heights) {
  const n = heights.length;
  const stack = new Stack();
  let maxArea = 0;

  for (let i = 0; i < n; i++) {
    while (!stack.isEmpty() && heights[i] < heights[stack.peek()]) {
      const h = heights[stack.pop()];
      const w = stack.isEmpty() ? i : i - stack.peek() - 1;
      maxArea = Math.max(maxArea, w * h);
    }

    stack.push(i);
  }

  while (stack.length !== 0) {
    const h = heights[stack.pop()];
    const w = stack.length === 0 ? n : n - stack[stack.length - 1] - 1;
    maxArea = Math.max(maxArea, w * h);
  }

  return maxArea;
};

// 填充0的版本，不用那么多的临界判断
var largestRectangleArea = function (heights) {
  const stack = new Stack();
  stack.push(0);
  heights.push(0);
  heights.unshift(0);

  const n = heights.length;
  let maxArea = 0;

  for (let i = 1; i < n; i++) {
    while (heights[i] < heights[stack.peek()]) {
      const h = heights[stack.pop()];
      const w = i - stack.peek() - 1;
      maxArea = Math.max(maxArea, w * h);
    }

    stack.push(i);
  }

  return maxArea;
};

// @lc code=end

console.log(largestRectangleArea([4, 2, 0, 3, 2, 5]));
