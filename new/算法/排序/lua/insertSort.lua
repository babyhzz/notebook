-- 每一次将后面一个元素插入到前面已经排好序的数组中
local function insertSort(arr)

  -- 记录已经排序的个数
  local sortedCount = 1

  while sortedCount < #arr do
    -- 下一个待插入的元素
    local nextNum = arr[sortedCount + 1]
    -- 从已经排序的最后一个元素向前找
    local index = sortedCount
    -- 这个位置要先判断索引，否则会越界
    while index > 0 and arr[index] > nextNum do
      -- 如果index指定的元素比待插入的值大，则向后移动
      arr[index + 1] = arr[index]
      index = index - 1
    end
    -- index元素比待插入值小，但下一个值已经移动，故插入到下一个位置
    arr[index + 1] = nextNum
    sortedCount = sortedCount + 1
  end
end

-- 生成一个随机数组
local arr = {}
for i = 1, 200000 do table.insert(arr, math.random(1, 100)) end
-- print('origin arr:', table.unpack(arr))
local beginTime = os.time();
insertSort(arr)
local endTime = os.time();
-- print('sorted arr:', table.unpack(arr))
print(string.format('time consume: %ss ', endTime - beginTime))
