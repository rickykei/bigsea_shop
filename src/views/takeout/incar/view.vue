<template>
  <el-form size="small" ref="form" :model="form" label-width="180px" :loading="loading">
	<div class="pb50" v-loading="loading">
		<div class="product-content">
			<!--基本信息-->
			<div class="common-form">基本信息</div>
			<div class="table-wrap">
				<el-row>
				 <el-col :span="5">
				 	<div class="pb16">
				 		<span class="gray9">入車id：</span>
				 		{{ form.detail.incar_id}}
				 	</div>
				 </el-col>
					<el-col :span="5">
						<div class="pb16">
							<span class="gray9">入車日：</span>
							{{ form.detail.incar_time}}
						</div>
					</el-col>
					<el-col :span="5">
						<div class="pb16">
							<span class="gray9">車牌：</span>
							{{ form.detail.car_no }}
						</div>
					</el-col> 
				</el-row>
			</div>			 
			<!--商品信息-->
			<div class="common-form mt16">商品信息</div>
			<div class="p-0-30 mb18">
			  <div class="d-s-c"> 添加商品: <div class="blue ml30" @click="addProdRow">添加商品+</div>
			  </div>
			</div>
			<div class="table-wrap">
				<el-table size="small" :data="form.detail.product" border style="width: 100%">
					// ricky add del 20240211
					<el-table-column prop="product_id" label="刪去" width="50">
						<template #default="scope">
							<el-button class='mr16 mb20' size="mini" icon="Delete" circle @click="delIndex(scope.$index)"></el-button>
						</template>
					</el-table-column>
					<el-table-column prop="product_name" label="商品" width="450">
						<template #default="scope"> 
							<div class="product-info">
								 <div class="info">
									  
										<div class="name">	
											<el-select v-model="scope.row.category_id" placeholder="分類" @change="changeCat($event,scope.$index)">
													<el-option :label="item.name" :value="item.category_id" 
													v-for="(item,index) in form.category" :key='index'>
													</el-option>
											</el-select>
											
											<el-select v-if="scope.row.category_id!=''" v-model="scope.row.product_id" placeholder="產品名"
											@change="changeProd($event,scope.$index,scope.row.category_id)" >
												<el-option :label="item1.product_name" :value="item1.product_id"
													v-for="item1 in form.category[scope.row.category_id]['products']"
													:key='item1.product_id'>
												</el-option>
											</el-select> 
								 {{scope.row.product_id}}
									  </div>
									
								
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="remaining" label="上天車上餘貨">
						<template #default="scope">
							 <p>{{scope.row.remaining}} </p>
						</template>
					</el-table-column>
					<el-table-column prop="total_num" label="訂貨數量">
						<template #default="scope">
							 <p>{{scope.row.total_num}} </p>
						</template>
					</el-table-column>
					<el-table-column prop="incar_qty_am" label="入貨數量(AM)">
						<template #default="scope">
							<p>x <el-input type="number" v-model="scope.row.incar_qty_am" style="width:50%" @change="calTotal(scope.$index)"></el-input> </p>
						</template>
					</el-table-column>
					<el-table-column prop="incar_qty_pm" label="入貨數量(PM)">
						<template #default="scope">
						 
							<p>x <el-input type="number" v-model="scope.row.incar_qty_pm" style="width:50%" @change="calTotal(scope.$index)"></el-input> </p>
						</template>
					</el-table-column>
					<el-table-column prop="diff" label="相差">
						<template #default="scope"> 
							<p>{{ scope.row.diff}} </p>
						</template>
					</el-table-column>
				</el-table>
			</div> 
		<!--提交-->
		 
	  </div>
	</div>
 </el-form>
</template>

<script>
	import IncarApi from '@/api/incar.js';  
	import { deepClone,formatModel2 } from '@/utils/base.js';
	export default {
		components: {},
		data() {
			return {
				active: 0,
				/*是否加载完成*/
				loading: true,
				/*订单数据*/
				form: {
					detail: {
						incar_id: 0,
						incar_time: '',
						car_no: '',
						product: [],
					},
					category: {},
					
				},
				user_data: {}, 
				 incar_time: '',
				 incar_id: 0,
				 car_no: '', 
				 ampm_range: [{label: '上午',id:'09:00'},{label:'下午',id: '14:00'}],
				 /*模型数据*/
				 model: {
				  car_no: '',
				  incar_time: '',
				  incar_id: '',
				  product: [{
				  	incar_product_id: 0,
				  	product_id: 0,
				  	total_num: 0, 
					incar_qty_am: 0,
					incar_qty_pm: 0,
					diff:0,
				  }],
				 },
			};
		},
		created() {
			 
			this.incar_id = this.$route.query.incar_id;
			console.log(this.incar_id);
			this.getParams();
			 
		},
		methods: {
			calTotal(index){
				  
				this.form.detail.product[index].diff =(parseInt(this.form.detail.product[index].remaining)+parseInt(this.form.detail.product[index].incar_qty_pm)+parseInt(this.form.detail.product[index].incar_qty_am))-parseInt(this.form.detail.product[index].total_num);
				
			},
			addProdRow() {
			  if (this.form.detail.product == '') {
			    this.form.detail.product = []
			  }
			  this.form.detail.product.push({
			    product_name: '',
			    product_id: 94,
				category_id: 0,
				incar_qty_pm: 0,
				incar_qty_am: 0,
				diff: 0,
				remaining: 0,
				total_num:0,
			  })
			},
			changeCat(selCatId,index){
				 
				//alert(item);
				//this.form.detail.product[pid].product_id=item.product_id;
				//this.form.detail.product[pid].line_price=item.line_price;
				//this.form.detail.product[pid].product_name=item.product_name;
			},
			changeProd(selProdId,index,catId){
			 
				this.form.detail.product[index].product_id=this.form.category[catId].products[selProdId].product_id;
			 	this.form.detail.product[index].product_name=this.form.category[catId].products[selProdId].product_name;
				  
			},
			delIndex(n) {
			  
			  this.form.detail.product.splice(n,1);
			 
			},
			 
			/*获取参数*/
			getParams() {
				let self = this;
				
				// 取到路由带过来的参数
				  
				//alert(incar_time);
				let params = [];
				params.incar_id =self.incar_id;
			 
 			  	  IncarApi.getInCarDetailByIncarId({
							incar_id: params.incar_id,
						},
						true
					)
					.then(data => {
						self.loading = false;
						self.form = data.data;
					})
					.catch(error => {
						self.loading = false;
					});    
					 
					
			},
			/*提交*/
			onSubmit: function() {
			  let self = this;
			  let params = self.form.detail;
		  
				self.$refs.form.validate(valid => {
					 let params = formatModel2(self.model, self.form.detail);
			    if (valid) {
					 let params = formatModel2(self.model, self.form.detail);
					// params.product2 = formatModel(self.model.product, self.form.detail.product);
			      self.loading = true;
				  
				  //data message before submit  
			      IncarApi.setInCarDetailByIncarId({
					  params: JSON.stringify(params)
			        }, true)
			        .then(data => {
			          self.loading = false;
			          ElMessage({
			            message: '更新成功',
			            type: 'success'
			          });
			          //self.$router.push('/takeout/order/index');
					    this.$router.back(-1);
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
<style></style>