-- 归并排序的核心，merge算法
local function merge(arr, low, mid, high)
  if (low >= high) then return end

  local temp = {}
  local index1 = low
  local index2 = mid + 1

  while (index1 <= mid and index2 <= high) do
    if (arr[index1] <= arr[index2]) then
      table.insert(temp, arr[index1])
      index1 = index1 + 1
    else
      table.insert(temp, arr[index2])
      index2 = index2 + 1
    end
  end

  while (index1 <= mid) do
    table.insert(temp, arr[index1])
    index1 = index1 + 1
  end

  while (index2 <= high) do
    table.insert(temp, arr[index2])
    index2 = index2 + 1
  end

  for i = low, high do arr[i] = temp[i - low + 1] end
end

local function mergeSort(arr, low, high)
  if (low == high) then return end

  local mid = math.floor((low + high) / 2)
  -- 分而治之的思想
  mergeSort(arr, low, mid)
  -- 注意low位是mid + 1，不要写成mid，避免参加两次计算
  mergeSort(arr, mid + 1, high)
  merge(arr, low, mid, high)
end

-- 生成一个随机数组
local arr = {}
for i = 1, 100 do table.insert(arr, math.random(1, 1000)) end

local beginTime = os.time();
mergeSort(arr, 1, #arr)
local endTime = os.time();
print(string.format('time consume: %ss ', endTime - beginTime))
print(table.unpack(arr))
