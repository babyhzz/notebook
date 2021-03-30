/*
 * @lc app=leetcode.cn id=136 lang=javascript
 *
 * [136] 只出现一次的数字
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function (nums) {
  let sum = 0;
  let set = new Set();
  for (let i = 0; i < nums.length; i++) {
    if (set.has(nums[i])) {
      sum -= nums[i];
    } else {
      set.add(nums[i]);
      sum += nums[i];
    }
  }

  return sum;
};
// @lc code=end
