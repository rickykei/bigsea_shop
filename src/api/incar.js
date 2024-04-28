import request from '@/utils/request'
let InCarApi = {
    /*订单列表*/
  
    getInCarList(data,errorback){
		return request._post('/shop/takeout.incar/index', data, errorback);
	}
}

export default InCarApi;
