const App = getApp()

Page({
    data: {
        indicatorDots: !1,
        autoplay: !1,
        current: 0,
        interval: 3000,
        duration: 1000,
        circular: !1,
    },
    onLoad() {
    },
    onShow() {
    },
    bindload(e) {
        setTimeout(App.WxService.getStorageSync('storeId') ? this.goIndex : this.goLogin, 3000)
    },
    goIndex() {
        App.WxService.redirectTo('/pages/index/index')
    },
    goLogin() {
        App.WxService.redirectTo('/pages/login/index')
    },
})
