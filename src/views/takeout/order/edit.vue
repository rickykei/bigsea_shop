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
							<span class="gray9">訂單號：</span>
							{{ form.detail.order_id }}
						</div>
					</el-col>
					<el-col :span="5">
						<div class="pb16">
							<span class="gray9">買家：</span>
							{{ form.detail.user.nickName }}
							<span>用户ID：({{ form.detail.user.user_id }})</span>
						</div>
					</el-col>
					<el-col :span="5">
						<div class="pb16">
							<span class="gray9">訂單金額 (元)：</span>
							{{ form.detail.order_price }}
						</div>
					</el-col>
					<el-col :span="5" v-if="form.detail.express_price > 0">
						<div class="pb16">
							<span class="gray9">配送费 (元)：</span>
							{{ form.detail.express_price }}
						</div>
					</el-col>
					<el-col :span="5" v-if="form.detail.bag_price > 0">
						<div class="pb16">
							<span class="gray9">包装费 (元)：</span>
							{{ form.detail.bag_price }}
						</div>
					</el-col>
					<el-col :span="5">
						<div class="pb16" v-if="form.detail.coupon_money > 0">
							<span class="gray9">优惠券抵扣 (元)：</span>
							{{ form.detail.coupon_money }}
						</div>
					</el-col>
					<el-col :span="5">
						<div class="pb16" v-if="form.detail.points_money > 0">
							<span class="gray9">积分抵扣 (元)：</span>
							{{ form.detail.points_money }}
						</div>
					</el-col>
					<el-col :span="5">
						<div class="pb16" v-if="form.detail.fullreduce_money > 0">
							<span class="gray9">满减金额 (元)：</span>
							{{ form.detail.fullreduce_money }}
						</div>
					</el-col>
					<el-col :span="5">
						<div class="pb16">
							<span class="gray9">实付款金额 (元)：</span>
							{{ form.detail.pay_price }}
						</div>
					</el-col>
					<el-col :span="5">
						<div class="pb16">
							<span class="gray9">支付方式：</span>
							{{ form.detail.pay_type.text }}
						</div>
					</el-col>
					
					
					<el-col :span="5">
						<div class="pb16">
							<span class="gray9">配送状态：</span>
							{{ form.detail.deliver_text }}
						</div>
					</el-col>
				
					<el-col :span="5">
						<div class="pb16">
							<span class="gray9">交易状态：</span>
							{{ form.detail.order_status.text }}
						</div>
					</el-col>
					<el-col :span="5"
						v-if="form.detail['pay_status']['value'] == 10 && form.detail['order_status']['value'] == 10 && form.detail['order_source'] == 10"
						v-auth="'/takeout/order/updatePrice'">
						<el-button @click="editClick(form.detail)" size="small">修改价格</el-button>
					</el-col>
					<el-col :span="5">
						<div class="pb16">
							<span class="gray9">配送方式：</span>
							{{ form.detail.delivery_type.text }}
						</div>
					</el-col>
					<el-col :span="5">
						<div class="pb16">
							<span class="gray9">車：</span>
							<el-select v-model="form.detail.table_no" placeholder="車" @change="">
									<el-option :label="item.label" :value="item.id" 
									v-for="(item,index) in car_array" :key='index'>
									</el-option>
							</el-select>
							 
						</div>
					</el-col>
					<el-col :span="50"> 
					<div class="pb16">
							<span class="gray9">提貨時間：</span>
						  
						      <el-date-picker size="small" v-model="create_time" type="date" value-format="YYYY-MM-DD" ></el-date-picker>
						  </div>
					</el-col>
					<el-col :span="5"><div class="pb16">
						<span class="gray9">上午下午：</span>
						 
							  
								<el-select size="small" v-model="ampm" placeholder="请选择">
								  <el-option v-for="(item, index) in ampm_range" :key="index" :label="item.label" :value="item.id">
								  </el-option>
								</el-select>
							 </div>
						 
					</el-col>
					
				</el-row>
			</div>
			<!--商户信息-->
			<div class="common-form mt16">门店信息</div>
			<div class="table-wrap">
				<el-row>
					<el-col :span="5">
						<div class="pb16">
							<span class="gray9">门店名称：</span>
							{{ form.detail.supplier.name }}
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
							<p>x <el-input type="number" v-model="scope.row.total_num" style="width:10%"></el-input> </p>
						</template>
					</el-table-column>
					<el-table-column prop="total_price" label="商品總價(元)">
						<template #default="scope">
							<p>$ {{ scope.row.total_price }}</p>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<!--收货信息-->
			<div v-if="form.detail.delivery_type.value == 10">
				<div class="common-form mt16">配送信息</div>
				<div class="table-wrap">
					<el-row>
						<el-col :span="5">
							<div class="pb16">
								<span class="gray9">联系人：</span>
								{{ form.detail.address.name }}
							</div>
						</el-col>
						<el-col :span="5">
							<div class="pb16">
								<span class="gray9">联系电话：</span>
								{{ form.detail.address.phone }}
							</div>
						</el-col>
						<el-col :span="9">
							<div class="pb16">
								<span class="gray9">联系地址：</span>
								{{ form.detail.address.detail }}{{ form.detail.address.address }}
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="25">
							<div class="pb16">
								<span class="gray9">备注：</span>
								{{ form.detail.buyer_remark }}
							</div>
						</el-col>
					</el-row>
				</div>
			</div>

			<!--自提门店信息-->
			<template v-if="form.detail.delivery_type.value == 20">
				<div class="common-form mt16">自提用户信息</div>
				<div class="table-wrap" v-if="form.detail.extract">
					<el-row>
						<el-col :span="5">
							<div class="pb16">
								<span class="gray9">联系电话：</span>
								{{ form.detail.extract.phone }}
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="25">
							<div class="pb16">
								<span class="gray9">备注：</span>
								{{ form.detail.buyer_remark }}
							</div>
						</el-col>
					</el-row>
				</div>
			</template>

			<!--付款信息-->
			<div class="table-wrap" v-if="form.detail.pay_status.value == 20">
				<div class="common-form mt16">付款信息</div>
				<div class="table-wrap">
					<el-row>
						<el-col :span="5">
							<div class="pb16">
								<span class="gray9">应付款金额：</span>
								{{ form.detail.pay_price }}
							</div>
						</el-col>
						<el-col :span="5">
							<div class="pb16">
								<span class="gray9">支付方式：</span>
								{{ form.detail.pay_type.text }}
							</div>
						</el-col>
						<el-col :span="5">
							<div class="pb16">
								<span class="gray9">支付流水号：</span>
								{{ form.detail.transaction_id }}
							</div>
						</el-col>
						<el-col :span="5">
							<div class="pb16">
								<span class="gray9">付款状态：</span>
								{{ form.detail.pay_status.text }}
							</div>
						</el-col>
						<el-col :span="5">
							<div class="pb16">
								<span class="gray9">付款时间：</span>
								{{ form.detail.pay_time }}
							</div>
						</el-col>
						<el-col :span="5" v-if="detail.refund_money>0">
							<div class="pb16">
								<span class="gray9">退款金额：</span>
								{{ form.detail.refund_money }}
							</div>
						</el-col>
					</el-row>
				</div>
			</div>

			<!--发货信息-->
			<div v-if="form.detail.delivery_type.value == 10">
				<div>
					<div class="common-form mt16">发货信息</div>
					<div class="table-wrap">
						<el-row>
							<el-col :span="5">
								<div class="pb16">
									<span class="gray9">发货状态：</span>
									{{ form.detail.delivery_status.text }}
								</div>
							</el-col>
						</el-row>
					</div>
				</div>
			</div>

			<!--取消信息-->
			<div class="table-wrap" v-if="form.detail.order_status.value == 20 && form.detail.cancel_remark != ''">
				<div class="common-form mt16">取消信息</div>
				<div class="table-wrap">
					<el-row>
						<el-col :span="5">
							<div class="pb16">
								<span class="gray9">商家备注：</span>
								{{ form.detail.cancel_remark }}
							</div>
						</el-col>
					</el-row>
				</div>
			</div>

			<!--门店自提核销-->
			<div
				v-if="form.detail.delivery_type.value == 20 && form.detail.pay_status.value == 20 && form.detail.order_status.value != 21 && form.detail.order_status.value != 20">
				<div class="common-form mt16">门店自提核销</div>
				<div class="table-wrap">
					<template>
						<el-row>
							<el-col :span="5">
								<div class="pb16">
									<span class="gray9">核销状态：</span>
									<template v-if="form.detail.delivery_status.value == 20">
										已核销
									</template>
									<template v-else>
										未核销
									</template>
								</div>
							</el-col>
							<el-col :span="5" v-if="form.detail.delivery_time">
								<div class="pb16">
									<span class="gray9">核销时间：</span>
									{{ form.detail.delivery_time }}
								</div>
							</el-col>
						</el-row>
					</template>
				</div>
			</div>
		</div>
		<div class="common-button-wrapper">
			<el-button size="small" type="info" @click="cancelFunc">返回上一页</el-button>
		</div>
	</div>
	</el-form>
