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
									 <span
									 	:class="{'text-d-line':scope.row.is_user_grade==1,'gray6':scope.row.is_user_grade!=1}">$
									 	{{ scope.row.line_price }}</span>
									 <span class="ml10" v-if="scope.row.is_user_grade==1">
									 	会员折扣价：$ {{ scope.row.grade_product_price }}
									 </span>
									  </div>
								
								
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="total_num" label="數量">
						<template #default="scope">
							<p>x <el-input type="number" v-model="scope.row.total_num" style="width:50%" @change="calTotal"></el-input> </p>
						</template>
					</el-table-column>
					<el-table-column prop="total_price" label="商品總價(元)">
						<template #default="scope">
							<p>$ {{ scope.row.total_price }}</p>
						</template>
					</el-table-column>
				</el-table>
			</div> 
		<!--提交-->
		<div class="common-button-wrapper">
		  <el-button size="small" type="info" @click="cancelFunc">取消</el-button>
		  <el-button size="small" type="primary" @click="onSubmit" :loading="loading">发布</el-button>
		</div>
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
						product: []
					},
					category: {},
					
				},
				user_data: {},
				create_time: '',
				ampm: '',
			 
				 ampm_range: [{label: '上午',id:'09:00'},{label:'下午',id: '14:00'}],
				 /*模型数据*/
				 model: {
				  order_id: 0,
				  user_id: 0,
				  total_price: 0,
				  order_price: 0,
				  pay_price: 0,
				  table_no: '',
				  mealtime: '',
				  product: [{
				  	order_product_id: 0,
				  	product_id: 0,
				  	total_num: 0, 
				  }],
				 },
			};
		},
		created() {
			/*获取列表*/
			this.getParams();
		},
		methods: {
			calTotal(){
				 
				this.form.detail.order_price=this.form.detail.product.reduce(
					(total,item)=>{
						item.total_price=item.line_price * item.total_num;
						
						return total + item.total_price;
						
						},
					0
					); 
				this.form.detail.pay_price=	this.form.detail.order_price;
				this.form.detail.total_price=	this.form.detail.order_price;
			},
			addProdRow() {
			  if (this.form.detail.product == '') {
			    this.form.detail.product = []
			  }
			  this.form.detail.product.push({
			    product_name: '',
			    product_id: 94,
				category_id: 0,
				line_price:0,
				product_price:0,
				total_price:0,
				total_pay_price:0,
				total_num:1,
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
				this.form.detail.product[index].line_price=this.form.category[catId].products[selProdId].line_price;
				this.form.detail.product[index].product_price=this.form.category[catId].products[selProdId].product_price;
				this.form.detail.product[index].product_name=this.form.category[catId].products[selProdId].product_name;
				this.form.detail.product[index].total_price=this.form.category[catId].products[selProdId].line_price*this.form.detail.product[index].total_num;
				this.form.detail.product[index].total_pay_price=this.form.detail.product[index].total_price;
				this.calTotal();
			},
			delIndex(n) {
			 
			  //this.form.model.product_attr.splice(n, 1);
			  this.form.detail.product.splice(n,1);
			  this.calTotal();
			},
			next() {
				if (this.active++ > 4) this.active = 0;
			},
			/*获取参数*/
			getParams() {
				let self = this;
				
				// 取到路由带过来的参数
				const car_no = this.$route.query.car_no;
				const incar_time = this.$route.query.incar_time;
				this.form.detail.car_no=car_no;
				this.form.detail.incar_time=incar_time;
				//alert(incar_time);
				let params = [];
				params.car_no =car_no;
				params.incar_time=incar_time;
				
 			  	IncarApi.getInCarDetailByIncarTimeCarno({
							car_no: params.car_no,
							incar_time: params.incar_time,
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
			  self.form.detail.mealtime=self.create_time+" "+self.ampm;
			  
			  
			  
				self.$refs.form.validate(valid => {
					 let params = formatModel2(self.model, self.form.detail);
			    if (valid) {
					 let params = formatModel2(self.model, self.form.detail);
					// params.product2 = formatModel(self.model.product, self.form.detail.product);
			      self.loading = true;
				  
				  //data message before submit 
				  
			      OrderApi.takeSetOrderdetail({
					  order_id: this.form.detail.order_id,
			          params: JSON.stringify(params)
			        }, true)
			        .then(data => {
			          self.loading = false;
			          ElMessage({
			            message: '修改成功',
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