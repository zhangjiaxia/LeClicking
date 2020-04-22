<template>
	<view class="top">
		<view class="uni-flex uni-row info">
			<view class="text uni-flex circle">
				<view class="crown">
					<image class="icon" src="../../static/crown.png"></image>
				</view>
				<authPage>
					<image :src="userInfo.avatarUrl ? userInfo.avatarUrl : '../../static/head.png'" class="head"></image>
				</authPage>
			</view>
			<view class="uni-flex uni-column rest">
				<authPage>
					<view class="uni-flex uni-row vertical">
						<text class="uni-flex nick">{{userInfo.nickName || '卡卡'}}</text>
						<view class="uni-flex">
							<text class="iconfont .icon-nv minisex"></text>
						</view>
					</view>
				</authPage>
				<authPage :showUserOrPhone="userInfo.mobile" >
					<view class="phonediv">
						<view class="text mobile">
							{{userInfo.mobile.substring(0, 3) || '***'}}****
						</view>
					</view>
				</authPage>
			</view>
		</view>
		<view class="uni-flex uni-row">
			<view class="uni-flex uni-column content rest">
				<authPage>
					<view class="uni-flex content" @click="$turnPage('mine/adddevice', 'navigateTo')">
						<text class="iconfont .icon-VRshebei iconturn"></text>
						<view class="text icontext">
							我的设备
						</view>
					</view>
				</authPage>
			</view>
			<view class="uni-flex uni-column content rest">
				<authPage>
					<view class="uni-flex content" @click="$turnPage('mine/collection', 'navigateTo')">
						<text class="iconfont .icon-shoucang1 iconturn"></text>
						<view class="text icontext">
							我的收藏
						</view>
					</view>
				</authPage>
			</view>
			<view class="uni-flex uni-column content rest">
				<authPage>
					<view class="uni-flex content" @click="$turnPage('order/ordermanagement', 'navigateTo')">
						<text class="iconfont .icon-dingdan iconturn"></text>
						<view class="text icontext">
							订单管理
						</view>
					</view>
				</authPage>
			</view>
			<view class="uni-flex uni-column content rest">
				<authPage>
					<view class="uni-flex content" @click="$turnPage('../index/help/customer', 'navigateTo')">
						<text class="iconfont .icon-kefu iconturn"></text>
						<view class="text icontext">
							客服中心
						</view>
					</view>
				</authPage>
			</view>
		</view>
		<view style="margin-top: 20rpx;">
			<authPage>
				<view class="uni-flex uni-row vertical bar" @click="$turnPage('mine/billmanagement', 'navigateTo')">
					<view class="uni-flex rest entertext">账单管理</view>
					<text class="iconfont .icon-gengduo enter"></text>
				</view>
			</authPage>
			<authPage>
				<view class="uni-flex uni-row vertical bar" @click="$turnPage('mine/coupon', 'navigateTo')">
					<view class="uni-flex rest entertext">红包/卡券</view>
					<text class="iconfont .icon-gengduo enter"></text>
				</view>
			</authPage>
			<view class="uni-flex uni-row vertical bar">
				<view class="uni-flex rest entertext">邀请好友</view>
				<button class="share-btn uni-flex rest share" open-type="share">邀请好友</button>
				<text class="iconfont .icon-gengduo enter"></text>
			</view>
			<view class="uni-flex uni-row vertical bar">
				<view class="uni-flex rest entertext">关于我们</view>
				<text class="iconfont .icon-gengduo enter"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import authPage from '@/components/authorization-page.vue' //引入授权窗体
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		components: {
			authPage
		},
		computed: mapState(['token', 'userInfo']),
		data() {
			return {
				
			}
		},
		onLoad(options) {
			
		},
		onShareAppMessage(res) {
			return {
				title: '乐嗒嗒',
				imageUrl: "../../static/logo.png",
				path: '/pages/index/index'
			}
		},
		methods: {
			showPoster() {
				//跳转海报页面
				this.$turnPage('mine/poster', 'navigateTo');
			}
		}
	}
</script>

<style lang="scss">
	.iconturn {
		font-size: 52rpx;
	}
	.top {
		height: 280rpx;
		background: rgba(236,208,56,1);
		padding-top: 30rpx;
		.info {
			margin-bottom: 44rpx;
			.circle {
				position: relative;
				width: 150rpx;
				height: 90rpx;
				.crown {
					position: absolute;
					left: 34rpx;
					top: -32rpx;
					.icon {
						width:53rpx;
						height:48rpx;
					}
				}
				.head {
					margin-left: 42rpx;
					width:90rpx;
					height:90rpx;
					border-radius:50%;
					border: 4rpx solid #EBAB21;
				}
			}
			.nick {
				font-size: 26rpx;
				color: #343434;
				margin-right: 10rpx;
			}
			.phonediv {
				width:112rpx;
				height:25rpx;
				background:rgba(248,230,129,1);
				border-radius:13px;
				padding-left: 10rpx;
			}
			.minisex {
				color: #F07D55;
				font-size: 26rpx;
			}
			.mobile {
				font-size: 16rpx;
				color: #343434;
			}
		}
		.icon {
			width: 46rpx;
			height: 46rpx;
		}
	}
	.icontext {
		font-size: 23rpx;
		color: #4A4A4A;
	}
	.bar {
		margin-left: 33rpx;
		height: 107rpx; 
		// border-bottom: 1px solid #DDDDDD;
		.enter {
			color: #CECECE;
			font-size: 27rpx;
			margin-right: 31rpx;
		}
		.entertext {
			font-size: 26rpx;
			color: #4A4A4A;
		}
		.share {
			position: absolute;
			width: 100%;
			opacity: 0;
		}
	}
</style>
