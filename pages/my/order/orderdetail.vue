<template>
	<view>
		<view class="uni-flex content head">
			<view class="uni-flex vertical">
				<image class="order" src="../../../static/gift.png"></image>
				<text class="pay">{{orderDetail.statusText}}</text>
			</view>
		</view>
		<view class="topbar">
			<!-- <view class="uni-flex uni-row vertical logistics space">
				<view class="uni-flex">
					<view class="uni-flex content icon">
						<text class="iconfont .icon-mn_wuliu_fill car"></text>
					</view>
				</view>
				<view class="uni-flex rest">
					<view class="uni-flex uni-column">
						<view class="express">你的快递已到达广州白云区中转站,预计今天到达，请保持电话通畅</view>
						<view class="date">2020-01-01&nbsp;&nbsp;14:52:52</view>
					</view>
				</view>
				<view class="uni-flex">
					<text class="iconfont .icon-gengduo enter"></text>
				</view>
			</view> -->
			<view class="uni-flex uni-row vertical logistics" v-if="addressInfo">
				<view class="uni-flex">
					<view class="uni-flex content icon2">
						<text class="iconfont .icon-dizhi position"></text>
					</view>
				</view>
				<view class="uni-flex rest">
					<view class="uni-flex uni-column info">
						<view>
							<text class="nick">{{addressInfo.name || ''}}</text>
							<text class="mobile">{{addressInfo.phone || ''}} </text>
						</view>
						<view class="address">
							{{addressInfo.province || ''}}{{addressInfo.city || ''}}{{addressInfo.area || ''}}{{addressInfo.address || ''}}
							<!-- 广东省 广州市 白云区 望岗工业二路26号 汇和天地1号楼 2楼A206 -->
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="orders">
			<view class="uni-flex uni-row order"
				v-for="(item, index) in orderDetail.products" :key="index">
				<view class="uni-flex">
					<image class="gamecover" :src="item.iconImg"></image>
				</view>
				<view class="uni-flex uni-column rest gamecontent">
					<view class="gametitle">{{item.name}}</view>
					<view class="desc">{{item.profile}}</view>
					<view class="subdesc">版本：{{item.version}}</view>
					<view class="uni-flex uni-row vertical price">
						<view class="uni-flex pricecount">￥{{item.vipPrice / 100}}</view>
					</view>
					<view class="uni-flex horizontalright sum">共1件商品 合计：￥{{item.vipPrice / 100}}</view>
					<!--游戏商品只要支付就能评价，设备商品需要已完成状态才能评价-->
					<view class="uni-flex uni-row horizontalright" 
						v-if="(orderDetail.status != 0 && item.type=='00') || (orderDetail.status == 3 && item.type=='01')">
						<view class="confirm content" @click="toEvaluate(item)">
							<text class="confirmtext">去评价</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="settle">
			<view class="uni-flex uni-row">
				<view class="uni-flex rest lefttext">商品总价</view>
				<view class="uni-flex righttext">￥{{orderDetail.total / 100}}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex rest lefttext">运费</view>
				<view class="uni-flex righttext">￥{{orderDetail.expressFee / 100}}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex rest lefttext">店铺优惠</view>
				<view class="uni-flex righttext">-￥{{orderDetail.coupon.discount / 100 || 0}}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex rest total">订单总价</view>
				<view class="uni-flex totalcount">￥{{orderDetail.orderAmt / 100}}</view>
			</view>
		</view>
		<view class="uni-flex uni-row vertical realPay">
			<view class="uni-flex rest total">实付款</view>
			<view class="uni-flex active">￥{{orderDetail.orderAmt / 100}}</view>
		</view>
		<view class="orderinfo">
			<view class="title">订单信息</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex base">订单编号：</view>
				<view class="uni-flex rest baseright">{{orderDetail.orderNo}}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex base">微信交易号：</view>
				<view class="uni-flex rest baseright">{{orderDetail.wxPayNo}}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex base">创建时间：</view>
				<view class="uni-flex rest baseright">{{orderDetail.createDt}}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex base">付款时间：</view>
				<view class="uni-flex rest baseright">{{orderDetail.payDt || ''}}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex base">发货时间：</view>
				<view class="uni-flex rest baseright">{{orderDetail.deliveryDt || ''}}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex base">交易时间：</view>
				<view class="uni-flex rest baseright">{{orderDetail.dealDt || ''}}</view>
			</view>
		</view>
		<!-- <view class="uni-flex uni-row apply vertical horizontalright">
			<view class="uni-flex btnapply content">
				<text class="applytext">查看物流</text>
			</view>
			<view class="uni-flex btnapply content space">
				<text class="applytext">申请售后</text>
			</view>
		</view> -->
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
				list: [{},{}],
				orderDetail: {}, //订单详情
				addressInfo: {} //地址详情
			}
		},
		onLoad(options) {
			this.getOrderDetail(options.id);
		},
		methods: {
			toEvaluate(item) {
				let evaluateGoods = []
				evaluateGoods.push(item);
				//整个订单商品或单个评价
				this.$store.commit('setEvaluateGoods', evaluateGoods)
				this.$turnPage('evaluate', 'navigateTo')
			},
			getOrderDetail(id) {
				let that = this;
				let params = {
					userId: this.userInfo.userId,
					id: id
				}
				interfaceurl.checkAuth(interfaceurl.orderDetail, params).then((res) => {
					that.orderDetail = res.data;
					that.orderDetail.createDt = new Date(that.orderDetail.createDt).format("yyyy-MM-dd hh:mm:ss");
					if(that.orderDetail.payDt) {
						that.orderDetail.payDt = new Date(that.orderDetail.payDt).format("yyyy-MM-dd hh:mm:ss");
					}
					if(that.orderDetail.dealDt) {
						that.orderDetail.dealDt = new Date(that.orderDetail.dealDt).format("yyyy-MM-dd hh:mm:ss");
					}
					if(that.orderDetail.deliveryDt) {
						that.orderDetail.deliveryDt = new Date(that.orderDetail.deliveryDt).format("yyyy-MM-dd hh:mm:ss");
					}
					that.orderDetail.statusText = that.getStatusText(that.orderDetail.status);
					that.addressInfo = that.orderDetail.address;
					//计算商品总价
					let total = 0;
					for(var item of that.orderDetail.products) {
						total += parseInt(item.vipPrice);
					}
					that.orderDetail.total = total;
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
	.head {
		height: 120rpx;
		background: #FD5E2D;
		.order {
			width: 140rpx;
			height: 105rpx;
		}
		.pay {
			font-size: 48rpx;
			color: #FFFFFF;
			margin-left: 20rpx;
			font-weight: bold;
		}
	}
	.topbar {
		background: white;
		padding: 15px 0;
		.space {
			margin-bottom: 60rpx;
		}
	}
	.logistics {
		margin: 0 23rpx;
		.icon, .icon2 {
			border-radius:50%;
			width:60rpx;
			height:60rpx;
			border-radius: 50%;
			margin-right: 20rpx;
			color: #FFFFFF;
		}
		.icon {
			background:linear-gradient(0deg,rgba(45,118,253,1),rgba(45,143,253,1));
			.car {
				font-size: 24rpx;
			}
		}
		.icon2 {
			background:linear-gradient(0deg,rgba(253,94,45,1),rgba(253,133,45,1));
			.position {
				font-size: 28rpx;
			}
		}
		.express {
			line-height: 1.2;
			color: #4893F1;
			font-size: 29rpx;
			margin-bottom: 18rpx;
		}
		.date {
			color: #999999;
			font-size: 16rpx;
		}
		.enter {
			font-size: 28rpx;
			color: #999999;
			margin-left: 55rpx;
		}
	}
	.info {
		color: #343434;
		.nick {
			font-size: 26rpx;
		}
		.mobile {
			color: #999999;
			font-size: 26rpx;
			margin-left: 40rpx;
		}
		.address {
			margin-top: 18rpx;
			font-size: 24rpx;
			line-height: 1.2;
		}
	}
	.orders {
		margin-top: 20rpx;
		background: #FFFFFF;
		.order {
			padding-bottom: 42rpx;
			// height:335rpx;
			background:#FFFFFF;
			.gamecover {
				width:120rpx;
				height:120rpx;
				border-radius:5rpx;
				margin: 20rpx 26rpx 0 22rpx;
			}
			.gamecontent {
				.gametitle {
					color: #343434;
					font-size: 34rpx;
					margin-top: 10rpx;
					font-weight: bold;
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
				.sum {
					font-size: 26rpx;
					color: #343434;
					margin-right: 20rpx;
					margin-bottom: 30rpx;
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
	.realPay {
		border-top: 1px solid #DDDDDD;
		background: white;
		height: 60rpx;
		padding: 0 23rpx;
		.total {
			font-size: 34rpx;
			color: #343434;
			font-weight: bold;
		}
		.active {
			font-size: 28rpx;
			color: #FD5E2D;
		}
	}
	.settle {
		background: #FFFFFF;
		margin-top: -22rpx;
		padding: 0 22rpx;
		color: #666666;
		view {
			line-height: 2;
		}
		.lefttext {
			font-size: 28rpx;
			color: #666666;
		}
		.righttext {
			font-size: 28rpx;
		}
		.total {
			font-size: 34rpx;
			color: #343434;
			font-weight: bold;
		}
		.totalcount {
			font-size: 28rpx;
			color: #343434;
		}
		.active {
			font-size: 19rpx;
			color: #FD5E2D;
		}
	}
	.orderinfo {
		margin-top: 19rpx;
		// margin-bottom: 101rpx;
		background: #FFFFFF;
		padding: 20rpx 0;
		padding-left: 23rpx;
		view {
			line-height: 2;
		}
		.title {
			font-size: 34rpx;
			color: #343434;
			font-weight: bold;
		}
		.base {
			width: 188rpx;
			font-size: 28rpx;
			color: #666666;
		}
		.baseright {
			color: #666666;
			font-size: 28rpx;
		}
	}
	.apply {
		height:90rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px -1px 0px 0px rgba(221,221,221,1);
		.btnapply {
			width:130rpx;
			height:40rpx;
			background:rgba(255,255,255,1);
			border:1px solid rgba(221,221,221,1);
			border-radius:20rpx;
		}
		.space {
			margin: 0 21rpx;
		}
		.applytext {
			color: #666666;
			font-size: 19rpx;
		}
	}
</style>
