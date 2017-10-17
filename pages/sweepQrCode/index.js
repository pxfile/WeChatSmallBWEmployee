const app = getApp()
var util = require('../../utils/util.js')

Page({

    data: {
        scanCode: '',
    },

    onLoad() {
        // 允许从相机和相册扫码
        var that = this
        wx.scanCode({
            success: (res) => {
                console.log('二维码：---》》' + JSON.stringify(res))
                that.setData({
                    scanCode: res.charSet,
                })
            },
            fail: (res)=> {
                console.log('二维码：---》》' + JSON.stringify(res))
            },
            complete: ()=> {
                that.setData({
                    scanCode: 'CAf641b18ebeeb4c528beaf99c2e301e01',
                })
                that.goToPickGoods()
            }
        })

    },

    /**
     * 订单列表
     */
    goToPickGoods(){
        app.WxService.navigateTo('/pages/pickGoods/index?scanCode=' + this.data.scanCode)
    }
})