<template>
  <div class="home page-component" style="width:100%">
    <el-row>
      <el-col :span="24">
        <el-carousel style="margin-bottom: 60px;height: 100%;" height="350px">
          <el-carousel-item v-for="(item, index) in bannerList" :key="index">
            <el-image :src="require('@/assets/images/' + item)" style="margin-top: -120px;zoom:0.8"></el-image>
            <!-- <img :src="require(item)" alt="" /> -->
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-row style="z-index: 100;margin-bottom: 20px;">
        <el-col :span="20" :offset="2">
          <el-card class="box-card" style="height: 300px;margin-top: -80px;border-radius: 10px;">
            <div slot="header" class="clearfix" style="display: flex;align-items: center;">
              <div style="font-size: 18px;font-weight: 600;margin-right: 10px;">为您推荐</div>
              <div>
                <el-tag :key="tag" v-for="tag in dynamicTags.slice(0, 5)" :disable-transitions="false" type="success"
                  style="margin-left: 5px;" @close="handleClose(tag)">
                  {{ tag }}
                </el-tag>
                <el-tag type="success" style="margin-left: 5px;" v-show="dynamicTags.length > 5">...</el-tag>
                <el-button class="button-new-tag" size="small" @click="changeInterest()"
                  v-show="dynamicTags.length">更换/添加兴趣</el-button>
              </div>
              <el-button style="margin-left:auto; padding: 3px 0" type="text" @click="refreshRecommend()"
                :disabled="isFreashState"><i :class="isFreashState ? 'el-icon-loading' : 'el-icon-refresh'"
                  style="margin-right: 5px;"></i>没合适的？换一批</el-button>
            </div>
            <div>
              <el-row :gutter="20" style="height: 250px;">
                <el-col :span="6" style="height: 90%;" v-for="(item, index) in recommendList" :key="index">
                  <recommendCard :item="item"></recommendCard>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-col :span="20" :offset="2">
        <el-row :gutter="30">
          <el-col :span="18">
            <el-row style="padding-left: 10px; padding-bottom: 20px;" justify="space-between">
              <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">保险种类</div>
              <div>
                <!-- 保障 -->
                <div class="filter-wrapper">
                  <span class="label">品牌：</span>
                  <div class="condition-wrapper">
                    <span class="item v-link clickable" :class="hostypeActive == item ? 'selected' : ''"
                      v-for="(item, index) in hostypeList" :key="index" @click="hostypeSelect(item, index)">
                      {{ item }}</span>
                  </div>
                </div>

                <!-- 类型 -->
                <div class="filter-wrapper">
                  <span class="label">类型：</span>
                  <div class="condition-wrapper">
                    <span class="item v-link clickable" :class="districtActive == item ? 'selected' : ''"
                      v-for="(item, index) in districtList" :key="index" @click="districtSelect(item, index)">
                      {{ item }}
                    </span>
                  </div>
                </div>

                <!-- 排序 -->
                <div class="filter-wrapper" style="margin-top: 10px; line-height: 40px;">
                  <span class="label">排序：</span>
                  <div class="condition-wrapper">
                    <span class="item v-link clickable" :class="recommendActiveIndex == index ? 'selected' : ''"
                      v-for="(item, index) in recommendOption" :key="item.index"
                      @click="recommendSelect(item.name, index)">{{ item.name }}</span>
                  </div>

                  <!-- 价格区间 -->
                  <span class="label">价格区间：</span>
                  <div class="condition-wrapper">
                    <el-slider v-model="value9" style="width: 200px; margin-left: 20px;" range show-stops :max="maxPrice"
                      @change="filterData"></el-slider>
                    <span style="margin-left: 10px;">{{ value9[0] }} 至 {{ value9[1] }}（元）</span>
                  </div>
                </div>
              </div>
            </el-row>
            <el-row class="" justify="space-between" :gutter="20">
              <insurance-card v-for="(item, index) in list" :key="index" :item="item" />
            </el-row>
            <el-row type="flex" class="row-bg" justify="space-between" style="margin-top: 10px;">
              <el-col :span="6" :offset="5">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                  :hide-on-single-page="true" :current-page="currentPage" :page-sizes="[12, 24, 36]" :page-size="10"
                  layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <div class="common-dept">
              <div class="header-wrapper">
                <div class="title-wrapper">
                  <div class="icon-wrapper">
                    <span class="iconfont title-icon"></span>
                  </div>
                  <span class="title">热门产品</span>
                </div>
                <!-- <div class="all-wrapper">
                  <el-select v-model="hotSearchValue" size="small" style="width: 100px;" :popper-append-to-body="false">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </div> -->
              </div>
              <div class="content-wrapper" style="margin: 0px 5px 20px 5px;">
                <ul>
                  <li v-for="(item, index) in showHotList" :key="index" @click="show(item.mid)">
                    <div class="listNum" :class="index < 3 ? 'yIcon' : 'gIcon'">{{ index + 1 }}</div>

                    <div style="white-space:nowrap;width:60%;overflow: hidden;">
                      <el-link :underline="false" style="overflow:hidden;text-overflow: ellipsis;display:inline-block">{{
                        item.descri }}</el-link>
                    </div>
                    <div class="hidden_info">{{ item.genres }}</div>
                  </li>
                </ul>
                <el-button class="infoLine" @click="showMoreHot()" size="small"><span>{{ showMoreText }}</span>
                </el-button>
                <!-- <span class="item v-link clickable dark" v-for="(item,index) in commonInsurance" :key="index" >{{ item.name }} </span> -->
              </div>
            </div>
            <div class="common-dept">
              <div class="header-wrapper">
                <div class="title-wrapper">
                  <div class="icon-wrapper">
                    <span class="iconfont title-icon"></span>
                  </div>
                  <span class="title">常见保险</span>
                </div>

              </div>
              <div class="content-wrapper" style="margin: 0 0 20px;">
                <div class="item v-link clickable dark" v-for="(item, index) in commonInsurance" :key="index"
                  style="font-size: 14px;">
                  <el-popover placement="top-start" :title="item.name" width="200" trigger="hover" :content="item.info">
                    <span slot="reference">{{ item.name }}
                    </span> </el-popover>
                </div>
              </div>
            </div>
            <div class="common-dept">
              <div class="header-wrapper">
                <div class="title-wrapper">
                  <div class="icon-wrapper">
                    <span class="iconfont title-icon"></span>
                  </div>
                  <span class="title">了解更多</span>
                </div>
              </div>
              <div class="content-wrapper" style="display: flex;flex-direction: column;align-items: center;margin: 0;">
                <span>扫描二维码 进入小程序</span>
                <div>
                  <!-- <el-image></el-image> -->
                  <div style="width: 120px; height: 120px; background-color: aqua;">
                    <img src="~assets/images/qxbins/footerQrcode.png" alt="">
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-drawer title="选择你的兴趣" :visible.sync="dialogUserFormVisible" :direction="'rtl'" :before-close="handleClose"
      :modal-append-to-body="false" :size="'40%'" :destroy-on-close="true" style="transition: all .3s;">
      <el-collapse-transition>
        <div>
          <el-row>
            <el-col :span="24" style="height: 600px;">
              <!-- Pass a method to closeDrawer as a prop -->
              <selectInterest @hadChoosed="closeDrawer"></selectInterest>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </el-drawer>
  </div>
