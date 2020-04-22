<template>
	<view>
		<!--弹窗，可封装-->
		<uni-popup :show="showpopup" :type="type" @change="change">
			<view class="uni-flex popup content">
				<view>
					<view class="msg">你还没有绑定设备呦~</view>
					<view>
						<view class="uni-flex bind content" @click="$turnPage('/pages/my/mine/newdevice', 'navigateTo')">绑定设备</view>
						<view class="uni-flex purchase content" @click="showpopup=false;">购买设备</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup :show="showdevicepopup" :type="type" @change="change">
			<view class="uni-flex devicepopup">
				<view class="checkdevice">
					<view class="uni-flex uni-row" style="margin-bottom: 30rpx;">
						<view class="uni-flex rest choose">请选择安装设备</view>
						<view class="uni-flex add" @click="saveCart">添加设备</view>
					</view>
					<view class="uni-flex uni-row vertical" @click="setDeviceId(item.id)"
						v-for="(item, index) in devices" :key="index">
						<view class="uni-flex rest choose number">{{item.name}}</view>
						<view class="uni-flex">
							<text class="iconfont .icon-gou5 add" 
								:style="{color: item.id == deviceId ? '#FD5E2D' : 'grey'}">
							</text>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup :show="showattributepopup" :type="type" @change="change">
			<view class="uni-flex uni-column attributepopup">
				<view class="top">
					<view class="attrTitle">选择属性</view>
					<view class="">
						<view class="uni-flex content item" :class="{itemactive: attrIndex == index }" @click="setAttrIndex(index)"
							v-for="(item, index) in attrList" :key="index">{{item.name}}
						</view>
					</view>
				</view>
				<view class="uni-flex vertical itembar">
					已选规格：{{attrList[attrIndex].name}}
				</view>
				<view class="uni-flex uni-row bottombtn">
					<view class="uni-flex rest content base" @click="showattributepopup = false;">取消</view>
					<view class="uni-flex rest content active" @click="deviceAddCart">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		computed: mapState(['userInfo']),
		components: {
			uniPopup
		},
		data() {
			return {
				/*弹窗相关参数*/
				showpopup: false, //提示用户绑定设备
				showdevicepopup: false, //显示设备列表
				showattributepopup: false, //显示设备属性
				type: 'center',
				attrList: [], //设备商品的属性
				devices: [], //用户绑定的设备
				item: {}, //用户选中的商品（设备或游戏）
				deviceId: 0, //用户选中的设备
				attrIndex: 0, //用户选中的属性
				isDownLoad: false, //是否为下载操作
			}
		},
		onLoad(options) {
			
		},
		methods: {
			//弹窗相关方法
			//加入购物车前判断用户是否绑定设备
			setDeviceId(id) {
				this.deviceId = id;
			},
			setAttrIndex(index) {
				this.attrIndex = index;
			},
			//跳转立即支付页面
			turn(item) {
				let selectCartList = [];
				item.productId = item.id;
				item.quantity = 1;
				item.proAttrId = this.attrList.length > 0 ? this.attrList[this.attrIndex].id : ''
				selectCartList.push(item);
				this.$store.commit("setCartOrder", selectCartList);
				this.$turnPage('orderpay', 'navigateTo');
				this.disappear();
			},
			//添加设备商品到购物车中
			deviceAddCart() {
				//加入购物车：false，立即支付：true
				if(this.item.isPayOrCart) {
					//确认设备安装后，可能加入购物车，也可能跳转立即支付页面
					this.turn(this.item);
				} else {
					let params = {
						productId: this.attrList.length > 0 ? this.attrList[this.attrIndex].productId : this.item.id,
						userId: this.userInfo.userId,
						equipmentId: '',
						proAttrId: this.attrList.length > 0 ? this.attrList[this.attrIndex].id : ''
					}
					this.execAddCart(params);
				}
			},
			getAttrList(item) {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.attrList, {productId: item.id}).then((res) => {
					that.attrList = res.data;
					//如果设备商品的属性列表不为空，则弹出选择，否则直接加入购物车
					if(that.attrList.length > 0) {
						that.togglePopup('center', 'attributepopup');
					} else {
						that.deviceAddCart(item);
					}
				});
			},
			beforeSaveCart(item, isDownLoad) {
				let that = this;
				that.item = item;
				that.isDownLoad = isDownLoad
				interfaceurl.checkAuth(interfaceurl.equipmentPage, {userId: that.userInfo.userId}).then((res) => {
					that.devices = res.data;
					if (that.devices.length === 0) {
						that.togglePopup('center', 'popup');
					} else {
						that.deviceId = that.devices[0].id;
						that.togglePopup('bottom', 'devicepopup');
					}
				});
			},
			saveCart() {
				//true为下载，false为加入购物车
				if(this.isDownLoad) {
					let equipmentIds = [];
					equipmentIds.push(this.deviceId);
					let bindParams = {
						productId: this.item.id,
						userId: this.userInfo.userId,
						equipmentIds: equipmentIds
					}
					let that = this;
					interfaceurl.checkAuth(interfaceurl.bindGame, bindParams).then((res) => {
						this.showdevicepopup = false
						uni.showToast({
						    title: '游戏下载中...',
						    icon: 'none',
						    duration: 2000
						});
						//在确定下载的设备后,判断是否出现进度条
						this.$store.commit('setDownResult', false)
						setTimeout(function(){
							that.$store.commit('setDownResult', true)
						}, 3000)
					});
				} else {
					if(this.item.isPayOrCart) {
						//确认设备安装后，可能加入购物车，也可能跳转立即支付页面
						this.turn(this.item);
					} else {
						let params = {
							productId: this.item.id,
							userId: this.userInfo.userId,
							equipmentId: this.deviceId
						}
						this.execAddCart(params);
					}
				}
			},
			execAddCart(params) {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.addCart, params).then((res) => {
					interfaceurl.checkAuth(interfaceurl.cartPage, {userId: that.userInfo.userId}).then((res) => {
						that.$store.commit('setCartNum', res.data.length);
					});
					that.disappear();
					uni.showToast({
					    title: '添加成功',
					    icon: 'success',
					    duration: 2000
					});
				});
			},
			popup(item) {
				this.item = item;
				this.getAttrList(item);
			},
			togglePopup(type, open) {
				this.type = type
				this['show' + open] = true
			},
			disappear() {
				this.showpopup = false
				this.showdevicepopup = false
				this.showattributepopup = false
			},
			change(e) {
				if (!e.show) {
					this.disappear();
				}
			}
		}
	}
