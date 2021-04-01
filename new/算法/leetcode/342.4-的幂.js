/*
 * @lc app=leetcode.cn id=342 lang=javascript
 *
 * [342] 4的幂
 */

// @lc code=start
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfFour = function (n) {
  let num = n;

  while (Number.isInteger(num) && num >= 4) {
    num = num / 4;
  }

  // 除到最后的结果是1
  return num === 1;
};
// @lc code=end
