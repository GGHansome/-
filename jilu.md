骨架屏uview2进行了重构，虽然说更方便自定义，但感觉没1好用。。
注册页面用了validate表单验证,话说2标的必填的旁边的小红星怎么没了
上传头像部分uview2也进行了重构封装了uniapp的uploadFile方法
感觉2版本像是一个还在测试的版本，1里面的模板资源和内置样式都没了，所以我自己对商品分类和购物车进行了重写
商品分类页面布局进行了全设备的响应式，购物车页面优化了点击复选框异步所导致的延迟勾选
uview封装的vuex确实好用，自己也用首页数据和用户数据做了下测试，进行了模块化管理
2里的http封装也更接近axios了(感觉就是一样。。)