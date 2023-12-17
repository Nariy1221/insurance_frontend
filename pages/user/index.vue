<template>
  <!-- header -->
  <div class="nav-container page-component">
    <!--左侧导航 #start -->
    <div class="nav left-nav">
      <div class="nav-item" :class="activeIndex == index ? 'selected' : ''" v-for="(item,index) in navList" :key="index">
        <span class="v-link dark" :class="activeIndex == index ? 'selected' : 'clickable'"  @click="move2page(index,item.url)">
          {{ item.label }}
        </span>
      </div>
    </div>
    <!-- 左侧导航 #end -->
    <!-- 右侧内容 #start -->
    <div class="page-container">
      <account v-show="activeIndex == 0"></account>
      <shiming v-show="activeIndex == 1"></shiming>
      <insured v-show="activeIndex == 2"></insured>
      <order v-show="activeIndex == 3"></order>
      <notice v-show="activeIndex == 4"></notice>
      <suggest v-show="activeIndex == 5"></suggest>
      <!-- <ToBuy v-show="activeIndex == 1" :item="hospital" @currentStep="getStep"></ToBuy>
      <detail v-show="activeIndex == 0" :item="hospital" @InsurcanceBuy="activeIndex = 1"></detail> -->
    </div>
    <!-- 右侧内容 #end -->
  </div>
  <!-- footer -->
</template>

<script>
import hospitalApi from "@/api/hosp";
import shiming from "./shiming.vue";
import insured from "./insured.vue";
import order from "./order.vue";
import notice from "./notice.vue";
import suggest from "./suggest.vue";
import account from "./account.vue";
import blockList from '@/temp_data/blockList'
export default {
  components: {
    shiming,
    insured,
    order,
    notice,
    suggest,
    account
  },
  data() {
    return {
      activeIndex: 0,
      hoscode: null,
      hospital: blockList[0],
      hotlist: blockList.slice(0, 5),
      currentStep:4,
      navList:[
        {"label":"账号信息","url":"/account"},
        {"label":"实名认证","url":"/user"},
        {"label":"被保人管理","url":"/insured"},
        {"label":"订单管理","url":"/order"},
        {"label":"消息中心","url":"/notice"},
        {"label":"意见反馈","url":"/suggest"},
      ],
    };
  },

  created() {
    console.log(this.$route.query.url)
    for(let index in this.navList) {
      console.log(this.navList[index].url)
      if(this.navList[index].url == this.$route.query.url){
        this.activeIndex = index
        break;
      }

    }
    // this.orderId = this.$route.query;
    this.init();
  },
  methods: {
    init() {
      // hospitalApi.show(this.hoscode).then((response) => {
      //   this.hospital = response.data.hospital;
      // });
    },
    move2page(index,url){
        this.activeIndex = index
        this.$router.push({ path: "/user",query:{"url":url} })
    },
  },
};
</script>
<style scoped>
.page-container{
  background-color: #fff;
  padding: 20px;
  margin-top: 38px;
}
</style>
