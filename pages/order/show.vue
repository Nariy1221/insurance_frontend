<template>
  <!-- header -->
  <div class="nav-container page-component">
    <!--左侧导航 #start -->
    <div class="nav left-nav">
      <div class="nav-item">
        <span
          class="v-link clickable dark"
          onclick="javascript:window.location='/user'"
          >实名认证
        </span>
      </div>
      <div class="nav-item selected">
        <span
          class="v-link selected dark"
          onclick="javascript:window.location='/order'"
        >
          购买订单
        </span>
      </div>
      <div class="nav-item">
        <span
          class="v-link clickable dark"
          onclick="javascript:window.location='/patient'"
        >
          购买人管理
        </span>
      </div>
      <div class="nav-item">
        <span class="v-link clickable dark"> 修改账号信息 </span>
      </div>
      <div class="nav-item">
        <span class="v-link clickable dark"> 意见反馈 </span>
      </div>
    </div>
    <!-- 左侧导航 #end -->
    <!-- 右侧内容 #start -->
    <div class="page-container">
      <div class="order-detail">
        <div class="title">购买详情</div>
        <div class="status-bar">
          <div class="left-wrapper">
            <div class="status-wrapper BOOKING_SUCCESS">
              <span class="iconfont"></span>
              {{ orderInfo.param.orderStatusString }}
            </div>
          </div>
          <div class="right-wrapper">
            <img
              src="//img.114yygh.com/static/web/code_order_detail.png"
              class="code-img"
            />
            <div class="content-wrapper">
              <!-- <div>
                微信<span class="iconfont"></span>关注“北京114预约挂号”
              </div>
              <div class="watch-wrapper">快速挂号，轻松就医</div> -->
            </div>
          </div>
        </div>
        <div class="info-wrapper">
          <div class="title-wrapper">
            <div class="block"></div>
            <div>购买信息</div>
          </div>
          <div class="info-form">
            <el-form ref="form" :model="form">
              <el-form-item label="购买人信息：">
                <div class="content">
                  <span>{{ orderInfo.patientName }}</span>
                </div>
              </el-form-item>
              <el-form-item label="购买日期：">
                <div class="content">
                  <span
                    >{{ orderInfo.reserveDate }}
                    {{ orderInfo.reserveTime == 0 ? "上午" : "下午" }}</span
                  >
                </div>
              </el-form-item>
              <el-form-item label="保险类型：">
                <div class="content">
                  <span>{{ orderInfo.hosname }} </span>
                </div>
              </el-form-item>
              <!-- <el-form-item label="就诊科室：">
                <div class="content">
                  <span>{{ orderInfo.depname }} </span>
                </div>
              </el-form-item> -->
              <!-- <el-form-item label="医生职称：">
                <div class="content">
                  <span>{{ orderInfo.title }} </span>
                </div>
              </el-form-item>
              <el-form-item label="医事服务费：">
                <div class="content">
                  <div class="fee">{{ orderInfo.amount }}元</div>
                </div>
              </el-form-item> -->
              <el-form-item label="单号：">
                <div class="content">
                  <span>{{ orderInfo.outTradeNo }} </span>
                </div>
              </el-form-item>
              <el-form-item label="时间：">
                <div class="content">
                  <span>{{ orderInfo.createTime }}</span>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="rule-wrapper mt40">
          <div class="rule-title">注意事项</div>
          <div>
            1、请确认购买人人信息是否准确，若填写错误将无法保障，损失由本人承担；<br />
            <span style="color: red"
              >{{
                orderInfo.fetchTime
              }}</span
            ><br />
         
          </div>
        </div>
        <div
          class="bottom-wrapper mt60"
          v-show="orderInfo.orderStatus == 0 || orderInfo.orderStatus == 1"
        >
          <div class="button-wrapper">
            <div class="v-button white" @click="cancelOrder()">取消预约</div>
          </div>
          <div class="button-wrapper ml20" v-show="orderInfo.orderStatus == 0">
            <div class="v-button" @click="pay()">支付</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧内容 #end -->
    <!-- 微信支付弹出框 -->
    <el-dialog
      :visible.sync="dialogPayVisible"
      style="text-align: left"
      :append-to-body="true"
      width="500px"
      @close="closeDialog"
    >
      <div class="container">
        <div class="operate-view" style="height: 350px">
          <div class="wrapper wechat">
            <div>
              <!-- 显示支付二维码 -->
              <qriously :value="payObj.codeUrl" :size="220" />
              <!-- <img src="images/weixin.jpg" alt="" /> -->

              <div
                style="
                  text-align: center;
                  line-height: 25px;
                  margin-bottom: 40px;
                "
              >
                请使用微信扫一扫<br />
                扫描二维码支付
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
  <!-- footer -->
</template>
<script>
// import "~/assets/css/hospital_personal.css";
// import "~/assets/css/hospital.css";

import orderInfoApi from "@/api/order";
import weixinApi from "@/api/weixin";

export default {
  data() {
    return {
      orderId: null,
      orderInfo: {
        param: {},
      },
      dialogPayVisible: false,
      payObj: {},
      timer: null, // 定时器名称
    };
  },
  created() {
    this.orderId = this.$route.query.orderId;
    this.init();
  },
  methods: {
    init() {
      orderInfoApi.getOrders(this.orderId).then((response) => {
        console.log(response.data);
        this.orderInfo = response.data;
      });
    },
    //生成支付二维码
    pay() {
      this.dialogPayVisible = true;
      weixinApi.createNative(this.orderId).then((response) => {
        this.payObj = response.data;
        if (this.payObj.codeUrl == "") {
          this.dialogPayVisible = false;
          this.$message.error("支付错误");
        } else {
          this.timer = setInterval(() => {
            this.queryPayStatus(this.orderId);
          }, 3000);
        }
      });
    },
    //查询支付状态
    queryPayStatus(orderId) {
      weixinApi.queryPayStatus(orderId).then((response) => {
        if (response.message == "支付中") {
          return;
        }
        clearInterval(this.timer);
        window.location.reload();
      });
    },

    cancelOrder() {
      this.$confirm("确定取消预约吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // promise
          // 点击确定，远程调用
          return orderInfoApi.cancelOrder(this.orderId);
        })
        .then((response) => {
          this.$message.success("取消成功");
          this.init();
        })
        .catch(() => {
          this.$message.info("已取消取消预约");
        });
    },

    closeDialog() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
  },
};
</script>
<style>
.info-wrapper {
  padding-left: 0;
  padding-top: 0;
}
.content-wrapper {
  color: #333;
  font-size: 14px;
  padding-bottom: 0;
}
.bottom-wrapper {
  width: 100%;
}
.button-wrapper {
  margin: 0;
}
.el-form-item {
  margin-bottom: 5px;
}
.bottom-wrapper .button-wrapper {
  margin-top: 0;
}
</style>
