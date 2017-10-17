var util = require('../../utils/util.js')
const App = getApp()

Page({
    data: {
        phoneNumber: '',
        infoMess: '',
    },
    //用户名和密码输入框事件
    phoneInput(e){
        console.log(e)
        this.setData({
            phoneNumber: e.detail.value
        })
    },
    //登录按钮点击事件，调用参数要用：this.data.参数；
    //设置参数值，要使用this.setData({}）方法
    loginBtnClick(a) {
        console.log(a)
        App.WxService.setStorageSync('mobile', this.data.phoneNumber)
        this.getUserLogin(this.data.phoneNumber)
    },
    /**
     *用户登录 登录权限验证
     */
    getUserLogin(mobile){
        var that = this
        if (this.data.phoneNumber.length == 0) {
            util.showModel('温馨提示', '手机号不能为空！')
        } else {
            util.showBusy('正在登录...')
            App.HttpService.isRule({
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

            that.goIndex()
        }
    },
    /**
     * 保存用户信息
     */
    setStorageSyncData(mobile, storeName, storeId){
        App.WxService.setStorageSync('mobile', mobile)
        App.WxService.setStorageSync('storeName', storeName)
        App.WxService.setStorageSync('storeId', storeId)
    },
    /**
     * 跳转首页
     */
    goIndex() {
        App.WxService.redirectTo('/pages/index/index')
    },
})