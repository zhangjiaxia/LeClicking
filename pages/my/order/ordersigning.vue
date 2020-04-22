<template>
	<view>
		<view class="uni-flex content head">
			<view class="uni-flex vertical">
				<image class="order" src="../../../static/gift.png"></image>
				<text class="pay">交易完成</text>
			</view>
		</view>
		<view class="topbar">
			<!-- <view class="uni-flex uni-row vertical logistics space">
				<view class="uni-flex">
					<view class="uni-flex content icon">
						<text class="iconfont .icon-mn_wuliu_fill car"></text>
					</view>
				</view>
				<view class="uni-flex rest">
					<view class="uni-flex uni-column">
						<view class="express">你的快递已到达广州白云区中转站,预计今天到达，请保持电话通畅</view>
						<view class="date">2020-01-01&nbsp;&nbsp;14:52:52</view>
					</view>
				</view>
				<view class="uni-flex">
					<text class="iconfont .icon-gengduo enter"></text>
				</view>
			</view> -->
			<view class="uni-flex uni-row vertical logistics">
				<view class="uni-flex">
					<view class="uni-flex content icon2">
						<text class="iconfont .icon-dizhi position"></text>
					</view>
				</view>
				<view class="uni-flex rest">
					<view class="uni-flex uni-column info">
						<view>
							<text class="nick">张女士</text>
							<text class="mobile">1552165232 </text>
						</view>
						<view class="address">
							广东省 广州市 白云区 望岗工业二路26号 汇和天地1号楼 2楼A206
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="orders">
			<view class="uni-flex uni-row order"
				v-for="(item, index) in list" :key="index">
				<view class="uni-flex">
					<image class="gamecover" src="../../../static/logo.png"></image>
				</view>
				<view class="uni-flex uni-column rest gamecontent">
					<view class="gametitle">游戏设备</view>
					<view class="desc">是由Rovio开发的一款休闲益智类游戏产</view>
					<view class="subdesc">型号：CFG464564654465</view>
					<view class="uni-flex uni-row vertical price">
						<view class="uni-flex pricecount">￥10000</view>
					</view>
					<view class="uni-flex horizontalright sum">共1件商品 合计：￥1000.00</view>
					<view class="uni-flex uni-row horizontalright">
						<view class="del content">
							<text class="deltext">申请售后</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="settle">
			<view class="uni-flex uni-row">
				<view class="uni-flex rest lefttext">商品总价</view>
				<view class="uni-flex righttext">￥2000.00</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex rest lefttext">运费</view>
				<view class="uni-flex righttext">￥0.00</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex rest lefttext">店铺优惠</view>
				<view class="uni-flex righttext">-￥20.00</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex rest total">订单总价</view>
				<view class="uni-flex totalcount">￥1800.00</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex rest total">实付款</view>
				<view class="uni-flex active">￥1800.00</view>
			</view>
		</view>
		<view class="orderinfo">
			<view class="title">订单信息</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex base">订单编号：</view>
				<view class="uni-flex rest baseright">46546546543643646</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex base">微信交易号：</view>
				<view class="uni-flex rest baseright">46546546543643646</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-flex base">付款时间：</view>
				<view class="uni-flex rest baseright">46546546543643646</view>
			</view>
		</view>
		<!-- <view class="uni-flex uni-row apply vertical horizontalright">
			<view class="uni-flex btnapply content">
				<text class="applytext">查看物流</text>
			</view>
			<view class="uni-flex btnapply content space">
				<text class="applytext">删除订单</text>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{},{}]
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	page {
		background: #F0F0F0;
	}
	.head {
		height: 120rpx;
		background: #FD5E2D;
		.order {
			width: 140rpx;
			height: 105rpx;
		}
		.pay {
			font-size: 31rpx;
			color: #FFFFFF;
			margin-left: 20rpx;
		}
	}
	.topbar {
		background: white;
		padding: 15px 0;
		.space {
			margin-bottom: 60rpx;
		}
	}
	.logistics {
		margin: 0 23rpx;
		.icon, .icon2 {
			border-radius:50%;
			width:60rpx;
			height:60rpx;
			border-radius: 50%;
			margin-right: 20rpx;
			color: #FFFFFF;
		}
		.icon {
			background:linear-gradient(0deg,rgba(45,118,253,1),rgba(45,143,253,1));
			.car {
				font-size: 24rpx;
			}
		}
		.icon2 {
			background:linear-gradient(0deg,rgba(253,94,45,1),rgba(253,133,45,1));
			.position {
				font-size: 28rpx;
			}
		}
		.express {
			line-height: 1.2;
			color: #4893F1;
			font-size: 29rpx;
			margin-bottom: 18rpx;
		}
		.date {
			color: #999999;
			font-size: 16rpx;
		}
		.enter {
			font-size: 28rpx;
			color: #999999;
			margin-left: 55rpx;
		}
	}
	.info {
		color: #343434;
		.nick {
			font-size: 26rpx;
		}
		.mobile {
			color: #999999;
			font-size: 26rpx;
			margin-left: 40rpx;
		}
		.address {
			margin-top: 18rpx;
			font-size: 24rpx;
			line-height: 1.2;
		}
	}
	.orders {
		margin-top: 20rpx;
		.order {
			padding-bottom: 42rpx;
			height:335rpx;
			background:#FFFFFF;
			.gamecover {
				width:120rpx;
				height:120rpx;
				border-radius:5rpx;
				margin: 20rpx 26rpx 0 22rpx;
			}
			.gamecontent {
				.gametitle {
					color: #343434;
					font-size: 31rpx;
					margin-top: 10rpx;
				}
				.desc {
					color: #666666;
					font-size: 24rpx;
				}
				.subdesc {
					color: #999999;
					font-size: 18rpx;
				}
				.price {
					.pricecount {
						font-size: 28rpx;
						color: #FD5E2D;
						margin-right: 306rpx;
					}
				}
				.sum {
					font-size: 26rpx;
					color: #343434;
					margin-right: 20rpx;
					margin-bottom: 30rpx;
				}
				.del, .confirm {
					width:130rpx;
					height:40rpx;
					border-radius:20rpx;
				}
				.del {
					border:1px solid #DDDDDD;
					margin-right: 20rpx;
					.deltext {
						color: #666666;
						font-size: 19rpx;
					}
				}
				.confirm {
					border:1px solid #FD5E2D;
					margin: 0 20rpx 0 22rpx;
					.confirmtext {
						color: #FD5E2D;
						font-size: 19rpx;
					}
				}
			}
		}
	}
	.settle {
		background: #FFFFFF;
		margin-top: -22rpx;
		padding: 0 22rpx;
		color: #666666;
		.lefttext {
			font-size: 19rpx;
		}
		.righttext {
			font-size: 16rpx;
		}
		.total {
			font-size: 23rpx;
			color: #343434;
		}
		.totalcount {
			font-size: 19rpx;
			color: #343434;
		}
		.active {
			font-size: 19rpx;
			color: #FD5E2D;
		}
	}
	.orderinfo {
		margin-top: 19rpx;
		// margin-bottom: 101rpx;
		background: #FFFFFF;
		padding-left: 23rpx;
		.title {
			font-size: 23rpx;
			color: #343434;
			margin-bottom: 31rpx;
		}
		.base {
			width: 188rpx;
			font-size: 19rpx;
			color: #666666;
		}
		.baseright {
			color: #666666;
			font-size: 16rpx;
		}
	}
	.apply {
		height:90rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px -1px 0px 0px rgba(221,221,221,1);
		.btnapply {
			width:130rpx;
			height:40rpx;
			background:rgba(255,255,255,1);
			border:1px solid rgba(221,221,221,1);
			border-radius:20rpx;
		}
		.space {
			margin: 0 21rpx;
		}
		.applytext {
			color: #666666;
			font-size: 19rpx;
		}
	}
</style>
