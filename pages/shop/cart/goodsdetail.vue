<template>
	<view>
		<view class="gamepic">
			<image class="gamepic" :src="detail.iconImg"></image>
		</view>
		<view class="baseinfo">
			<view class="uni-flex uni-row vertical price">
				<view class="uni-flex present">￥{{detail.vipPrice == 0 ? 0 : (detail.vipPrice / 100 || '')}}</view>
				<view class="uni-flex original rest">原价：{{detail.price == 0 ? 0 : (detail.price / 100 || '')}}</view>
				<authPage>
					<view class="uni-flex vertical">
						<text class="iconfont .icon-shoucang1 heart" :style="{color: detail.collectFlg === 1 ? '#f34763' : '#999999'}" @click="addFavor(detail.id)"></text>
						<text class="fabulous">{{detail.collectNum || 0}}</text>
					</view>
				</authPage>
			</view>
			<view class="gametitle">{{detail.name || ''}}</view>
			<view class="uni-flex uni-row game">
				<view class="uni-flex rest desc">{{detail.profile || ''}}</view>
				<view class="uni-flex version">版本：{{detail.version || ''}}</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row count vertical">
			<view class="uni-flex down" v-if="detail.type=='00'">下载量：{{detail.downNum || 0}}</view>
			<view class="uni-flex visit">访问量：{{detail.visitTotal || 0}}</view>
		</view>
		<view class="line"></view>
		<view class="detail">
			<view class="title">详情介绍</view>
			<view class="desc"><rich-text :nodes="detail.details"></rich-text></view>
		</view>
		<view class="detail">
			<view class="title">历史版本</view>
			<view class='timeAxisView'>
				<timeAxis :content="detail.historyVersion" :isShowLeftLine="true"/>
			</view>
		</view>
		<view class="commenttop" v-if="detail.commentNum > 0">
			<view class="uni-flex uni-row comment">
				<view class="uni-flex rest key">评论</view>
				<view class="uni-flex vertical value">更多评论 ({{detail.commentNum}})
					<text class="iconfont .icon-z044 enter"></text>
				</view>
			</view>
			<view class="uni-flex uni-row commentele" v-for="(item, index) in commonList" :key="index">
				<view class="uni-flex">
					<image class="head" :src="item.icon"></image>
				</view>
				<view class="uni-flex uni-column rest discuss">
					<view class="uni-flex uni-row vertical">
						<view class="uni-flex rest nick">{{item.name}}</view>
						<view class="uni-flex date">{{item.createDt}}</view>
					</view>
					<view class="uni-flex msg">
						{{item.content}}
					</view>
				</view>
			</view>
		</view>
		<view class="uni-flex uni-row vertical shopbar">
			<view class="uni-flex content indexspace" @click="$turnPage('../../index/index','switchTab')">
				<text class="iconfont .icon-shouye index"></text>
				<text class="indextext">首页</text>
			</view>
			<view class="uni-flex content servicespace" @click="$turnPage('../../index/help/customer','navigateTo')">
				<text class="iconfont .icon-iconrx service"></text>
				<text class="servicetext">客服</text>
			</view>
			<authPage>
				<view class="uni-flex" @click="beforeSaveCart(false)">
					<view class="uni-flex content addcart">
						<text class="addcarttext">加入购物车</text>
					</view>
				</view>
			</authPage>
			<authPage>
				<view class="uni-flex">
					<view class="uni-flex content pay" @click="beforeSaveCart(true)">
						<text class="paytext">购买支付</text>
					</view>
				</view>
			</authPage>
			<view class="float">
				<view class="uni-flex uni-column ">
					<authPage>
						<view class="uni-flex content circle" @click="$turnPage('cart', 'navigateTo')">
							<text class="iconfont .icon-gouwuche cart"></text>
						</view>
					</authPage>
					<view class="uni-flex content circle">
						<text class="iconfont .icon-fenxiang share"></text>
						<button class="sharebtn" open-type="share"></button>
					</view>
				</view>
			</view>
		</view>
		<!--加入购物车前-->
		<beforeCart ref='cart'></beforeCart>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import timeAxis from '@/components/time-axis.vue'
	import beforeCart from '@/components/before-cart.vue'
	import authPage from '@/components/authorization-page.vue' //引入授权窗体
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		computed: mapState(['token', 'userInfo']),
		components: {
			authPage,
			timeAxis,
			beforeCart
		},
		data() {
			return {
				commonList: [], //评论列表
				commonParams: {
					productId: 205,
					start: 0,
					length: 10,
					userId: 97
				}, //评论参数
				detail: {}, //宝贝详情
				/*弹窗相关参数*/
				showpopup: false, //提示用户绑定设备
				showdevicepopup: false, //显示设备列表
				showattributepopup: false, //显示设备属性
				type: 'center',
				attrList: [], //设备商品的属性
				devices: [], //用户绑定的设备
				productId: 0, //用户选中的商品ID
				deviceId: 0, //用户选中的设备
			}
		},
		onLoad(options) {
			this.commonParams.userId = this.userInfo.userId;
			this.getDetails(options.id);
			this.getComment();
		},
		onShareAppMessage(res) {
		  return {
			title: '商品分享',
			path: '/pages/shop/goodsdetail?id=' + this.detail.id
		  }
		},
		methods: {
			getDetails(id) {
				let that = this;
				//商品详情的是否收藏字段，需要token参数（非必填）
				interfaceurl.detail({id}).then((res) => {
					that.detail = res.data;
					if(that.detail.historyVersion) {
						that.detail.historyVersion = JSON.parse(that.detail.historyVersion)
					}
				});
			},
			addFavor(id) {
				let that = this
				let params = {
					userId: this.userInfo.userId,
					productId: this.detail.id
				}
				interfaceurl.checkAuth(interfaceurl.addCollection, params).then((res) => {
					that.getDetails(that.detail.id)
					uni.showToast({
					    title: '收藏成功',
					    icon: 'none',
					    duration: 2000
					});
				});
			},
			getComment() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.comment, that.commonParams, false).then((res) => {
					that.commonList = res.data;
					for(var item of that.commonList) {
						item.createDt = new Date(item.createDt).format("yyyy-MM-dd hh:mm:ss");
					}
				});
			},
			//弹窗相关方法
			//加入购物车前判断用户是否绑定设备
			beforeSaveCart(isPayOrCart) {
				this.detail.isPayOrCart = isPayOrCart
				if(this.detail.type == '00') {
					//调用子组件的方法
					this.$refs.cart.beforeSaveCart(this.detail);
				} else { //说明是设备商品，要弹出属性选择
					this.$refs.cart.popup(this.detail);
				}
			}
		}
	}
