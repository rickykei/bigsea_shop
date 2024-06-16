import request from '@/utils/request'
let ReportApi = {
    /*订单列表*/
   
	
	getProductSales(data,errorback){
		return request._post('/shop/report.productsales/index', data, errorback);
	},
	getDailySales(data,errorback){
		return request._post('/shop/report.dailysales/index', data, errorback);
	},
	 
}

export default ReportApi;
