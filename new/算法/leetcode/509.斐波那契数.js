/*
 * @lc app=leetcode.cn id=509 lang=javascript
 *
 * [509] 斐波那契数
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
  if (n < 2) {
    return n;
  }

  let f1 = 0;
  let f2 = 1;
  let fi = 0;
  for(let i = 2; i <= n; i++) {
    fi = (f1 + f2) % 1000000007;
    f1 = f2 % 1000000007;
    f2 = fi % 1000000007;
  }

  return fi;
};

console.log(fib(81))

// @lc code=end

