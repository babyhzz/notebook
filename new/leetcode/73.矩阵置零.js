/*
 * @lc app=leetcode.cn id=73 lang=javascript
 *
 * [73] 矩阵置零
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function(matrix) {
  const rows = [];
  const cols = [];
  for(let i = 0; i < matrix.length; i++) {
    for(let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 0) {
       rows.push(i);
       cols.push(j);
      }
    }
  }

  for(let i = 0; i < matrix.length; i++) {
    for(let j = 0; j < matrix[i].length; j++) {
      if (rows.includes(i) || cols.includes(j)) {
        matrix[i][j] = 0;
      }
    }
  }
};
// @lc code=end

