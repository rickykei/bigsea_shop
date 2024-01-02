<template>
   
  <div class="basic-setting-content pl16 pr16">
    <!--基本信息-->
    <div class="common-form">基本信息</div>
    <el-form-item label="會員名稱：" :rules="[{ required: true, message: '請填寫會員名' }]" prop="form.model.nickName">
      <el-input v-model="form.model.nickName" class="max-w460"></el-input>
    </el-form-item>
    <el-form-item label="Mobile/Tel：" :rules="[{ required: true, message: '會員電話' }]" prop="form.model.mobile">
       <el-input v-model="form.model.mobile" class="max-w460"></el-input>
    </el-form-item>
    <el-form-item label="收貨人名：" :rules="[{ required: true, message: '收貨人名' }]" prop="form.model.address.name">
        <el-input v-model="form.model.address.name" class="max-w460"></el-input>
    </el-form-item>
	<el-form-item label="收貨人電話：" :rules="[{ required: true, message: '收貨人電話' }]">
	  <el-input v-model="form.model.address.tel" class="max-w460"></el-input>
	</el-form-item>
	<el-form-item label="選地區" prop="form.model.address.region_id" :rules="[{required: true,message: 'Please select'}]">
	  <el-select v-model="form.model.address.district_id" placeholder="港九" @change="initDistrict">
	    <el-option :label="item.name" :value="item.id" v-for="(item,index) in areaListData" :key='index'></el-option>
	  </el-select>
	  <span></span>
	  <el-select v-if="form.model.address.district_id!=''" v-model="form.model.address.region_id" placeholder="區"  >
	    <el-option :label="item1.name" :value="item1.id"
	      v-for="(item1,index1) in areaListData[form.model.address.district_id]['region']" :key='index1'></el-option>
	  </el-select>
	  <span></span> 
	</el-form-item>
    <el-form-item label="地址：" :rules="[{ required: true, message: '地址' }]">
      <el-input v-model="form.model.address.address" class="max-w460"></el-input>
    </el-form-item>

  </div>
</template>

<script>
   
  // import draggable from 'vuedraggable';
  export default {
     
    data() {
      return {
        formData: {},
		areaList:[],
      };
    },
    inject: ['form'],
    created() {
       this.formData = this.form;
		this.areaListData =	this.areaList;
      // this['formData'] = this.form;
      
    },
    methods: {
		initDistrict() {
		  this.form.model.address.district_id = ''
		},
      
 
    }
  };
</script>

<style></style>
