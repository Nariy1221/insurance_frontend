import request from '@/utils/request'
const api_name = `/api/order/orderInfo`
export default {
    //根据dictcode获取下级节点
    createOrder(uid,mid) {
        return request({
            url: `/rest/orders/create-order`,
            method: 'get',
            params:{
                uid,mid
            }
        })
    },
    getOrderList(uid) {
        return request({
            url: `/rest/orders/find-order`,
            method: 'get',
            params:{
                uid
            }
        })
    },
    //生成订单
    saveOrders(scheduleId, patientId) {
        return request({
            url: `${api_name}/auth/submitOrder/${scheduleId}/${patientId}`,
            method: 'post'
        })
    },
    //订单详情
    getOrders(orderId) {
        return request({
            url: `${api_name}/auth/getOrders/${orderId}`,
            method: `get`
        })
    },
    //订单列表
    getPageList(page, limit, searchObj) {
        return request({
            url: `${api_name}/auth/${page}/${limit}`,
            method: `get`,
            params: searchObj
        })
    },
    //订单状态
    getStatusList() {
        return request({
            url: `${api_name}/auth/getStatusList`,
            method: 'get'
        })
    },
    //取消订单
    cancelOrder(orderId) {
        return request({
            url: `/api/order/orderInfo/auth/cancelOrder/${orderId}`,
            method: 'get'
        })
    },
}
