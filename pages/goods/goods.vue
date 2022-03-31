<template>
	<view style="height: 100%;">
		<!-- 加载页 -->
		<u-loading-page :loading="loading"></u-loading-page>
		<!--头部搜索栏 -->
		<view class="search">
			<u-search v-model="search" :show-action="true" actionText="搜索" @search="searchGoods" @custom="searchGoods"></u-search>
		</view>
		<view class="wrapper">
			<!-- 左侧滚动栏 -->
			<scroll-view scroll-y="false" class="scroll-left">
				<!-- 书籍方向 -->
				<view v-for="(catgory,index) in categories" :key="catgory.id"> 
					<!-- 方向名称 -->
					<view class="bookDir">{{catgory.name}}</view>
					<!-- 种类名称 -->
					<view class="bookCat" v-for="(item,index) in catgory.children" :key="item.id">
						<view @click="clickSlideBar(item.id)" :style="item.id === currentId?bookCatStyle:''">{{item.name}}</view>
					</view>
				</view>
			</scroll-view>
			<!-- 右侧商品栏 -->
			<scroll-view v-if="this.sign === 0" scroll-y="true" class="scroll-right" @scrolltolower="toLower" >
				<view class="goods-wrapper">
					<u-row>
						<u-col span="6" v-for="(goods,index) in goodsList" :key="index">
							<navigator class="goods" :url='`/pages/goods/detail?id=${goods.id}`'>
								<image class="goods-img" :src="goods.cover_url" mode=""></image>
								<text class="title u-line-1">{{goods.title}}</text>
							</navigator>
						</u-col>
						<!-- 加载更多 -->
						<u-loadmore v-if="loadMore" class="loadMore" :status="status" :line="true" @loadmore="loadmoreEvent"/>
					</u-row>
				</view>
			</scroll-view>
			<u-empty v-if="this.sign === 2" text="暂无商品" mode="list" class="empty"></u-empty>
			<u-loading-icon v-if="this.sign === 1" text="加载中" textSize="18" class="loading"></u-loading-icon>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsList:[],
				categories:[],
				search:'',//搜索的关键字
				// 点击侧边栏时候的样式改变
				bookCatStyle:{
					backgroundColor:"#FFFFFF",
					fontWeight:"bold"
				},
				currentId:0, //点击时书籍分类名称时的下标
				params:{
					page:1
				},
				loading:true,
				loadMore:false, //是否显示加载更多
				status:'loadmore', //加载更多的状态
				sign:-1, //用来标识 商品显示0 商品加载1 与 商品为空2
			}
		},
		onLoad() {
			this.getGoodsInfo()
		},
		methods: {
			async getGoodsInfo(){
				this.status = 'loading'
				const result = await this.$API.reqGoodsList(this.params)
				this.categories = result.categories
				this.goodsList = [...this.goodsList,...result.goods.data]
				this.params.page = result.goods.current_page
				this.loading = false
				this.loadMore = true
				this.sign = 0
				this.status = 'loadmore'
				if(!result.goods.data.length) this.status = 'nomore'
				if(!this.goodsList.length) this.sign = 2
				console.log(result);
			},
			// 点击侧边栏事件
			clickSlideBar(id){
				this.currentId = id
				this.params.category_id = id
				this.sign = 1
				this.goodsList = []
				this.getGoodsInfo()
			},
			// 加载更多事件
			loadmoreEvent(){
				this.params.page++
				this.getGoodsInfo()
			},
			// scroll-view触底
			toLower(){
				this.status = 'loading'
				this.loadmoreEvent()
			},
			//搜索的回调
			searchGoods(){
				this.sign = 1
				this.params.title = this.search
				this.params.page = 1
				this.goodsList = []
				this.getGoodsInfo()
			}
		}
	}
</script>

<style lang="less">
	
	.u-row{
		flex-wrap: wrap;
		padding: 10px;
		padding-bottom: 0;
		background-color: #FFFFFF;
	}
	.row{
		justify-content: center;
	}
	page{
		background-color: #FAFAFA;
		height: 100%;
		overflow: hidden;
	}
	.search{
		padding:20rpx 10rpx;
		background-color: #FFFFFF;
	}
	.wrapper{
		display: flex;
		height: 100%;
	}
	.scroll-left{
		height:100%;
		width: 25%;
		box-sizing: border-box;
		padding-bottom: 54px; //根据tabBar的高度进行微调
		background-color:#F6F6F6 ;
		
		.bookDir{
			background-color:#ef3f3f ;
			color: #FFFFFF;
			font-weight: bold;
			padding: 14rpx;
		}
		.bookCat{
			line-height: 50px;
			text-align: center;
			font-size: 13px;
			border-bottom: 1px #e3e3e3 solid;
		}
	}
	.empty,.loading{
		box-sizing: border-box;
		margin: 0 auto;
		padding-bottom: 54px;
	}
	.scroll-right{
		width: 75%;
		height: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		padding-bottom: 54px; //根据tabBar的高度进行微调
		.goods-wrapper{
			height: 100%;
			.goods{
				display: flex;
				flex-direction: column;
				align-items: center;
				padding-bottom: 40rpx;
				.goods-img{
					height: 60px;
					width: 60px;
				}
				.title{
						font-size: 13px;
						font-weight: bold;
				}
			}
		}
	}
</style>
