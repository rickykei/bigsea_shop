<template>
 
  <el-dialog title="会员編輯" v-model="dialogVisible" @close='dialogFormVisible' :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
      <el-form size="small" ref="form" :model="form" label-width="180px" :loading="loading">
      	<!--基础信息-->
      	<div class="basic-setting-content pl16 pr16">
      		 <el-form-item label="公司Id：" :rules="[{ required: true, message: '請填寫會員名' }]" prop="model.user.user_id">
      		 	{{form.model.user.user_id}}
      		 </el-form-item>
      		<el-form-item label="公司名稱：" :rules="[{ required: true, message: '請填寫會員名' }]" prop="model.user.nickName">
      			<el-input v-model="form.model.user.nickName" class="max-w460"></el-input>
      		</el-form-item>
      		<el-form-item label="公司Mobile/Tel：(login_id)" :rules="[{ required: true, message: '請填寫Mobile' }]" prop="model.user.mobile">
      			<el-input v-model="form.model.user.mobile" class="max-w460"></el-input>
      		</el-form-item>
      		<el-form-item label="收貨人名：" :rules="[{ required: true, message: '收貨人名' }]" prop="model.user.address.name">
      			<el-input v-model="form.model.user.address.name" class="max-w460"></el-input>
      		</el-form-item>
      		<el-form-item label="收貨人電話：" :rules="[{ required: true, message: '收貨人電話' }]" prop="model.user.address.phone">
      			<el-input v-model="form.model.user.address.phone" class="max-w460"></el-input>
      		</el-form-item>
      		<el-form-item label="選地區" :rules="[{required: true,message: ''}]" prop="model.user.address.province_id">
      			<el-select v-model="form.model.user.address.province_id" placeholder="省" @change="initCity">
      				<el-option :label="item.name" :value="item.id" v-for="(item,index) in form.model.region"
      					:key='index'></el-option>
      			</el-select>
      			<span></span>
      			<el-select v-if="form.model.user.address.province_id!=''" v-model="form.model.user.address.district_id"
      				placeholder="港九" @change="initRegion">
      				<el-option :label="item1.name" :value="item1.id"
      					v-for="(item1,index1) in form.model.region[form.model.user.address.province_id]['city']"
      					:key='index1'></el-option>
      			</el-select>
      			<span></span>
      			<el-select v-if="form.model.user.address.district_id!=''" v-model="form.model.user.address.region_id"
      				placeholder="區">
      				<el-option :label="item2.name" :value="item2.id"
      					v-for="(item2,index2) in form.model.region[form.model.user.address.province_id]['city'][form.model.user.address.district_id]['region']"
      					:key='index2'></el-option>
      			</el-select>
      		</el-form-item>
      		<el-form-item label="地址：" :rules="[{ required: true, message: '地址' }]" prop="model.user.address.address">
      			<el-input v-model="form.model.user.address.address" class="max-w460"></el-input>
      		</el-form-item>
      
      	</div>
       
      </el-form>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
    <div class="dialog-footer">
      <el-button @click="dialogFormVisible">取 消</el-button>
      <el-button type="primary"  @click="onSubmit"  :loading="loading">提交</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
  import UserApi from '@/api/user.js';
  export default {
	  provide: function() {
	  	return {
	  		form: this.form
	  	}
	  },
    data() {
      return {
        loading: false,
        /*左边长度*/
        formLabelWidth: '120px',
        /*是否显示*/
        dialogVisible: false,
        /*默认选中*/
        activeName: 'first',
        form: {
        	model: {
        		user:{
						user_id: '',
        				nickName: '',
        				mobile: '',
						address: {
							address_id: '',
							name: '',
							phone: '',
							province_id:'',
							district_id: '',
							region_id: '',
						    address:'',
						}, 
        		},  
				region: [],
        	},
        	
        },  
        source: 0,
      };
    },
    props: ['open_edit','form2'],
    created() {
      this.dialogVisible = this.open_edit; 
	  	this.getBaseData();
    },
    methods: {

      /*选中*/
      handleClick(tab, event) {
        this.source = tab.index;
      },
      initCity() {
      	this.form.model.user.address.district_id = ''
      },
      initRegion() {
      	this.form.model.user.address.region_id = ''
      },
      /*获取region数据*/
      getBaseData: function() {
      	let self = this;
      	UserApi.takeGetEditUserAddress({
			 user_id: self.form2.user_id,
		}, true)
      		.then(res => {
      			self.loading = false;
      			Object.assign(self.form.model, res.data);
			 
      			 	//	console.log("------");
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
								user_id: self.form2.user_id,
								params: JSON.stringify(params)
							}, true)
							.then(data => {
								self.loading = false;
								ElMessage({
									message: '更改用戶及地址成功',
									type: 'success'
								});
								self.dialogFormVisible(true);
								self.$router.push('/user/user/index');
							})
							.catch(error => {
								self.loading = false;
							});
							 
					}
				});
			},

      /*关闭弹窗*/
      dialogFormVisible(e) {
        if (e) {
          this.$emit('closeDialog', {
            type: 'success',
            openDialog: false
          })
        } else {
          this.$emit('closeDialog', {
            type: 'error',
            openDialog: false
          })
        }
      }

    }
  };
</script>

<style></style>
