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
        try {
            this.setData({
                phone: app.WxService.getStorageSync('mobile'),
                isRule: app.WxService.getStorageSync('isRule')
            })
        } catch (e) {
            // Do something when catch error
        }
        this.getUserInfo()
        console.log("isRule-->" + app.WxService.getStorageSync('isRule') + 'storeId-->' + app.WxService.getStorageSync('storeId'))
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
        // 允许从相机和相册扫码
        var that = this
        wx.scanCode({
            success: (res) => {
                console.log('二维码：---》》' + JSON.stringify(res))
                that.setData({
                    scanCode: res.charSet,
                })
                that.goToPickGoods()
            },
            fail: (res)=> {
                console.log('二维码：---》》' + JSON.stringify(res))
            },
            complete: ()=> {
                that.setData({
                    scanCode: 'CAf641b18ebeeb4c528beaf99c2e301e01',
                })
            }
        })
    },

    /**
     * 订单列表
     */
    goToPickGoods(){
        app.WxService.navigateTo('/pages/pickGoods/index?scanCode=' + encodeURIComponent(this.data.scanCode))
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
        this.getUserLogin(app.WxService.getStorageSync('weixin_code'))
    },

    /**
     *用户登录 登录权限验证
     */
    getUserLogin(weixinCode){
        var that = this
        util.showBusy('正在登录...')
        app.HttpService.isRule({
            weixinCode: weixinCode,
        }).then(res => {
            const data = res.data
            console.log(data)
            if (data.code == 0) {
                util.showSuccess(data.message)
                that.setData({
                    isRule: data.data.storeId.length > 0
                })
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
        try {
            App.WxService.setStorageSync('mobile', mobile)
            App.WxService.setStorageSync('storeName', storeName)
            App.WxService.setStorageSync('storeId', storeId)
        } catch (e) {
            console.log('setStorageSync failed')
        }
    },
})
