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
var largestRectangleArea = function (heights) {
  var stack = [];
  var maxArea = 0;

  for (let i = 0; i < heights.length; i++) {
    if (stack.length === 0) {
      stack.push(heights[i]);
    } else {
      let top = stack[stack.length - 1];
      if (heights[i] >= top) {
        stack.push(heights[i]);
      } else {
        let back = 1;
        while (heights[i] < top && top) {
          maxArea = Math.max(maxArea, stack.pop() * back);
          top = stack[stack.length - 1];
          back++;
        }
      }
    }
  }

  if (stack.length !== 0) {
    let top = stack[stack.length - 1];
    let back = 1;
    while (top) {
      maxArea = Math.max(maxArea, stack.pop() * back);
      top = stack[stack.length - 1];
      back++;
    }
  }

  return maxArea;
};
// @lc code=end

console.log(largestRectangleArea([1, 1]));
