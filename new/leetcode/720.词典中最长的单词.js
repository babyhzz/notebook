/*
 * @lc app=leetcode.cn id=720 lang=javascript
 *
 * [720] 词典中最长的单词
 */

// @lc code=start
/**
 * @param {string[]} words
 * @return {string}
 */
var longestWord = function(words) {
  words.sort();
  const set = new Set();

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.length === 1) {
      set.add(word);
    } else {
      const prefix = word.slice(0, word.length - 1);
      if (set.has(prefix)) {
        set.add(word);
        console.log(word);
      }
    }
  }

  let longWords = Array.from(set);
  let targetWord = longWords[0];
  for (let i = 1; i < longWords.length; i++) {
    if (longWords[i].length > targetWord.length) {
      targetWord = longWords[i];
    } else if (longWords[i].length === targetWord.length) {
      targetWord = longWords[i] < targetWord ? longWords[i] : targetWord;
    }
  }

  return targetWord;
};

console.log(longestWord(["rac","rs","ra","on","r","otif","o","onpdu","rsf","rs","ot","oti","racy","onpd"]))
// @lc code=end

