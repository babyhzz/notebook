/*
 * @lc app=leetcode.cn id=1446 lang=javascript
 *
 * [1446] 连续字符
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var maxPower = function (s) {
  let max = 0;

  let tempChar = null;
  let tempPower = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== tempChar) {
      // 终结了，若比保存的最大值大，则更新
      if (tempPower > max) {
        max = tempPower;
      }
      tempChar = s[i];
      tempPower = 1;
    } else {
      tempPower++;
    }
  }

  if (tempPower > max) {
    max = tempPower;
  }

  return max;
};
// @lc code=end
