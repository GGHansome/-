<template>
	<view>
		<!-- 加载页 -->
		<u-loading-page :loading="loading"></u-loading-page>
		<view class="goods-warpper" v-for="(item,index) in collectList" :key="item.id">
			<view class="goods-inner">
				<!-- 商品图片 -->
				<view class="img">
					<u-image :src="item.goods.cover_url" height="95px" width="95px"></u-image>
				</view>
				<!-- 商品信息 -->
				<view class="detail">
					<view class="title">{{item.goods.title}}</view>
					<view class="price">￥ {{item.goods.price}}</view>
					<view class="time">与{{item.created_at}}收藏</view>
				</view>
				<view class="heart" @click="clickHeart(index,item.goods_id)">
					<u-icon v-if="item.isCollect" name="heart-fill" color="#2979ff" size="28"></u-icon>
					<u-icon v-else name="heart" color="#2979ff" size="28"></u-icon>
				</view>
			</view>
			
		</view>
		<!-- 加载更多 -->
		<u-loadmore v-if="loadMore" class="loadMore" :status="status" :line="true" @loadmore="loadmoreEvent"/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				collectList:[], //收藏商品列表
				page:1 ,//当前页码
				loading:true,
				loadMore:false,
				status:'loadmore'
			}
		},
		 onLoad() {
			this.getCollectList()
		},
		async onReachBottom(){
			loadmoreEvent()
		},
		// 上拉刷新
		async onPullDownRefresh(){
			this.page = 1
			this.collectList = []
			await this.getCollectList()
			uni.stopPullDownRefresh()
		},
		methods: {
			// 获取收藏列表的方法
			async getCollectList(){
				const params = {page:this.page}
				this.status = 'loading'
				const result = await this.$API.reqUserCollect(params)
				// 给每个元素添加一个收藏标识
				result.data.forEach(item => {
					item.isCollect = true
				})
				this.collectList = [...this.collectList,...result.data]
				this.page = result.meta.pagination.current_page
				this.loading = false
				this.loadMore = true
				this.status = 'loadmore'
				if(!result.data.length){
					this.status = 'nomore'
				}
			},
			// 点击加载更多或触底时所触发的回调
			loadmoreEvent(){
				this.page++
				this.getCollectList()
			},
			// 收藏或取消收藏
			async clickHeart(index,id){
				this.collectList[index].isCollect = false
				await this.$API.reqIsCollect(id)
				this.$u.toast('取消收藏')
				this.collectList.splice(index,1)		
			}
		}
	}
</script>

<style lang="scss">
	.loadMore{
		transform: translateY(-20rpx);
	}
	.goods-warpper{
		padding: 20rpx 10rpx;
		.goods-inner{	
			position: relative;
			height: 200rpx;
			box-shadow:0 0 2px 3px rgba(207, 207, 207, 0.3);
			display: flex;
			padding: 10rpx;
			.img{
				border: 1px solid #e2dedc;
			}
			.detail{
				display: flex;
			  flex-direction: column;
				justify-content: space-between;
				.title{
					font-size: 36rpx;
					font-weight: bold;
				}
				.price{
					color: red;
				}
				.time{
					font-size: 24rpx;
					color: $u-light-color;
				}
			}
			.heart{
				position: absolute;
				right: 0;
				bottom: 0;
			}
		}
	}
</style>
