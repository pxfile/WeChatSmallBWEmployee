var util = require('../../utils/util.js')
const App = getApp()

Page({
    data: {
        weixinCode: '',
    },

    onLoad(){
        if (App.WxService.getStorageSync('storeId')) {
            App.WxService.redirectTo('/pages/index/index')
            return
        }
    },
    //用户名和密码输入框事件
    phoneInput(e){
        console.log(e)
        this.setData({
            weixinCode: e.detail.value
        })
    },
    //登录按钮点击事件，调用参数要用：this.data.参数；
    //设置参数值，要使用this.setData({}）方法
    loginBtnClick(a) {
        console.log(a)
        // var regMobile = /^1\d{10}$/;
        // if (!regMobile.test(this.data.phoneNumber)) {
        //     util.showModel('温馨提示', '手机号有误，请重新操作！');
        //     this.setData({
        //         phoneNumber: ''
        //     })
        //     return;
        // }
        App.WxService.setStorageSync('weixin_code', this.data.weixinCode)
        this.getUserLogin(this.data.weixinCode)
    },
    /**
     *用户登录 登录权限验证
     */
    getUserLogin(weixinCode){
        var that = this
        if (this.data.weixinCode.length == 0) {
            util.showModel('温馨提示', '微信号不能为空！')
        } else {
            util.showBusy('正在登录...')
            App.HttpService.isRule({
                weixinCode: weixinCode,
            }).then(res => {
                const data = res.data
                console.log(data)
                if (data.code == 0) {
                    util.showSuccess(data.message)
                    that.setStorageSyncData(data.data.storePhone, data.data.storeName, data.data.storeId)
                    that.goIndex()
                    console.log('login--storeId-->' + data.data.storeId)
                } else {
                    util.showModel('登录失败', data.message);
                    console.log('request fail', data.message);
                }
            })
        }
    },
    /**
     * 保存用户信息
     */
    setStorageSyncData(mobile, storeName, storeId){
        App.WxService.setStorageSync('isRule', storeId.length > 0)
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