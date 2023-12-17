<template>
  <div class="home page-component">

    <div class="line"></div>
    <!-- <el-carousel indicator-position="outside">
      <el-carousel-item v-for="item in 2" :key="item">
        <img src="~assets/images/web-banner2.png" alt="" />
      </el-carousel-item>
    </el-carousel> -->
    <!-- 搜索 -->
    <!-- <div class="search-container">
      <div class="search-wrapper">
        <div class="hospital-search">
          <el-autocomplete class="search-input" prefix-icon="el-icon-search" v-model="state"
            :fetch-suggestions="querySearchAsync" placeholder="点击输入保险名称" @select="handleSelect">
            <span slot="suffix" class="search-btn v-link highlight clickable selected">搜索
            </span>
          </el-autocomplete>
        </div>
      </div>
    </div> -->
    <!-- bottom -->
    <div class="bottom">
      <div class="left">
        <div class="home-filter-wrapper">
          <div class="title">保险种类</div>
          <div>
            <div class="filter-wrapper">
              <span class="label">保险：</span>
              <div class="condition-wrapper">
                <span class="item v-link clickable" :class="hostypeActiveIndex == index ? 'selected' : ''"
                  v-for="(item, index) in hostypeList" :key="item.id" @click="hostypeSelect(item.value, index)">{{
                    item.name }}</span>
              </div>
            </div>
            <div class="filter-wrapper">
              <span class="label">类型：</span>
              <div class="condition-wrapper">
                <span class="item v-link clickable" :class="provinceActiveIndex == index ? 'selected' : ''"
                  v-for="(item, index) in districtList" :key="item.id" @click="districtSelect(item.value, index)">{{
                    item.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="v-scroll-list hospital-list">
          <div class="v-card clickable list-item" v-for="item in list" :key="item.id">
            <div class="">
              <div class="hospital-list-item hos-item" index="0" @click="show(item.hoscode)">
                <div class="wrapper">
                  <div class="hospital-title">{{ item.hosname }}</div>
                  <div class="bottom-container">
                    <div class="icon-wrapper">
                      <span class="iconfont"></span>{{ item.param.hostypeString }}
                    </div>
                    <!-- <div class="icon-wrapper">
                      <span class="iconfont"></span>每天{{
                        item.bookingRule.releaseTime
                      }}放号
                    </div> -->
                  </div>
                </div>
                <!-- <img
                  :src="'data:image/jpeg;base64,' + item.logoData"
                  :alt="item.hosname"
                  class="hospital-img"
                /> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="common-dept">
          <div class="header-wrapper">
            <div class="title">常见保险</div>
            <div class="all-wrapper">
              <span>全部</span>
              <span class="iconfont icon"></span>
            </div>
          </div>
          <div class="content-wrapper">
            <span class="item v-link clickable dark">人寿保险 </span>
            <span class="item v-link clickable dark">平安保险 </span>
            <span class="item v-link clickable dark">天天保 </span>
            <span class="item v-link clickable dark">雇主保 </span>
            <span class="item v-link clickable dark">灵工小保 </span>
            <span class="item v-link clickable dark">即时保 </span>
            <span class="item v-link clickable dark"> 智能定制 </span>
            <span class="item v-link clickable dark">全球保 </span>
          </div>
        </div>
        <div class="space">
          <div class="header-wrapper">
            <div class="title-wrapper">
              <div class="icon-wrapper">
                <span class="iconfont title-icon"></span>
              </div>
              <span class="title">平台公告</span>
            </div>
            <div class="all-wrapper">
              <span>全部</span>
              <span class="iconfont icon"></span>
            </div>
          </div>
          <div class="content-wrapper">
            <div class="notice-wrapper">
              <div class="point"></div>
              <span class="notice v-link clickable dark">关于保险
              </span>
            </div>
            <div class="notice-wrapper">
              <div class="point"></div>
              <span class="notice v-link clickable dark">预约咨询
              </span>
            </div>
            <div class="notice-wrapper">
              <div class="point"></div>
              <span class="notice v-link clickable dark">
                更新通知
              </span>
            </div>
          </div>
        </div>
        <div class="suspend-notice-list space">
          <div class="header-wrapper">
            <div class="title-wrapper">
              <div class="icon-wrapper">
                <span class="iconfont title-icon"></span>
              </div>
              <span class="title">我们的客户</span>
            </div>
            <div class="all-wrapper">
              <span>全部</span>
              <span class="iconfont icon"></span>
            </div>
          </div>
          <div class="content-wrapper">
            <div class="notice-wrapper">
              <div class="point"></div>
              <span class="notice v-link clickable dark">
                盒马鲜生
              </span>
            </div>
            <div class="notice-wrapper">
              <div class="point"></div>
              <span class="notice v-link clickable dark">
                瑞星咖啡
              </span>
            </div>
            <div class="notice-wrapper">
              <div class="point"></div>
              <span class="notice v-link clickable dark">京东物流
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import hospApi from "@/api/hosp";
import dictApi from "@/api/dict";
import hostypeList from "@/temp_data/hostypeList"
import districtList from "@/temp_data/districtList"
import blockList from "@/temp_data/blockList"
export default {
  //服务端渲染异步，显示医院列表
  // asyncData({ params, error }) {
  //   //调用
  //   return hospApi.getPageList(1, 100, null).then((response) => {
  //     return {
  //       list: response.data.content,
  //       pages: response.data.totalPages,
  //     };
  //   });
  // },
  data() {
    return {
      searchObj: {},
      page: 1,
      limit: 10,

      state: "",
      hosname: "", //医院名称
      hostypeList: hostypeList, //医院等级集合 保障项目
      districtList: districtList, //地区集合  行业
      list: blockList,
      hostypeActiveIndex: 0,
      provinceActiveIndex: 0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    //查询医院等级列表 和 所有地区列表
    init() {
      //查询医院等级列表
      dictApi.findByDictCode("Hostype").then((response) => {
        //hostypeList清空
        this.hostypeList = [];
        //向hostypeList添加全部值
        this.hostypeList.push({ name: "全部", value: "" });
        //把接口返回数据，添加到hostypeList
        for (var i = 0; i < response.data.length; i++) {
          this.hostypeList.push(response.data[i]);
        }
      });

      //查询地区数据
      dictApi.findByDictCode("Province").then((response) => {
        this.districtList = [];
        this.districtList.push({ name: "全部", value: "" });
        for (let i in response.data) {
          this.districtList.push(response.data[i]);
        }
      });
      //  dictApi.findByParentId("Province").then((response) => {
      //   this.districtList = [];
      //   this.districtList.push({ name: "全部", value: "" });
      //   for (let i in response.data) {
      //     this.districtList.push(response.data[i]);
      //   }
      // });

    },

    //查询医院列表
    getList() {
      hospApi
        .getPageList(this.page, this.limit, this.searchObj)
        .then((response) => {
          for (let i in response.data.content) {
            this.list.push(response.data.content[i]);
          }
          this.page = response.data.totalPages;
          console.log("-----------")
          console.log(response.data)
        });

    },

    //根据医院等级查询
    hostypeSelect(hostype, index) {
      //准备数据
      this.list = [];
      this.page = 1;
      this.hostypeActiveIndex = index;
      this.searchObj.hostype = hostype;
      //调用查询医院列表方法
      this.getList();
    },

    //根据地区查询医院
    districtSelect(districtCode, index) {
      this.list = [];
      this.page = 1;
      this.provinceActiveIndex = index;

      this.searchObj.districtCode = districtCode;
      console.log(this.searchObj.districtCode)
      this.getList();
    },

    //在输入框输入值，弹出下拉框，显示相关内容
    querySearchAsync(queryString, cb) {
      this.searchObj = [];
      if (queryString == "") return;
      hospApi.getByHosname(queryString).then((response) => {
        for (let i = 0, len = response.data.length; i < len; i++) {
          response.data[i].value = response.data[i].hosname;
        }
        cb(response.data);
      });
    },

    //在下拉框选择某一个内容，执行下面方法，跳转到详情页面中
    handleSelect(item) {
      window.location.href = "/hosp/" + item.hoscode;
    },

    //点击某个医院名称，跳转到详情页面中
    show(hoscode) {
      window.location.href = "/hosp/" + hoscode;
    },
  },
};
</script>
