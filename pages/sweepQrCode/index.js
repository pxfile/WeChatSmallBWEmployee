const app = getApp()
var util = require('../../utils/util.js')

Page({
    /**
     * 订单列表
     */
    goToPickGoods(e){
        app.WxService.navigateTo('/pages/pickGoods/index?scanCode='+'CAf641b18ebeeb4c528beaf99c2e301e01')
    }
})