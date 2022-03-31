<template>
	<navigator class="good-wrapper" :url='`/pages/goods/detail?id=${item.id}`'>
		<image class="good-img" :src="item.cover_url" mode=""></image>
		<view class="title">
			<text class="u-line-1">{{item.title}}</text>
		</view>
		<view class="detail">
			<view class="price">￥ {{item.price}}</view>
			<view class="salenum">销量:{{item.sales}}</view>
		</view>
	</navigator>
</template>

<script>
	export default {
		name:"goods-card",
		props:['item'],
		data() {
			return {
			};
		},
	}
</script>

<style lang="less">
.good-wrapper{
		box-shadow: 0 5px 10px 0 rgba(0,0,0,.3);
		padding: 7.5px;
		margin-top: 10px;
		.good-img{
			width: 100%;
			height: 300rpx;
		}
		.title{
			font-weight: bold;
			margin: 5px 0;
		}
		.detail{
			display: flex;
			justify-content: space-between;
			.price{
				font-size: 14px;
				color: red;
				font-weight: bold;
			}
			.salenum{
				font-size: 12px;
				color: #cccccc;
			}
		}
	}
</style>
