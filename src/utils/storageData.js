/**
 * @description 获取
 * @returns
 */
export function getStorage(name) {
  // let data = sessionStorage.getItem(name);
  // if (data) {
  //   data = JSON.parse(sessionStorage.getItem(data))
  //   return data
  // }
  return JSON.parse(localStorage.getItem(name));
}

/**
 * @description 存储
 * @param token
 * @returns 
 */
export function setStorage(data, name) {
  return localStorage.setItem(name, data);
}
/**
 * @description 移除
 * @returns
 */
export function removeStorage(name) {
  return localStorage.removeItem(name);
}
