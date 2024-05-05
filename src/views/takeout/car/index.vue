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
               <el-form-item label="提貨日期">
                 <div class="block">
                   <span class="demonstration"></span>
                   <el-date-picker size="small" v-model="searchForm.create_time" type="date" value-format="YYYY-MM-DD" ></el-date-picker>
                 </div>
               </el-form-item>
       	  <el-form-item label="上午/下午">
       		<el-select size="small" v-model="searchForm.ampm" placeholder="请选择">
       		  <el-option v-for="(item, index) in ampm_range" :key="index" :label="item.label" :value="item.id">
       		  </el-option>
       		</el-select>
       	  </el-form-item>
        <el-form-item>
			 
			  <el-button size="small"  @click.stop="onSubmit()">查询</el-button>
			 
          <el-button size="small" target="_blank" @click.stop="downloadPdf2()" > 
		PDF
	 </el-button>  
	    
        </el-form-item>
      </el-form>
    </div>
    <!--内容-->
   <div class="table-wrap">
     <el-table size="small" :data="tableData.data" border style="width: 100%" v-loading="loading">
       <el-table-column prop="product_name" label="產品名" width="180"></el-table-column>
       <el-table-column prop="product_content" label="產品描述" width="280"></el-table-column>
	 
	   <el-table-column prop="total_num" label="件數" width="280"></el-table-column>
	   <el-table-column prop="product_unit" label="單位" width="280"></el-table-column>
     </el-table>
   </div>
   
  </div>
</template>

<script>
  import useDownloadPdf from '@/components/file/DownloadPdfButton.vue';
  import CarApi from '@/api/car.js';
  import Cancel from './dialog/cancel.vue';
  import qs from 'qs';
  import { useUserStore } from '@/store';
  const { token } = useUserStore();
  export default {
    components: {
      Cancel,    
	  useDownloadPdf
    },
	filters: {
	        strippedHtml(arg) {
				let regex = /(<([^>]+)>)/ig;
	            return arg.replace(regex, "a");
	        }
	    }, 
    data() {
      return {
	 activeName: 'all',
	 /*是否加载完成*/
	 loading: true,
	 /*列表数据*/
	 tableData: [],
	 /*一页多少条*/
	 pageSize: 20,
	 /*一共多少条数据*/
	 totalDataNumber: 0,
	 /*当前是第几页*/
	 curPage: 1,
       
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
      // this.getData();
	  this.loading=false;
    },
	setup() {
	    
	 
	  },
    methods: { 
		
		strippedHtml(arg) {
			let regex = /(<([^>]+)>)/ig;
		    return arg.replace(regex, "");
		},
		/*获取列表*/
		getData() {
			 
		  let self = this;
		  let Params = this.searchForm;
		  Params.dataType = self.activeName;
		  Params.page = self.curPage;
		  Params.list_rows = self.pageSize;
		  self.loading = true;
		  CarApi.getCarlist(Params, true)
		    .then(res => {
		    
		     let list = [];
		     for (let i = 0; i < res.data.list.length; i++) {
		       let item = res.data.list[i];
				item.product_content=   this.strippedHtml(item.product_content);
				item.total_num = parseInt(item.incar_qty_am)+parseInt(item.incar_qty_pm);
		       list.push(item);
		     }
		      self.tableData.data = list;
		      //self.order_count = res.data.order_count.order_count;
		      self.loading = false;
		    })
		    .catch(error => {});
		},
     /*搜索查询*/
     onSubmit() { 
       this.getData();
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
	  carPickUpList: function() {
	     
	  		 
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
