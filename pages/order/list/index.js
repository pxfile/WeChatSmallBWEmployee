var app = getApp()
var util = require('../../../utils/util.js')
Page({
    data: {
        start_num: 0,
        list: [],
        onpulldownrefresh: '下拉刷新...',
        onreachbottom: '上拉加载更多...',
        prompt: {
            hidden: !0,
            icon: '../../../assets/images/iconfont-empty.png',
        },
        date: '',
    },

    /**
     * 选择时间
     * @param e
     */
    bindDateChange(e) {
        this.setData({
            date: e.detail.value
        })
        this.fetchListData(false)
    },

    onLoad() {
        this.setData({
            date: util.formatDate(new Date()),
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
            // startTime: that.data.date + " 0:0:0",
            // endTime: that.data.date + " 23:0:0"
            startTime: '2017-8-30 0:0:0',
            endTime: '2017-10-16:0:0:0'
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
})