//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        isRule: false,
    },
    onLoad() {
        this.setData({
            phone: app.WxService.getStorageSync('mobile'),
            isRule: app.WxService.getStorageSync('storeId').length > 0
        })
        this.getUserInfo()
    },
    getUserInfo() {
        const userInfo = app.globalData.userInfo

        if (userInfo) {
            this.setData({
                userInfo: userInfo
            })
            return
        }

        app.getUserInfo()
            .then(data => {
                console.log(data)
                this.setData({
                    userInfo: data
                })
            })
    },

    /**
     * 扫码取款
     */
    sweepQRCode(e){
        app.WxService.redirectTo('/pages/sweepQrCode/index')
    },

    /**
     * 订单列表
     */
    goToOrderList(e){
        app.WxService.redirectTo('/pages/order/list/index')
    }
})