</script>

<style lang="scss">
	.gamepic {
		width: 100%;
		height:750rpx;
	}
	.baseinfo {
		padding-left: 19rpx;
		.price {
			.present {
				color: #000000;
				font-size: 36rpx;
				margin-right: 18rpx;
			}
			.original {
				color: #666666;
				font-size: 23rpx;
				text-decoration: line-through;
			}
			.heart {
				color: #999999;
				font-size: 32rpx;
			}
			.fabulous {
				color: #999999;
				font-size: 16rpx;
				margin-left: 15rpx;
				margin-right: 34rpx;
			}
		}
		.gametitle {
			color: #343434;
			font-size: 34rpx;
			font-weight: bold;
		}
		.game {
			margin-bottom: 28rpx;
			.desc {
				color: #666666;
				font-size: 25rpx;
			}
			.version {
				color: #666666;
				font-size: 23rpx;
				margin-right: 23rpx;
			}
		}
	}
	.line {
		height:10rpx;
		background:#F2F2F2;
	}
	.count {
		height: 60rpx;
		.down, .visit {
			color: #999999;
			font-size: 20rpx;
			padding-left: 23rpx;
		}
		.down {
			width: 220rpx;
		}
	}
	.detail {
		padding-left: 23rpx;
		color: #343434;
		.title {
			font-size: 31rpx;
			margin: 20rpx 0 10rpx 0;
			font-weight: bold;
		}
		.desc {
			font-size: 23rpx;
			margin-bottom: 10rpx;
			margin-right: 44rpx;
		}
		.pic {
			width:710rpx;
			height:316rpx;
		}
		.timeAxisView {
			margin-top: 30rpx;
		}
	}
	.commenttop {
		margin: 0 22rpx;
		.comment {
			margin: 30rpx 20rpx 49rpx 20rpx;
			.key {
				color: #343434;
				font-size: 31rpx;
			}
			.value {
				color: #666666;
				font-size: 23rpx;
				.enter {
					color: #999999;
					font-size: 21rpx;
					transform: rotate(-90deg);
					margin-left: 22rpx;
				}
			}
		}
		.commentele {
			margin-bottom: 60rpx;
			.head {
				width:70rpx;
				height:70rpx;
				border-radius:50%;
				margin-right: 22rpx;
			}
			.discuss {
				.nick {
					color: #343434;
					font-size: 27rpx;
				}
				.date {
					color: #666666;
					font-size: 19rpx;
				}
				.msg {
					color: #666666;
					font-size: 25rpx;
				}
			}
		}
	}
	.shopbar {
		position: relative;
		height:98rpx;
		background:#FFFFFF;
		box-shadow:0px -1px 0px 0px #DDDDDD;
		.indexspace {
			margin: 0 63rpx;
			.index {
				font-size: 30rpx;
				color: #666666;
			}
			.indextext {
				color: #999999;
				font-size: 17rpx;
			}
		}
		.servicespace {
			margin-right: 59rpx;
			.service {
				color: #EB5D32;
				font-size: 34rpx;
			}
			.servicetext {
				color: #EB5D32;
				font-size: 17rpx;
			}
		}
		.addcart, .pay {
			width:220rpx;
			height:70rpx;
			border-radius:35rpx;
		}
		.addcart {
			border:1px solid #DDDDDD;
			.addcarttext {
				font-size: 23rpx;
				color: #EB5D32;
			}
		}
		.pay {
			background: #FD5E2D;
			margin-left: 31rpx;
			.paytext {
				font-size: 23rpx;
				color: #FFFFFF;
			}
		}
	}
	.float {
		position: fixed;
		bottom: 180rpx;
		right: 41rpx;
		color: #999999;
		z-index: 100;
		.circle {
			width: 70rpx;
			height: 70rpx;
			border-radius: 50%;
			border: 1px solid #DDDDDD;
			background: #FFFFFF;
			margin-bottom: 20rpx;
			.cart {
				font-size: 36rpx;
			}
			.share {
				font-size: 40rpx;
			}
			.sharebtn {
				position: absolute;
				height: 80rpx;
				width: 100%;
				opacity: 0;
			}
		}
	}
</style>
