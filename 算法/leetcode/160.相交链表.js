/*
 * @lc app=leetcode.cn id=160 lang=javascript
 *
 * [160] 相交链表
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
  /**********set方法************/
  // var set = new Set();
  // var a = headA;
  // var b = headB;
  // while (a) {
  //   set.add(a);
  //   a = a.next;
  // }
  // while (b) {
  //   if (set.has(b)) {
  //     return b;
  //   } else {
  //     b = b.next;
  //   }
  // }
  // return null;

  /**********循环链表的方法************/
  var a = headA;
  var b = headB;

  // 不相交的话会同时为null
  while (a !== b) {
    a = a === null ? headB : a.next;
    b = b === null ? headA : b.next;
  }

  return a;
};
// @lc code=end
