<template>
	<view>
		<view class="uni-flex uni-row" :style="{height: menuHeight + 'px'}">
			<view class="uni-flex uni-column left">
				<scroll-view scroll-y="true" class="pattern">
					<view class="uni-flex vertical base" 
						:class="{bgcolor: selectLeftId === 0}" @click="setLeftId(0)">
						<view class="main" :class="{active: selectLeftId === 0}" style="font-size: 26rpx;">
							全部
						</view>
					</view>
					<view v-for="(item, index) in typeList" :key="index">
						<view class="uni-flex vertical base" :class="{bgcolor: selectLeftId === item.id}" @click="setLeftId(item.id)">
							<view class="main" :class="{active: selectLeftId === item.id}">{{item.name}}</view>
						</view>
						<view class="bartitle">
							<view class="uni-flex vertical base" v-for="(subItem, i) in item.children" :key="i"
								:class="{bgcolor: selectLeftId === subItem.id}" @click="setLeftId(subItem.id)">
								<view class="sub" :class="{active: selectLeftId === subItem.id}"
								:style="{'padding-left': selectLeftId === subItem.id ? '40rpx' : 'none'}">{{subItem.name}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="uni-flex rest right">
				<scroll-view scroll-y="true" class="space">
					<view class="uni-flex uni-row gameinfo" @click="turn(item.id)"
						v-for="(item, index) in list" :key="index">
						<view class="uni-flex">
							<image class="gamecover" :src="item.iconImg"></image>
						</view>
						<view class="uni-flex uni-column rest gamecontent">
							<view class="gametitle">{{item.name}}</view>
							<view class="desc">{{item.profile}}</view>
							<view class="downcount">
								{{item.type === '00' ? '下载量' : '购买量'}}：{{item.downNum ? item.downNum : 0}}
							</view>
							<view v-if="item.type === '00'">
								<view v-if="!downResult && chooseItem.id == item.id">
									<progress percent="100" activeColor="#FD5E2D" active stroke-width="4" show-info font-size="12" />
								</view>
								<view class="uni-flex uni-row vertical" style="margin-top: 19rpx;" v-else>
									<authPage>
										<view class="uni-flex content gamePrice" @click.stop="saveCart(item, false)">{{item.vipPrice == 0 ? '免费' : '￥' + item.vipPrice / 100}}</view>
									</authPage>
									<view class="uni-flex rest yuanPrice">原价：{{item.price / 100}}</view>
								</view>
								<authPage>
									<text class="iconfont .icon-zanting play" v-if="!downResult && chooseItem.id == item.id"></text>
									<text class="iconfont .icon-kaishi play" @click.stop="saveCart(item, true)" v-else></text>
								</authPage>
							</view>
							<view class="uni-flex uni-row vertical price" v-else>
								<view class="uni-flex present">￥{{item.vipPrice / 100}}</view>
								<view class="uni-flex rest original">原价：{{item.price / 100}}</view>
								<view class="uni-flex">
									<authPage>
										<view class="content cart" @click.stop="$emit('popup', item)">
											<text class="iconfont .icon-03f icon"></text>
										</view>
									</authPage>
								</view>
							</view>
							<view class="line"></view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import authPage from '@/components/authorization-page.vue' //引入授权窗体
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		computed: mapState(['token', 'downResult']),
		components: {
			authPage
		},
		props: {
			menuHeight: {
				type: String,
				default: '0'
			},
			typeList: {
				type: Array,
				default: []
			},
			list: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				selectLeftId: 0, //0代表全部
				chooseItem: {} //用户选中的商品
			}
		},
		methods: {
			//跳转宝贝详情页，传入宝贝id
			turn(id) {
				this.$turnPage('cart/goodsdetail?id=' + id, 'navigateTo');
			},
			setLeftId(id) {
				this.selectLeftId = id;
				this.$emit('queryList', id)
			},
			saveCart(item, isDownLoad) {
				this.chooseItem = item
				if(item.vipPrice == 0) {
					//如果免费，直接改为下载操作
					isDownLoad = true
				}
				let params = {
					item: item,
					isDownLoad: isDownLoad
				}
				this.$emit('saveCart', params)
			}
		}
	}
</script>

<style lang="scss">
	.left {
		width: 200rpx;
		background: #ECECEC;
		height: 100%;
		.bgcolor {
			background: #FFFFFF;
		}
		.pattern {
			height: 100%;
			color: #343434;
			font-size: 26rpx;
			.base {
				height: 80rpx;
			}
			.active {
				border-left: 8rpx solid #FD5E2D;
			}
			.main {
				padding-left: 21rpx;
				font-size: 34rpx;
				font-weight: bold; //取值数字时，某些手机会不生效
			}
			.sub {
				padding-left: 48rpx;
			}
		}
	}
	.right {
		height: 100%;
		.space {
			padding-top: 20rpx;
		}
		.gameinfo {
			margin-left: 21rpx;
			.gamecover {
				width: 177rpx;
				height: 177rpx;
				border-radius: 10rpx;
			}
			.gamecontent {
				margin-left: 16rpx;
				color: #666666;
				.gametitle {
					font-size: 34rpx;
					color: #343434;
					font-weight: bold;
				}
				.desc {
					font-size: 21rpx;
				}
				.downcount {
					font-size: 17rpx;
				}
				/*游戏下载*/
				.play {
					margin-top: 6rpx;
					margin-bottom: 52rpx;
					font-size: 23rpx;
				}
				/*游戏设备*/
				.price {
					margin-bottom: 51rpx;
					.present {
						font-size: 25rpx;
						color: #FD5E2D;
					}
					.original {
						font-size: 20rpx;
						color: #666666;
						text-decoration:line-through;
						margin-left: 19rpx;
					}
					.cart {
						width: 41rpx;
						height: 41rpx;
						background: #FD5E2D;
						border-radius:50%;
						margin-right: 50rpx;
						.icon {
							color: #FFFFFF;
							font-size: 20rpx;
						}
					}
				}
				.gamePrice {
					margin-right: 20rpx;
					width:100rpx;
					height:30rpx;
					background:rgba(253,94,45,1);
					border-radius:15rpx;
					color: #FFFFFF;
					font-size: 14rpx;
				}
				.yuanPrice {
					color: #999999;
					font-size: 17rpx;
					text-decoration: line-through;
				}
				.line {
					height: 2rpx;
					background: #DDDDDD;
					margin-bottom: 31rpx;
				}
			}
		}
	}
</style>
