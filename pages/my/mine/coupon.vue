<template>
	<view class="layout">
		<view class="coupon" v-for="(item, index) in coupons" :key="index">
			<image class="pic" src="../../../static/redcoupon.png" v-if="item.type == 1"></image>
			<image class="pic" src="../../../static/bluecoupon.png" v-else></image>
			<view class="uni-flex uni-row info">
				<view class="uni-flex rest uni-column space">
					<view class="uni-flex vertical indexbar">
						<text class="price">{{item.discount}}元</text>
						<text class="type">{{item.name}}</text>
					</view>
					<view class="uni-flex desc">
						{{item.rule}}
					</view>
					<view class="uni-flex horizontalright desc">
						有效期至{{item.expire}}
					</view>
				</view>
				<view class="uni-flex content right">
					<view>
						<text class="multiplication">X</text>
						<text class="count">{{item.quantity || 0}}</text>
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
				coupons: [], //优惠券列表
				list: [{},{},{},{},{}]
			}
		},
		onLoad() {
			console.log('优惠券')
			console.log(this.userInfo)
			this.getCoupons();
		},
		methods: {
			getCoupons() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.couponManage, {userId: that.userInfo.userId}).then((res) => {
					that.coupons = res.data;
					for(var item of that.coupons) {
						item.expire = new Date(item.expire).format("yyyy-MM-dd hh:mm:ss");
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.layout {
		margin: 20rpx;
		.coupon {
			position: relative;
			width: 710rpx;
			height: 203rpx;
			border: 1px dashed #888888;
			.pic {
				width: 100%;
				height: 100%;
			}
			.info {
				position: absolute;
				top: 0;
				height: 180rpx;
				color: #FFFFFF;
				width: 100%;
				.space {
					padding-left: 40rpx;
					.indexbar {
						margin-top: 20rpx;
						.price {
							font-size: 42rpx;
							margin-right: 20rpx;
						}
						.type {
							font-size: 32rpx;
						}
					}
					.desc {
						font-size: 17rpx;
						margin-bottom: 10rpx;
						padding-right: 40rpx;
					}
				}
				.right {
					width: 140rpx;
					.multiplication {
						font-size: 23rpx;
					}
					.count {
						font-size: 43rpx;
					}
				}
			}
		}
	}
</style>
