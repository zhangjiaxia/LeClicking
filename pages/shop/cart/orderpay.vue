<template>
	<view>
		<view class="pays">
			<view class="uni-flex uni-row pay"
				v-for="(item, index) in cartOrder" :key="index">
				<view class="uni-flex">
					<image class="gamecover" :src="item.iconImg"></image>
				</view>
				<view class="uni-flex uni-column rest gamecontent">
					<view class="gametitle">{{item.name}}</view>
					<view class="desc">是由Rovio开发的一款休闲益智类游戏产</view>
					<view class="subdesc">版本：{{item.verions || '0.01'}}</view>
					<view class="price">￥{{item.vipPrice / 100}}</view>
				</view>
			</view>
		</view>
		<view class="uni-flex uni-row vertical discount" v-if="flag">
			<view class="uni-flex rest vertical">
				<text class="iconfont .icon-dizhi lefticon" style="font-size: 31rpx;"></text>
				<text class="lefttext">{{extraInfo.address}}</text>
			</view>
			<view class="uni-flex vertical" @click="$turnPage('addaddress', 'navigateTo')">
				<text class="righttext">去添加</text>
				<text class="iconfont .icon-gengduo lefticon"></text>
			</view>
		</view>
		<view class="uni-flex uni-row vertical discount">
			<view class="uni-flex rest vertical">
				<text class="iconfont .icon-youhui lefticon" style="font-size: 26rpx;"></text>
				<text class="distext">优惠/折扣</text>
			</view>
			<view class="uni-flex vertical">
				<text class="disprice">-{{extraInfo.discount}}</text>
			</view>
		</view>
		<view class="uni-flex uni-row vertical discount" v-if="flag">
			<view class="uni-flex rest vertical">
				<text class="iconfont .icon-mn_wuliu_fill lefticon" style="font-size: 28rpx;"></text>
				<text class="distext">运费</text>
			</view>
			<view class="uni-flex vertical">
				<text class="freight">{{extraInfo.freight == 0 ? 0 : (extraInfo.freight / 100 || '')}}</text>
			</view>
		</view>
		<view class="uni-flex vertical remark">
			<input type="text" placeholder="备注/留言" placeholder-class="remarktext" v-model="orderParams.remarks" />
		</view>
		<view class="uni-flex uni-row horizontalright">
			<text class="total">合计：￥{{total / 100}}</text>
		</view>
		<view class="uni-flex uni-row vertical purchasepay">
			<view class="uni-flex rest">
				<text class="totals">应付总额：</text>
				<text class="totalcount">￥{{total / 100}}</text>
			</view>
			<view class="uni-flex" @click="overbooking">
				<view class="purchase content">
					<text class="paytext">购买支付</text>
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
		computed: mapState(['userInfo', 'cartOrder', 'tempAddress']),
		data() {
			return {
				flag: false, //判断是否包含硬件商品
				total: 0, //订单总额
				orderParams: {
					userId: 97,
					addressId: '',
					couponId: '',
					expreeFee: 0,
					orderAmt: 0,
					products: [{
						id: 0,
						quantity: 1
					}],
					cartIds: [], //购物车ID，[1,2,3]
					remarks: '' //留言
				},
				province: '', //省份
				coupons: [], //优惠券默认第一个
				extraInfo: {
					address: '暂无收货地址，请添加收货地址', //地址省市区
					discount: 0, //优惠的价格
					freight: 0 //运费
				} //订单额外信息
			}
		},
		onLoad() {
			this.orderParams.userId = this.userInfo.userId;
			this.getParams();
			this.getCoupons();
		},
		watch:{
			tempAddress(val) {
				//如果用户有选择地址的话，改为用户临时选择的地址
				if(val.province) {
					this.extraInfo.address = val.province + val.city + val.area + val.address;
				}
			}
		},
		methods: {
			getFee() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.fee, {province: that.tempAddress.province || that.province }).then((res) => {
					that.extraInfo.freight = res.data.fee;
				});
			},
			getAddress() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.defaultAddress, {}, false).then((res) => {
					let address = res.data;
					if(address.id) {
						that.extraInfo.address = address.province + address.city + address.area + address.address;
						that.orderParams.addressId = address.id;
						that.province = address.province;
					}
				});
			},
			getCoupons() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.couponManage, {userId: that.userInfo.userId}).then((res) => {
					that.coupons = res.data;
					if(that.coupons.length > 0) {
						let coupon = that.coupons[0];
						that.orderParams.couponId = coupon.id;
						//如果是现金券，直接赋值；如果是折扣券，订单金额乘折扣
						// if(coupon.type === 1) {
						// 	that.extraInfo.discount = coupon.discount;
						// } else {
						// 	that.extraInfo.discount = this.orderParams.orderAmt * coupon.discount / 10;
						// }
						that.extraInfo.discount = 0 //暂时为0
						that.total = this.orderParams.orderAmt - this.extraInfo.discount + this.extraInfo.freight
						that.orderParams.orderAmt = that.total;
					}
				});
			},
			getParams() {
				let products = [];
				let cartIds = [];
				let orderAmt = 0;
				for (var item of this.cartOrder) {
					let product = {};
					product.id = item.productId;
					product.quantity = item.quantity;
					product.attrId = item.attrId;
					orderAmt += item.vipPrice;
					products.push(product);
					cartIds.push(item.id);
					//如果设备属性ID有值，说明是设备商品
					if(item.proAttrId) {
						this.flag = true;
					}
				}
				this.orderParams.products = products;
				this.orderParams.orderAmt = orderAmt;
				this.orderParams.cartIds = cartIds;
				if(this.flag) {
					this.getAddress();
					this.getFee();
				}
			},
			overbooking() {
				let that = this;
				if(that.flag && !that.orderParams.addressId) {
					uni.showToast({
					    title: '请添加地址',
					    icon: 'none',
					    duration: 2000
					});
					return;
				}
				interfaceurl.checkAuth(interfaceurl.buildOrder, that.orderParams).then((res) => {
					let payParams = {
						userId: that.userInfo.userId,
						orderId: res.data.id,
						orderNo: res.data.orderNo
					}
					interfaceurl.checkAuth(interfaceurl.pay, payParams).then((res) => {
						uni.requestPayment({
						    timeStamp: res.data.timeStamp,
						    nonceStr: res.data.nonceStr,
						    package: res.data.package,
						    signType: res.data.signType,
						    paySign: res.data.paySign,
						    success: (res) => {
						        that.$turnPage('../../my/order/ordermanagement', 'redirectTo')
						    },
						    fail: (res) => {
								that.$turnPage('../../my/order/ordermanagement', 'redirectTo')
						    },
						    complete: () => {
								
						    }
						});
					});
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F0F0F0;
	}
	input {
		margin-left: 30rpx;
		width: 100%;
	}
	.tip {
		margin: 21rpx auto;
		width:709rpx;
		height:90rpx;
		background:#FFFFFF;
		border-radius:10rpx;
		color: #FD5E2D;
		.device {
			margin-left: 19rpx;
			font-size: 29rpx;
		}
		.add {
			font-size: 26rpx;
		}
		.enter {
			font-size: 28rpx;
			color: #FD5E2D;
			margin: 0 19rpx;
		}
	}
	.pays {
		margin: 0 20rpx;
		margin-top: 20rpx;
		.pay {
			margin-bottom: 22rpx;
			width:710rpx;
			height:200rpx;
			background:#FFFFFF;
			border-radius:10rpx;
			.gamecover {
				width:120rpx;
				height:120rpx;
				border-radius:5rpx;
				margin: 20rpx 26rpx 0 20rpx;
			}
			.gamecontent {
				.gametitle {
					color: #343434;
					font-size: 31rpx;
					margin-top: 10rpx;
				}
				.desc {
					color: #666666;
					font-size: 23rpx;
					// margin-bottom: 36rpx;
				}
				.subdesc {
					color: #999999;
					font-size: 19rpx;
				}
				.price {
					color: #FD5E2D;
					font-size: 28rpx;
				}
			}
		}
	}
	.discount {
		margin: 0 auto;
		width:749rpx;
		height:90rpx;
		background:#FFFFFF;
		.lefticon {
			color: #000000;
			margin-left: 30rpx;
			margin-right: 20rpx;
		}
		.lefttext {
			color: #999999;
			font-size: 28rpx;
		}
		.righticon {
			font-size: 28rpx;
			color: #999999;
			margin: 0 20rpx;
		}
		.righttext {
			color: #999999;
			font-size: 26rpx;
		}
		.distext {
			color: #343434;
			font-size: 26rpx;
		}
		.disprice {
			color: #FD5E2D;
			font-size: 22rpx;
			margin: 0 20rpx;
		}
		.freight {
			color: #343434;
			font-size: 22rpx;
			margin: 0 20rpx;
		}
	}
	.remark {
		width:749rpx;
		height:90rpx;
		background:#FFFFFF;
		margin-top: 20rpx;
		.remarktext {
			margin-left: 22rpx;
			font-size: 27rpx;
			color: #999999;
		}
	}
	.total {
		color: #666666;
		font-size: 26rpx;
		margin: 20rpx 20rpx 110rpx 0;
	}
	.purchasepay {
		position: fixed;
		bottom: 0;
		width:749rpx;
		height:98rpx;
		background:#FFFFFF;
		box-shadow:0px -1px 0px 0px rgba(221,221,221,1);
		.totals {
			margin: 0 19rpx;
			color: #343434;
			font-size: 31rpx;
		}
		.totalcount {
			color: #FD5E2D;
			font-size: 31rpx;
		}
		.purchase {
			width:220rpx;
			height:70rpx;
			background:rgba(253,94,45,1);
			border-radius:35rpx;
			margin-right: 10rpx;
			.paytext {
				color: #FFFFFF;
				font-size: 23rpx;
			}
		}
	}
</style>
