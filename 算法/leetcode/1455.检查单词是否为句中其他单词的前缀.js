/*
 * @lc app=leetcode.cn id=1455 lang=javascript
 *
 * [1455] 检查单词是否为句中其他单词的前缀
 */

// @lc code=start
/**
 * @param {string} sentence
 * @param {string} searchWord
 * @return {number}
 */
var isPrefixOfWord = function(sentence, searchWord) {
  const wordArray = sentence.split(" ");
  for(let i = 0; i < wordArray.length; i++) {
    if (wordArray[i].startsWith(searchWord)) {
      return i + 1;
    }
  }

  return -1;
};
// @lc code=end
console.log(isPrefixOfWord("i love eating burger", "burg"))

