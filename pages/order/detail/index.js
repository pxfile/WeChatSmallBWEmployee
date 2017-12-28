//index.js
//获取应用实例
var app = getApp()
var util = require('../../../utils/util.js')
Page({
    data: {
        payMoney:0,
        goods_detail: {},
        prompt: {
            hidden: !0,
            icon: '../../../assets/images/iconfont-empty.png',
        },
    },

    onLoad(option) {
        this.setData({
            id: decodeURIComponent(option.id),
        })
        this.fetchListData(this.data.id)
    },

    /**
     * 请求订单列表
     */
    fetchListData(id) {
        util.showBusy('正在加载...')
        var that = this
        app.HttpService.storeOrderDetail({
            orderId: id,
            storeId: app.WxService.getStorageSync('storeId'),
        }).then(res => {
            const data = res.data
            console.log(data)
            if (data.code == 0) {
                that.setData({
                    goods_detail: data.data,
                    payMoney:util.fMoney(data.data.payMoney,2)
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
})
