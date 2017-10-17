import WxRequest from '../assets/plugins/wx-request/lib/index'

class HttpService extends WxRequest {
    constructor(options) {
        super(options)
        this.$$prefix = ''
        this.$$path = {
            is_rule: '/store/isRule',
            scan_order: '/order/scanOrder',
            receive_order: '/order/receiveOrder',
            store_order_complete_list: '/order/storeOrderComplete',
            store_order_detail: '/order/storeOrderDetail',

        }
        this.interceptors.use({
            request(request) {
                request.header = request.header || {}
                // request.header['content-type'] = 'application/json'
                request.header['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
                if (request.url.indexOf('/api') !== -1 && wx.getStorageSync('token')) {
                    request.header.Authorization = 'Bearer ' + wx.getStorageSync('token')
                }
                wx.showLoading({
                    title: '加载中',
                })
                return request
            },
            requestError(requestError) {
                wx.hideLoading()
                return Promise.reject(requestError)
            },
            response(response) {
                wx.hideLoading()
                if (response.statusCode === 401) {
                    wx.removeStorageSync('token')
                    wx.redirectTo({
                        url: '/pages/login/index'
                    })
                }
                return response
            },
            responseError(responseError) {
                wx.hideLoading()
                return Promise.reject(responseError)
            },
        })
    }

    //登录权限验证
    isRule(params) {
        return this.postRequest(this.$$path.is_rule, {
            data: params,
        })
    }

    //通过二维码查询订单
    scanOrder(params) {
        return this.postRequest(this.$$path.scan_order, {
            data: params,
        })
    }

    //取货确认
    receiveOrder(params) {
        return this.postRequest(this.$$path.receive_order, {
            data: params,
        })
    }

    //查询完成订单
    storeOrderComplete(params) {
        return this.postRequest(this.$$path.store_order_complete_list, {
            data: params,
        })
    }

    //查询完成订单详情
    storeOrderDetail(params) {
        return this.postRequest(this.$$path.store_order_detail, {
            data: params,
        })
    }
}

export default HttpService