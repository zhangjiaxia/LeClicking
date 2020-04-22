<template>
	<view>
		<!-- <view v-if="isShowLeftLine" class='leftLine'></view> -->
		<view class='itemTimeZ' v-for="(item, index) in content" :key="index">
			<!--  左边 -->
			<view class='rightContent'>
				<slot name="rightChilren"></slot>
				<!-- <block v-if="textArray.length > 0">
					<text v-for="(item, index) in textArray" :key="index" 
						:class="{curentTitle:isCurent,outTitle:!isCurent}">
						{{item}}
					</text>
				</block> -->
				<text :class="{curentTime:isCurent,outTime:!isCurent}">{{item.date}}</text>
			</view>
			 <!--  中间 -->
			<view class='leftView'>
				<view :class="{roundVIew: isCurent, outRoundVIew:!isCurent}"></view>
				<view v-if="isShowLeftLine" class='leftLine'></view>
			</view>
			<!-- 右边 -->
			<view class='rightContent'>
				<slot name="rightChilren"></slot>
				<text :class="{curentTitle:isCurent,outTime:!isCurent}">{{item.version}}</text>
				<text :class="{curentTime:isCurent,outTime:!isCurent}">{{item.detail}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		// options: {
		//     multipleSlots: true
		// },
		props: {
			isCurent:{
			  type: Boolean,
			  value: false
			},
			isShowLeftLine: {
			  type: Boolean,
			  value: true
			},
			// textArray:{
			//   type: Array,
			//   value:[]
			// }
			content: {
				type: Array,
				value: []
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.itemTimeZ{
	  display: flex;
	  flex:1;
	  padding:0px 15px 0 15px;
	}
	.leftView{
	  display: flex;
	  flex-direction: column;
	  margin-left: -190rpx;
	}
	.roundVIew{
	  width: 9px;
	  height: 9px;
	  border-radius: 4.5px;
	  background: red;
	}
	.outRoundVIew{
	  width: 15rpx;
	  height: 15rpx;
	  border-radius: 50%;
	  background: #676767;
	}
	.leftLine{
	  display: flex;
	  flex: 1;
	  width: 1px;
	  margin-left: 2.5px;
	  padding-bottom: 6px;
	  background: #CECECE;
	}
	.rightContent{
	  display: flex;
	  flex:1;
	  flex-direction: column;
	  margin-top: -6px;
	  margin-left: 15px;
	  padding-bottom: 24px;
	}
	.curentTitle{
	  font-size: 16px;
	  line-height: 22.5px;
	  color:#fe473c
	}
	.curentTime{
	  font-size: 14px;
	  color:#fe473c
	}
	.outTitle{
	  font-size: 16px;
	  line-height: 22.5px;
	  color:#999
	}
	.outTime{
	  font-size: 23rpx;
	  color: #343434;
	}
</style>
