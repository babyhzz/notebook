/*
 * @lc app=leetcode.cn id=1464 lang=javascript
 *
 * [1464] 数组中两元素的最大乘积
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function (nums) {
  let first = Number.MIN_SAFE_INTEGER;
  let second = Number.MIN_SAFE_INTEGER;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > first) {
      second = first;
      first = nums[i];
    } else if (nums[i] > second) {
      second = nums[i];
    }
  }

  return (first - 1) * (second - 1);
};
// @lc code=end
