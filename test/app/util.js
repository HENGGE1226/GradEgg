'use strict';

// 处理图片储存的格式
function changeImg(imgUrl) {
  if (imgUrl.length === 0) {
    return ''
  }
  if (Array.isArray(imgUrl)) {
    const str = imgUrl.join(',')
    return str
  } else {
    const arr = imgUrl.split(',')
    return arr
  }
};

module.exports = {
  changeImg
}