import request from '@/utils/request'
let CarApi = {
    /*订单列表*/
    takeOrderlist(data, errorback) {
        return request._post('/shop/takeout.order/index', data, errorback);
    },
    storeOrderlist(data, errorback) {
        return request._post('/shop/store.order/index', data, errorback);
    },
    
}

export default CarApi;
