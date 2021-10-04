/*
 * @lc app=leetcode.cn id=122 lang=javascript
 *
 * [122] 买卖股票的最佳时机 II
 */

// @lc code=start
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let profit = 0;

  let b = 0;
  // b最多只能到倒数第二个点
  while (b < prices.length - 1) {
    console.log(`b:${b}`);
    while (prices[b + 1] < prices[b]) {
      b++;
    }
    let s = b + 1;

    if (s < prices.length) {
      while (prices[s + 1] && prices[s + 1] > prices[s]) {
        s++;
      }
      console.log(`${prices[b]} - ${prices[s]}`);
      profit += prices[s] - prices[b];

      b = s + 1;
    }
  }

  return profit;
};
// @lc code=end
console.log(maxProfit([7, 1, 5, 3, 6, 4]));
