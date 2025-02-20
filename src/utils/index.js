import Decimal from "decimal.js";

export function truncateString(str, front = 4,back=4) {
    if (str.length <= (front+back)) {
      return str;
    }
    const frontPart = str.slice(0, front);
    const backPart = str.slice(-back);
    return `${frontPart}...${backPart}`;
  }
export function calcConversion(value,fixed= 2){
    if(value===undefined||value==null){
        return '0';
    }
    if(new Decimal(value).comparedTo(new Decimal(0)) === 0){
        return '0';
    }
    return new Decimal(value).toFixed(fixed, Decimal.ROUND_DOWN).toString();
}

export function getAssetsUrl(pathName) {
  return require("@/assets/images"+ pathName);
}


export function isMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'windows phone'];
    return mobileKeywords.some((keyword) => userAgent.includes(keyword));
}

export function debounce(fn, delay) {
    let that = this;
    let timer = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(that, arguments);
        }, delay);
    };
}


export function isProd() {
    return location.host.indexOf('ton.fy-ect.net') == 0;
}
export function isLocal() {
    return location.host.indexOf('192.') > -1 ||  location.host.indexOf('127.') > -1 ||  location.host.indexOf('localhost') > -1
}




/**
 * 格式化时间为指定字符串格式
 * @param {Date|number} dateInput - 输入的日期对象或时间戳
 * @param {string} format - 输出的时间格式字符串,支持以下占位符:
 *   - yyyy: 四位年份
 *   - yy: 两位年份
 *   - MM: 两位月份
 *   - M: 一位或两位月份
 *   - dd: 两位日期
 *   - d: 一位或两位日期
 *   - HH: 两位小时(24小时制)
 *   - H: 一位或两位小时(24小时制)
 *   - mm: 两位分钟
 *   - m: 一位或两位分钟
 *   - ss: 两位秒钟
 *   - s: 一位或两位秒钟
 *   - SSS: 三位毫秒
 *   - S: 一位或多位毫秒
 * @returns {string} 格式化后的时间字符串
 */
export function formatDate(dateInput, format) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const formatMap = {
      yyyy: date.getFullYear(),
      yy: String(date.getFullYear()).slice(-2),
      MM: String(date.getMonth() + 1).padStart(2, '0'),
      M: date.getMonth() + 1,
      dd: String(date.getDate()).padStart(2, '0'),
      d: date.getDate(),
      HH: String(date.getHours()).padStart(2, '0'),
      H: date.getHours(),
      mm: String(date.getMinutes()).padStart(2, '0'),
      m: date.getMinutes(),
      ss: String(date.getSeconds()).padStart(2, '0'),
      s: date.getSeconds(),
      SSS: String(date.getMilliseconds()).padStart(3, '0'),
      S: date.getMilliseconds(),
    };

    return format.replace(/([a-z]+)/gi, (match) => formatMap[match]);
}

// 将 20241029 格式的日期字符串转换为 yyyy-MM-dd 格式
export function formatDateGet(timeString) {
  if (timeString.length !== 8 || isNaN(timeString)) {
    throw new Error('Invalid date string format');
  }

  const year = timeString.substring(0, 4);
  const month = timeString.substring(4, 6);
  const day = timeString.substring(6, 8);

  return `${year}-${month}-${day}`;
}

export function ymd(time, timeZone) {
    const date = time == undefined ? new Date() : time instanceof Date ? time : new Date(time);

    // 使用指定时区生成日期字符串，格式为 "YYYY-MM-DD"
    const formattedDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        ...{timeZone}
    });

    // 提取年份、月份和日期部分
    const [month, day, year] = formattedDate.split("/");
    return parseInt(year, 10) * 10000 + parseInt(month, 10) * 100 + parseInt(day, 10);
}


export function getRemainingDays( endDate) {
  // 创建 Date 对象
  const currentDate = new Date(); // 当前时间
  const end = new Date(endDate);  // 结束时间

  // 计算时间差（以毫秒为单位）
  const timeDifference = end - currentDate;

  // 计算剩余天数
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysRemaining;
}

export function formatDateYMD(timeString) {
  // 解析原始时间字符串（假设格式为 yyyyMMdd）
  const year = timeString.substring(0, 4);
  const month = timeString.substring(4, 6) - 1; // JavaScript 的月份从0开始
  const day = timeString.substring(6, 8);

  // 创建 Date 对象，默认时间为00:00:00
  const date = new Date(year, month, day);

  // 格式化为 yyyy-MM-dd HH:mm:ss
  const formattedDate = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-') + ' ' +
  [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
    String(date.getSeconds()).padStart(2, '0')
  ].join(':');

  return formattedDate;
}


export function maskString(str='', startCount=5, endCount=4) {
  if (typeof str !== 'string'||!str) {
    return '';
  }

  const length = str.length;
  if (length <= startCount + endCount) {
    return str;
  }

  const startStr = str.substr(0, startCount);
  const endStr = str.substr(length - endCount);
  const maskedStr = startStr + '....' + endStr;

  return maskedStr;
}
export function getQueryblance (blance) {
 if (blance.includes("-")) {
      return blance
 } else {
   return '+' +blance
  }
}
export function getQueryString (name) {
  let query = window.location.search.substring(1);
       let vars = query.split("&");
       for (let i=0;i<vars.length;i++) {
               let pair = vars[i].split("=");
               if(pair[0] == name){return pair[1];}
       }
       return('');
}


// 格式化数值的函数
export function formatNumber(num){
    if (num < 1000) return num.toString(); // 小于1000直接返回原数值
    const units = ['k', 'm', 'b', 't']; // 单位数组（千，百万，十亿，万亿）
    let unitIndex = -1;
    let result = num;

    while (result >= 1000 && unitIndex < units.length - 1) {
        result /= 1000;
        unitIndex++;
    }

    // 保留一位小数，并去掉四舍五入
    const truncatedResult = Math.trunc(result * 10) / 10;

    return `${truncatedResult}${units[unitIndex]}`; // 截取并拼接单位
};


export function attr(ele, prop){
    return ele.dataset[prop] || ele.getAttribute(`data-${prop}`);
}

export function time2minute(timestamp, method='floor') {
    return Math[method](timestamp / 60000); // 1分钟 = 60000毫秒
}

export function time2hour(timestamp, method='floor') {
    return Math[method](timestamp / 3600000); // 1小时 = 3600000毫秒
}

export function time2day(timestamp, method='floor') {
    return Math[method](timestamp / 86400000); // 1小时 = 3600000毫秒
}

export function time2second(timestamp, method='floor') {
    return Math[method](timestamp / 1000); // 1小时 = 3600000毫秒
}

/**
 * 按1分钟为1小时计算的天数
 * @param timestamp
 * @param method
 * @returns {*}
 */
export function time2day4inMin(timestamp, method='floor') {
    return Math[method](timestamp / 60000 / 24);
}

/**
 * 按1分钟为1小时计算的小时数
 * @param timestamp
 * @param method
 * @returns {*}
 */
export function time2hour4inMin(timestamp, method='floor') {
    return Math[method](timestamp / 60000);
}



