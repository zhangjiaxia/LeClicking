<template>
	<view class="find">
		<view class="moregame">
			<view class="uni-flex uni-row">
				<view class="uni-flex rest entertext">好玩推荐</view>
				<view class="uni-flex uni-row vertical">
					<text class="more">更多</text>
					<text class="iconfont .icon-z044 enter"></text>
				</view>
			</view>
		</view>
		<scroll-view scroll-x="true" class="gamefun">
			<image v-for="(item, index) in recommendList" :key="index" 
				:src="item.iconImg" class="fun" @click="turn(item.id)"></image>
		</scroll-view>
		<view class="moregame">
			<view class="uni-flex uni-row">
				<view class="uni-flex rest entertext">人气下载</view>
				<view class="uni-flex uni-row vertical">
					<text class="more">更多</text>
					<text class="iconfont .icon-z044 enter"></text>
				</view>
			</view>
		</view>
		<scroll-view scroll-x="true" class="gamefun">
			<view class="game content" v-for="(item, index) in downloadList" :key="index" @click="turn(item.id)">
				<image :src="item.iconImg" class="new"></image>
				<view class="gametext">{{item.name}}</view>
			</view>
		</scroll-view>
		<view class="moregame">
			<view class="uni-flex uni-row">
				<view class="uni-flex rest entertext">最新游戏</view>
				<view class="uni-flex uni-row vertical">
					<text class="more">更多</text>
					<text class="iconfont .icon-z044 enter"></text>
				</view>
			</view>
		</view>
		<scroll-view scroll-x="true" class="gamefun">
			<view class="game content" v-for="(item, index) in latestList" :key="index" @click="turn(item.id)">
				<image :src="item.iconImg" class="new"></image>
				<view class="gametext">{{item.name}}</view>
			</view>
		</scroll-view>
		<view class="moregame">
			<view class="uni-flex uni-row">
				<view class="uni-flex rest entertext">月榜排行</view>
				<view class="uni-flex uni-row vertical">
					<text class="more">更多</text>
					<text class="iconfont .icon-z044 enter"></text>
				</view>
			</view>
		</view>
		<scroll-view scroll-x="true" class="gamefun">
			<view class="game content" v-for="(item, index) in monthlyList" :key="index" @click="turn(item.id)">
				<image :src="item.iconImg" class="new"></image>
				<view class="gametext">{{item.name}}</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	export default {
		data() {
			return {
				recommendList: [], //好玩推荐
				downloadList: [], //人气下载
				latestList: [], //最新游戏
				monthlyList: [], //月榜排行
				params: {
					typeId: '', //产品类型ID
					searchContent: '', //搜素内容
					startDT: '', //开始时间
					endDT: '', //结束时间
					start: 0, //开始行
					length: 10, //每页数据量
					type: 1 //查询类别：1:好玩推荐2:最新上架3:下载热榜4:好评度高5:月度排行
				} //接口参数
			}
		},
		onShow() {
			uni.showLoading();
			this.getRecommendList();
			this.getDownloadList();
			this.getLatestList();
			this.getMonthlyList();
			uni.hideLoading();
		},
		onLoad() {
			
		},
		methods: {
			//跳转宝贝详情页，传入宝贝id
			turn(id) {
				this.$turnPage('../shop/cart/goodsdetail?id=' + id, 'navigateTo');
			},
			//获取所有类型数据
			getRecommendList() {
				let that = this;
				that.params.type = 1;
				interfaceurl.checkAuth(interfaceurl.productPage, that.params, false).then((res) => {
					this.recommendList = res.data;
				});
			},
			getDownloadList() {
				let that = this;
				that.params.type = 3;
				interfaceurl.checkAuth(interfaceurl.productPage, that.params, false).then((res) => {
					this.downloadList = res.data;
				});
			},
			getLatestList() {
				let that = this;
				that.params.type = 2;
				interfaceurl.checkAuth(interfaceurl.productPage, that.params, false).then((res) => {
					this.latestList = res.data;
				});
			},
			getMonthlyList() {
				let that = this;
				that.params.type = 5;
				interfaceurl.checkAuth(interfaceurl.productPage, that.params, false).then((res) => {
					this.monthlyList = res.data;
				});
			}
		}
	}
</script>

<style lang="scss">
	image {
		border-radius: 10rpx;
	}
	.find {
		padding-bottom: 31rpx;
		.moregame {
			margin-top: 20rpx;
			.enter {
				margin-left: 15rpx;
				margin-right: 42rpx;
				color: #999999;
				font-size: 21rpx;
				transform: rotate(-90deg);
			}
			.entertext {
				font-size: 42rpx;
				color: #343434;
				margin-left: 41rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
			}
			.more {
				font-size: 24rpx;
				color: #999999;
				margin-left: 15rpx;
			}
		}
		.gamefun {
			width: 100%;
			white-space: nowrap;
			margin-left: 20rpx;
			border-radius:10px;
			.fun {
				width:570rpx;
				height:221rpx;
				margin-right: 11rpx;
				display: inline-flex;
			}
			.game {
				width:230rpx;
				margin-right: 30rpx;
				display: inline-block;
				text-align: center;
				.new {
					height:170rpx;
					width: 100%;
				}
			}
			.gametext {
				font-size: 26rpx;
				color: #343434;
			}
		}
	}
</style>
