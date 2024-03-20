import request from '@/utils/request'
let CarApi = {
    /*订单列表*/
    getCarlist(data, errorback) {
        return request._post('/shop/takeout.car/index', data, errorback);
    }, 
    
}

export default CarApi;
