/**
 * 时间戳
 * @param {*} timestamp  时间戳
 */
const timestampToTime = (timestamp) => {
  let date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10 ?
      '0' + (date.getMonth() + 1) :
      date.getMonth() + 1) + '-'
  let D =
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  let h =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let m =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    ':'
  let s =
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
};

/**
 * 时间日期格式化
 * @param dateObj 如果为字符串 则原样返回，如果为date时间对象则返回格式化后的结果
 * @param format
 * @returns {*}
 */
const dateFormats = (dateObj, format) => {
  if(typeof(dateObj) =='string'){
      return dateObj
  }
  let date = {
    'M+': dateObj.getMonth() + 1,
    'd+': dateObj.getDate(),
    'h+': dateObj.getHours(),
    'm+': dateObj.getMinutes(),
    's+': dateObj.getSeconds(),
    'q+': Math.floor((dateObj.getMonth() + 3) / 3),
    'S+': dateObj.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
    }
  }
  return format
}
/**
 * 存储localStorage
 */
const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
  }
  
  /**
   * 获取localStorage
   */
  const getStore = name => {
    if (!name) return;
    return window.localStorage.getItem(name);
  }
  
  /**
   * 删除localStorage
   */
  const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name);
  }
  
  /**
   * 设置cookie
   **/
  function setCookie(name, value, day) {
    let date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires=' + date;
  }
  
  /**
   * 获取cookie
   **/
  function getCookie(name) {
    let reg = RegExp(name + '=([^;]+)');
    let arr = document.cookie.match(reg);
    if (arr) {
      return arr[1];
    } else {
      return '';
    }
  }
  
  /**
   * 删除cookie
   **/
  function delCookie(name) {
    setCookie(name, null, -1);
  }

  function setStorage(storage_method="localStorage",key,data){
    storage_method === "localStorage" ? localStorage.setItem(key,data):sessionStorage.setItem(key,data)
  }
  function getStorage(storage_method="localStorage",key){
    const result =  storage_method === "localStorage" ? localStorage.getItem(key):sessionStorage.getItem(key)
    return result
  }
  export{
    setStore,
    getStore,
    removeStore,
    setCookie,
    getCookie,
    delCookie,
    setStorage,
    getStorage
}