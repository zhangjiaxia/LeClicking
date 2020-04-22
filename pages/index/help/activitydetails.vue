<template>
	<view class="activity">
		<rich-text :nodes="detail.details" space="nbsp"></rich-text>
		<view class="addiv">
			<image class="ad" :src="img"></image>
		</view>
	</view>
	<!-- <view class="activity">
		<view class="title">欢迎参加思迪互动开发者大赛</view>
		<view class="objective">一、活动目的</view>
		<view class="item">
			为了进一步夯实我校少先队组织基础，
			进一步深化队员对少先队组织的认识，
			增强广大少先队员组织意识集体意识，增强光荣感和责任感.
			增强广大少先队员组织意识集体意识，增强光荣感和责任感
		</view>
		<view class="objective">二、活动时间</view>
		<view class="item">
			2020年 10月12（星期五）中午12：30
		</view>
		<view class="objective">三、活动地点</view>
		<view class="item">
			学校操场
		</view>
		<view class="objective">四、活动对象</view>
		<view class="item">
			学校全体教师、中队辅导员（二至六年级班主任）、少先队员（二至六年级学生）
		</view>
		<view class="objective">五、活动要求</view>
		<view class="item">
			统一着装、准备鲜艳的红领巾、严肃纪律
		</view>
		<view class="objective">六、活动过程</view>
		<view class="lastitem">
			<view class="frontitem">1. 出大队旗</view>
			<view class="subitem">大队部负责旗手训练</view>
			<view class="frontitem">2. 唱队歌</view>
			<view class="subitem">音乐谢老师作现场指挥</view>
			<view class="frontitem">3. 献红领巾</view> 
			<view class="subitem">大队部安排礼仪小标兵对主席台老师献红领巾，大队部安排礼仪小标兵对主席台老师献红领巾，
			（大队部安排礼仪小标兵对主席台老师献红领巾）
			</view>　　
			<view class="frontitem">4. 大队辅导员致辞开幕</view> 
			<view class="frontitem">5. 少先队员按部就班展示表演</view> 
		</view>
		<view class="addiv">
			<image class="ad" :src="img"></image>
		</view>
	</view> -->
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	export default {
		data() {
			return {
				decode: true,
				detail: {}, //活动详情
				img: '' //活动图片
			}
		},
		onLoad(options) {
			this.img = '../../../static/activity.png';
			this.getActivityDetail(options.id);
		},
		methods: {
			getActivityDetail(id) {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.activityDetail, {id}, false).then((res) => {
					that.detail = res.data;
					//that.escape2Html(that.detail.details)
				});
			},
			escape2Html(str) {
				var arrEntities = {
					'lt': '<',
					'gt': '>',
					'nbsp': ' ',
					'amp': '&',
					'quot': '"',
					'middot':'·',
					'amp':'&',
					'brvbar':'¦',
					'mdash':'—',
					'ndash':'–',
					'ge':'≥',
					'le':'≤',
					'laquo':'«',
					'raquo':'»',
					'deg':'°',
					'bull':'•',
					'macr':'¯',
					'#64':'@'
				};
				return str.replace(/&(lt|gt|nbsp|amp|quot|middot|amp|brvbar|mdash|ndash|ge|le|laquo|raquo|deg|bull|macr|#64);/ig, 
					function(all, t) {
						return arrEntities[t];
					}
				);
			}
		}
	}
</script>

<style lang="scss">
	.activity {
		margin: 0 20rpx;
		color: #343434;
		.title {
			margin-top: 40rpx;
			margin-bottom: 46rpx;
			font-size: 35rpx;
			text-align: center;
		}
		.objective {
			font-size: 27rpx;
		}
		.item, .lastitem {
			color: #979797;
			font-size: 27rpx;
			margin-top: 30rpx;
			margin-bottom: 40rpx;
		}
		.item, .frontitem {
			text-indent: 28rpx;
			margin-bottom: 10rpx;
		}
		.lastitem {
			.subitem {
				text-indent: 56rpx;
				margin-bottom: 10rpx;
			}
		}
		.addiv {
			margin-bottom: 100rpx;
			padding: 0 auto;
			.ad {
				width:710rpx;
				height:180rpx;
				border-radius:10rpx;
			}
		}
	}
</style>
