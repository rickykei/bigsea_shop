<template>
  <!--
      作者：luoyiming
      时间：2019-10-25
      描述：订单列表
  -->
  <div class="user">
    <!--搜索表单-->
    <div class="common-seach-wrap">
      <el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
         
        <el-form-item label="車號">
          <el-select size="small" v-model="searchForm.car_no" placeholder="请选择"> 
            <el-option v-for="(item, index) in deliver_source" :key="index" :label="item.label" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提貨時間">
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker size="small" v-model="searchForm.create_time" type="date" value-format="YYYY-MM-DD" ></el-date-picker>
          </div>
        </el-form-item>
	  <el-form-item label="上午下午">
		<el-select size="small" v-model="searchForm.ampm" placeholder="请选择">
		  <el-option v-for="(item, index) in ampm_range" :key="index" :label="item.label" :value="item.id">
		  </el-option>
		</el-select>
	  </el-form-item>
        <el-form-item>
          <el-button size="small" target="_blank" @click.stop="downloadPdf2()" > 
		PDF
	 </el-button>  
	    
        </el-form-item>
      </el-form>
    </div>
    <!--内容-->
     
   
  </div>
</template>

<script>
  import useDownloadPdf from '@/components/file/DownloadPdfButton.vue';
  import TakeOutApi from '@/api/takeout.js';
  import Cancel from './dialog/cancel.vue';
  import qs from 'qs';
  import { useUserStore } from '@/store';
  const { token } = useUserStore();
  export default {
    components: {
      Cancel,    
	  useDownloadPdf
    },
    data() {
      return {
	 
        /*是否加载完成*/
        loading: true, 
        searchForm: {
          car_no: '',
          deliver_source: '',
          create_time: '',
		  ampm: '09:00',
        },
        /*时间*/
        create_time: '',
        /*是否打开编辑弹窗*/
        open_edit: false,
        /*当前编辑的对象*/
        car_no: 0,
        deliver_id: 0,
        deliver_source: [{label:'YR897',id:'YR897'},{label:'YG5976',id:'YG5976'},{label:'自提',id:'PICK'}],
		ampm_range: [{label: '上午',id:'09:00'},{label:'下午',id: '14:00'}],
		token,
      };
    },
    created() {
      /*获取列表*/
     
    },
	setup() {
	    
	 
	  },
    methods: { 
     
      /*打开添加*/
      detailClick(row) {
        let self = this;
        let params = row.deliver_id;
        self.$router.push({
          path: '/takeout/deliver/detail',
          query: {
            deliver_id: params
          }
        });
      },
      /*确认送达*/
      verifyClick(row) {
        let self = this;
        ElMessageBox.confirm('此操作将确认送达, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.loading = true;
          TakeOutApi.verify({
              deliver_id: row.deliver_id
            }, true)
            .then(data => {
              self.loading = false;
              if (data.code == 1) {
               ElMessage({
                  message: '恭喜你，操作成功',
                  type: 'success'
                });
                self.getData();
              }
            })
            .catch(error => {
              self.loading = false;
            });

        }).catch(() => {
          self.loading = false;
        });
      },
    
      
      downloadPdf2: function() {
	    const { downloadPdf } = useDownloadPdf();
		
		let baseUrl = window.location.protocol + '//' + window.location.host;
		this.searchForm.token = this.token;
		if(process.env.NODE_ENV==='development')
		 this.pdfUrl = baseUrl + '/api/index.php/shop/takeout.car/export?' + qs.stringify(this.searchForm);
		else
		 this.pdfUrl = baseUrl + '/index.php/shop/takeout.car/export?' + qs.stringify(this.searchForm);
	   
	   console.log(this.pdfUrl);
		return downloadPdf(this.pdfUrl);
      },
     
     
    }
  };
</script>
<style lang="scss">
  .product-info {
    padding: 10px 0;
    border-top: 1px solid #eeeeee;
  }

  .order-code .state-text {
    padding: 2px 4px;
    border-radius: 4px;
    background: #808080;
    color: #ffffff;
  }

  .order-code .state-text-red {
    background: red;
  }

  .table-wrap .product-info:first-of-type {
    border-top: none;
  }

  .table-wrap .el-table__body tbody .el-table__row:nth-child(odd) {
    background: #f5f7fa;
  }
</style>
