import Vue from 'vue'
import Vuex from 'vuex'
import {
  setStorage,
  getStorage
} from '@/utils/util'
import cookie from 'js-cookie'
Vue.use(Vuex)
const defaultUserInfo = {
  username: "",
  uid: "",
  first: "",
  prefGenres: [],
  timestamp: 0,
  phone: "",
}
const defaultBuyFLow = {
  url: "detail",
  step: 0
}
const store = () => new Vuex.Store({
  state: {
    user: JSON.stringify(cookie.get('user')) || {
      name: 'Tom',
      region: '居民身份证',
      cardID: '37xxxxxxxxxxxxxxxx',
      phone: '19506192606',
    },
    buyFlow: JSON.stringify(cookie.get('buyFlow')) || {
      url: "detail",
      step: 0
    },
    userInfo: JSON.stringify(cookie.get('userInfo')) || {
      username: "",
      uid: "",
      first: "",
      prefGenres: [],
      timestamp: 0,
      phone: "",
    },
    userDetails: JSON.stringify(cookie.get('userDetails')) || {
      name: '',
      sex: '',
      birthday: '',
      occupation: '',
      marriage: '',
      income: '',
      health: '',
      medical_history: '',
      family_medical_history: '',

    },
    certificates:JSON.stringify(cookie.get('certificates')) ||{
      certificatesType:'',
      certificatesNo:''
    },
    authStatus: 0,
    userInterest: JSON.stringify(cookie.get('userInterest')) || {
      interest: [],
    },
    insuranceExcept: JSON.stringify(cookie.get('insuranceExcept')) || []
  },
  mutations: {
    UPDATE_USER(state, payload) {
      state.user = payload
      cookie.set("user", JSON.stringify(payload))
    },
    UPDATE_BUYFLOW(state, payload) {
      state.buyFlow = payload
      cookie.set("buyFlow", JSON.stringify(payload))
    },
    UPDATE_USERINFO(state, payload) {
      state.userInfo = payload
      cookie.set("userInfo", JSON.stringify(payload))
    },
    UPDATE_USERINTEREST(state, payload) {
      state.userInfo.prefGenres = payload.interest
      cookie.set("userInterest", JSON.stringify(payload))
    },
    UPDATE_INTERESTOPTIONS(state, payload) {
      state.userInterest.interest = payload
      cookie.set("userInterest", JSON.stringify(payload))
    },
    UPDATE_INSURANCE(state, payload) {
      state.insuranceExcept = payload
      console.log(payload)
      cookie.set("insuranceExcept", JSON.stringify(payload))
    },
    UPDATE_AUTHSTATUS(state, payload) {
      state.authStatus = payload
      cookie.set("authStatus", payload)
    },
    UPDATE_USERDETAILS(state, payload) {
      state.userDetails = payload
      cookie.set("userDetails", JSON.stringify(payload))
    },
    UPDATE_CERTIFICATES(state, payload) {
      state.certificates = payload
      cookie.set("certificates", JSON.stringify(payload))
    }
  },
  actions: {
    updateUser({
      commit
    }, payload) {
      commit('UPDATE_USER', payload)
    },
    updateBuyFlow({
      commit
    }, payload) {
      commit('UPDATE_BUYFLOW', payload)
    },
    updateInsuranceExcept({
      commit
    }, payload) {
      commit('UPDATE_INSURANCE', payload)
    },
    updateUserInfo({
      commit
    }, payload) {
      commit('UPDATE_USERINFO', payload)
    },
    updateUserInterest({
      commit
    }, payload) {
      commit('UPDATE_USERINTEREST', payload)
    },
    updateInterestOptions({
      commit
    }, payload) {
      commit('UPDATE_INTERESTOPTIONS', payload)
    },
    updateAuthStatus({
      commit
    }, payload) {
      commit('UPDATE_AUTHSTATUS', payload)
    },
    updateUserDetails({
      commit
    }, payload) {
      commit('UPDATE_USERDETAILS', payload)
    },
    updateCertificates({
      commit
    }, payload) {
      commit('UPDATE_CERTIFICATES', payload)
    },
    loginOut({
      commit
    }) {
      console.log('离开了')
      commit('UPDATE_USERINTEREST', {})
      commit('UPDATE_USERINFO', defaultUserInfo)
      commit('UPDATE_AUTHSTATUS', 0)
    },
    quitBuyFlow({
      commit
    }) {
      console.log('离开了')
      commit('UPDATE_BUYFLOW', defaultBuyFLow)
    },
  },
  getters: {
    getUser(state) {
      if (!state.user) {
        state.user = cookie.get('user')
      }
      return state.user
    },
    getBuyFlow(state) {
      if (!state.buyFlow) {
        state.buyFlow = cookie.get('buyFlow')
      }
      return state.buyFlow
    },
    getInsuranceExcept(state) {
      if (!state.insuranceExcept) {
        state.insuranceExcept = cookie.get('insuranceExcept')
      }
      return state.insuranceExcept
    },
    getUserInfo(state) {
      if (!state.userInfo) {
        state.userInfo = cookie.get('userInfo')
      }
      return state.userInfo
    },
    getUserInterest(state) {
      if (!state.userInfo) {
        state.userInfo = cookie.get('userInfo')
      }
      return state.userInfo.prefGenres
    },
    getInterestOptions(state) {
      if (!state.userInterest) {
        state.userInterest = cookie.get('userInterest')
      }
      return state.userInterest
    },
    getAuthStatus(state) {
      if (!state.authStatus) {
        state.authStatus = cookie.get('authStatus')
      }
      return state.authStatus
    },
    getInterestOptions(state) {
      if (!state.userInterest) {
        state.userInterest = cookie.get('userInterest')
      }
      return state.userInterest
    },
    getCertificates(state) {
      if (!state.certificates) {
        state.certificates = cookie.get('certificates')
      }
      return state.certificates
    },
    getUserDetails(state) {
      if (!state.userDetails) {
        state.userDetails = cookie.get('userDetails')
      }
      return state.userDetails
    },
  }
})
export default store
