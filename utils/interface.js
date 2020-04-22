import req from './request.js' //引入请求api
import store from '@/store' //引入全局变量的token

const isFormal = false //是否正式,false:测试，true:正式

const localUrlTest = "http://39.97.247.179:8080" //本地项目https://192.168.0.127
const baseUrlTest = "https://game.itaocow.com.cn"; //测试域名，平时开发用测试域名，例如39.97.247.179
const baseUrlFormal = "https://shop.itaocow.com.cn"; //正式域名，提交文件时要切换到正式域名，例如https://wxmini.etour.wangytech.com
//const baseUrl = isFormal ? baseUrlFormal : baseUrlTest;
const newTestUrl = "http://pro.gzzshd.com";
const baseUrl = newTestUrl

/**后台>http://39.97.247.179:8080/productInfoList.html
 * 后台账号：test  密码： 123456
 * 后台接口》https://192.168.0.199/swagger-ui.html#!/
 * 配置接口定义，请求方式默认为get，post方式需明确指定
 * 根据指引》https://www.jianshu.com/p/edd9a1aac8bd
 */
const interfaceurl = {
    /**
     * 错误弹窗
     */
    showErr(err) {
        uni.hideLoading();
        const msg = req.errPicker(err);
        //正式，由于正式环境不可在用户面前暴露过多问题，所以像500,404这些未正常请求到后台的异常直接提示‘wifi信号弱’
        if (isFormal) {
            uni.showToast({
                title: msg,//'wifi信号弱'
                icon: 'none',
                duration: 2000
            });
        } else { //测试,尽可能的暴露问题
            uni.showModal({
                showCancel: false,
                content: msg
            });
        }
    },
    /**
     * 数据格式业务处理
     */
    showBussisnessErr(res) {
        console.log(res);
        //res.respCode为0则是正常，其它数值代表请求有正常跑完全程，后台接口能够捕获到的异常处理
        if (res.respCode !== '0000') {
			if(res.respCode === '0029' || res.respCode === '0028') {
				store.commit('updateToken', '');
				uni.setStorageSync('token', '');
				uni.showToast({
					title: '用户登录过期,请重新操作',
					icon: 'none',
					duration: 2000
				});
			} else {
				uni.showToast({
				    title: res.respMsg,
				    icon: 'none',
				    duration: 2000
				});
			}
			// if(res.respCode === 50008) {
			// 	uni.showToast({
			// 	    title: '用户登录过期,请重新操作',
			// 	    icon: 'none',
			// 	    duration: 2000
			// 	});
			// 	uni.getUserInfo({
			// 	  success: function(res) {
			// 		 let detail = {
			// 			encryptedData: res.encryptedData,
			// 			iv: res.iv
			// 		 }
			// 		detail.userInfo = res.userInfo
			// 		interfaceurl.login(detail);
			// 	  }
			// 	})
			// }
            return false
        }
        //返回true值后，执行正常业务
        return true
    },
	/**
	 * 用户登录并授权手机号，若用户授权登录后，检查登录状态失效，就要重新登录
	 */
	login(detail, successBack) {
		uni.login({
		  success (res) {
		    if (res.code) {
				//这里直接用原生请求就行了
				uni.request({
					url: `${baseUrl}/mp/wxapi/session.do`,
					data: {
					  appId: 'wx8886f23ea6db4812',
					  code: res.code
					},
					method: 'post',
					success (res) {
						let loginResp = res.data.data;
						uni.setStorageSync('token', loginResp.token)
						store.commit('updateToken', loginResp.token)
						interfaceurl.checkAuth(interfaceurl.wxLogin, {
							agentId: uni.getStorageSync('agentId') || '', //推荐人ID,只有在分销小程序传过来有值
						    sessionKey: loginResp.sessionKey,
							openId: loginResp.openId,
							rawData: detail.rawData,
							signature: detail.signature,
							encryptedData: detail.encryptedData,
							iv: detail.iv,
							userInfo: detail.userInfo
						}).then((res) => {
							res.data.rawData = detail.rawData
							res.data.signature = detail.signature
							console.log('授权用户信息')
							console.log(detail)
							store.commit('setUserInfo', res.data);
							uni.setStorageSync('userInfo', res.data);
						});
						if(successBack) {
							successBack();
						}
					},
					fail(res) {
						interfaceurl.showErr(res)
					}
				})
		    } else {
		      uni.showToast({
				  title: '登录失败！' + res.errMsg,
				  icon: 'none',
				  duration: 2000
		      });
		    }
		  }
		})
	},
	/**
	 * 检查登录状态，每次调用权限接口时都要检查登录状态
	 */
	checkLogin(){
	  return new Promise(function(resolve,reject){
	    wx.checkSession({
	      success: resolve,
	      fail: reject
	    })
	  })
	},
	//小程序接口,标记false的接口都是开放接口，其余的为权限接口
	//接口返回的价格单位都是分
	
	//获取登录授权sessin_key
	session(data) { return req.request({ url: `${baseUrl}/mp/wxapi/session.do`, data, method: 'POST' }, false) },
	//授权用户登录
	wxLogin(data) { return req.request({ url: `${baseUrl}/mp/wxapi/auth/login.do`, data, method: 'POST' }) },
	//产品分类
	productType(data) { return req.request({ url: `${baseUrl}/mp/product/type.do`, data }, false) },
	//产品信息
	productPage(data) { return req.request({ url: `${baseUrl}/mp/product/page.do`, data, method: 'POST'  }, false) },
	//好玩推荐
	recommend(data) { return req.request({ url: `${baseUrl}/mp/index/recommend.do`, data }, false) },
	//发现产品信息
	productPage(data) { return req.request({ url: `${baseUrl}/mp/product/page.do`, data, method: 'POST' }, false) },
	//广告轮播
	advert(data) { return req.request({ url: `${baseUrl}/mp/index/advert.do`, data }, false) },
	//活动优惠
	activityCoupon(data) { return req.request({ url: `${baseUrl}/mp/index/activity.do`, data }, false) },
	//活动详情
	activityDetail(data) { return req.request({ url: `${baseUrl}/mp/activity/detail.do`, data }, false) },
	//产品评论
	comment(data) { return req.request({ url: `${baseUrl}/mp/product/comment.do`, data, method: 'POST' }, false) },
	//全新设备
	newEquipment(data) { return req.request({ url: `${baseUrl}/mp/index/equipment.do`, data }, false) },
	//产品属性
	attrList(data) { return req.request({ url: `${baseUrl}/mp/product/attrList.do`, data }, false) },
	//获取运费
	fee(data) { return req.request({ url: `${baseUrl}/mp/exp/fee.do`, data, method: 'POST' }, false) },
	//全文搜索
	search(data) { return req.request({ url: `${baseUrl}/mp/product/search.do`, data, method: 'POST' }, false) },
	//小程序推广码
	qrcode(data) { return req.request({ url: `${baseUrl}/mp/wxapi/getQrcode.do`, data, method: 'POST' }, false) },
	
	//权限接口调用前先检查下用户登录状态
	checkAuth(bussinessInterfaceurl, data, isAuth = true) {
		return new Promise(function (resolve, reject) {
			if(isAuth) {
				interfaceurl.checkLogin().then((res) => { //login API 获取code
					// wx.showLoading({
					// 	title: '',
					// 	mask: true,
					// 	duration:3000
					// });
					//权限接口调用
					bussinessInterfaceurl(data).then((res) => {
						if(interfaceurl.showBussisnessErr(res)){
							//wx.hideLoading();
							resolve(res); //接口200时返回的数据
						} 
					}).catch(interfaceurl.showErr); //异常捕获
				}).catch((err) => {
					//interfaceurl.showErr(err)	弹出session通道失效
					interfaceurl.login()
				});
			} else {
				//开放接口调用
				bussinessInterfaceurl(data).then((res) => {
					if(interfaceurl.showBussisnessErr(res)){
						resolve(res); //接口200时返回的数据
					} 
				}).catch(interfaceurl.showErr); //异常捕获
			}
		})
	},
	
	//授权获取手机号
	getMobile(data) { return req.request({ url: `${baseUrl}/mp/wxapi/auth/getMobile.do`, data, method: 'POST' }) },
	//用户收藏
	collection(data) { return req.request({ url: `${baseUrl}/mp/auth/collection/page.do`, data, method: 'POST'}) },
	//加入收藏
	addCollection(data) { return req.request({ url: `${baseUrl}/mp/auth/collection/store.do`, data, method: 'POST'}) },
	//移除收藏
	delCollection(data) { return req.request({ url: `${baseUrl}//mp/auth/collection/delete.do`, data, method: 'POST'}) },
	//优惠券管理
	couponManage(data) { return req.request({ url: `${baseUrl}/mp/auth/users/coupon.do`, data}) },
	//订单管理
	orderManage(data) { return req.request({ url: `${baseUrl}/mp/auth/order/page.do`, data, method: 'POST'}) },
	//订单详情
	orderDetail(data) { return req.request({ url: `${baseUrl}/mp/auth/order/detail.do`, data, method: 'POST'}) },
	//账单管理(暂时无该接口)
	billManage(data) { return req.request({ url: `${baseUrl}/mp/auth/users/bill.do`, data, method: 'POST'}) },
	//设备绑定
	equipmentPage(data) { return req.request({ url: `${baseUrl}/mp/auth/equipment/page.do`, data, method: 'POST'}) },
	//添加/编辑绑定设备
	equipmentSave(data) { return req.request({ url: `${baseUrl}/mp/auth/equipment/saveOrUpdate.do`, data, method: 'POST'}) },
	//解除绑定
	equipmentDelete(data) { return req.request({ url: `${baseUrl}/mp/auth/equipment/delete.do`, data, method: 'POST'}) },
	//购物车
	cartPage(data) { return req.request({ url: `${baseUrl}/mp/auth/cart/page.do`, data, method: 'POST'}) },
	//加入购物车
	addCart(data) { return req.request({ url: `${baseUrl}/mp/auth/cart/store.do`, data, method: 'POST'}) },
	//移除购物车
	delCart(data) { return req.request({ url: `${baseUrl}/mp/auth/cart/delete.do`, data, method: 'POST'}) },
	//地址管理
	addressPage(data) { return req.request({ url: `${baseUrl}/mp/auth/address/page.do`, data, method: 'POST'}) },
	//删除地址
	addressDelete(data) { return req.request({ url: `${baseUrl}/mp/auth/address/delete.do`, data, method: 'POST'}) },
	//添加/编辑地址
	addressSave(data) { return req.request({ url: `${baseUrl}/mp/auth/address/saveOrUpdate.do`, data, method: 'POST'}) },
	//统一下单
	buildOrder(data) { return req.request({ url: `${baseUrl}/mp/auth/order/buildOrder.do`, data, method: 'POST'}) },
	//订单支付auth
	pay(data) { return req.request({ url: `${baseUrl}/mp/payment/pay.do`, data, method: 'POST'}) },
	//游戏下载设备绑定（小程序点击下载）
	bindGame(data) { return req.request({ url: `${baseUrl}/mp/auth/game/bind.do`, data, method: 'POST'}) },
	//设备接入获取下载信息(游戏下载),这是U3D的接口
	downInfo(data) { return req.request({ url: `${baseUrl}/mp/game/downInfo.do`, data, method: 'POST'}) },
	//获取默认地址
	defaultAddress(data) { return req.request({ url: `${baseUrl}/mp/auth/address/default.do`, data}) },
	//订单取消
	orderCancel(data) { return req.request({ url: `${baseUrl}/mp/auth/order/cancel.do`, data, method: 'POST'}) },
	//订单删除
	orderDelete(data) { return req.request({ url: `${baseUrl}/mp/auth/order/delete.do`, data, method: 'POST'}) },
	//查询用户是否收藏某商品id=产品ID
	collectFlg(data) { return req.request({ url: `${baseUrl}/mp/auth/collection/collectFlg`, data}) },
	//订单确认收货
	confirmfinish(data) { return req.request({ url: `${baseUrl}/mp/auth/order/confirmFinish.do`, data, method: 'POST'}) },
	//产品评论添加
	addComment(data) { return req.request({ url: `${baseUrl}/mp/product/auth/comment.do`, data, method: 'POST'}) },
	//产品详情
	detail(data) { return req.request({ url: `${baseUrl}/mp/product/detail.do`, data }) },
}

export default interfaceurl;