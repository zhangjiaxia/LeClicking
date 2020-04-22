<template>
	<view>
		<view class="uni-flex uni-row status">
			<view class="uni-flex rest content noactive" :class="{active: orderParams.status === ''}"
				@click="setStatus('')">全部
				<view class="line" v-if="orderParams.status === ''"></view>
			</view>
			<view class="uni-flex rest content noactive" :class="{active: orderParams.status === 0}"
				@click="setStatus(0)">待付款
				<view class="line" v-if="orderParams.status === 0"></view>
			</view>
			<view class="uni-flex rest content noactive" :class="{active: orderParams.status === 1}"
				@click="setStatus(1)">待发货
				<view class="line" v-if="orderParams.status === 1"></view>
			</view>
			<view class="uni-flex rest content noactive" :class="{active: orderParams.status === 2}"
				@click="setStatus(2)">已发货
				<view class="line" v-if="orderParams.status === 2"></view>
			</view>
			<view class="uni-flex rest content noactive" :class="{active: orderParams.status === 3}"
				@click="setStatus(3)">已完成
				<view class="line" v-if="orderParams.status === 3"></view>
			</view>
		</view>
		<view class="orders">
			<view class="order" v-for="(item, index) in orderList" :key="index">
				<view class="uni-flex uni-row" @click="$turnPage('orderdetail?id=' + item.id, 'navigateTo')" v-for="(subItem, i) in item.products" :key="i">
					<view class="uni-flex">
						<image class="gamecover" :src="subItem.iconImg"></image>
					</view>
					<view class="uni-flex uni-column rest gamecontent">
						<view class="gametitle">{{subItem.name}}</view>
						<view class="desc">{{subItem.profile}}</view>
						<view class="subdesc">版本：{{subItem.version}}</view>
						<view class="uni-flex uni-row vertical price">
							<view class="uni-flex pricecount">￥{{subItem.vipPrice / 100}}</view>
						</view>
					</view>
				</view>
				<view class="uni-flex horizontalright sum">共{{item.products.length}}件商品 合计：￥{{item.orderAmt / 100}}</view>
				<view class="uni-flex uni-row vertical orderStatus">
					<view class="uni-flex rest">
						<text class="status">{{item.statusText}}</text>
					</view>
					<view class="uni-flex" v-if="item.status == 0">
						<view class="del content" @click="cancel(item)">
							<text class="deltext">取消订单</text>
						</view>
						<view class="confirm content" @click="gotoPay(item)">
							<text class="confirmtext">去付款</text>
						</view>
					</view>
					<view class="uni-flex" v-if="item.status == 2">
						<view class="confirm content" @click="confirmReceipt(item.id)">
							<text class="confirmtext">确认收货</text>
						</view>
					</view>
					<view class="uni-flex" v-if="item.status == 3">
						<view class="confirm content" @click="toEvaluate(item)">
							<text class="confirmtext">去评价</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		computed: mapState(['userInfo']),
		data() {
			return {
				orderList: [], //订单列表
				orderParams: {
					userId: 0,
					startDT: '',
					endDT: '',
					start: 0,
					length: 10,
					status: '' //0:待支付1:待发货2:已发货3:已完成
				}, //订单参数
			}
		},
		onLoad() {
		},
		onShow() {
			this.$store.commit("setCartOrder", []);
			this.getOrders();
		},
		methods: {
			confirmReceipt(orderId) {
				let confirmParams = {
					id: orderId,
					userId: this.userInfo.userId
				}
				interfaceurl.checkAuth(interfaceurl.confirmfinish, confirmParams).then((res) => {
					this.getOrders();
					uni.showToast({
					    title: '确认收货成功',
					    icon: 'none',
					    duration: 2000
					});
				});
			},
			toEvaluate(item) {
				//整个订单商品或单个评价
				this.$store.commit('setEvaluateGoods', item.products)
				this.$turnPage('evaluate', 'navigateTo')
			},
			gotoPay(item) {
				let that = this;
				let payParams = {
					userId: that.userInfo.userId,
					orderId: item.id,
					orderNo: item.orderNo
				}
				interfaceurl.checkAuth(interfaceurl.pay, payParams).then((res) => {
					uni.requestPayment({
					    timeStamp: res.data.timeStamp,
					    nonceStr: res.data.nonceStr,
					    package: res.data.package,
					    signType: res.data.signType,
					    paySign: res.data.paySign,
					    success: (res) => {
					        that.getOrders();
					    },
					    fail: (res) => {
							uni.showToast({
							    title: '支付失败',
							    icon: 'none',
							    duration: 2000
							});
					    },
					    complete: () => {
							
					    }
					});
				});
			},
			cancel(item) {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.orderDelete, {id: item.id}).then((res) => {
					this.getOrders();
					uni.showToast({
					    title: '订单取消成功',
					    icon: 'none',
					    duration: 2000
					});
				});
			},
			setStatus(val) {
				this.orderParams.status = val;
				this.getOrders();
			},
			getOrders() {
				let that = this;
				that.orderParams.userId = that.userInfo.userId;
				interfaceurl.checkAuth(interfaceurl.orderManage, that.orderParams).then((res) => {
					that.orderList = res.data;
					//计算总价，状态数字文字转换
					for(var item of that.orderList) {
						item.statusText = that.getStatusText(item.status);
					}
				});
			},
			getStatusText(status) {
				let text = '';
				switch (status){
					case 0: text = '待付款'
						break;
					case 1: text = '待发货'
						break;
					case 2: text = '已发货'
						break;
					case 3: text = '已完成'
						break;
					default:
						break;
				}
				return text;
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F0F0F0;
	}
	.status {
		margin: 30rpx 20rpx;
		view {
			font-size: 23rpx;
		}
		.noactive {
			color: #666666;
		}
		.active {
			color: #FD5E2D;
		}
		.line {
			width:30rpx;
			height:3rpx;
			background:rgba(253,94,45,1);
		}
	}
	.orders {
		margin: 0 auto;
		width:710rpx;
		.order {
			margin-bottom: 20rpx;
			width:710rpx;
			background:#FFFFFF;
			border-radius:10rpx;
			.gamecover {
				width:120rpx;
				height:120rpx;
				border-radius:5rpx;
				margin: 20rpx 26rpx 0 22rpx;
			}
			.gamecontent {
				.gametitle {
					color: #343434;
					font-size: 31rpx;
					margin-top: 10rpx;
				}
				.desc {
					color: #666666;
					font-size: 24rpx;
				}
				.subdesc {
					color: #999999;
					font-size: 18rpx;
				}
				.price {
					.pricecount {
						font-size: 28rpx;
						color: #FD5E2D;
						margin-right: 306rpx;
					}
				}
			}
			.sum {
				font-size: 26rpx;
				color: #343434;
				margin-right: 20rpx;
				margin-bottom: 30rpx;
			}
			.orderStatus {
				height: 70rpx;
				border-top: 1px dashed #DDDDDD;
				.status {
					color: #FD5E2D;
					font-size: 22rpx;
				}
				.del, .confirm {
					width:130rpx;
					height:40rpx;
					border-radius:20rpx;
				}
				.del {
					border:1px solid #DDDDDD;
					.deltext {
						color: #666666;
						font-size: 19rpx;
					}
				}
				.confirm {
					border:1px solid #FD5E2D;
					margin: 0 20rpx 0 22rpx;
					.confirmtext {
						color: #FD5E2D;
						font-size: 19rpx;
					}
				}
			}
		}
	}
</style>
