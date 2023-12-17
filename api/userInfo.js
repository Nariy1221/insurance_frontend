import request from '@/utils/request'
import qs from 'qs';
const api_name = `/api/user`

export default {
  // 发送登录请求
  loginWithPhoneCode(phoneNumber, verificationCode) {
    return request({
      url: `${api_name}/loginWithPhoneCode`,
      method: 'post',
      data: {
        phoneNumber,
        verificationCode
      }
    });
  },
  loginWithID(ID, Code) {
    return request({
      url: `/rest/users/login`,
      method: 'get',
      params: {
        username:ID,
        password:Code
      }
    });
  },
  registerWithID(ID, Code) {
    return request({
      url: `/rest/users/register`,
      method: 'get',
      params: {
        username:ID,
        password:Code
      }
    });
  },
  savePrefer(uid, genres){
    return request({
      url:'/rest/users/store-prefer',
      method:'post',
      data:{
        uid:uid,
        genres:genres
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //用户认证接口
  saveUserAuth(Id, userAuth) {
    return request({
      url: `${api_name}/auth/userAuth`,
      method: 'post',
      data: {
        Id,
        userAuth
      }
    })
  },
  //根据userid获取用户信息
  getUserInfoById(userId) {
    return request({
      url: `${api_name}/auth/getUserInfo`,
      method: `post`,
      data: {
        userId
      }
    })
  },
    // 发送获取验证码请求
    sendVerificationCode(phoneNumber) {
      return request({
        url: `/api/msm/sendVerificationCode`,
        method: 'post',
        data: {
          phoneNumber
        }
      });
    }
}
