//自定义工具库
const install = (Vue,vm) =>{
	// 如果没有token，跳转到登录页面(这里就类似导航守卫)
	const isLogin = () => {
		const token = vm.user.user_token
		if(!token){
			// 来自哪个页面
			const currentPage = getCurrentPages().pop()
			const {route,options} = currentPage
			uni.setStorageSync('back_url',route)
			uni.setStorageSync('back_path',options)
			// console.log(currentPage);
			uni.$u.toast('请登录')
			setTimeout(()=>{
				uni.$u.route({
					type:'redirect',
					url:'/pages/auth/login'
				})
			},1500)
			return false
		}else{
			return true
		}
	}
	
	const updataUserInfo= async()=>{
		// 更新vuex用户信息
		const userInfo = await vm.$API.reqGetUserInfo()
		vm.$u.vuex('user_info',userInfo)
	}
	
	vm.$u.utils = {
		isLogin,
		updataUserInfo
	}
}
//检查


export default {install}