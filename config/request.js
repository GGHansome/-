// 此vm参数为页面的实例，可以通过它引用vuex中的变量
module.exports = (vm) => {
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		/* config 为默认全局配置*/
		config.baseURL = 'https://api.shop.eduwork.cn'; /* 根域名 */
		return config
	})

	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
		// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
		config.data = config.data || {}

		// if (vm.access_token) {
		config.header.Authorization = 'Bearer ' + vm.user.user_token
		// }
		return config
	}, config => { // 可使用async await 做异步操作
		return Promise.reject(config)
	})

	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
		/* 对响应成功做点什么 可使用async await 做异步操作*/
		// 响应状态吗
		const {
			statusCode,
			data
		} = response
		if (statusCode < 400) {
			return data
		}
	}, (response) => {
		// 对响应错误做点什么 （statusCode !== 200）
		const {
					statusCode,
					data
				} = response
				if (statusCode == 400) {
					// 错误的请求
					uni.$u.toast(data.message);
				} else if (statusCode == 401) {
					// 401的情况有两种，一种是认证未通过，一种是没有token或者过期
					// 密码错误情况
					if(data.message == "Unauthorized"){
						uni.$u.toast('账号或密码错误');
					}else{
						// token过期，未登录权限
						uni.$u.toast('身份过期，请重新登录');
						setTimeout(()=>{
								uni.$u.route('/pages/user/login')
						},1500)
					}
				} else if (statusCode == 422) {
					// 参数没有填写
					uni.$u.toast(Object.values(data.errors)[0][0]);
				} else {
					uni.$u.toast("请求超时")
				}
				
		return Promise.reject(response)
	})
	
	// 封装patch请求
	// uni.$u.patch = (url, data = {}, config = {}) => {
	// 		// 模拟patch请求
	// 		const _data = {
	// 			...data,
	// 			_method: 'PATCH'
	// 		}
	// 		return uni.$u.http.post(url, _data, config)
	// 	}
}
