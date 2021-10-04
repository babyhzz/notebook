/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  const numIndexMap = {};
  for(let i = 0; i < nums.length; i++) {
    const firstNum = nums[i];
    const secondNum = target - firstNum;
    if (numIndexMap[secondNum] !== undefined) {
      return [numIndexMap[secondNum], i];
    } else {
      numIndexMap[nums[i]] = i;
    }
  }

  return [];

};

console.log(twoSum([2,7,11,15], 9));
console.log(twoSum([3,2,4], 6));
console.log(twoSum([3,3], 6));

// @lc code=end

