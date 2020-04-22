<template>
	<view class="layer">
		<view class="uni-flex uni-row vertical number">
			<view class="uni-flex rest">
				<input type="text" v-model="params.name" placeholder="请输入设备号" placeholder-class="holder" />
			</view>
			<view class="uni-flex" style="width: 40rpx;">
				<text class="iconfont .icon-saoma scan"></text>
			</view>
		</view>
		<view class="uni-flex content btn" @click="addEquipment()">
			<text>确认</text>
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
				params: {
					name: '',
					defaultSign: 0
				}
			}
		},
		onLoad() {
			
		},
		methods: {
			addEquipment() {
				let that = this;
				that.params.userId = that.userInfo.userId;
				interfaceurl.checkAuth(interfaceurl.equipmentSave, that.params).then((res) => {
					uni.showToast({
					    title: '添加设备成功',
					    icon: 'success',
					    duration: 2000
					});
				});
			}
		}
	}
</script>

<style lang="scss">
	input {
		width: 100%;
		margin-left: 10rpx;
	}
	.layer {
		margin: 0 30rpx;
		.number {
			.holder {
				color: #999999;
			}
			border-bottom: 1px solid #DDDDDD;
			margin: 70rpx 0;
			.scan {
				color: #343434;
				font-size: 36rpx;
			}
		}
		.btn {
			height:90rpx;
			border:1px solid rgba(253,94,45,1);
			border-radius:10rpx;
			color: #FD5E2D;
			font-size: 26rpx;
		}
	}
</style>
