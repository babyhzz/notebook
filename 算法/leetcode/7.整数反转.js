/*
 * @lc app=leetcode.cn id=7 lang=javascript
 *
 * [7] 整数反转
 */

// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function (x) {
  let n = Math.abs(x);

  let sum = 0;
  while (n / 10 > 1) {
    sum = 10 * sum + (n % 10);
    n = (n / 10) | 0;
  }

  sum = sum * 10 + n;

  return sum * Math.sign(x);
};
// @lc code=end

console.log(reverse(-321));
