<template>
	<view class="layout">
		<view class="uni-flex content address" @click="turn(null)">
			<text class="addnew">添加新地址</text>
		</view>
		<view class="line"></view>
		<view class="info" v-for="(item, index) in addressList" :key="index" @click="setTempAddress(item)">
			<view class="uni-flex uni-column element">
				<view class="uni-flex vertical">
					<text class="nick">{{item.name}}</text>
					<text class="mobile">{{item.phone}}</text>
				</view>
				<view class="uni-flex area">
					{{item.province}}{{item.city}}{{item.area}}{{item.address}}
				</view>
				<view class="spacebar">
					<view class="uni-flex uni-row">
						<view class="uni-flex vertical rest">
							<text class="iconfont .icon-xianshi_xuanzetianchong setdefault"
								:class="{active: item.defaultSign === 1}"></text>
							<text class="default" :class="{active: item.defaultSign === 1}">
								设为默认
							</text>
						</view>
						<view class="uni-flex">
							<view class="uni-flex content operate space" @click.stop="turn(item)">编辑</view>
							<view class="uni-flex content operate" @click.stop="delAddress(item.id)">删除</view>
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
				addressList: [], //地址列表
				delParams: {
					userId: 97,
					id: 0
				}, //删除参数
				list: [{},{},{}]
			}
		},
		onShow() {
			this.getAddressList();
		},
		onLoad() {
			
		},
		methods: {
			setTempAddress(item){
				this.$store.commit('setTempAddress', item);
				this.$turnPage(1, 'navigateBack');
			},
			turn(item) {
				this.$store.commit('setAddressEdit', item);
				this.$turnPage('editaddress', 'navigateTo');
			},
			getAddressList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.addressPage, {userId: that.userInfo.userId}, false).then((res) => {
					that.addressList = res.data;
				});
			},
			delAddress(id) {
				let that = this;
				that.delParams.id = id;
				interfaceurl.checkAuth(interfaceurl.addressDelete, that.delParams, false).then((res) => {
					that.getAddressList();
				});
			}
		}
	}
</script>

<style lang="scss">
	.layout {
		width:748rpx;
		margin: 0 auto;
		.address {
			height:90rpx;
			border-top: 1px solid #DDDDDD;
			.addnew {
				color: #FD5E2D;
				font-size: 31rpx;
			}
		}
		.line {
			height:20rpx;
			background:#F2F2F2;
		}
		.info {
			height: 230rpx;
			border-bottom:1px solid #DDDDDD;
			padding: 30rpx;
			.element {
				height: 100%;
				position: relative;
			}
			.spacebar {
				position: absolute;
				bottom: 0;
				width: 100%;
			}
			.nick {
				margin-right: 23rpx;
				color: #343434;
				font-size: 31rpx;
			}
			.mobile {
				color: #999999;
				font-size: 19rpx;
			}
			.area {
				font-size: 26rpx;
				color: #343434;
				margin-top: 25rpx;
				margin-bottom: 31rpx;
				line-height: 1;
			}
			.setdefault {
				margin-right: 13rpx;
				font-size: 24rpx;
				color: #CCCCCC;
			}
			.default {
				color: #999999;
				font-size: 19rpx;
			}
			.active {
				color: #FD5E2D;
			}
			.operate {
				width:90rpx;
				height:40rpx;
				border:1px solid #DDDDDD;
				border-radius:5rpx;
				color: #666666;
				font-size: 19rpx;
			}
			.space {
				margin-right: 20rpx;
			}
		}
	}
</style>
