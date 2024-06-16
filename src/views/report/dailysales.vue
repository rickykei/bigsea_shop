<template>

	<div class="user">
		<!--搜索表单-->
		<div class="common-seach-wrap">
			<el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
<el-form-item label="車號">
					<el-select size="small" v-model="searchForm.car_no" placeholder="请选择">
						<el-option v-for="(item, index) in deliver_source" :key="index" :label="item.label"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			 
		<el-form-item label="報表日期">
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker size="small" v-model="searchForm.create_time" type="daterange" value-format="YYYY-MM-DD"
              range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期"></el-date-picker>
          </div>
        </el-form-item>
				<el-form-item>
					<el-button size="small" @click.stop="onSubmit()">查询</el-button>
				 <el-button size="small" target="_blank" @click.stop="downloadPdf2()" >
				 		PDF
				 </el-button>  
				</el-form-item>
			</el-form>
		</div>
		 <!--内容-->
		 <div class="table-wrap">
		   <el-table size="small" :data="tableData.data" border style="width: 100%" v-loading="loading">
			   <el-table-column prop="pay_time" label="日" ></el-table-column>
			   <el-table-column prop="table_no" label="車號" ></el-table-column> 
		 	   <el-table-column prop="total_price" label="現金" ></el-table-column>
		 	   
		   </el-table>
		 </div>
	 <!--分页-->
	 <div class="pagination">
	   <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
	     :current-page="curPage" :page-size="pageSize" layout="total, prev, pager, next, jumper"
	     :total="totalDataNumber"></el-pagination>
	 </div>
	  
	</div>
</template>

<script>
 
	import qs from 'qs';
	import ReportApi from '@/api/report.js';
	import useDownloadPdf from '@/components/file/DownloadPdfButton.vue';
	import {
		useUserStore
	} from '@/store';
	const {
		token
	} = useUserStore();
	export default {
		components: { 
		  useDownloadPdf
		},
		 
		data() {
			return {
				activeName: 'all',
				/*是否加载完成*/
				loading: true,
				/*列表数据*/
				tableData: [],
				/*一页多少条*/
				pageSize: 15,
				/*一共多少条数据*/
				totalDataNumber: 0,
				/*当前是第几页*/
				curPage: 1,

				searchForm: { 
					create_time: '', 
				},
				 deliver_source: [{label:'YR897',id:'YR897'},{label:'YG5976',id:'YG5976'},{label:'自提',id:'PICK'}],
				/*时间*/
				create_time: '',
				/*是否打开编辑弹窗*/
				 
				car_no: 0, 
				token,
				  
				 
			};
		},
		created() {
			/*获取列表*/
			this.getData();
			this.loading = false;
		},

		methods: {
			/*选择第几页*/
			handleCurrentChange(val) {
			  let self = this;
			  self.curPage = val;
			  self.getData();
			},
			
			/*每页多少条*/
			handleSizeChange(val) {
			  this.curPage = 1;
			  this.pageSize = val;
			  this.getData();
			},
			
			/*切换菜单*/
			handleClick(tab, event) {
			  let self = this;
			  self.curPage = 1;
			  self.getData();
			},
			downloadPdf2: function() {
			  const { downloadPdf } = useDownloadPdf();
					this.searchForm.list_rows=10000000;
					let baseUrl = window.location.protocol + '//' + window.location.host;
					this.searchForm.token = this.token;
					if(process.env.NODE_ENV==='development')
					 this.pdfUrl = baseUrl + '/api/index.php/shop/report.dailysales/export?' + qs.stringify(this.searchForm);
					else
					 this.pdfUrl = baseUrl + '/index.php/shop/report.dailysales/export?' + qs.stringify(this.searchForm);
			 
			 
					return downloadPdf(this.pdfUrl);
			},
			carPickUpList: function() {
			   
					 
					return downloadPdf(this.pdfUrl);
			},
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
				ReportApi.getDailySales(Params, true)
					.then(res => {

						let list = [];
						for (let i = 0; i < res.data.list.data.length; i++) {
							let item = res.data.list.data[i]; 
							list.push(item);
						 
						}
						self.tableData.data = list;
						self.totalDataNumber = res.data.list.total;
						self.loading = false;
					})
					.catch(error => {});
			},
			/*搜索查询*/
			onSubmit() {
				this.getData();
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