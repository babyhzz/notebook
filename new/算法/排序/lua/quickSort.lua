-- 快速排序
-- 个人理解，喂养模式，
-- 从右至左找到小的喂养low，从左向右找到大的喂养high
local function getIndex(arr, low, high)
  local temp = arr[low]
  while (low < high) do
    -- high找到一个小的给low
    while (low < high and arr[high] >= temp) do high = high - 1 end
    arr[low] = arr[high]

    -- high给了一个小的给low，那么low也要还一个大的给high
    while (low < high and arr[low] <= temp) do low = low + 1 end
    arr[high] = arr[low]
  end

  -- 跳出循环时low和high相等,此时的low或high就是temp的正确索引位置
  -- 由原理部分可以很清楚的知道low位置的值并不是temp,所以需要将temp赋值给arr[low]
  arr[low] = temp
  return low
end

local function quickSort(arr, low, high)
  if (low >= high) then return end
  local index = getIndex(arr, low, high)
  quickSort(arr, low, index - 1)
  quickSort(arr, index + 1, high)
end

-- 生成一个随机数组
local arr = {}
for i = 1, 1000000 do table.insert(arr, math.random(1, 1000)) end

local beginTime = os.time();
quickSort(arr, 1, #arr)
local endTime = os.time();
print(string.format('time consume: %ss ', endTime - beginTime))
-- print(table.unpack(arr))