</script>

<style lang="scss">
	/*弹窗样式相关*/
	.popup {
		background: #FFFFFF;
		width:500rpx;
		height:300rpx;
		border-radius:10rpx;
		.msg {
			text-align: center;
			margin-bottom: 64rpx;
			font-size: 32rpx;
			color: #000000;
		}
		.bind, .purchase {
			width:180rpx;
			height:70rpx;
			font-size: 27rpx;
			border:1px solid rgba(253,94,45,1);
			border-radius:10rpx;
			display: inline-flex;
		}
		.bind {
			margin-right: 15px;
			color: #FD5E2D;
		}
		.purchase {
			background:rgba(253,94,45,1);
			color: #FFFFFF;
		}
	}
	.devicepopup {
		width: 100%;
		background: #FFFFFF;
		view {
			font-size: 27rpx;
			line-height: 1.2;
		}
		.checkdevice {
			margin: 38rpx 20rpx;
			width: 100%;
			.choose {
				color: #343434;
			}
			.add {
				color: #FD5E2D;
			}
			.number {
				font-size: 22rpx;
			}
		}
	}
	.attributepopup {
		width: 690rpx;
		font-size: 28rpx;
		background:#FFFFFF;
		border-radius:10rpx;
		.top {
			margin-top: 40rpx;
			margin-left: 30rpx;
			.attrTitle {
				color: #000000;
				font-size: 36rpx;
				margin-bottom: 40rpx;
			}
			.item {
				width: 190rpx;
				height: 60rpx;
				border-radius: 5rpx;
				margin-right: 26rpx;
				margin-bottom: 30rpx;
				display: inline-flex;
				background: #FFFFFF;
				border: 1px solid #DDDDDD;
				color: #333333;
			}
			.itemactive {
				background: #fff1ed;
				border: 1px solid #fd5e2d;
				color: #FD5E2D;
			}
		}
		.itembar {
			height: 80rpx;
			background: #efefef;
			color: #343434;
			margin-top: 25rpx;
			padding-left: 32rpx;
		}
		.bottombtn {
			height: 100rpx;
			.base {
				color: #666666;
			}
			.active {
				color: #FD5E2D;
			}
		}
	}
</style>
