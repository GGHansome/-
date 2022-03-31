<template>
	<view>
		<template v-if="user.user_token">
			<u-loading-page :loading="loading"></u-loading-page>
			<view class="goods-wrapper" v-for="(item,index) in cartList" :key="item.id">
				<!-- 左侧复选框 -->
				<view class="left-check">
					<u-checkbox-group>
						<u-checkbox shape="circle" size="20" :checked="Boolean(goodsChecked[index])" @change="(val)=>isCheckGoods(val,item.id)"></u-checkbox>
					</u-checkbox-group>
				</view>
				<!-- 右侧商品详情 -->
				<view class="right-detail">
					<!-- 商品图片 -->
					<view class="img-wrapper">
						<image :src="item.goods.cover_url" class="goods-img"></image>
					</view>
					<!-- 商品信息 -->
					<view class="goods-detail">
						<!-- 书籍名称 -->
						<view class="title">{{item.goods.title}}</view>
						<!-- 数据描述 -->
						<view class="descript">{{item.goods.description}}</view>
						<!-- 书籍库存 -->
						<view class="num-out">
							<view class="num-inner">
								库存:<text class="num">{{item.goods.stock}}</text>
							</view>
						</view>
						<!-- 价格，步进器以及删除 -->
						<view class="detail-wrapper">
							<!-- 价格 -->
							<view class="price">￥{{item.goods.price}}</view>
							<!-- 步进器 -->
							<u-number-box  :min="1" :max="item.goods.stock" v-model="item.num" :name="item.id" @change="changeGoodsNum" disabledInput></u-number-box>
							<!-- 删除icon -->
							<view @click="deleteGoods(item.id)"><u-icon name="trash-fill" color="red" size="28"></u-icon></view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 底部价格框 -->
			<view class="totalPrice">
				<view class="total-wrapper">
					 <u-checkbox-group>
						<u-checkbox label="全选" shape="circle" size="20" :checked="isCheckedAll" @change="changeAll"></u-checkbox>
					</u-checkbox-group>
					<view class="textOuter">
					 <text class="text">合计</text>
					 <text class="price">￥{{totalPrice}}</text>
					</view>
					<button type="primary" size="large" @click="click">去结算</button>
				</view>		  
			</view>
		</template>
		<u-empty v-else text="暂未登入" mode="permission"></u-empty>
	</view>
</template>

<script>
	// 解决异步勾选延迟问题的关键是不要通过服务器返回的数据来更新视图
	export default {
		data() {
			return {
				cartList:[],
				cartId:[], //购物车ID,用来标识某个商品的勾选状态
				allCartId:[], // 用来全选和取消全选的购物车id备份
				goodsChecked:[],//goods复选框的标识，用来全选的时候解决异步勾选延迟问题
				loading:true,
				show:false ,//模态框的标识
			}
		},
		onShow() {
			if(this.user.user_token){
				this.getGoodsCart()
			}
		},
		computed:{
			//判断全选复选框的状态
			isCheckedAll(){
				return this.cartList.length === this.cartId.length
			},
			totalPrice(){
				return this.cartList.reduce((pre,item)=>{
					let onePrice = 0
					if(item.is_checked){
						onePrice = item.num*item.goods.price
					}
					return pre+onePrice
				},0)
			}
			
		},
		methods: {
			// 获取购物车列表的回调
			async getGoodsCart(){
				let result = await this.$API.reqGoodsCart()
				// 每次切回购物车页面重新请求数据需要把原本的标识id置空，防止累加造成数据重复(当然这里用set集合数组去重也可以)
				this.cartId = []
				this.allCartId = []
				this.goodsChecked = []
				////////////////////////////
				this.loading = false
				this.cartList = result.data
				result.data.forEach(item=>{
					this.allCartId.push(item.id)
					this.goodsChecked.push(item.is_checked)
					if(item.is_checked){
						this.cartId.push(item.id)
					}
				})
				console.log(result);
			},
			// 修改复选框的回调
			async isCheckGoods(val,id){
				if(val){
					// 通过循环修改本地商品选中的状态
					this.cartList.forEach(item=>{
						if(item.id === id){
							item.is_checked = 1
						}
					})
					this.cartId.push(id)
				}else{
					// 通过循环修改本地商品选中的状态
					this.cartList.forEach(item=>{
						if(item.id === id){
							item.is_checked = 0
						}
					})
					//从数组中过滤出未选中的商品id
					this.cartId = this.cartId.filter(item=>{
						return item!==id
					})
				}
				await this.$API.reqGoodsIsChecked({cart_ids:this.cartId})
			},
			// 修改步进器时的回调
			async changeGoodsNum(msg){
				await this.$API.reqUpdataGoodsNum(msg.name,{num:msg.value})
			},
			// 全选和取消全选的回调
			async changeAll(msg){
				if(msg){
					// 修改全部商品的状态
					this.cartList.forEach(item=>{
							item.is_checked = 1
					})
					// 将全部商品状态切换为全选
					for(let i=0;i<this.goodsChecked.length;i++){
						this.goodsChecked.splice(i,1,1)
					}
					await this.$API.reqGoodsIsChecked({cart_ids:this.allCartId})
				}else{
					this.cartList.forEach(item=>{
							item.is_checked = 0
					})
					// 将全部商品状态切换为全不选
					for(let i=0;i<this.goodsChecked.length;i++){
						this.goodsChecked.splice(i,1,0)
					}
					await this.$API.reqGoodsIsChecked({cart_ids:[]})				
				}
			},
			// 删除icon的回调
			deleteGoods(id){
				uni.showModal({
					content: '确定要删除此商品吗？',
					success: async (res) => {
						if (res.confirm) {
							this.cartList = this.cartList.filter(item=>{
								return item.id !== id
							})
							this.cartId = this.cartId.filter(item=>{
								return item.id !== id
							})
							await this.$API.reqDeleteGoods(id)
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},
			click(){
				console.log(this.cartList);
				console.log(this.cartId);
				
			}
		}
	}
</script>

<style lang="less">
	page{
		padding-bottom: 54px;
	}
	.goods-wrapper{
		display: flex;
		height: 220rpx;
		padding: 14rpx;
		align-items: center;
		.left-check{
			width: 10%;
		}
		.right-detail{
			display: flex;
			background-color: #FBFAFB;
			padding: 10rpx;
			width: 90%;
			.img-wrapper{
				.goods-img{
					height: 100px;
					width: 100px;
				}
			}
			.goods-detail{
				width: 100%;
				.title{
					font-size: 32rpx;
					font-weight: bold;
				}
				.descript{
					font-size: 24rpx;
					color: #cccccc;
				}
				.num-out{
					display: flex;
					flex-direction: column;
					font-size: 24rpx;
					color: #cccccc;
					.num-inner{
						align-self: flex-end;
						.num{
							color: red;
						}
					}
					
				}
				.detail-wrapper{
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-top: 30rpx;
					.price{
						font-weight: bold;
						color: red;
					}
				}
			}
		}
	}
	.totalPrice{
		position: fixed;
		bottom: 50px;
		height: 80rpx;
		/*#ifdef MP-WEIXIN*/
		bottom:0;
		z-index:999;
		height: 100rpx;
		/* #endif */	
		width: 100%;
		padding: 14rpx;
		background-color: #f8f8f8;
		.total-wrapper{
			display: flex;
			align-items: center;
			.textOuter{
				margin-left: 100px;
				/*#ifdef MP-WEIXIN*/
				margin-left: 80px;
				/* #endif */
				.text{
					font-weight: bold;
				}
				.price{
					color: red;
					font-weight: bold;
				}
			}
		}
	}
</style>
