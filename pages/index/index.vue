<template>
	<view>
		<u-swiper :list="home.slides" keyName="img_url" height="160" indicator indicatorMode="line" circular></u-swiper>
		<u-sticky bgColor="#fff" class="tabs">
			<u-tabs :list="tags" @change="changeTags" 
				itemStyle="padding-left: 30px; padding-right:30px; height: 44px;"></u-tabs>
		</u-sticky>
				<u-row customStyle="margin-bottom: 5px" justify="space-around">
					<u-col span="5.5" v-for="(item,index) in home.goods.length?home.goods:6" :key="index">
						<!-- 商品信息 -->
						<goods-card v-show="!loading" :item="item"></goods-card>
						<!-- 骨架屏 -->
						<view style="width: 340rpx;margin-top: 20rpx;" v-show="loading">
							<u-skeleton class="skeleton" :loading="loading" titleWidth="100%" titleHeight="320rpx"></u-skeleton>
							<u-skeleton class="skeleton" :loading="loading" titleWidth="100%" ></u-skeleton>
							<view style="display: flex;">
								<u-skeleton style="margin-right: 100rpx;" :loading="loading" titleWidth="100%" ></u-skeleton>
								<u-skeleton :loading="loading" titleWidth="100%" ></u-skeleton>
							</view>
						</view>
					</u-col>
				</u-row>
			</view>
</template>

<script>
	import {reqHomeInfoList} from '../../config/api.js'
	export default {
		data() {
			return {
				page:1,  //当前请求商品数据的页码数
				current:0, //导航栏的标识
				loading:true,//控制骨架屏的显示与隐藏
				tags: [{
					name: '默认',
				}, {
					name: '销量',
				}, {
					name: '推荐'
				}, {
					name: '最新'
				}]
			}
		},
		onLoad() {
			this.getHomeData()
			
		},
		//触底的生命周期函数，带上分页的参数
		onReachBottom(){
			this.page ++
			this.getHomeData()
		},
		
		methods: {
			// 改变导回调航栏时触发的
			changeTags(current) {
				this.loading = true
				this.current = current.index
				this.home.goods = []
				this.page = 1
				this.getHomeData()
			},
			// 获取首页数据
			async getHomeData(){
				const params = {
					page:this.page
				}
				// 增加排序条件
				if(this.current === 1) params.sales = 1
				if(this.current === 2) params.recommend = 1
				if(this.current === 3) params.new = 1
				let data = await reqHomeInfoList(params)
				console.log(data);
				this.home.goods = [...this.home.goods,...data.goods.data] //商品信息
				this.home.slides = data.slides //轮播图数据
				this.loading = false
			}
		},
	}
</script>

<style lang="less">
	.tabs{
		display: flex;
		justify-content: space-around;
	} 
	.u-row{
		flex-wrap: wrap;
	}
	.skeleton{
		margin-bottom: 10rpx;
	}

	
	
</style>
