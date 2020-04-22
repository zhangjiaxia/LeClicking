<template>
	<view>
		<view class="total">
			<view class="uni-flex uni-row">
				<view class="uni-flex rest count">共{{collectionList.length}}件宝贝</view>
				<view class="uni-flex uni-row vertical" @click="delCollect(0)">
					<text class="alldel">全部移除</text>
				</view>
			</view>
		</view>
		<view class="collects">
			<view class="uni-flex uni-row collect"
				v-for="(item, index) in collectionList" :key="index">
				<view class="uni-flex">
					<image class="gamecover" :src="item.iconImg"></image>
				</view>
				<view class="uni-flex uni-column rest gamecontent">
					<view class="gametitle">{{item.name}}</view>
					<view class="desc">{{item.profile}}</view>
					<view class="subdesc">{{item.verions}}</view>
					<view class="uni-flex uni-row vertical price">
						<view class="uni-flex pricecount">￥{{item.vipPrice / 100}}</view>
						<view class="uni-flex">
							<view class="del content" @click="delCollect(item.id)">
								<text class="deltext">移除</text>
							</view>
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
				collectionList: [], //收藏列表
			}
		},
		onLoad() {
			this.getCollection();
		},
		methods: {
			getCollection() {
				let that = this;
				//that.userInfo.userId = 97;
				interfaceurl.checkAuth(interfaceurl.collection, {userId: that.userInfo.userId}).then((res) => {
					that.collectionList = res.data;
				});
			},
			delCollect(id) {
				let ids = [];
				if (id === 0) { //移除全部
					for (var item of this.collectionList) {
						ids.push(item.id);
					}
				} else {
					ids.push(id);
				}
				let that = this;
				//that.userInfo.userId = 97;
				interfaceurl.checkAuth(interfaceurl.delCollection, ids).then((res) => {
					that.getCollection();
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
		margin: 31rpx 41rpx;
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
		.collect {
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
</style>
