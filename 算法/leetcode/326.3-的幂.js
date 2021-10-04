/*
 * @lc app=leetcode.cn id=326 lang=javascript
 *
 * [326] 3的幂
 */

// @lc code=start
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfThree = function (n) {
  let num = n;

  while (Number.isInteger(num) && num >= 3) {
    num = num / 3;
  }

  // 除到最后的结果是1
  return num === 1;
};
// @lc code=end
