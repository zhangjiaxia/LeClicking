<template>
	<view>
		<view class="time">
			<view class="uni-flex uni-row option">
				<view class="uni-flex content seven" :class="{active: timeRange === 1}" @click="setTimeRange(1)">
					七天内<view class="underline" v-if="timeRange === 1"></view>
				</view>
				<view class="uni-flex content three space" :class="{active: timeRange === 2}" @click="setTimeRange(2)">
					三个月内<view class="underline" v-if="timeRange === 2"></view>
				</view>
				<view class="uni-flex vertical three" :class="{active: timeRange === 3}" @click="onShowDatePicker('range')">
					自定义时间
					<text class="iconfont .icon-gengduo screen" :class="{active: timeRange === 3}"></text>
				</view>
			</view>
			<view class="uni-flex uni-row pay">
				<view class="uni-flex total">总支出</view>
				<view class="uni-flex price">{{bills.totalAmt}}</view>
			</view>
		</view>
		<view class="paylist">
			<view class="uni-flex uni-row whole" v-for="(item, index) in bills.records" :key="index">
				<view class="uni-flex">
					<view class="content icon">
						<text class="iconfont .icon-shangpin-tianchong icontext"></text>
					</view>
				</view>
				<view class="uni-flex uni-column rest info">
					<view class="uni-flex uni-row money">
						<view class="uni-flex rest buy">{{item.name}}</view>
						<view class="uni-flex count">-{{item.payAmt}}</view>
					</view>
					<view class="uni-flex uni-row paytime">
						<view class="uni-flex rest date">2019-12-12&nbsp;&nbsp;&nbsp;12:12:00</view>
						<view class="uni-flex weixin">微信支付</view>
					</view>
				</view>
			</view>
		</view>
		<!--时间组件-->
		<view>
			<!-- <button type="primary" @click="onShowDatePicker('range')">选择日期范围</button> -->
			<mx-date-picker :show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'开始'" :end-text="'结束'" :show-seconds="true" @confirm="onSelected" @cancel="onSelected" />
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import mxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue"; //引入日期组件
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		components: {
			mxDatePicker
		},
		computed: mapState(['userInfo']),
		data() {
			return {
				bills: [], //账单列表
				billParams: {
					userId: 0,
					startDT: '',
					endDT: '',
					start: 0,
					length: 10
				}, //账单参数
				timeRange: 1, //1:七天，2:三个月，3:自定义
				dateOption: {
					currentDate: '', //当前时间
					sevenBefor: '', //七天前
					currentMonth: '', //三月
				} ,//时间条件参数
				//时间组件参数
				showPicker: false,
				date: '2019/01/01',
				range: ['2019/01/01','2019/01/06'],
				type: 'rangetime',
				value: ''
			}
		},
		onLoad() {
			this.getDateOption();
			this.getBills();
		},
		methods: {
			getDateOption() {
				let currentDate = new Date(), seven = new Date(), currentMonth = new Date();
				seven.setDate(currentDate.getDate()-7);
				currentMonth.setMonth(currentDate.getMonth() - 3);
				//当前时间
				currentDate = new Date(currentDate).format("yyyy-MM-dd");
				//七天
				seven = new Date(seven).format("yyyy-MM-dd");
				//三月
				currentMonth = new Date(currentMonth).format("yyyy-MM-dd");
				this.dateOption.currentDate = currentDate;
				this.dateOption.sevenBefor = seven;
				this.dateOption.currentMonth = currentMonth;
				console.log(this.dateOption)
				//赋值时间参数
				this.billParams.startDT = this.dateOption.sevenBefor;
				this.billParams.endDT = this.dateOption.currentDate;
			},
			setTimeRange(val){
				this.timeRange = val;
				this.billParams.endDT = this.dateOption.currentDate;
				if(val === 1) {
					this.billParams.startDT = this.dateOption.sevenBefor;
				} else if(val === 2) {
					this.billParams.startDT = this.dateOption.currentMonth;
				}
				if(val === 1 || val === 2) {
					this.getBills();
				}
			},
			getBills() {
				let that = this;
				//清空数据
				that.bills = [];
				that.billParams.userId = that.userInfo.userId
				interfaceurl.checkAuth(interfaceurl.billManage, that.billParams).then((res) => {
					that.bills = res.data;
					for(var item of that.bills.records) {
						item.createDt = new Date(item.createDt).format("yyyy-MM-dd hh:mm:ss");
					}
				});
			},
			onShowDatePicker(type){//显示
				this.setTimeRange(3);
				this.type = type;
				this.showPicker = true;
				this.value = this[type];
			},
			onSelected(e) {//选择
				this.showPicker = false;
				if(e) {
					this[this.type] = e.value;
					//选择的值
					console.log('value => '+ e.value);
					//原始的Date对象
					console.log('date => ' + e.date);
					let range = e.value.toString().split(',');
					let flag = new Date(range[0]).getTime() > new Date(range[1]).getTime();
					this.billParams.startDT = flag ? range[1] : range[0];
					this.billParams.endDT = flag ? range[0] : range[1];
					this.getBills();
				}
			}
		}
	}
</script>

<style lang="scss">
	.underline {
		width:30rpx;
		height:3rpx;
		background:rgba(253,94,45,1);
	}
	.active {
		color: #FD5E2D !important;
	}
	.base {
		color: #343434;
	}
	.time {
		height:157rpx;
		background:#F0F0F0;
		.option {
			view {
				font-size: 23rpx;
			}
			position: relative;
			top: 29rpx;
			height: 52rpx;
			.seven {
				margin: 0 70rpx;
			}
			.three {
				.screen {
					font-size: 20rpx;
					color: #999999;
					margin-left: 19rpx;
				}
			}
			.space {
				margin-right: 258rpx;
			}
		}
		.pay {
			margin-top: 50rpx;
			view {
				font-size: 27rpx;
			}
			.total {
				color: #343434;
				margin-left: 19rpx;
				margin-right: 95rpx;
			}
			.price {
				color: #FD5E2D;
			}
		}
	}
	.paylist {
		margin-bottom: 60rpx;
		.whole {
			height: 140rpx;
			.icon {
				width:60rpx;
				height:60rpx;
				background:rgba(243,198,91,1);
				border-radius:50%;
				margin-left: 20rpx;
				margin-top: 40rpx;
				.icontext {
					font-size: 28rpx;
					color: #FFFFFF;
				}
			}
			.info {
				margin: 30rpx 20rpx 0 10rpx;
				border-bottom: 1px solid #DDDDDD;
				.money {
					color: #343434;
					.buy {
						font-size: 27rpx;
					}
					.count {
						font-size: 22rpx;
					}
				}
				.paytime {
					view {
						font-size: 19rpx;
					}
					color: #999999;
				}
			}
		}
	}
</style>
