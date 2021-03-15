/*
 * @lc app=leetcode.cn id=543 lang=javascript
 *
 * [543] 二叉树的直径
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var diameterOfBinaryTree = function (root) {
  if (root == null) {
    return 0;
  }

  // 三种情况，左节点直径，右节点直径，过父节点直径
  const leftDiameter = diameterOfBinaryTree(root.left);
  const rightDiameter = diameterOfBinaryTree(root.right);
  const rootDiameter = depth(root.left) + depth(root.right);
  return Math.max.call(null, leftDiameter, rightDiameter, rootDiameter);
};

/**
 * 求二叉树的最大深度
 * @param {*} root 
 */
var depth = function (root) {
  if (root == null) {
    return 0;
  }

  return Math.max(depth(root.left), depth(root.right)) + 1;
};
// @lc code=end
