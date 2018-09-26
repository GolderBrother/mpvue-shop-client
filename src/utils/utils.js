
/**
 * 单数 => 双数
 * @param {number} n 
 */
function formatNumber(n) {
    let str = +n;
    return str < 10 ? `0${str}` : str;
  };

  
/**
 * 判断对象是否为空
 * @param {Object} obj 
 */
export const isEmptyObj = obj => {
  if (JSON.stringify(obj) === "{}") {
    return true;
  }
  return false;
}

/**
 * js 时间戳转换成几分钟前，几小时前，几天前
 * @param {number} timespan 
 * @returns {string}
 */
export const formatMsgTime = timespan => {  

  let dateTime = new Date(timespan);

  let year = dateTime.getFullYear();
  let month = dateTime.getMonth() + 1;
  let day = dateTime.getDate();
  let hour = dateTime.getHours();
  let minute = dateTime.getMinutes();
  let second = dateTime.getSeconds();
  let now = new Date();
  let now_new = now.getTime();

  let milliseconds = 0;
  let timeSpanStr;

  milliseconds = now_new - timespan;

  if (milliseconds <= 1000 * 60 * 1) {
    timeSpanStr = '刚刚';
  } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
    timeSpanStr = Math.floor((milliseconds / (1000 * 60))) + '分钟前';
  } else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
    timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60)) + '小时前';
  } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
    timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
  } else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
    timeSpanStr = formatNumber(month) + '-' + formatNumber(day) + ' ' + formatNumber(hour) + ':' + formatNumber(minute);
  } else {
    timeSpanStr = year + '-' + formatNumber(month) + '-' + formatNumber(day) + ' ' + formatNumber(hour) + ':' + formatNumber(minute);
  }
  return timeSpanStr;
};

/**
 * new Date() => 2018/09/26 14:45:03
 * @param {Date} date 
 */
export const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
};

