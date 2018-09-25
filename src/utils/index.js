function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}


//-------------------------------------------------------------------------请求的封装

// const host = 'https://www.heyuhsuo.xyz/heyushuo';
import config from '@/api/config';
const host = config.API_HOST; // 开发接口地址
export {
  host
}

/**
 * 请求封装成Promise对象返回
 * @param {*} url 
 * @param {*} method 
 * @param {*} data 
 * @param {*} header 
 * @return {Promise}
 */
function request(url, method, data, header = {}) {
  wx.showLoading({
    title: '加载中' //数据请求前loading
  })
  return new Promise((resolve, reject) => {
    // wx请求 相当于翻版的jquery的ajax : $.ajax
    wx.request({
      url: host + url, //仅为示例，并非真实的接口地址
      method: method,
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        console.log("request",res)
        resolve(res.data)
      },
      fail: function (error) {
        wx.hideLoading();
        reject(error)
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  })
}
/**
 * get 请求 对请求响应前拦截，处理异常错误等
 * @param {string} url 
 * @param {Object} data 
 * @return {Promise} 
 */
export const get = async(url, data) => {
  try {
    const res = await request(url, 'GET', data);
    return res;
  } catch (error) {
    const { errMsg } = error;
    wx.showToast({
      icon:'none',
      title:errMsg
    });
    return {
      data: false,
      msg: errMsg
    }
  }
}

// export function get(url, data){
//   return request(url, 'GET', data);
// }

/**
 * post 请求 对请求响应前拦截，处理异常错误等
 * @param {string} url 
 * @param {Object} data 
 * @return {Promise}
 */
export const post = async (url, data) => {
  try {
    const res = await request(url, 'POST', data);
    return res;
  } catch (error) {
    const { errMsg } = error;
    wx.showToast({
      icon:'none',
      title:errMsg
    });
    return {
      data: false,
      msg: errMsg
    };
  }
}
// export function post(url, data){
//   return request(url, 'POST', data);
// }
// 这种函数声明的方法捕获不到 异常错误
// export function post(url, data) {
//   // return request(url, 'POST', data);
//   return new Promise((resolve, reject) => {
//     try {
//       const res = request(url, 'POST', data);
//       console.log(res);
//       resolve(res);

//     } catch (error) {
//       console.log(error);
//       reject({
//         data: false,
//         msg: error.message
//       });
//     }
//   });
// }

//-------------------------------------------------------------------------请求的封装


//----------------------------------------------用户是否登录 未登录跳转到登录页面 -------------------------


export function toLogin() {
  const userInfo = wx.getStorageSync('userInfo');
  if (!userInfo) {
    wx.navigateTo({
      url: "/pages/login/main"
    });
  } else {
    return true;
  }
}

export function login() {
  const userInfo = wx.getStorageSync('userInfo');
  if (userInfo) {
    return userInfo;
  }
  return false;
}

//---------------------------------------------- 获取用户 openId -------------------------


export function getStorageOpenid() {
  const openId = wx.getStorageSync("openId");
  if (openId) {
    return openId;
  } else {
    return ''
  }
}




export function getOpenid() {
  // wx.login({
  //   success: res => {
  //     if (res.code) {
  //       //发起网络请求
  //       wx.request({
  //         url: 'https://api.weixin.qq.com/sns/jscode2session',
  //         data: {
  //           "appid": "wxd2677ab83f7a0569",
  //           "secret": "abed5421d88eb8236e933c6e42d5c14e",
  //           "js_code": res.code,
  //           "grant_type": "authorization_code"
  //         },
  //         success: function (data) {
  //           var openid = data.data.openid;
  //           wx.setStorageSync("openid", openid);
  //         }
  //       })
  //     } else {
  //       console.log('登录失败！' + res.errMsg)
  //     }

  //   },
  //   fail: () => {},
  //   complete: () => {}
  // });
}
