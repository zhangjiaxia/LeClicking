<template>
	<view class="">
		<view id="up">
			<view class="uni-flex uni-row vertical searchdiv">
				<view class="uni-flex content searchbar" @click="$turnPage('../index/help/search', 'navigateTo')">
					<text class="iconfont .icon-search search"></text>
					<text class="searchfont">{{key || '热搜：植物大战僵尸'}}</text>
				</view>
				<view class="uni-flex rest msgbar" @click="turnOrNot">
					<authPage>
						<text class="iconfont .icon-gouwuche msg" style="line-height: 1;"></text>
						<uni-badge v-if="cartNum > 0" class="space" :text="cartNum" type="error" size="small" />
					</authPage>
				</view>
			</view>
			<view class="bar">
				<view class="normal" :class="{recommended: typeOptions[0]}" style="margin-left: 30rpx;" @click="setType(1)">推荐</view>
				<view class="normal" :class="{recommended: typeOptions[1]}" @click="setType(2)">最新上架</view>
				<view class="normal" :class="{recommended: typeOptions[2]}" @click="setType(3)">下载热榜</view>
				<view class="normal" :class="{recommended: typeOptions[3]}" @click="setType(4)">好评度高</view>
			</view>
		</view>
		<!--商品列表-->
		<category :menuHeight="menuHeight" :typeList="typeList" :list="list" @download="beforeDownload"
			@saveCart="beforeSaveCart" @queryList="queryList" @popup="popup"></category>
		<!--加入购物车前-->
		<beforeCart ref='cart'></beforeCart>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import authPage from '@/components/authorization-page.vue' //引入授权窗体
	import uniBadge from '@/components/uni-badge/uni-badge.vue'
	import category from '@/components/shop-category.vue' //自定义组件
	import beforeCart from '@/components/before-cart.vue'
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		computed: mapState(['userInfo', 'cartNum', 'key', 'typeNumber', 'token']),
		components: {
			authPage,
			beforeCart,
			uniBadge,
			category
		},
		data() {
			return {
				typeOptions: [false,false,false,false], //点两下就去除类型的筛选条件，且置灰
				menuHeight: 0, //游戏列表高度
				list: [], //右侧数据列表
				typeList: [], //产品分类列表
				goodsParams: {
					typeId: '', //产品类型Id
					searchContent: '', //搜索内容
					startDT: '', //开始时间
					endDT: '', //结束时间
					start: 0,
					length: 100,
					type: 0 //1:好玩推荐2:最新上架3:下载热榜4:好评度高5:月度排行
				}, //商品列表的参数
			}
		},
		//设置菜单高度
		mounted(){
			let that = this
			let query = uni.createSelectorQuery().in(this)
			uni.getSystemInfo({
			  success: res => {
				query.selectAll('#up').boundingClientRect(rect => {
				  rect.map((currentValue, index, arr) => {
					let tabbarHeight = res.screenHeight - res.windowHeight
					that.menuHeight = res.screenHeight - currentValue.height - tabbarHeight
				  })
				}).exec();
			  }
			});
		},
		onLoad() {
			this.getTypeList();
		},
		onShow() {
			this.goodsParams.searchContent = this.key
			this.goodsParams.type = this.typeNumber
			this.getList();
		},
		methods: {
			turnOrNot() {
				if(this.token) {
					this.$turnPage('cart/cart', 'navigateTo');
				}
			},
			setType(type) {
				this.typeOptions[type - 1] = !this.typeOptions[type - 1];
				if(this.typeOptions[type - 1]) {
					//避免出现两个true
					for(let i in this.typeOptions) {
						if(!(type - 1 == i)) {
							this.typeOptions[i] = false
						}
					}
				}
				if(this.typeOptions[type - 1]) {
					this.goodsParams.type = type;
				} else {
					//置灰说明重复点了，设参数值为默认
					this.goodsParams.type = 0;
				}
				this.getList();
			},
			queryList(id) {
				this.goodsParams.typeId = id;
				this.getList();
			},
			getTypeList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.productType, {}, false).then((res) => {
					that.typeList = res.data;
				});
			},
			getList() {
				uni.showLoading();
				let that = this;
				interfaceurl.checkAuth(interfaceurl.productPage, that.goodsParams, false).then((res) => {
					that.list = res.data;
				});
				uni.hideLoading();
			},
			/*加入购物车前判断用户是否绑定设备调用子组件的方法*/
			//下载需要绑定设备。免费的直接绑定下载。收费的。系统会先判定是否购买了
			beforeSaveCart(params) {
				this.$refs.cart.beforeSaveCart(params.item, params.isDownLoad);
			},
			popup(item) {
				this.$refs.cart.popup(item);
			}
		}
	}
</script>

<style lang="scss">
	#up {
		padding-top: 22rpx;
		padding-bottom: 12rpx;
	}
	.searchdiv {
		margin-bottom: 30rpx;
		.searchbar {
			width:600rpx;
			height:60rpx;
			background:rgba(236,236,236,1);
			border-radius:30px;
			margin-left: 20rpx;
			margin-right: 38rpx;
			position: relative;
			.search {
				font-size: 39rpx;
				color: #C8C8C8;
				position: absolute;
				left: 30rpx;
			}
			.searchfont {
				font-size: 28rpx;
				color: #999999;
			}
		}
		.msgbar {
			position: relative;
			// padding-left: 38rpx;
			.msg {
				font-size: 54rpx;
				color: #666666;
			}
			.space {
				position: absolute;
				left: 32rpx;
				top: -20rpx;
			}
		}
	}
	.bar {
		font-size: 26rpx;
		.normal {
			font-weight: bold;
			display: inline-block;
			width: 130rpx;
			text-align: center;
			margin-left: 60rpx;
		}
		.recommended {
			background:#FDEFEB;
			border-radius:5rpx;
			color: #FD5E2D;
		}
		.notactive {
			color: #343434;
		}
	}
</style>
