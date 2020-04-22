<script>
	import store from '@/store' //引入全局变量的token
	import interfaceurl from '@/utils/interface.js'
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function(res) {
			let token = uni.getStorageSync('token');
			if (token) {
				// uni.getUserInfo({
				//   success: function(res) {
				// 	 let detail = {
				// 		encryptedData: res.encryptedData,
				// 		iv: res.iv
				// 	 }
				// 	detail.userInfo = res.userInfo
				// 	interfaceurl.login(detail, successBack);
				//   }
				// })
				let userInfo = uni.getStorageSync('userInfo');
				store.commit('updateToken', token);
				store.commit('setUserInfo', userInfo);
				let that = this;
				interfaceurl.checkAuth(interfaceurl.cartPage, {userId: userInfo.userId}).then((res) => {
					store.commit('setCartNum', res.data.length);
				});
			}
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	/*自定义公共样式*/
	@import './common/custom.css';
</style>
