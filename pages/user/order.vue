<template>
  <div class="personal-order">
    <div class="title">订单管理</div>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-form :inline="true">
          <el-form-item label="被保人：">
            <el-select v-model="searchObj.patientId" placeholder="请选择被保人" class="v-select patient-select">
              <el-option v-for="item in patientList" :key="item.id" :label="item.name + '【' + item.certificatesNo + '】'"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单状态：" style="margin-left: 80px">
            <el-select v-model="searchObj.orderStatus" placeholder="全部" class="v-select patient-select"
              style="width: 200px">
              <el-option v-for="item in statusList" :key="item.status" :label="item.comment" :value="item.status">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="search-button v-link highlight clickable selected" @click="fetchData()">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <div class="table">
          <el-empty description="描述文字" v-show="list.length ==0"></el-empty>
          <el-table :data="list" stripe style="width: 100%;" v-show="list.length !=0">
            <!-- <el-table-column label="就诊时间" width="120">
              <template slot-scope="scope">
                {{ scope.row.reserveDate }}
                {{ scope.row.reserveTime === 0 ? "上午" : "下午" }}
              </template>
            </el-table-column> -->
            <el-table-column type="index" width="80" label="序号" align="center">
            </el-table-column>
            <el-table-column prop="insurance_id" label="保险ID" align="center">
              <template slot-scope="scope">
                <el-link>{{ scope.row.insurance_id }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="payment_type" label="支付方式" width="200" align="center">
            </el-table-column>
            <el-table-column prop="amount" label="支付金额（元）" width="150" align="center">
            </el-table-column>
            <el-table-column prop="create_time" label="订单时间" align="center" width="180">
              <template slot-scope="scope">
                {{ scope.row.create_time==''||scope.row.create_time==null?'-':formattedDate(Number(scope.row.create_time)) }}
            </template>
            </el-table-column>
            <el-table-column prop="status" label="订单状态" width="100" align="center">
              <template slot-scope="scope">
              <el-tag :type="scope.row.status =='已完成' ? 'success' : scope.row.status =='已取消' ?'warning':'error'" disable-transitions>
                {{ scope.row.status?scope.row.status:'已取消' }}</el-tag>
            </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button type="text" class="v-link highlight clickable selected" style="color: tomato;"
                  @click="show(scope.row.id)">删除</el-button>
                <el-button type="text" class="v-link highlight clickable selected"
                  @click="show(scope.row.id)">详情</el-button>
                  <el-button type="text" class="" v-if="scope.row.status=='完成'"
                  @click="download(scope.row.id)">下载电子保单</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <el-pagination class="pagination" layout="prev, pager, next" :current-page="page" :total="total"
          :page-size="limit" @current-change="fetchData">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- <el-drawer title="订单详情" :visible.sync="orderVisible" :direction="'btt'" :before-close="handleClose"
      :modal-append-to-body="false" :size="'40%'" :destroy-on-close="true" style="transition: all .3s;">
      <el-row>
        <el-col :span="14" :offset="2">
          <el-form ref="form" :model="list[0]">
            <el-row>
              <el-col :span="12">
                <el-form-item label="被保人信息：" style="margin-bottom: 5px;">
                  {{ list[0].patientName }}
                </el-form-item>
                <el-form-item label="与本人关系：" style="margin-bottom: 5px;">
                  {{ list[0].patientName }}
                </el-form-item>
                <el-form-item label="证件号：" style="margin-bottom: 5px;">
                  {{ list[0].patientName }}
                </el-form-item>
                <el-form-item label="年龄：" style="margin-bottom: 5px;">
                  {{ list[0].patientName }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保险名称/类型：" style="margin-bottom: 5px;">
                  {{ list[0].hosname }}
                </el-form-item>
                <el-form-item label="其他信息：" style="margin-bottom: 5px;">
                  {{ list[0].patientName }}
                </el-form-item>
                <el-form-item label="创建/完成日期：" style="margin-bottom: 5px;">
                  {{ list[0].orderTime }}
                </el-form-item>
                <el-form-item label="订单号：" style="margin-bottom: 5px;">
                  {{ list[0].orderId }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="5" :offset="1">
          <div style="font-weight: 700;margin-bottom: 20px;">
            <el-statistic :value="deadline2" time-indices title="支付倒计时">
            </el-statistic>
          
          </div>
          
            <div>
                <el-radio v-model="radio" label="1"><img src="@/assets/images/weiixin.png" style="width:45px;"
                        alt=""></el-radio>
                <el-radio v-model="radio" label="2"><img src="@/assets/images/zhifubao.png" style="width: 45px;"
                        alt=""></el-radio>
                <el-radio v-model="radio" label="3"><img src="@/assets/images/yinlian.png" style="width: 60px;"
                        alt=""></el-radio>
            </div>
            <div style="margin-top: 30px;text-align: center;">
              <el-button>取消订单</el-button>
              <el-button type="primary" @click="onSubmit">支付</el-button>
            </div>
        </el-col>
      </el-row>
    </el-drawer> -->
    <toPDF ref="toPDF" style="position: absolute;right: 1500px;top: 0;"></toPDF>
  </div>

  <!-- footer -->
</template>
<script>
// import "~/assets/css/hospital_personal.css";
// import "~/assets/css/hospital.css";

import orderInfoApi from "@/api/order";
import insuranceApi from '@/api/insurances'
import toPDF from '@/pages/toPDFTemplate'
// import patientApi from "@/api/patient";
export default {
  components:{toPDF},
  data() {
    return {
      list: [
        // {
        //   "custormer_id": "111111",
        //   "insurance_id": "12312",
        //   "amount": "12312312",
        //   "payment_type": "支付宝",
        //   "status": "完成",
        //   "create_time": "2023-11-11 20:20:10",
        //   "code":"1231231231"
        // }
      ], // banner列表
      insuranceList:[],
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单对象
      patientList: [],
      statusList: [],
      orderVisible: false,
      radio:'1',
      deadline2: Date.now() + 1000 * 60 * 60 * 8,
    };
  },
  created() {
    this.orderId = this.$route.query.orderId;
    this.fetchData();
    // this.findPatientList();
    // this.getStatusList();
  },
  methods: {
    formattedDate (originalDateString) {
            // 原始日期时间字符串
            // const originalDateString =  this.nowTime;

            // 解析日期时间字符串为 JavaScript Date 对象
            const date = new Date(originalDateString);

            // 提取日期和时间的各个部分
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            // const minutes = date.getMinutes().toString().padStart(2, '0');
            // const seconds = date.getSeconds().toString().padStart(2, '0');

            return year + '年' + month + '月' + day + '日' + hours + '时';
        },
    fetchData() {
      let uid = this.$store.getters.getUserInfo.uid
      orderInfoApi.getOrderList(uid).then((response) => {
            console.log(response)
            if(response.success)
              this.list = response.order
              // this.list.push(response.order)
      })
      // insuranceApi.getInsurancetByMid(this.list[0].insurance_id).then((response) => {
      //       console.log(response)
      //       this.insuranceList.push(response.insurance)
      // })
    },
    findPatientList() {
      // patientApi.findList().then((response) => {
      //   this.patientList = response.data;
      // });
    },
    getStatusList() {
      orderInfoApi.getStatusList().then((response) => {
        this.statusList = response.data;
      });
    },
    changeSize(size) {
      console.log(size);
      this.limit = size;
      this.fetchData(1);
    },
    show(id) {
      this.orderVisible = true
      // window.location.href = "/order/show?orderId=" + id;
    },
    onSubmit(){

    },
    download(id){
        this.$refs.toPDF.download();
    },
    handleClose(){
      this.orderVisible = false
    },
  },
};
</script>
