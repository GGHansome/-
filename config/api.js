const http = uni.$u.http

// 获取首页数据的接口
// /api/index  get 
export const reqHomeInfoList = (params={})=> http.request({url:'/api/index',method:'get',params})

// 请求登录的接口
// /api/auth/login post
export const reqAuthLogin = (data) => http.request({url:'/api/auth/login',method:'post',data})

// 获取用户信息的接口
// /api/user get
export const reqGetUserInfo = () => http.request({url:'/api/user',method:'get'})

//用户注册的接口
///api/auth/register post
export const reqRegister = (data) =>http.request({url:'/api/auth/register',method:'post',data})

// 用户退户登录的接口
// /api/auth/logout post 
export const reqLogOut = () =>http.request({url:'/api/auth/logout',method:'post'})

// 获取商品列表的接口 get
// /api/goods get 
 export const reqGoodsList = (params={}) =>http.request({url:'/api/goods',method:'get',params})
 
// 获取商品详情的接口
// /api/goods/{good} 
export const reqGetGoodsDetail = (good) =>http.request({url:`/api/goods/${good}`,method:'get'})

// 商品取消或收藏的接口
// /api/collects/goods/{goods} post
export const reqIsCollect = (goods) =>http.request({url:`/api/collects/goods/${goods}`,method:'post'})

// 添加购物车的接口 post
// /api/carts post
export const reqAddCart = (data) =>http.request({url:'/api/carts',method:'post',data})

// 请求购物车列表 get 
// /api/carts get
export const reqCartList = (params={}) =>http.request({url:'/api/carts',method:'get',params})

// 修改头像前获取oss token的接口
// /api/auth/oss/token get
export const reqGetOssToken = () =>http.request({url:'/api/auth/oss/token',method:'get'})

// 更新用户信息接口
// /api/user put
export const reqUpdataUserInfo = (data) =>http.request({url:'/api/user',method:'put',data})

// 更新用户头像接口
// /api/user/avatar PATCH
// export const reqUpdataUserAva = (data) =>uni.$u.patch('/api/user/avatar',data)
export const reqUpdataUserAva = (data) =>http.request({url:'/api/user/avatar',method:'post',data})

// 用户收藏商品列表接口
// /api/collects get
export const reqUserCollect = (params) =>http.request({url:'/api/collects',method:'get',params})

// 获取购物车列表数据
// /api/carts get 
export const reqGoodsCart = () =>http.request({url:'/api/carts',method:'get',params:{include:'goods'}})

// 修改购物车商品数量的回调
// /api/carts/{cart} put 
export const reqUpdataGoodsNum = (cart,data) =>http.request({url:`/api/carts/${cart}`,method:'put',data})

// 修改购物车是否选中
// /api/carts/checked post
export const reqGoodsIsChecked = (data) =>http.request({url:`/api/carts/checked`,method:'patch',data})

// 移除购物商品的数据
// /api/carts/{cart} delete
export const reqDeleteGoods = (cart) =>http.request({url:`/api/carts/${cart}`,method:'delete'})






/* 
// api.js
 const install = (Vue){
 	Vue.prototype.$API.reqGetUserInfo = () => http.request({url:'/api/user',method:'get'})
 }
 
 export default {install}
 
 //main.js
 import $API from 'pages/config/api.js'
 Vue.use($API,app)
 
 Vue.use原理
 主要核心是通过apply方法将封装好的带有Vue的this指向的数组传递给install函数
 首先 Vue.use函数内部会将除了第一个参数以外的所有参数存放在一个数组里面，将Vue函数对象的this插入到数组第一个位置
 然后我们将传入的第一个参数标识为plugin，然后去执行plugin.install.applay方法，通过applay方法，将封装好的带有Vue
 的this指向的数组传递给install，就是plugin.install.apply(plugin,[this,...]),然后install内部就可以使用Vue对象
 上的方法以及传入的其他参数
 */
