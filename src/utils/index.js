//-------------------------------------------------------------------------请求的封装

// const host = 'https://www.heyuhsuo.xyz/heyushuo';
import config from '@/api/config';
const host = config.API_HOST; // 开发接口地址
export {
  host
}

/**
 * 请求封装成Promise对象返回 执行请求前做的事
 * @param {*} url 
 * @param {*} method 
 * @param {*} data 
 * @param {*} header 
 * @return {Promise}
 */
function request(url, method, data, header = {}) {
  //添加全局的，数据请求前loading
  wx.showLoading({
    title: '加载中'
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
        console.log("request", res)
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
 * get 请求 对请求响应前拦截，处理操作失败，处理异常错误等
 * @param {string} url 
 * @param {Object} data 
 * @return {Promise} 
 */
export const get = async (url, data) => {
  try {
    const res = await request(url, 'GET', data);
    const {
      data: dataRes,
      msg
    } = await request(url, 'GET', data);
    if (dataRes === false && !msg) {
      wx.showToast({
        icon: 'none',
        title: msg,
      });
      return;
    }
    return res;
  } catch (error) {
    const {
      errMsg
    } = error;
    wx.showToast({
      icon: 'none',
      title: errMsg
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
    const {
      data: dataRes,
      msg
    } = res;
    if (!dataRes) {
      wx.showToast({
        icon: 'none',
        title: msg
      });
      return;
    }
    return res;
  } catch (error) {
    const {
      errMsg
    } = error;
    wx.showToast({
      icon: 'none',
      title: errMsg
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
