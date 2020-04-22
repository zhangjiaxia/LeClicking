<template>
	<view class="">
		<view class="uni-flex uni-row vertical searchdiv" @click="$turnPage('help/search', 'navigateTo')">
			<view class="uni-flex content searchbar">
				<text class="iconfont .icon-search search"></text>
				<text class="searchfont">热搜：植物大战僵尸</text>
			</view>
			<view class="uni-flex">
				<text class="iconfont .icon-xiaoxi msg"></text>
			</view>
		</view>
		<swiper class="swiper" circular :indicator-dots="indicatorDots" :indicator-active-color="indicatorDotsColor"
			:autoplay="autoplay" :interval="interval" :duration="duration">
			<swiper-item v-for="(item, index) in advertList" :key="index">
				<image class="swiper-item poster" :src="item.iconImg" ></image>
			</swiper-item>
		</swiper>
		<view class="uni-flex uni-row" style="margin: 0 20rpx;margin-bottom: 96rpx;">
			<view class="uni-flex uni-column content rest" @click="turnShop(1)">
				<text class="iconfont .icon-weinituijian icon"></text>
				<view class="text icontext">
					好玩推荐
				</view>
			</view>
			<view class="uni-flex uni-column content rest" @click="turnShop(3)">
				<text class="iconfont .icon-shandian-shi electron"></text>
				<view class="text icontext">
					下载热榜
				</view>
			</view>
			<view class="uni-flex uni-column content rest" @click="$turnPage('../shop/index', 'switchTab')">
				<text class="iconfont .icon-youxishebei gameplay"></text>
				<view class="text icontext">
					游戏设备
				</view>
			</view>
			<view class="uni-flex uni-column content rest" @click="$turnPage('help/customer', 'navigateTo')" >
				<text class="iconfont .icon-iconrx service"></text>
				<view class="text icontext">
					客服中心
				</view>
			</view>
		</view>
		<view class="moregame" @click="$turnPage('../find/index', 'switchTab')">
			<view class="uni-flex uni-row">
				<view class="uni-flex rest entertext">好玩推荐</view>
				<view class="uni-flex uni-row vertical">
					<text class="more">更多</text>
					<text class="iconfont .icon-z044 enter"></text>
				</view>
			</view>
		</view>
		<view class="uni-flex horizontally game" @click="$turnPage('../find/index', 'switchTab')">
			<view class="uni-flex">
				<!--v-for="(item, index) in recommendList" :key="index"-->
				<image src="../../static/recommend.png" class="recommended"></image>
				<view class="uni-flex uni-column gameinfo">
					<view class="gametitle">游戏发展园</view>
					<view class="gamedesc">快来邀请你的小伙伴加入进来吧，一起进入紧张、刺激的全新战场，福利多多。。</view>
				</view>
			</view>
		</view>
		<view class="moregame">
			<view class="uni-flex uni-row">
				<view class="uni-flex rest entertext">全新设备</view>
				<view class="uni-flex uni-row vertical">
					<text class="more">更多</text>
					<text class="iconfont .icon-z044 enter"></text>
				</view>
			</view>
		</view>
		<view class="uni-flex uni-row" style="margin-left: 10rpx;">
			<view class="uni-flex uni-column deviceinfo" style="margin-left: 10rpx;"
				@click="$turnPage('../shop/cart/goodsdetail?id=' + item.id, 'navigateTo')" 
				v-for="(item, index) in newEquipment" :key="index" v-if="index < 2">
				<view class="uni-flex picdiv">
					<image :src="item.iconImg" class="device"></image>
				</view>
				<view class="uni-flex uni-column desc">
					<view class="posi">
						<view class="uni-flex title">{{item.name}}</view>
						<view class="uni-flex subtitle">{{item.profile || '简介'}}</view>
						<view class="uni-flex vertical price">
							<text class="currency">￥</text>{{item.vipPrice / 100}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="moregame">
			<view class="uni-flex uni-row">
				<view class="uni-flex rest entertext">活动优惠</view>
				<view class="uni-flex uni-row vertical">
					<text class="more">更多</text>
					<text class="iconfont .icon-z044 enter"></text>
				</view>
			</view>
		</view>
		<view class="uni-flex horizontally game" @click="$turnPage('help/activitydetails?id='+activityCoupons[0].id, 'navigateTo')">
			<view class="uni-flex">
				<image class="discount" :src="activityCoupons[0].iconImg"></image>
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
				indicatorDots: true,
				indicatorDotsColor: '#FD5E2D',
				autoplay: false,
				interval: 5000,
				duration: 500,
				advertList: [], //广告轮播
				recommendList: [], //好玩推荐
				newEquipment: [], //全新设备
				activityCoupons: [], //活动优惠
				timeData: [{
					version: '版本号：V1.1',
					time: '2018年06月08日',
					desc: '升级性能，提高用户体验，增加玩家互动，多人对战模式。'
				},{
					version: '版本号：V1.1',
					time: '2019年06月08日',
					desc: '升级性能，提高用户体验，增加玩家互动，多人对战模式。'
				}]
			}
		},
		onLoad(query) {
			console.log('分销小程序传过来的数据:用户接收');
			// scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
			if(query && query.scene) {
				const scene = decodeURIComponent(query.scene)
				console.log(scene);
				uni.setStorageSync('agentId', scene);
			}
		},
		onShow() {
			this.getAdvert();
			this.getRecommendList();
			this.getNewEquipment();
			this.getActivityCoupon();
		},
		methods: {
			//消息订阅通知
			getMsg() {
				console.log('首页')
				wx.getSetting({
				  withSubscriptions: true,
				  success (res) {
				    console.log(res.authSetting)
				    // res.authSetting = {
				    //   "scope.userInfo": true,
				    //   "scope.userLocation": true
				    // }
				    console.log(res.subscriptionsSetting)
				    // res.subscriptionsSetting = {
				    //   mainSwitch: true, // 订阅消息总开关
				    //   itemSettings: {   // 每一项开关
				    //     SYS_MSG_TYPE_INTERACTIVE: 'accept', // 小游戏系统订阅消息
				    //     SYS_MSG_TYPE_RANK: 'accept'
				    //     zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: 'reject', // 普通一次性订阅消息
				    //     ke_OZC_66gZxALLcsuI7ilCJSP2OJ2vWo2ooUPpkWrw: 'ban',
				    //   }
				    // }
					wx.requestSubscribeMessage({
					  tmplIds: ['vN9wbBpcgCvqe6Wf4Tf_JcJnY3YP51oJ0Uf2y3aWmBs'],
					  success (res) { console.log('消息订单成功回调') }
					})
				  },
				  fail(err) {
					  console.log(err)
				  }
				})
			},
			turnShop(type) {
				this.$store.commit('setType', type);
				this.$turnPage('../shop/index', 'switchTab');
			},
			//获取广告轮播
			getAdvert() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.advert, {size: 2}, false).then((res) => {
					that.advertList = res.data
					let obj = {
						iconImg: '../../static/loop.png'
					}
					that.advertList.unshift(obj);
				});
			},
			//获取好玩推荐
			getRecommendList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.recommend, {size: 2}, false).then((res) => {
					that.recommendList.push(res.data[0])
				});
			},
			//获取全新设备
			getNewEquipment() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.newEquipment, {size: 2}, false).then((res) => {
					that.newEquipment = res.data
				});
			},
			//获取活动优惠
			getActivityCoupon() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.activityCoupon, {size: 2}, false).then((res) => {
					that.activityCoupons.push(res.data[0])
					that.activityCoupons[0].iconImg = '../../static/activity.png'
				});
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 260rpx;
		margin-bottom: 20rpx;
	}
	.searchdiv {
		margin-top: 22rpx;
		margin-bottom: 20rpx;
		.searchbar {
			width:600rpx;
			height:60rpx;
			background:rgba(236,236,236,1);
			border-radius:30px;
			margin-left: 20rpx;
			margin-right: 38rpx;
			position: relative;
			.search {
				font-size: 39rpx;
				color: #C8C8C8;
				position: absolute;
				left: 30rpx;
			}
			.searchfont {
				font-size: 28rpx;
				color: #999999;
			}
		}
		.msg {
			font-size: 42rpx;
			color: #666666;
		}
	}
	.poster {
		// height: 260rpx;
		height: 100%;
		width: 100%;
		margin-bottom: 50rpx;
	}
	.icontext {
		font-size: 28rpx;
		color: #343434;
	}
	.moregame {
		margin-top: 20rpx;
		.enter {
			margin-left: 15rpx;
			margin-right: 42rpx;
			color: #2D71FD;
			font-size: 21rpx;
			transform: rotate(-90deg);
		}
		.entertext {
			font-size: 36rpx;
			color: #343434;
			margin-left: 41rpx;
			margin-bottom: 10rpx;
			font-weight: bold;
		}
		.more {
			font-size: 24rpx;
			color: #2D71FD;
			margin-left: 15rpx;
		}
	}
	.game {
		position: relative;
		.recommended {
			width:710rpx;
			height:280rpx;
			background:rgba(0,0,0,1);
			//opacity:0.5;
			border-radius:10rpx;
		}
		color: #FFFFFF;
		.gameinfo {
			position: absolute;
			bottom: 22rpx;
			left: 44rpx;
			.gametitle {
				font-size: 34rpx;
			}
			.gamedesc {
				font-size: 20rpx;
			}
		}
	}
	.deviceinfo {
		width: 350rpx;
		.picdiv {
			height: 350rpx;
			background: #FFFFFF;
			border: 1px solid #DDDDDD;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
			.device {
				height: 214rpx;
				margin-top: 54rpx;
			}
		}
		.desc {
			background: #F7F7F7;
			border-bottom-left-radius: 10rpx;
			border-bottom-right-radius: 10rpx;
			height: 90px; //高度图片相适应
			.posi {
				margin-left: 10rpx;
			}
			.title {
				font-size: 28rpx;
				color: #343434;
			}
			.subtitle {
				font-size: 20rpx;
				color: #666666;
			}
			.price {
				font-size: 26rpx;
				color: #FD5E2D;
				margin-bottom: 20rpx;
				.currency {
					font-size: 20rpx;
				}
			}
		}
	}
	.discount {
		width:710rpx;
		height:180rpx;
		border-radius:10rpx;
		margin-bottom: 27rpx;
	}
	.icon, .electron, .gameplay, .service {
		font-size: 70rpx;
	}
	.icon {
		color: #F94585;
	}
	.electron {
		color: #F5C73B;
	}
	.gameplay {
		color: #358FF5;
	}
	.service {
		color: #FFAA31;
	}
</style>