</template>
<script>
import hospApi from "@/api/hosp";
import insurancesAPi from "@/api/insurances";
import recommendCard from '@/components/blocks/recommendCard'
import InsuranceCard from '@/components/blocks/InsuranceCard'
import selectInterest from '@/components/blocks/selectInterest'
export default {
  components: {
    InsuranceCard,
    recommendCard,
    selectInterest
  },
  data() {
    return {
      searchObj: {},
      total: 0,
      page: 1,
      limit: 12,
      currentPage: 1,
      state: "",
      hosname: "",
      hostypeList: {},
      districtList: {},
      bannerList: [
        "qxbins/banner1.png",
        "qxbins/banner2.png",
        "qxbins/banner3.png",
        "qxbins/banner4.png",
        "qxbins/banner5.png",
        "qxbins/banner6.png",
      ],
      recommendOption: [
        { "id": 1, "name": "综合排序", "value": "1" },
        { "id": 2, "name": "价格", "value": "2" },
        // { "id": 3, "name": "销量", "value": "3" },
        { "id": 3, "name": "最新", "value": "3" },],
      list: [],
      hostypeActive: '全部',
      districtActive: '全部',
      recommendActiveIndex: 0,
      minPrice: 0,
      maxPrice: 100,
      value9: [],
      commonInsurance: [
        { "name": '人寿保险', url: "", "info": "人寿保险最好了，快来买" },
        { "name": '平安保险', url: "", "info": "平安保险最好了，快来买" },
        { "name": '天天保', url: "", "info": "天天保最好了，快来买" },
        { "name": '雇主保', url: "", "info": "雇主保最好了，快来买" },
        { "name": '灵工小保', url: "", "info": "灵工小保最好了，快来买" },
        { "name": '即时保', url: "", "info": "即时保最好了，快来买" },
        { "name": '智能定制', url: "", "info": "智能定制最好了，快来买" },
        { "name": '全球保', url: "", "info": "全球保最好了，快来买" },
      ],
      hotList: [],
      showHotList: [],
      recommendList: [],
      InsuranceList: [],
      InsuranceNewList: [],
      beforeFilterList: [],
      beforeTotal: 0,
      showMoreText: "查看更多",
      options: [
        { "label": "近三天", "value": 1 },
        { "label": "近七天", "value": 2 },
        { "label": "近一月", "value": 3 },
      ],
      hotSearchValue: 1,
      dynamicTags: [],
      isFreashState: false,
      dialogUserFormVisible: false,
    };
  },
  created() {
    this.init();
    this.getCombinedList();
    // this.getAllType();
    // this.getAllSafeguard();
    // this.getPrice()

    //console.log(this.$store.state);
  },
  methods: {
    handleClose() {
      this.dialogUserFormVisible = false;
    },
    changeInterest() {
      this.dialogUserFormVisible = true;
    },
    closeDrawer() {
      this.dialogUserFormVisible = false;
    },
    init() {
      insurancesAPi.getHotByNum(10).then((response) => {
        // //console.log(response)
        this.hotList = response.insurances
        if (this.hotList.length < 10) {
          insurancesAPi.getInsuranceListByNew(10 - this.hotList.length).then((response) => {
            this.hotList.push.apply(this.hotList, response.insurances)
            this.showHotList = this.hotList.slice(0, 5)
          })
        }
        this.showHotList = this.hotList.slice(0, 5)
      })

      // insurancesAPi.getInsuranceListByGenres('all', 40).then((response) => {
      //   //console.log(response.data)
      //   this.total = response.data.InsuranceList.length
      //   this.InsuranceList = response.data.InsuranceList
      //   this.getPageInfo();
      // })
    },
    getOptions(list) {
      this.districtList = Array.from(new Set(Array.from(list, ({ genres }) => genres)))
      this.hostypeList = Array.from(new Set(Array.from(list, ({ name }) => name)));
      this.districtList.unshift('全部');
      this.$store.commit('UPDATE_INTERESTOPTIONS', this.districtList)
      // this.hostypeList.push('显示更多+');
      this.hostypeList.unshift('全部');
      this.getPrice(list)

    },
    async getCombinedList() {
      try {
        const hotResponse = await insurancesAPi.getHotByNum(40);
        console.log(hotResponse.insurances.length);
        const hotLength = hotResponse.insurances.length;
        this.InsuranceList = hotResponse.insurances;
        console.log(this.InsuranceList);

        if (hotLength < 10) {
          const newResponse = await insurancesAPi.getInsuranceListByNew(16);
          this.InsuranceNewList = newResponse.insurances;
          console.log(this.InsuranceNewList);

          // Concatenate the hot and new insurances
          this.InsuranceList = this.InsuranceList.concat(this.InsuranceNewList);
          // Or you can use spread operator: this.InsuranceList = [...this.InsuranceList, ...this.InsuranceNewList];

          this.total = this.InsuranceList.length; // Update total
          this.getOptions(this.InsuranceList);
          this.getPageInfo();

          // Highlight hot and new insurances
          this.listAddHightLight(this.InsuranceList, Math.min(5, hotLength), '热门保险');
          this.listAddHightLight(this.InsuranceList, 5, '最新保险', hotLength);
        } else {
          this.total = hotLength;
          this.getOptions(this.InsuranceList);
          this.getPageInfo();
          this.listAddHightLight(this.InsuranceList, Math.min(5, hotLength), '热门保险');
        }
        this.selectByInterest()
        this.beforeFilterList = this.InsuranceList;
      } catch (error) {
        console.error('An error occurred:', error);
      }
    },

    // getAllType() {
    //   insurancesAPi.getAllType().then((response) => {
    //     //console.log("所有类型", response.data.types);
    //     this.districtList = response.data.types
    //   })
    // },
    getAllSafeguard() {
      insurancesAPi.getAllSafeguard().then((response) => {
        //console.log("所有保障", response.data.safeguards);
        this.hostypeList = response.data.safeguards
      })
    },
    getPrice(list) {
      this.minPrice = list.sort(function (a, b) { return a.price - b.price })[0].price
      this.maxPrice = list.sort(function (a, b) { return b.price - a.price })[0].price
      this.value9 = [0, Math.ceil(this.maxPrice)]
    },

    // 获取当前页的数据信息
    getPageInfo() {
      console.log(this.currentPage, this.limit, this.total, this.InsuranceList[(this.currentPage - 1) * this.limit])
      //清空pageTicket中的数据
      this.list = [];
      // 获取当前页的数据
      for (let i = (this.currentPage - 1) * this.limit; i < this.total; i++) {
        //把遍历的数据添加到pageTicket里面
        this.list.push(this.InsuranceList[i]);
        //判断是否达到一页的要求
        if (this.list.length === this.limit) break;
      }
    },
    //筛选
    hostypeSelect(item, index) {
      this.hostypeActive = item;
      this.filterData()
      console.log(" this.hostypeActive", this.hostypeActive);
    },
    districtSelect(value, index) {
      this.districtActive = value;
      this.filterData()

    },
    recommendSelect(value, index) {
      this.recommendActiveIndex = index;
      if (value == '最新') {
        insurancesAPi.getInsuranceListByNew(40).then((response) => {
          console.log(response.insurances.length)

          this.InsuranceList = response.insurances
          this.InsuranceList
          this.listAddHightLight(this.InsuranceList, Math.min(10, response.insurances.length), '保险上新')
          this.total = response.insurances.length
          this.getPageInfo()
        })
        // alert(value)
      } else if (value == '价格') {
        this.InsuranceList = this.beforeFilterList.sort(function (a, b) { return a.price - b.price })
        this.listAddHightLight(this.InsuranceList, Math.min(5, this.InsuranceList.length), '价格最低')
        this.getPageInfo();
      } else if (value == '销量') {
        this.InsuranceList = this.beforeFilterList.sort(function (a, b) { return -a.count + b.count })
        this.listAddHightLight(this.InsuranceList, Math.min(5, this.InsuranceList.length), '销量最高')
        this.getPageInfo();
      } else {
        this.getCombinedList();
      }
      this.filterData()
      // this.beforeFilterList = this.InsuranceList
    },
    listAddHightLight(list, num, msg, start = 0) {
      console.log(list, num, msg)
      for (let i = start; i < num; i++) {
        console.log(list[i].hightlight)
        if ('hightlight' in list[i]) {
          list[i].hightlight = msg
          continue;
        } else {
          Object.assign(list[i], { hightlight: msg })
        }

      }
    },
    async filterData() {
      const selectedHostype = this.hostypeActive;
      const selectedDistrict = this.districtActive;
      const selectedPriceRange = this.value9;
      console.log(selectedHostype, selectedDistrict, selectedPriceRange)
      this.beforeFilterList = this.beforeFilterList.length == 0 ? this.InsuranceList : this.beforeFilterList
      this.beforeTotal = this.beforeTotal == 0 ? this.total : this.beforeTotal
      let filteredArray = this.beforeFilterList.filter(element =>
        ((element.name == selectedHostype) || selectedHostype == '全部') &&
        ((element.genres == selectedDistrict) || selectedDistrict == '全部') &&
        ((element.price <= selectedPriceRange[1]) && (element.price >= selectedPriceRange[0])));
      console.log(filteredArray)
      if (filteredArray.length < 1) {
        this.$message.error("没有满足条件的商品，请重新筛选");
      } else {
        this.InsuranceList = filteredArray
        this.total = filteredArray.length
        this.getPageInfo()
      }
      this.currentPage = 1
      //console.log(selectedHostype, selectedDistrict, selectedPriceRange);
      // try {
      //   const response = await insurancesAPi.SelectInsurance(selectedHostype, selectedDistrict, selectedPriceRange);
      //   const insurances = response.data.Insurances;
      //   this.total = response.data.Insurances.length
      //   this.InsuranceList = insurances
      //   this.list = insurances
      //   if (this.list.length > 12) {
      //     this.getPageInfo()
      //   }
      //   //console.log("筛选", response.data.Insurances);
      // } catch (error) {
      //   console.error('筛选数据失败', error);
      // }
    },
    selectByInterest() {
      let interest = this.$store.getters.getUserInfo.prefGenres
      let userID = this.$store.getters.getUserInfo.username
      this.dynamicTags = interest
      if (interest.length === 0) {
        insurancesAPi.getHotByNum(4).then((response) => {
          // //console.log(response)
          this.recommendList = response.insurances
          if (response.insurances.length < 4) {
            insurancesAPi.getInsuranceListByNew(4).then((response) => {
              this.recommendList.push.apply(this.recommendList, response.insurances)
            })

          }
          this.isFreashState = false
        })
      } else {
        insurancesAPi.getRecommendListByNum(userID, 4).then((response) => {
          console.log("interests", response);
          this.recommendList = response.insurances
          if (this.recommendList.length == 0) {
            let rand = Math.floor(Math.random() * 10)
            console.log("不够",this.InsuranceList)
            this.recommendList.push.apply(this.recommendList, this.InsuranceList.slice(rand, rand + 4))
          }
          this.isFreashState = false
        })
      }

    },
    handleSizeChange(val) {
      this.limit = val;
      this.getPageInfo()
      //console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getPageInfo()
      //console.log(`当前页: ${val}`);
    },

    //点击某个医院名称，跳转到详情页面中
    show(hoscode) {
      this.$router.push({ path: "/hosp/detail", query: { "id": hoscode } })
    },
    showMoreHot() {
      if (this.showMoreText == "查看更多") {
        this.showHotList = this.hotList.slice(0, Math.min(10, this.hotList.length + 1))
        this.showMoreText = "收起"
      } else {
        this.showHotList = this.hotList.slice(0, 5)
        this.showMoreText = "查看更多"
      }
    },
    refreshRecommend() {
      let userID = this.$store.getters.getUserInfo.username
      this.isFreashState = true
      // insurancesAPi.getRecommendListByNum(userID, 4).then((response) => {
      //   //console.log(response)
      //   this.recommendList = response.data.recommendedInsurances
      //   this.isFreashState = false
      // })
      this.selectByInterest()
      // var timer = setInterval(() => {
      //   this.isFreashState = false
      //   clearInterval(timer);
      // }, 1000);
    },
  },
};
</script>
<style scoped>
::v-deep.el-select-dropdown__wrap.el-scrollbar__wrap {
  margin-bottom: 0 !important;
}

.content-wrapper ul {
  /* margin: 0; */
  margin-left: 10px;
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

.content-wrapper .hidden_info {
  color: rgb(172, 172, 172);
  margin-left: 5px;
  /* width: 80px; */
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 12px;
}

.listNum {
  min-width: 20px;
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

.common-dept {
  background-color: #fff;
  border-radius: 10px;
  padding: 10px 5px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .04);
  margin-bottom: 20px;
}

.content-wrapper .infoLine {
  width: 100%;
  height: 40px;
  /* background-color: aqua; */
  text-align: center;
  /* line-height: 40px; */
}
</style>
