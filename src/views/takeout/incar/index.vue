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
				<el-form-item label="上貨日期">
					<div class="block">
						<span class="demonstration"></span>
						<el-date-picker size="small" v-model="searchForm.incar_time" type="date"
							value-format="YYYY-MM-DD"></el-date-picker>
					</div>
				</el-form-item>

				<el-form-item>
					<el-button size="small" @click.stop="onSubmit()">查询</el-button>
					<el-button size="small" target="_blank" @click.stop="addClick()" v-auth="'/takeout/incar/add'">輸入車單</el-button>

				</el-form-item>
			</el-form>
		</div>
		<!--内容-->
		<div class="table-wrap">
			<el-table size="small" :data="tableData.data" border style="width: 100%" v-loading="loading">
				<el-table-column prop="incar_id" label="入車單ID" width="180"></el-table-column>
				<el-table-column prop="incar_time" label="入車日" width="180"></el-table-column>
				<el-table-column prop="car_no" label="車號" width="180"></el-table-column>
				 <el-table-column fixed="right" label="操作" width="200">
				   <template #default="scope" >
				     <div v-if="!scope.row.is_top_row"> 
				 	 <el-button @click="editClick(scope.row.incar_id)" type="text" size="small" v-auth="'/takeout/incar/edit'">Edit
				 	 </el-button>
					 </div>
				   </template>
				 </el-table-column>
			</el-table>
		</div>

	</div>
</template>

<script>
	import InCarApi from '@/api/incar.js';
	import Cancel from './dialog/cancel.vue';
	import qs from 'qs';
	import {
		useUserStore
	} from '@/store';
	const {
		token
	} = useUserStore();
	export default {
		components: {
			Cancel
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
					incar_time: '',
					ampm: '09:00',
				},
				
				/*时间*/
				create_time: '',
				/*是否打开编辑弹窗*/
				open_edit: false,
				/*当前编辑的对象*/
				car_no: 0, 
				token,
				 deliver_source: [{label:'YR897',id:'YR897'},{label:'YG5976',id:'YG5976'},{label:'自提',id:'PICK'}],
			};
		},
		created() {
			/*获取列表*/
			this.getData();
			this.loading = false;
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
				InCarApi.getInCarList(Params, true)
					.then(res => {

						let list = [];
						for (let i = 0; i < res.data.list.length; i++) {
							let item = res.data.list[i];
							//item.product_content = this.strippedHtml(item.product_content);
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
			/*打开添加*/
			addClick() {
				let self = this;
				let params = self.searchForm; 
				self.$router.push({
					path: '/takeout/incar/add',
					query: {
						car_no: params.car_no,
						incar_time: params.incar_time
					}
				});
			},
			/*打开edit page*/
			editClick(incar_id) {
				let self = this;
			 
				self.$router.push({
					path: '/takeout/incar/edit',
					query: {
						incar_id: incar_id, 
					}
				});
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