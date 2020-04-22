<template>
	<view>
		<view class="edit">
			<view class="uni-flex vertical bar">
				<input type="text" v-model="info.name" placeholder="姓名" class="info" />
			</view>
			<view class="uni-flex vertical bar">
				<input type="text" v-model="info.phone" placeholder="手机" class="info" />
			</view>
			<view class="uni-flex uni-row bar" @click="showMulLinkageThreePicker">
				<view class="uni-flex vertical rest">
					<text class="info">
						<!-- {{info.province}} {{info.city}} {{info.area}} -->
						{{position}}
					</text>
				</view>
				<view class="uni-flex vertical">
					<text class="iconfont .icon-gengduo enter"></text>
				</view>
			</view>
			<view class="uni-flex vertical detail">
				<view class="info indent">
					<input type="text" v-model="info.address" placeholder="详细地址" />
				</view>
			</view>
		</view>
		<view class="uni-flex uni-row vertical default" @click="setSign">
			<view class="uni-flex">
				<text class="iconfont .icon-xianshi_xuanzetianchong setdefault"
					:class="{active : info.defaultSign === 1}">
				</text>
			</view>
			<view class="uni-flex">
				<text class="defaulttext" :style="{color: info.defaultSign === 1 ? '#FD5E2D' : '#343434'}">设为默认地址</text>
			</view>
		</view>
		<view class="uni-flex content">
			<view class="uni-flex content btnsave" @click="saveAddress">
				保存
			</view>
		</view>
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import cityData from '@/common/city.data.js';
	import interfaceurl from '@/utils/interface.js'
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		computed: mapState(['addressEdit', 'userInfo']),
		components: {
			mpvuePicker,
			mpvueCityPicker
		},
		data() {
			return {
				themeColor: '#007AFF',
				cityPickerValueDefault: [0, 0, 1],
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray:[],
				position: 'xx省xx市xx区',
				saveOrEdit: true, //true:新增，false:修改
				info: {} //用户地址信息，深拷贝
			}
		},
		onLoad() {
			this.info = this.deepCopy(this.addressEdit);
			if(this.info.id) {
				this.saveOrEdit = false
				this.position = this.info.province + '' + this.info.city + '' + this.info.area
			} else {
				//初始化一下对象
				this.info = {defaultSign: 1}
			}
			let that = this;
			uni.setNavigationBarTitle({
			    title: that.saveOrEdit ? '添加地址' : '编辑地址'
			});
			this.info.userId = this.userInfo.userId;
		},
		methods: {
			setSign() {
				this.info.defaultSign = this.info.defaultSign === 1 ? 0 : 1;
			},
			saveAddress() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.addressSave, that.info, false).then((res) => {
					uni.showToast({
					    title: '保存成功',
					    icon: 'success',
					    duration: 2000
					});
					that.$turnPage('1', 'navigateBack');
				});
			},
			deepCopy(obj) {
			  var result = Array.isArray(obj) ? [] : {};
			  for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
				  if (typeof obj[key] === 'object' && obj[key]!==null) {
					result[key] = deepCopy(obj[key]);   //递归复制
				  } else {
					result[key] = obj[key];
				  }
				}
			  }
			  return result;
			},
			// 三级联动选择
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				this.info.province = e.label.split('-')[0]
				this.info.city = e.label.split('-')[1]
				this.info.area = e.label.split('-')[2]
				this.position = e.label.replace('-', '').replace('-', '');
			},
			onCancel(e) {
				//console.log('取消地址选择')
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F0F0F0;
	}
	.active {
		color: #FD5E2D;
	}
	.edit {
		margin: 0 auto;
		width:749rpx;
		height:386rpx;
		background:#FFFFFF;
		.bar {
			height: 88rpx;
			border-top: 2rpx solid #DDDDDD;
			.enter {
				font-size: 23rpx;
				color: #CFCFCF;
				margin-right: 41rpx;
			}
		}
		.info {
			margin-left: 29rpx;
			width: 100%;
		}
		.detail {
			border-top: 2rpx solid #DDDDDD;
			//border-bottom: 2rpx solid #DDDDDD;
			height: 116rpx;
			.indent {
				margin-right: 47rpx;
				line-height: 1.2;
			}
		}
	}
	.default {
		height:90rpx;
		background:rgba(255,255,255,1);
		margin-top: 21rpx;
		margin-bottom: 71rpx;
		.setdefault {
			font-size: 24rpx;
			margin-left: 31rpx;
			margin-right: 15rpx;
		}
		.defaulttext {
			font-size: 26rpx;
			color: #343434;
		}
	}
	.btnsave {
		width:300rpx;
		height:80rpx;
		background:rgba(255,255,255,1);
		border-radius:10rpx;
		color: #343434;
		font-size: 27rpx;
	}
</style>
