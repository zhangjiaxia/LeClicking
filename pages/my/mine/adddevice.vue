<template>
	<view>
		<view class="addnew content" @click="$turnPage('newdevice', 'navigateTo')">
			<text class="newdevice">添加新设备</text>
		</view>
		<view class="line"></view>
		<view class="devicelist">
			<view class="uni-flex uni-row vertical deviceinfo"
				v-for="(item, index) in devices" :key="index">
				<view class="uni-flex uni-column rest device">
					<view class="devicename">{{item.name}}</view>
					<view class="uni-flex vertical default active">
						<text class="iconfont .icon-xianshi_xuanzetianchong setdefault active"></text>
						设为默认
					</view>
					<!-- <view class="uni-flex vertical default">
						<text class="iconfont .icon-xianshi_xuanzetianchong setdefault"></text>
						设为默认
					</view> -->
				</view>
				<view class="uni-flex">
					<view class="del content" @click="delDevice(item.id)">
						<text class="deltext">移除</text>
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
				devices: [] //设备列表
			}
		},
		onShow() {
			this.getEquipmentPage();
		},
		onLoad() {
			
		},
		methods: {
			getEquipmentPage() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.equipmentPage, {userId: that.userInfo.userId}).then((res) => {
					that.devices = res.data;
				});
			},
			delDevice(id) {
				let that = this;
				let params = {
					userId: that.userInfo.userId,
					id: id
				}
				interfaceurl.checkAuth(interfaceurl.equipmentDelete, params).then((res) => {
					that.getEquipmentPage();
				});
			}
		}
	}
</script>

<style lang="scss">
	.addnew {
		width:748rpx;
		height:90rpx;
		background:#FFFFFF;
		margin: 0 auto;
		border-top: 1px solid #DDDDDD;
		.newdevice {
			font-size: 31rpx;
			color: #FD5E2D;
		}
	}
	.line {
		width:748rpx;
		height:20rpx;
		background:#F2F2F2;
		margin: 0 auto;
	}
	.devicelist {
		.deviceinfo {
			height: 152rpx;
			border-bottom: 1px solid #DDDDDD;
			.device {
				margin-left: 31rpx;
				.devicename {
					color: #343434;
					font-size: 31rpx;
					margin-bottom: 22rpx;
				}
				.default {
					color: #999999;
					font-size: 19rpx;
					.setdefault {
						font-size: 24rpx;
						color: #CCCCCC;
						border-radius: 50%;
						margin-right: 13rpx;
					}
					.active {
						color: #FD5E2D;
					}
				}
				.active {
					color: #FD5E2D;
				}
			}
		}
		.del {
			width:90rpx;
			height:40rpx;
			border:1px solid #DDDDDD;
			border-radius:5rpx;
			margin-right: 31rpx;
			.deltext {
				font-size: 19rpx;
				color: #666666;
			}
		}
	}
</style>
