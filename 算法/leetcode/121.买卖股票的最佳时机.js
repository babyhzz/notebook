/*
 * @lc app=leetcode.cn id=121 lang=javascript
 *
 * [121] 买卖股票的最佳时机
 */

// @lc code=start
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  // 最大赚取的金额
  let maxEarn = 0;

  // 保存的最小价格
  let minPrice = Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < prices.length; i++) {
    if (prices[i] - minPrice > maxEarn) {
      maxEarn = prices[i] - minPrice;
    }
    if (prices[i] < minPrice) {
      minPrice = prices[i];
    }
  }

  return maxEarn;
};
// 暴力破解法，会超时
// var maxProfit = function (prices) {
//   let max = 0;
//   for (let i = 0; i < prices.length; i++) {
//     for (let j = i + 1; j < prices.length; j++) {
//       if (prices[j] - prices[i] > max) {
//         max = prices[j] - prices[i];
//       }
//     }
//   }
//   return max;
// };

// @lc code=end
