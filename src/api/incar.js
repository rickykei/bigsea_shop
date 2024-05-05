import request from '@/utils/request'
let InCarApi = {
    /*订单列表*/
  
    getInCarList(data,errorback){
		return request._post('/shop/takeout.incar/index', data, errorback);
	},
	
	getInCarDetailByIncarTimeCarno(data, errorback) {
	    return request._get('/shop/takeout.incar/add', data, errorback);
	},
	
	setInCarDetailByIncarTimeCarno(data, errorback) {
	    return request._post('/shop/takeout.incar/add', data, errorback);
	},
	
	getInCarDetailByIncarId(data,errorback) {
		return request._get('/shop/takeout.incar/edit', data, errorback);
	},
	
	setInCarDetailByIncarId(data,errorback) {
		return request._post('/shop/takeout.incar/edit', data, errorback);
	}
}

export default InCarApi;
