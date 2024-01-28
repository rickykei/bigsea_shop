<template>
	<div class="user-add">
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" label-width="180px" :loading="loading">
			<!--基础信息-->
			<div class="basic-setting-content pl16 pr16">
				<!--基本信息-->
				<div class="common-form">基本信息</div>
				<el-form-item label="公司名稱：" :rules="[{ required: true, message: '請填寫會員名' }]" prop="model.user.nickName">
					<el-input v-model="form.model.user.nickName" class="max-w460"></el-input>
				</el-form-item>
				<el-form-item label="公司Mobile/Tel：(login_id)" :rules="[{ required: true, message: '請填寫Mobile' }]" prop="model.user.mobile">
					<el-input v-model="form.model.user.mobile" class="max-w460"></el-input>
				</el-form-item>
				<el-form-item label="收貨人名：" :rules="[{ required: true, message: '收貨人名' }]" prop="model.address.name">
					<el-input v-model="form.model.address.name" class="max-w460"></el-input>
				</el-form-item>
				<el-form-item label="收貨人電話：" :rules="[{ required: true, message: '收貨人電話' }]" prop="model.address.phone">
					<el-input v-model="form.model.address.phone" class="max-w460"></el-input>
				</el-form-item>
				<el-form-item label="選地區" :rules="[{required: true,message: ''}]" prop="model.address.province_id">
					<el-select v-model="form.model.address.province_id" placeholder="省" @change="initCity">
						<el-option :label="item.name" :value="item.id" v-for="(item,index) in form.region"
							:key='index'></el-option>
					</el-select>
					<span></span>
					<el-select v-if="form.model.address.province_id!=''" v-model="form.model.address.district_id"
						placeholder="港九" @change="initRegion">
						<el-option :label="item1.name" :value="item1.id"
							v-for="(item1,index1) in form.region[form.model.address.province_id]['city']"
							:key='index1'></el-option>
					</el-select>
					<span></span>
					<el-select v-if="form.model.address.district_id!=''" v-model="form.model.address.region_id"
						placeholder="區dd">
						<el-option :label="item2.name" :value="item2.id"
							v-for="(item2,index2) in form.region[form.model.address.province_id]['city'][form.model.address.district_id]['region']"
							:key='index2'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="地址：" :rules="[{ required: true, message: '地址' }]" prop="model.address.address">
					<el-input v-model="form.model.address.address" class="max-w460"></el-input>
				</el-form-item>

			</div>
			<!--提交-->
			<div class="common-button-wrapper">
				<el-button size="small" type="info" @click="cancelFunc">取消</el-button>
				<el-button size="small" type="primary" @click="onSubmit" :loading="loading">发布</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
	import UserApi from '@/api/user.js';
	//	import select_region from '@/utils/select.region.js';
	export default {

		data() {
			return {
				/*是否正在加载*/
				loading: false,
				/*form表单数据*/
				form: {
					model: {
						user:{
								user_id: 0,
								nickName: '',
								mobile: '',
						}, 
						address: {
							address_id:0,
							user_id:0,
							address: '',
							name: '',
							phone: '',
							district_id: '',
							province_id: '',
							region_id: '',

						},


					},
					region: [],
				}, 

			};
		},
		provide: function() {
			return {
				form: this.form
			}
		},
		created() {

			/*获取基础数据*/
			this.getBaseData();

		},
		methods: {
			initCity() {
				this.form.model.address.city_id = ''
			},
			initRegion() {
				this.form.model.address.region_id = ''
			},
			/*获取region数据*/
			getBaseData: function() {
				let self = this;
				UserApi.takeGetEditUserAddress({}, true)
					.then(res => {
						self.loading = false;
						Object.assign(self.form, res.data);
						//		console.log("------");
						//	console.log(self.form.region['1']['city']);
					})
					.catch(error => {
						self.loading = false;
					});
			},

			/*提交*/
			onSubmit: function() {
				let self = this;
				let params = self.form.model;
				self.$refs.form.validate(valid => {


					if (valid) {
						//console.log('form check valid');
						 
						self.loading = true;
						UserApi.takeEditUserAddress({
								params: JSON.stringify(params)
							}, true)
							.then(data => {
								self.loading = false;
								ElMessage({
									message: '添加用戶及地址成功',
									type: 'success'
								});
								self.$router.push('/user/user/index');
							})
							.catch(error => {
								self.loading = false;
							});
							 
					}
				});
			},

			/*取消*/
			cancelFunc() {
				this.$router.back(-1);
			}

		}
	};
</script>

<style lang="scss" scoped>
	.basic-setting-content {}

	.product-add {
		padding-bottom: 100px;
	}
</style>