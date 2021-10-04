-- 当第一个元素索引为0:
--      0
--     / \
--    1   2
-- 索引 i 的左节点为 2 * i + 1
-- 索引 i 的右节点为 2 * i + 2
-- 索引 i 的父节点为 floor((i - 1) / 2)
-- 长度为 n 的数组，最后一个非叶子节点索引 floor(n / 2 - 1)
-- 当第一个元素索引为1:
--      1
--     / \
--    2   3
-- 索引 i 的左节点为 2 * i
-- 索引 i 的右节点为 2 * i + 1
-- 索引 i 的父节点为 ceil((i - 1) / 2)
-- 长度为 n 的数组，最后一个叶子节点索引 floor(n / 2)
print(package.path)
local utils = require('utils')

local function heapify(arr, n)
  local parentIndex = math.floor(n / 2)
  while parentIndex > 0 do
    local leftIndex = 2 * parentIndex
    if (leftIndex <= n and arr[leftIndex] >= arr[parentIndex]) then
      utils.swap(arr, leftIndex, parentIndex);
    end
    local rightIndex = 2 * parentIndex + 1
    if (rightIndex <= n and arr[rightIndex] >= arr[parentIndex]) then
      utils.swap(arr, rightIndex, parentIndex);
    end
    parentIndex = parentIndex - 1
  end
end

local function heapSort(arr)
  local n = #arr;

  while (n > 1) do
    heapify(arr, n)
    utils.swap(arr, 1, n);
    n = n - 1
  end
end

-- 生成一个随机数组
local arr = {}
for i = 1, 100 do table.insert(arr, math.random(1, 100)) end

local beginTime = os.time();
heapSort(arr)
local endTime = os.time();
print(string.format('time consume: %ss ', endTime - beginTime))
print('sorted arr:', table.unpack(arr))
