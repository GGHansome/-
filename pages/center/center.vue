<template>
	<view>
		<view class="user-box">
			<!-- 头像 -->
			<view class="avatar">
				<u-avatar :src="user.user_info.avatar_url" size="140rpx" @click="isShowAvatar=true"></u-avatar>
				<u-overlay :show="isShowAvatar" @click="isShowAvatar = false" v-if="disableAvatar">
					<view class="preAvaWarp">
						<image :src="user.user_info.avatar_url" shape="circle" style="height: 200px;width: 200px;"></image>
					</view>
				</u-overlay>
			</view>
			
			<!-- 用户信息 -->
			<view class="userInfo" v-if="isUserInfo">
				<view class="userName">{{user.user_info.name}}</view>
				<view>
					<text class="email">邮箱: {{user.user_info.email}}</text>
					<br>
					<text class="small">创建日期:{{user.user_info.created_at}}</text>
				</view>
			</view>
			<view v-else  @click="$u.utils.isLogin()">
				<view>未登录</view>
			</view>
		</view>
		
		<u-cell-group>
			<u-cell icon="account" title="修改信息" size="large" isLink @click="updateMsg"></u-cell>
			<u-cell icon="star" title="商品收藏" size="large" isLink @click="showCollect"></u-cell>
		</u-cell-group>

		<view v-if="isUserInfo">
			<u-button type="error" :ripple="true" @click="isShowLoginout=true" style="margin-top: 20rpx;">退出登录</u-button>
		</view>
		<!-- 退出登录模态框 -->
		<u-modal :show="isShowLoginout" content="确定退出登录吗？" :showCancelButton="true" @confirm="loginOut" @cancel="isShowLoginout=false; disableAvatar=false"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShowLoginout:false,
				isShowAvatar:false, //是否预览头像标识
				disableAvatar:false //控制遮罩层的显示与隐藏
			}
		},
		onLoad() {
			// 判断是否处于登录状态、如果未登录跳转登录页
			// this.$u.utils.isLogin()
			// 如果已经登录，拿取信息
			// this.userInfo=this.vuex_user
			if(this.user.user_token) this.disableAvatar = true
		},
		computed:{
			// 检查是否有用户信息
			isUserInfo(){
				return Object.keys(this.user.user_info).length
			}
		},
		methods: {
			// 点击修改信息
			updateMsg(){
				if(!this.$u.utils.isLogin()){}// 如果没有登录先去登录
				else{
					this.$u.route('/pages/center/modifyInfo')
				}
			},
			// 点击查看收藏
			showCollect(){
				if(!this.$u.utils.isLogin()){}// 如果没有登录先去登录
				else{
					this.$u.route('/pages/center/goodsCollect')
				}
			},
			// 确定退出登录
			async loginOut(){
				// 请求api
				await this.$API.reqLogOut()
					// 清除缓存token和用户信息
					this.$u.vuex("user_token",'')
					this.$u.vuex("user_info",{})
					// 跳转首页
					this.$u.route({type:"reLaunch",url:"pages/index/index"})
				
			}
			
		}
	}
</script>

<style scoped lang="scss">
page{
	background-color: #ededed;
}
.u-cell{
	background-color: #fff;
	margin-top: 20rpx;
}
.user-box{
	display: flex;
	padding: 40rpx;
	background-color: #fff;
	.preAvaWarp{
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.userInfo{
		margin-left:20rpx;
		.userName{
			font-size: 40rpx;
			font-weight: bold;
			padding-bottom: 10rpx;
		}
		.email{
			color: $u-tips-color;
			font-size: 28rpx;
		}
		.small{
			color: $u-light-color;
			font-size: 24rpx;
		}
	}
}
</style>
