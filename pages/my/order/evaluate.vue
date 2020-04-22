<template>
	<view>
		<view style="margin-bottom: 120rpx;">
			<view class="evaluate" v-for="(item, index) in evaluateGoods" :key="index">
				<view class="uni-flex uni-row vertical titlebar">
					<view class="uni-flex">
						<image class="cover" :src="item.iconImg"></image>
					</view>
					<view class="uni-flex rest">
						<text class="name">{{item.name}}</text>
					</view>
				</view>
				<view class="comment">
					<textarea placeholder="发表评论" placeholder-class="speak" v-model="item.content"></textarea>
				</view>
			</view>
		</view>
		<view class="uni-flex content publish" @click="publishComment()">发表评论</view>
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
		computed: mapState(['userInfo', 'evaluateGoods']),
		data() {
			return {
				list: [{},{}]
			}
		},
		onLoad() {
			
		},
		methods: {
			publishComment() {
				console.log('是否带content',this.evaluateGoods)
				if(this.evaluateGoods.length == 1) {
					this.addComment(this.evaluateGoods[0])
				} else {
					for(var item of this.evaluateGoods) {
						if(item.content) {
							this.addComment(item)
						}
					}
				}
			},
			addComment(item) {
				let commentParams = {
					userId: this.userInfo.userId,
					productId: item.id,
					content: item.content //评论内容
				}
				interfaceurl.checkAuth(interfaceurl.addComment, commentParams).then((res) => {
					uni.showToast({
					    title: '添加评论成功',
					    icon: 'none',
					    duration: 2000
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
	.evaluate {
		background: #FFFFFF;
		margin-bottom: 20rpx;
		.titlebar {
			height: 100rpx;
			border-top: 1px solid #DDDDDD;
			border-bottom: 1px solid #DDDDDD;
			.cover {
				width:60rpx;
				height:60rpx;
				margin: 0 21rpx;
			}
			.name {
				color: #666666;
				font-size: 23rpx;
			}
		}
		.comment {
			height: 230rpx;
			padding-left: 21rpx;
			textarea {
				width: 100%;
				height: 100%;
				margin-top: 20rpx;
			}
			.speak {
				color: #999999;
				font-size: 23rpx;
			}
		}
	}
	.publish {
		height:90rpx;
		background:rgba(253,94,45,1);
		color: #FFFFFF;
		position: fixed;
		bottom: 0;
		width: 100%;
	}
</style>
