<template>
  <div class="app-container" v-show="loadings">
    <ClientOnly>
      <el-backtop :visibility-height="100" />
      <div id="main" style="display: flex;flex-direction: column;">
        <!-- 公共头 -->
        <myheader style=" flex: 0 0 auto;" />

        <div class="main-container" style="flex: 1 1 auto;">
          <el-scrollbar class="page-component__scroll">
            <!-- 内容区域 -->
            <nuxt :key="$route.fullPath" />
          </el-scrollbar>
        </div>
        <!-- 公共底 -->
        <myfooter style=" flex: 0 0 auto;" />
      </div>
    </ClientOnly>
  </div>
</template>
<script>
import "@/assets/css/app.css";
import "@/assets/css/chunk.css";
// import "@/assets/css/index.css";
import "@/assets/css/iconfont.css";
import "@/assets/css/main.css";
import "@/assets/css/hospital_personal.css";
import myheader from "./myheader";
import myfooter from "./myfooter";
import router from 'vue-router';
import "@/theme/index.css"
export default {
  components: {
    myheader,
    myfooter,
  },
  data() {
    return {
      loadings: false,
      window:''
    }
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to.query.search)
    this.getData(to.query.search)
    next()
  },
  created() {

  },
  mounted() {
    // console.log(document.querySelector("#main"))
    // document.querySelector("#main").style.display = 'flex';
    this.loadings = true
    this.window = window
    this.$router.afterEach((to, from, next) => {
      window.scrollTo(0, 0)
    });
    // this.$refs.body.style.cssText=""
  },
};
</script>
<style>
.main-container {
  color: #2a313d;
  background: #f0f4fa;
}

#main .main-container .page-component {
  color: #2a313d;
  background: #f0f4fa;
}
</style>

