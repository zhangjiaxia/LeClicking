import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    //modules,
    //严格模式启用后，数据状态的修改就必须通过mutations的方式提交，这样也便于查看状态变更
    strict: process.env.NODE_ENV !== 'production',
    state: {
        //用户登录后记录
		token: '', //用户登录后接口传回的token
		code: '', //获取用户的code
		userInfo: {}, //用户授权后得到的信息
		addressEdit: {}, //编辑地址信息
		cartNum: 0, //购物车数量
		cartOrder: [] ,//购物车订单
		key: '', //搜索关键词
		typeNumber: 0, //1:好玩推荐2:最新上架3:下载热榜4:好评度高5:月度排行
		tempAddress: {}, //临时地址
		downResult: true, //游戏下载结果,true:常规,结果(成功或失败),false:下载中
		evaluateGoods: [] //要评价的商品
    },
	//数据修改，非异步
    mutations: {
		updateToken(state, newValue) {
			state.token = newValue
		},
		getCode(state, newValue) {
			state.code = newValue
		},
		setUserInfo(state, newValue) {
			state.userInfo = newValue
		},
		setAddressEdit(state, newValue) {
			state.addressEdit = newValue
		},
		setCartNum(state, newValue) {
			state.cartNum = newValue
		},
		setCartOrder(state, newValue) {
			state.cartOrder = newValue
		},
		setKey(state, newValue) {
			state.key = newValue
		},
		setType(state, newValue) {
			state.typeNumber = newValue
		},
		setTempAddress(state, newValue) {
			state.tempAddress = newValue
		},
		setDownResult(state, newValue) {
			state.downResult = newValue
		},
		setEvaluateGoods(state, newValue) {
			state.evaluateGoods = newValue
		}
    },
	//异步方法，如果需要修改state中的数据，必须调用mutations里的方法
	actions: {
		// updateTokens(state, newValue) {
		// 	console.log('actions')
		// 	console.log(state, newValue)
		// 	//state.state.token = 'zjxs:' + newValue
		// 	state.commit('updateToken', 'zjxs:' + newValue)
		// }
	}
})