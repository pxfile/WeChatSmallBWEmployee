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
        app.WxService.navigateTo('/pages/sweepQrCode/index')
    },

    /**
     * 订单列表
     */
    goToOrderList(e){
        app.WxService.navigateTo('/pages/order/list/index')
    },

    /**
     * 点击重试
     */
    tryAgain(e){
        this.getUserLogin(app.WxService.getStorageSync('mobile'))
    },

    /**
     *用户登录 登录权限验证
     */
    getUserLogin(mobile){
        var that = this
        util.showBusy('正在登录...')
        app.HttpService.isRule({
            phone: mobile,
        }).then(res => {
            const data = res.data
            console.log(data)
            if (data.code == 0) {
                util.showSuccess(data.message)
                that.setStorageSyncData(data.data.storePhone, data.data.storeName, data.data.storeId)
            } else {
                util.showModel('登录失败', data.message);
                console.log('request fail', data.message);
            }
        })
    },
    /**
     * 保存用户信息
     */
    setStorageSyncData(mobile, storeName, storeId){
        App.WxService.setStorageSync('mobile', mobile)
        App.WxService.setStorageSync('storeName', storeName)
        App.WxService.setStorageSync('storeId', storeId)
    },
})