</template>

<script>
	import OrderApi from '@/api/order.js';
	 
	import { deepClone, } from '@/utils/base.js';
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
						order_id: 0,
						pay_status: [],
						pay_type: [],
						delivery_type: [],
						user: {},
						address: [],
						new_address: [],
						product: [],
						new_product: [],
						order_status: [],
						extract: [],
						delivery_status: [],
						supplier: {
							name: ''
						}
					},
					category: {},
					
				},
				user_data: {},
				create_time: '',
				ampm: '',
				 car_array:  [{label:'YR897',id:'YR897'},{label:'YG5976',id:'YG5976'},{label:'自提',id:'selfpick'}],
				 ampm_range: [{label: '上午',id:'09:00'},{label:'下午',id: '14:00'}],
			};
		},
		created() {
			/*获取列表*/
			this.getParams();
		},
		methods: {
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
				 
			},
			delIndex(n) {
			 
			  //this.form.model.product_attr.splice(n, 1);
			  this.form.detail.product.splice(n,1);
			},
			next() {
				if (this.active++ > 4) this.active = 0;
			},
			/*获取参数*/
			getParams() {
				let self = this;
				// 取到路由带过来的参数
				const params = this.$route.query.order_id;
				OrderApi.takeOrderdetail({
							order_id: params
						},
						true
					)
					.then(data => {
						self.loading = false;
						self.form = data.data;
						self.ampm = self.form.detail.mealtime.substr(-5, 5);
						self.create_time = self.form.detail.mealtime.substr(0, 10);
					})
					.catch(error => {
						self.loading = false;
					});
					
			 
			},
			/*取消*/
			cancelFunc() {
				this.$router.back(-1);
			},

		}
	};
</script>
<style></style>