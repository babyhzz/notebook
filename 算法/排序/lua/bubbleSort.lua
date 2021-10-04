-- 冒泡排序，从前往后冒泡，每次冒泡选出一个最大值
print(package.path)
local utils = require('utils')

local function bubbleSort(arr)
  local len = #arr;

  while len > 1 do
    for i = 1, len - 1 do
      if (arr[i] > arr[i + 1]) then utils.swap(arr, i, i + 1) end
    end
    len = len - 1
  end
end

-- 生成一个随机数组
local arr = {}
for i = 1, 20 do table.insert(arr, math.random(1, 20)) end

print('origin arr:', table.unpack(arr))

-- os.time() 获取当前时间的秒数
local beginTime = os.time();
bubbleSort(arr)
local endTime = os.time();

print('sorted arr:', table.unpack(arr))
print(string.format('time consume: %ss ', endTime - beginTime))
