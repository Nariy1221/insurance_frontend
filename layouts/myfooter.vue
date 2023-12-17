<template>
  <div class="footer-container">
    <div class="wrapper">
      <div>
        <span class="record">青岛市黄岛区中电信息港10-2栋9层</span><span class="phone">4001-5588-12</span>
      </div>
      <div class="right">
        <span class="v-link clickable" @click="toPath()"> 联系我们 </span><span class="v-link clickable"> 合作伙伴 </span><span
          class="v-link clickable"> 用户协议 </span><span class="v-link clickable"> 隐私协议 </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "myfooter",
  methods:{
    toPath(){
      window.location.href = 'http://www.qxbins.com/'
    }
  }
};
</script>
