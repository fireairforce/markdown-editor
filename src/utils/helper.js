export const flattenArr = (arr) => {
  return arr.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {});
};

export const objToArr = (obj) => {
  return Object.keys(obj).map((key) => obj[key]);
};

// 获得父元素的dom节点
export const getParentNode = (node, parentClassName) => {
  let current = node;
  while (current !== null) {
    if (current.classList.contains(parentClassName)) {
      return current;
    }
    // 如果不包含往上面浮动
    current = current.parentNode;
  }
  return false;
};
