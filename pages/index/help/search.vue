<template>
	<view>
		<view class="uni-flex uni-row vertical linebar">
			<view class="uni-flex uni-row rest vertical keyword">
				<text class="iconfont .icon-search search"></text>
				<input type="text" placeholder="搜索软件/硬件" :focus="focus" style="width: 100%;" v-model="keyword" @confirm="turn" />
			</view>
			<view class="uni-flex cancel" @click="$turnPage('1', 'navigateBack')">取消</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	import interfaceurl from '@/utils/interface.js'
	export default {
		computed: mapState(['key']),
		data() {
			return {
				focus: true,
				keyword: '' //关键词
			}
		},
		onLoad() {
			this.keyword = this.key;
		},
		methods: {
			turn() {
				this.$store.commit('setKey', this.keyword);
				this.$turnPage('../../shop/index?key=' + this.keyword, 'switchTab');
			}
		}
	}
</script>

<style lang="scss">
	.linebar {
		height: 65rpx;
		margin: 0 20rpx;
		.search {
			margin-right: 20rpx;
		}
		.keyword {
			border-bottom: 1px solid #dddddd;
			color: #999999;
		}
		.cancel {
			color: #fd5e2d;
			font-size: 26rpx;
		}
	}
</style>
