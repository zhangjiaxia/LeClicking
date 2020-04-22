<template>
	<view>
		<view class="total">
			<view class="uni-flex uni-row">
				<view class="uni-flex rest count">共{{cartList.length}}件宝贝</view>
				<view class="uni-flex uni-row vertical" @click="setPanel">
					<text class="alldel">
						{{settleOrDel ? '完成' : '管理'}}
					</text>
				</view>
			</view>
		</view>
		<view class="collects">
			<view class="uni-flex uni-row collect" @click="$turnPage('goodsdetail?id=' + item.productId, 'navigateTo')"
				v-for="(item, index) in cartList" :key="index">
				<view class="uni-flex" @click.stop="setCheck(item, index)">
					<text class="iconfont .icon-xianshi_xuanzetianchong circle" v-if="item.isSelect"></text>
					<text class="iconfont .icon-weixuan noCircle" v-else></text>
				</view>
				<view class="uni-flex uni-row">
					<image class="gamecover" :src="item.iconImg"></image>
				</view>
				<view class="uni-flex uni-column rest gamecontent">
					<view class="gametitle">{{item.name}}</view>
					<view class="desc">{{item.name}}</view>
					<view class="subdesc">{{item.verions}}</view>
					<view class="uni-flex uni-row vertical price">
						<view class="uni-flex pricecount">￥{{item.vipPrice / 100}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-flex uni-row vertical del" v-if="settleOrDel">
			<view class="uni-flex vertical rest" @click="isCheckAll(!checkAll)">
				<text class="iconfont .icon-xianshi_xuanzetianchong allselect" v-if="checkAll"></text>
				<text class="iconfont .icon-weixuan allNoSelect" v-else></text>
				<text class="">全选</text>
			</view>
			<view class="uni-flex" @click="delCart()">
				<view class="uni-flex content pay">
					<text class="paytext">移除</text>
				</view>
			</view>
		</view>
		<view class="uni-flex uni-row vertical operate" v-else>
			<view class="uni-flex vertical rest" @click="isCheckAll(!checkAll)">
				<text class="iconfont .icon-xianshi_xuanzetianchong allselect" v-if="checkAll"></text>
				<text class="iconfont .icon-weixuan allNoSelect" v-else></text>
				<text class="">全选</text>
			</view>
			<view class="uni-flex">
				<text class="alltext">结算：</text>
				<text class="settlecount">￥{{totalFee / 100}}</text>
			</view>
			<view class="uni-flex">
				<view class="uni-flex content pay" @click="turn">
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
		computed: mapState(['userInfo']),
		data() {
			return {
				settleOrDel: false, //是否显示移除栏
				cartList: [], //购物车列表
				selectCartList: [], //选中的购物车列表
				checkAll: true, //勾选或取消勾选所有游戏商品
				totalFee: 0, //用户勾选的购物车的总金额
			}
		},
		onLoad() {
			this.getCartPage();
		},
		methods: {
			turn() {
				this.$store.commit("setCartOrder", this.selectCartList);
				this.$turnPage('orderpay', 'navigateTo');
			},
			setPanel() {
				this.settleOrDel = !this.settleOrDel;
			},
			setCheck(item, index) {
				item.isSelect = !item.isSelect;
				this.cartList.splice(index, 1, this.cartList[index]);
				this.settlementAmountCalculate();
			},
			isCheckAll(flag) {
				this.checkAll = flag
				for(let index in this.cartList) {
					this.cartList[index].isSelect = flag
					this.cartList.splice(index, 1, this.cartList[index])
				}
				this.settlementAmountCalculate();
			},
			settlementAmountCalculate() {
				let that = this
				//总金额计算
				that.totalFee = 0
				that.selectCartList = []
				for(let index in that.cartList) {
					if(that.cartList[index].isSelect) {
						that.totalFee += that.cartList[index].vipPrice;
						that.selectCartList.push(that.cartList[index]);
					}
				}
			},
			getCartPage() {
				let that = this;
				//that.userInfo.userId = 97;
				interfaceurl.checkAuth(interfaceurl.cartPage, {userId: that.userInfo.userId}).then((res) => {
					that.cartList = res.data;
					that.$store.commit('setCartNum', res.data.length);
					for (var item of this.cartList) {
						item.isSelect = true;
						that.totalFee += item.vipPrice;
					}
					that.selectCartList = that.cartList;
				});
			},
			delCart() {
				let that = this;
				let ids = []
				for (var item of this.cartList) {
					if(item.isSelect) {
						ids.push(item.id);
					}
				}
				interfaceurl.checkAuth(interfaceurl.delCart, ids).then((res) => {
					that.getCartPage();
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F0F0F0;
	}
	.total {
		margin: 18rpx 30rpx;
		.count {
			color: #666666;
			font-size: 23rpx;
		}
		.alldel {
			color: #FD5E2D;
			font-size: 27rpx;
		}
	}
	.collects {
		margin: 0 20rpx;
		margin-bottom: 120rpx;
		.collect {
			margin-bottom: 22rpx;
			width:710rpx;
			height:200rpx;
			background:#FFFFFF;
			border-radius:10rpx;
			.circle, .noCircle {
				font-size: 40rpx;
				margin: 60rpx 10rpx 0 31rpx;
			}
			.circle {
				color: #FD5E2D;
			}
			.noCircle {
				color: #DDDDDD;
			}
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
				}
				.subdesc {
					color: #999999;
					font-size: 19rpx;
				}
				.price {
					.pricecount {
						font-size: 28rpx;
						color: #FD5E2D;
						margin-right: 306rpx;
					}
					.del {
						width:90rpx;
						height:40rpx;
						border:1px solid #DDDDDD;
						border-radius:20rpx;
						.deltext {
							color: #999999;
							font-size: 19rpx;
						}
					}
				}
			}
		}
	}
	.operate, .del {
		margin: 0 auto;
		width:749rpx;
		height:98rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px -1px 0px 0px rgba(221,221,221,1);
		position: fixed;
		bottom: 0;
		view {
			font-size: 31rpx;
		}
		.alltext {
			color: #343434;
		}
		.settlecount {
			color: #FD5E2D;
		}
		.allselect, .allNoSelect {
			font-size: 40rpx;
			margin-left: 50rpx;
			margin-right: 17rpx;
		}
		.allselect {
			color: #FD5E2D;
		}
		.allNoSelect {
			color: #DDDDDD;
		}
	}
	.operate {
		.pay {
			width:220rpx;
			height:70rpx;
			background:#FD5E2D;
			border-radius:35rpx;
			margin-left: 30rpx;
			margin-right: 22rpx;
			.paytext {
				color: #FFFFFF;
				font-size: 23rpx;
			}
		}
	}
	.del {
		.allselect {
			margin-right: 30rpx;
		}
		.pay {
			width:130rpx;
			height:70rpx;
			background:rgba(255,255,255,1);
			border:1px solid rgba(221,221,221,1);
			border-radius:35rpx;
			margin-right: 21rpx;
			.paytext {
				font-size: 23rpx;
				color: #FD5E2D;
			}
		}
	}
</style>
