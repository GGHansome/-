<template>
	<view class="u-p-l-20">
		<u-form :model="form" ref="uForm" labelWidth="150rpx">
			<u-form-item label="昵称" borderBottom>
				<u-input v-model="form.name" placeholder="请输入昵称" />
			</u-form-item>
			<u-form-item label="修改头像">
				<!-- <oss-upload @upSuccess="upSuccess"></oss-upload> -->
				<u-upload :fileList="fileList1" @beforeRead="beforeRead" @afterRead="afterRead"  @delete="deletePic" name="1" :maxCount="1" >
				</u-upload>
			</u-form-item>
		</u-form>
		<view class="u-flex u-m-t-20">
			<u-button @click="submit" type="primary" shape="square" size="medium">提交</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		onReady() {
			// 拿到用户vuex的信息
			this.form.name = this.user.user_info.name
		},
		data() {
			return {
				form: {
					name: '',
					avatar: ''
				},
				fileList1: [],
			};
		},
		methods: {
			click(){
				console.log(this.action,'action');
				console.log(this.formData,'formData');
				console.log(this.upFileName,'upFileName');
				
			},
			// 节流
			submit() {
				this.$u.throttle(this.submitNo(), 3000)
			},
			// 拿到子组件上传图片成功事件
			// upSuccess(data){
			// 	// 图片上传成功后 保存图片key
			// 	this.form.avatar=data
			// },

			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise(async (resolve, reject) => {
					// 设置唯一文件名
						const file=this.fileList1[0]
						const fileName=file.name
						const suffix=fileName.slice(fileName.lastIndexOf("."))
						const upFileName=this.$u.guid(20)+suffix
						this.form.avatar = upFileName
						// 请求获取oss-token的api
						const oss= await this.$API.reqGetOssToken()
					uni.uploadFile({
						url: oss.host, // 仅为示例，非真实的接口地址
						filePath: url,
						// name: upFileName,
						formData:{
							key: upFileName,
							policy: oss.policy,
							OSSAccessKeyId: oss.accessid, 
							success_action_status: '200', //让服务端返回200,不然，默认会返回204
							signature: oss.signature,
						},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},


			// 提交
			async submitNo() {
				// 更新昵称
				if (this.form.name&&this.form.name !== this.user.user_info.name) {
					// 准备参数
					const params = {
						name: this.form.name
					}
					// 调用更新用户信息接口
					await this.$API.reqUpdataUserInfo(params)
					// 更新用户信息
					this.$u.utils.updataUserInfo()
					this.$u.toast("更新信息成功")
				}
				// 更新头像
				if (this.form.avatar) {
					const params = {
						avatar: this.form.avatar
					}
					// 发送更改头像请求
					await this.$API.reqUpdataUserAva(params)
					// 更新缓存数据
					this.$u.utils.updataUserInfo()
					this.$u.toast("更新头像成功")
				}
				setTimeout(()=>{
					this.$u.route({
						type:'reLaunch',
						url:'/pages/center/center'
					})
				},1500)
				
			}
		}
	}
</script>

<style lang="scss">

</style>
