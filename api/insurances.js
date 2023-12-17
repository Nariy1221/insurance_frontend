import request from '@/utils/request'

export default {
  //根据dictcode获取下级节点
  getHotByNum(num) {
    return request({
      url: `/rest/insurance/hot`,
      method: 'get',
      params: {
        num
      }
    })
  },
  getRecommendListByNum(username, num) {
    return request({
      url: `/rest/insurance/wish`,
      method: 'get',
      params: {
        username,
        num
      }
    })
  },
  getInsuranceListByNew(num) {
    return request({
      url: `/rest/insurance/new`,
      method: 'get',
      params: {
        num
      }
    })
  },
  getInsuranceListByGenres(category, num) {
    return request({
      url: `/rest/insurance/genres`,
      method: 'post',
      params: {
        sort:category,
        num
      },
      headers:{
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    })
  },
  getInsurancetByMid(id) {
    return request({
      url: `/rest/insurance/info/`+id,
      method: 'get',
      // params: {
      //   id
      // },
    })
  },
  getInsurancetByQuery(query, num) {
    return request({
      url: `/rest/insurance/search`,
      method: 'post',
      data: {
        query,
        num
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  getInsurancetByRelation(name, num) {
    return request({
      url: `/rest/insurance/same`,
      method: 'post',
      data: {
        query:name,
        num
      },
      headers:{
        'Content-Type' : 'application/json'
      }
    })
  },
  getHistoryByUserId(id, num) {
    return request({
      url: `/rest/users/history`,
      method: 'get',
      params: {
        id,
        num
      },
    })
  },
  getInsurancetSchemesById(id) {
    return request({
      url: `/rest/insurance/detail`,
      method: 'get',
      params: {
        id
      },
    })
  },
  getAllType() {
    return request({
      url: '/rest/insurance/allType',
      method: 'get',
    });
  },
  getAllSafeguard() {
    return request({
      url: '/rest/insurance/allSafeguard',
      method: 'get',
    });
  },
  getPrice() {
    return request({
      url: '/rest/insurance/price',
      method: 'get',
    });
  },
  SelectInsurance(safeguard, type, priceRange) {
    return request({
      url: '/rest/insurance/screen',
      method: 'post',
      data: {
        safeguard,
        type,
        priceRange
      },
    });
  },
  selectByInterest(interest) {
    return request({
      url: '/rest/insurance/selectByInterest',
      method: 'post',
      data: {
        interest
      }
    })
  }
}
