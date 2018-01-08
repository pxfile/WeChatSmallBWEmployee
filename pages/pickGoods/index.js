//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')

Page({
    data: {
        goodsList: [],
        orderId: '',
        orderTime: '',
        totalPrice: '',
        scanCode: '',
        storeId: '',
        addressText: '',
        receiveOrder: true
    },

    onLoad(option) {
        this.setData({
            scanCode: decodeURIComponent(option.scanCode),
            storeId: app.WxService.getStorageSync('storeId'),
            addressText: '待取货'
        })
        this.fetchListData(this.data.scanCode, this.data.storeId)
    },

    /**
     * 通过二维码查询订单
     */
    fetchListData(scanCode, storeId) {
        util.showBusy('正在加载...')
        var that = this
        app.HttpService.scanOrder({
            scanCode: scanCode,
            storeId: storeId,
        }).then(res => {
            const data = res.data
            console.log(data)
            if (data.code == 0) {
                that.setData({
                    orderTime: data.data.orderTime,
                    orderId: data.data.orderId,
                    totalPrice: data.data.totalPrice,
                    goodsList: data.data.goodsList,
                })
            } else {
                util.showModel('加载失败', data.message);
                console.log('request fail', data.message);
            }
            that.setData({
                'prompt.hidden': !data.code,
            })
        })
    },

    receiveOrder(e){
        this.getReceiveOrder(this.data.storeId, this.data.scanCode, this.data.orderTime)
    },

    /**
     * 取货确认
     */
    getReceiveOrder(storeId, scanCode, pickTime){
        util.showBusy('正在加载...')
        var that = this
        app.HttpService.receiveOrder({
            storeId: storeId,
            scanCode: scanCode,
            pickTime: pickTime,
        }).then(res => {
            const data = res.data
            console.log(data)
            if (data.code == 0) {
                util.showSuccess(data.message)
                that.setData({
                    addressText: '已取货',
                    receiveOrder: true
                })
                that.goToOrderDetail();
            } else {
                util.showModel('加载失败', data.message);
                console.log('request fail', data.message);
                that.setData({
                    receiveOrder: false
                })
            }
        })
    },
    /**
     * 跳转订单详情
     */
    goToOrderDetail(){
        app.WxService.redirectTo('/pages/order/detail/index?id=' + encodeURIComponent(this.data.orderId) + '&type=0')
    }
})
