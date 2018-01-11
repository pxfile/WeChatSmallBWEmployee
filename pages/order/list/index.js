var app = getApp()
var util = require('../../../utils/util.js')
Page({
    data: {
        start_num: 0,
        list: [],
        selectDate: '选择日期',
        onpulldownrefresh: '下拉刷新...',
        onreachbottom: '上拉加载更多...',
        prompt: {
            hidden: !0,
            icon: '../../../assets/images/iconfont-empty.png',
        },
        date: '',
        startDate: '',
        endDate: '',
    },

    /**
     * 选择时间
     * @param e
     */
    bindDateChange(e) {
        this.setData({
            date: e.detail.value,
            selectDate: e.detail.value
        })
        this.fetchListData(false)
    },

    onLoad() {
        this.setData({
            date: util.formatDate(new Date()),
            startDate: '2017-01-01',
            endDate: '2030-12-31',
        })
        this.fetchListData(false);
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
        this.setData({
            start_num: 0,
        }),
            this.fetchListData(false);
        wx.stopPullDownRefresh();
    },
    /**
     * 上拉加载更多
     */
    onReachBottom() {
        this.setData({
            start_num: this.data.list.length,
        }),
            this.fetchListDataMore();
    },

    /**
     * 请求商品列表
     */
    fetchListData(isReachBottom) {
        util.showBusy('正在加载...')
        var that = this
        app.HttpService.storeOrderComplete({
            storeId: app.WxService.getStorageSync('storeId'),
            startTime: that.data.date + " 0:0:0",
            endTime: that.data.date + " 23:0:0"
        }).then(res => {
            const data = res.data
            console.log(data)
            if (data.code == 0) {
                if (isReachBottom) {
                    that.setData({
                        list: that.data.list.concat(data.data),
                    })
                } else {
                    that.setData({
                        list: data.data,
                        'prompt.hidden': data.data.length,
                    })
                }
            } else {
                util.showModel('加载失败', data.message);
                console.log('request fail', data.message);
                that.setData({
                    'prompt.hidden': 0 && !isReachBottom,
                })
            }
        })
    },

    /**
     * 上拉加载更多
     */
    fetchListDataMore() {
        if (this.data.list.length === 0) return
        this.fetchListData(true);
    },
    /**
     * 跳转订单详情
     */
    goToOrderDetail(e){
        app.WxService.navigateTo('/pages/order/detail/index?id=' + encodeURIComponent(e.currentTarget.dataset.id) + '&type=0')
    }
})
