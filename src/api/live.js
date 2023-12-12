import request from '@/utils/request'

let LiveApi = {

    /*直播列表*/
    getList(data, errorback) {
        return request._post('/shop/plus.live.wx/index', data, errorback);
    },

	  /*直播列表同步*/
    syn(data, errorback) {
        return request._post('/shop/plus.live.wx/syn', data, errorback);
    },
    
    /*置顶设置*/
    settop(data, errorback) {
        return request._post('/shop/plus.live.wx/settop', data, errorback);
    },

}

export default LiveApi;
