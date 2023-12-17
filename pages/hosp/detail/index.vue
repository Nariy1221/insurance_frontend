<template>
  <!-- header -->
  <div class="nav-container page-component">
    <!--左侧导航 #start -->
    <div class="nav left-nav">
      <div class="nav-item" :class="activeIndex == index ? 'selected' : ''" v-for="(item, index) in navList" :key="index">
        <span class="v-link dark" :class="activeIndex == index ? 'selected' : 'clickable'"
          @click="move2page(index, item.url)">
          {{ item.label }}
        </span>
      </div>
      <div class="common-dept" style="margin-top: 100px;">
        <el-divider></el-divider>
        <div class="header-wrapper">
          <div class="title-wrapper">
            <span class="title">相关产品</span>
          </div>
        </div>
        <div class="content-wrapper" style="display: flex;flex-direction: column;align-items: center;margin: 0;">
          <ul style="width: 200px;">
            <li v-for="(item, index) in relatList" :key="index" @click="show(item.mid)" :title="item.descri">
              <div class="listNum" :class="index < 3 ? 'yIcon' : 'gIcon'">{{ index + 1 }}</div>
              <div><el-link :underline="false" style="white-space: nowrap;display: inline-block;text-overflow: ellipsis;
    width: 150px;overflow: hidden;">{{ item.descri }}</el-link></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 左侧导航 #end -->
    <!-- 右侧内容 #start -->
    <div class="page-container">
      <ToBuy v-if="activeIndex == 1" :item="insurance" @currentStep="getStep" :relatedList="relatList"></ToBuy>
      <detail v-if="activeIndex == 0" :item="insurance" :isNotLogin="isNotLogin" @InsurcanceBuy="activeIndex = 1">
      </detail>
    </div>
    <!-- 右侧内容 #end -->
  </div>
  <!-- footer -->
</template>

<script>
import insuranceApi from "@/api/insurances";
import detail from "./detail.vue";
import ToBuy from "./toBuy.vue";
import blockList from '@/temp_data/blockList'
export default {
  components: {
    detail,
    ToBuy
  },
  data() {
    return {
      activeIndex: 0,
      hoscode: null,
      insurance: [],
      relatList: [],
      currentStep: 0,
      navList: [
        { "label": "保险详情", "url": "detail" },
        { "label": "购买保险", "url": "toBuy" },
      ],
      isNotLogin: false
    };
  },
  created() {
    this.hoscode = this.$route.query.id;

    // 如果需要跳转到 'toBuy' 页面
    if (this.$store.getters.getBuyFlow.url === 'toBuy') {
      this.activeIndex = 1;
      this.currentStep = this.$store.getters.getBuyFlow.step;
      this.$router.push({ path: "/hosp/detail", query: { "id": this.hoscode, "url": 'toBuy', "step": this.currentStep } });
    }
    this.init();
    console.log(this.$store.getters.getAuthStatus === '0')
    if (this.$store.getters.getUserInfo.username === '' || this.$store.getters.getAuthStatus === '0') {
      this.isNotLogin = true;
      let msg = this.$store.getters.getUserInfo.username === '' ? '请先登录并完成实名认证，方可购买保险!' : '请先完成实名认证，方可购买保险!'
      this.$message.info(msg);
    } else {
      this.isNotLogin = false;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.activeIndex == 0 || this.currentStep == 3) {
      next();
      this.$store.dispatch('quitBuyFlow');
      return;
    }
    if (to.params.status) {//就是上面的状态 如果是true , 则不询问是否保存, 当然这个方法比较笨, 大家可以使用更优雅的方式
      next();
    } else {
      this.$confirm("购买流程未完成, 是否要离开", "提示", {
        confirmButtonText: "取消",
        cancelButtonText: "确定",
        type: "warning",
        distinguishCancelAndClose: true,    // 重要，设置为true才会把右上角X和取消区分开来
        closeOnClickModal: false
      })
        .then(() => {

          // this.deleteFile();//业务功能请忽略
          // next();
        })
        .catch((e) => {
          if (e == 'cancel') {
            // TODO 确认不通过执行逻辑
            this.$store.dispatch('quitBuyFlow');
            next();
          } else if (e == 'close') {
            // TODO 右上角X的执行逻辑
            // next();
          }

          // alert("router")
        });
    }
  },
  methods: {
    init() {
      insuranceApi.getInsurancetByMid(this.hoscode).then((response) => {
        this.insurance = response.insurance;
        console.log("insurance", this.insurance)
        insuranceApi.getInsurancetByRelation(this.insurance.descri, 5).then((response) => {
          console.log('same', response.insurances.length)
          if (response.insurances.length == 0) {
            insuranceApi.getInsuranceListByGenres(this.insurance.genres, 5).then((response) => {
              console.log(response)
            })
          } else {
            this.relatList = response.insurances.slice(0, Math.min(5, response.insurances.length));
          }

          // console.log("insurance",this.insurance)
        });
      });


    },
    getStep(msg) {
      this.currentStep = msg
      const data = {
        url: 'toBuy',
        step: this.currentStep
      }
      this.$store.commit('UPDATE_BUYFLOW', data)
    },
    show(hoscode) {
      this.$router.push({ path: "/hosp/detail", query: { "id": hoscode } })
    },
    move2page(index, url) {
      if (index === 0 && this.currentStep < 3) {
        this.$confirm("购买流程未完成, 是否要离开", "提示", {
          confirmButtonText: "取消",
          cancelButtonText: "确定",
          type: "warning",
          distinguishCancelAndClose: true,    // 重要，设置为true才会把右上角X和取消区分开来
          closeOnClickModal: false
        })
          .then(() => {//取消
            // this.$store.dispatch('quitBuyFlow');
          })
          .catch((e) => {
            if (e == 'cancel') {//确定
              this.currentStep = 0
              this.moveAndKeep(index, url)
            } else if (e == 'close') {//取消
            }
          });
        return;
      }
      this.moveAndKeep(index, url)
    },
    moveAndKeep(index, url) {
      if (url == 'toBuy' && this.isNotLogin == true) {
        this.$message.info("请先登录并完成实名认证，方可购买保险!");
        return;
      }
      this.activeIndex = index
      const data = {
        id: this.hoscode,
        url: url,
        step: this.currentStep
      }
      this.$store.commit('UPDATE_BUYFLOW', data)
      this.$router.push({ path: "/hosp/detail", query: data })
    }
  },
};
</script>
<style scoped>
.content-wrapper ul {
  /* margin: 0; */
  /* margin-left: 10px; */
  padding: 0;
  list-style: none;
  width: 100%;
  display: inline-block;
}

.content-wrapper ul li {
  height: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;

}

.listNum {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  /* background-color: rgb(252, 173, 0); */
  color: rgb(255, 255, 255);
  line-height: 20px;
  text-align: center;
  border-radius: 5px;
}

.yIcon {
  background-color: rgb(252, 173, 0);
}

.gIcon {
  background-color: rgb(170, 170, 170);
}
</style>
