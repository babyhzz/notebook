local utils = {}

function utils.swap(arr, i, j)
  local tmp = arr[i]
  arr[i] = arr[j]
  arr[j] = tmp
end

return utils
