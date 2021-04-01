/*
 * @lc app=leetcode.cn id=492 lang=javascript
 *
 * [492] 构造矩形
 */

// @lc code=start
/**
 * @param {number} area
 * @return {number[]}
 */
var constructRectangle = function (area) {
  const s = Math.floor(Math.sqrt(area));
  for (let i = s; i > 0; i--) {
    if (area % i === 0) {
      return [area / i, i];
    }
  }
  return [area, 1];
};
// @lc code=end
