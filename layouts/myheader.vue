<template>
  <div class="header-container">

    <div class="wrapper">
      <!-- logo -->
      <div class="left-wrapper v-link selected" style="cursor: pointer;" @click="showIndex()">
        <img style="height: 50px" src="~assets/images/qxbins/indexlogo.svg" />
        <span class="text" style="width: 180px;color:#8c8c8c;font-size:18px;margin: 0;font-weight: 600;">保险购买平台</span>
      </div>
      <!-- 搜索框 -->
      <div class="search-wrapper">
        <div class="hospital-search animation-show">
          <el-autocomplete ref="auto_input"  class="search-input small" prefix-icon="el-icon-search" v-model="state" :v-el-fous="getFous"
            :trigger-on-focus="true" :fetch-suggestions="querySearchAsync" placeholder="点击输入保险名称" @select="handleSelect">
            <span slot="suffix" class="search-btn v-link highlight clickable selected">搜索
            </span>
          </el-autocomplete>
          <!-- <input  ref="temp"/> -->
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right-wrapper" style="width: auto;">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" style="border: none;">
          <!-- <el-menu-item @click="handleproduct" index="0" style="display: none;">产品中心</el-menu-item> -->
          <el-menu-item @click="handleproduct" index="1">可视化平台</el-menu-item>
          <el-submenu index="2">
            <template slot="title">推荐保险</template>
            <el-menu-item v-for="(item, index) in commonInsurance" :key="index" :index="'2-' + index">{{ item.name
            }}</el-menu-item>
          </el-submenu>
          <!-- <el-menu-item @click="handleorder" index="3">订单管理</el-menu-item> -->

          <el-menu-item v-show="name == ''" class="v-link clickable" @click="showLogin()" style="color:#409EFF;"
            id="loginDialog">登录/注册</el-menu-item>
          <el-submenu index="4" v-show="name != ''">
            <template slot="title">{{ name }}</template>
            <el-menu-item @click="loginMenu('/account')">账户管理</el-menu-item>
            <el-menu-item @click="loginMenu('/user')">实名认证</el-menu-item>
            <el-menu-item @click="loginMenu('/insured')">被保人管理</el-menu-item>
            <el-menu-item @click="loginMenu('/order')">订单管理</el-menu-item>
            <el-menu-item @click="loginMenu('/notice')">消息中心</el-menu-item>
            <el-menu-item @click="loginMenu('/logout')" divided>退出登录</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>

    <el-drawer :title="isNewPeople ? '登录/注册' : '选择你的兴趣'" :visible.sync="dialogUserFormVisible" :direction="'rtl'"
      :before-close="handleClose" :modal-append-to-body="false" :size="'40%'" :destroy-on-close="true" :show-close="isNewPeople" :wrapperClosable="isNewPeople"
      style="transition: all .3s;">
      <el-collapse-transition>
        <div v-show="isNewPeople">
          <el-row>
            <el-col :span="24" style="height: 350px;">
              <div style="padding: 80px 20px 20px" v-show="dialogAtrr.showLoginType === 'phone'">
                <el-row :gutter="20">
                  <el-col :span="18" :offset="3" style="text-align: center;margin-bottom: 30px;">
                    <el-radio-group v-model="dialogAtrr.labelTips" @change="handleChange">
                      <el-radio-button label="手机号登录"></el-radio-button>
                      <el-radio-button label="密码登录"></el-radio-button>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="18" :offset="3">
                    <el-form>
                      <el-form-item>
                        <el-input v-model="dialogAtrr.inputValue" :placeholder="dialogAtrr.placeholder"
                          :maxlength="dialogAtrr.maxlength" class="input v-input" style="font-size: 16px;">
                        </el-input>
                      </el-form-item>
                    </el-form>
                  </el-col>
                  <el-col :span="18" :offset="3">
                    <el-form>
                      <el-form-item>
                        <el-input v-model="dialogAtrr.codeInputValue" :placeholder="dialogAtrr.codeplaceholder"
                          :maxlength="dialogAtrr.codeMaxlength" class="input v-input" style="font-size: 16px;"
                          ref="codeRef" :type="dialogAtrr.labelTips == '密码登录' ? 'password' : 'text'">
                          <span slot="suffix" class="sendText v-link highlight clickable selected"
                            v-show="dialogAtrr.second == -1" @click="getCodeFun()">获取验证码
                          </span>
                          <span slot="suffix" class="sendText v-link" v-show="dialogAtrr.second > 0">{{ dialogAtrr.second
                          }}s
                          </span>
                          <span slot="suffix" class="sendText v-link highlight clickable selected"
                            v-show="dialogAtrr.second == 0" @click="getCodeFun()">重新发送
                          </span>
                        </el-input>
                      </el-form-item>
                    </el-form>
                  </el-col>
                  <el-col :span="18" :offset="3" style="margin-bottom: 20px;">
                    <span style="color: #8e8e8e;">{{ dialogAtrr.info }}</span>
                    <el-link type="info" style="float: right;" v-show="dialogAtrr.labelTips == '密码登录'">忘记密码？</el-link>
                  </el-col>
                  <el-col :span="18" :offset="3">
                    <div class="send-button v-button" @click="btnClick()">
                      {{ dialogAtrr.loginBtn }}
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div>
                <div style="padding: 100px 20px 10px" v-show="dialogAtrr.showLoginType === 'weixin'">
                  <div id="weixinLogin"></div>
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <div style="height: 100px;width: auto;">
                <el-row>
                  <el-col :span="18" :offset="3">
                    <el-divider></el-divider>
                  </el-col>
                  <el-col :span="24">
                    <div style="width: 40px;height: 40px;margin: 0 auto;" @click="weixinLogin()"
                      v-show="dialogAtrr.showLoginType === 'phone'">
                      <div class="iconfont icon wechatIcon"></div>
                    </div>
                    <div style="width: 40px;height: 40px;margin: 0 auto;" @click="phoneLogin()"
                      v-show="dialogAtrr.showLoginType === 'weixin'">
                      <span class="iconfont icon wechatIcon" style="background-color: gray;"></span>
                    </div>
                  </el-col>
                  <el-col :span="24" style="text-align: center;margin-top: 10px;">
                    <span class="third-text" v-show="dialogAtrr.showLoginType === 'phone'"> 第三方账号登录 </span>
                    <span class="third-text" v-show="dialogAtrr.showLoginType === 'weixin'"> 手机短信验证码登录 </span>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="24" style="height: 200px;">
              <div @click="getRecommend()">
                假设登录成功了</div>
            </el-col> 
          </el-row>-->
        </div>
      </el-collapse-transition>
      <el-collapse-transition >
        <div v-show="!isNewPeople">
          <el-row>
            <el-col :span="24" style="height: 600px;">
              <selectInterest @hadChoosed="closeDrawer"></selectInterest>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </el-drawer>
  </div>
</template>
<script>
import cookie from "js-cookie";
import Vue from "vue";
import userInfoApi from "@/api/userInfo";
// import smsApi from "@/api/msm";
import insurancesAPi from "@/api/insurances";
import weixinApi from "@/api/weixin";
import selectInterest from '@/components/blocks/selectInterest'
const defaultDialogAtrr = {
  showLoginType: "phone", // 控制手机登录与微信登录切换
  labelTips: "密码登录", // 输入框提示
  inputValue: "", // 输入框绑定对象
  placeholder: "请输入您的账号", // 输入框placeholder
  maxlength: 15, // 输入框长度控制
  codeplaceholder: "请输入您的密码",
  codeInputValue: "",
  codeMaxlength: 15,
  loginBtn: "下一步", // 登录按钮或获取验证码按钮文本
  info: "*如果账号未注册将自动注册",
  sending: true, // 是否可以发送验证码
  second: -2, // 倒计时间  second>0 : 显示倒计时 second=0 ：重新发送 second=-1 ：什么都不显示
  clearSmsTime: null, // 倒计时定时任务引用 关闭登录层清除定时任务
};
export default {
  name: "myheader",
  components: {
    selectInterest
  },
  data() {
    return {
      userInfo: {
        username: "",
        password: "",
        uid: "",
        first: "",
        prefGenres: [],
        timestamp: 0,
        phone: "",
        code: "",
        openid: "",
        ID: "",
        autonym: []
      },
      radio1: '手机验证码登录',
      activeIndex: "0",
      dialogUserFormVisible: false,
      // 弹出层相关属性
      dialogAtrr: defaultDialogAtrr,
      state: "",
      allInfos: [],
      name: "",
      commonInsurance: [
        { name: '人寿保险', url: "" },
        { name: '平安保险', url: "" },
        { name: '天天保', url: "" },
        { name: '雇主保', url: "" },
        { name: '灵工小保', url: "" },
        { name: '即时保', url: "" },
        { name: '智能定制', url: "" },
        { name: '全球保', url: "" },
      ],
      isNewPeople: true,
      currentSecond: 0,
      getFous:true
    };
  },

  created() {
    this.showInfo();

    let userInfo = this.$store.getters.getUserInfo
    this.name = userInfo.username
    if (userInfo.username != ''&& userInfo.first === true) {
      this.open();
    }

  },

  mounted() {
    // 注册全局登录事件对象
    window.loginEvent = new Vue();
    // 监听登录事件
    loginEvent.$on("loginDialogEvent", function () {
      document.getElementById("loginDialog").click();
    });
    // 触发事件，显示登录层：loginEvent.$emit('loginDialogEvent')

    //初始化微信js
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js";
    document.body.appendChild(script);

    // 微信登录回调处理
    let self = this;
    window["loginCallback"] = (name, token, openid) => {
      self.loginCallback(name, token, openid);
    };
  },
  computed: {

  },
  methods: {
    handleChange() {
      if (this.dialogAtrr.labelTips == "密码登录") {
        this.currentSecond = this.dialogAtrr.second
        this.dialogAtrr.inputValue = ""
        this.dialogAtrr.placeholder = "请输入您的账号" // 输入框placeholder
        this.dialogAtrr.maxlength = 15 // 输入框长度控制
        this.dialogAtrr.codeplaceholder = "请输入您的密码"
        this.dialogAtrr.codeInputValue = ""
        this.dialogAtrr.codeMaxlength = 15
        this.dialogAtrr.second = -2
        this.dialogAtrr.info = "*如果账号未注册将自动注册"
      } else if (this.dialogAtrr.labelTips == "手机号登录") {
        this.dialogAtrr.inputValue = this.userInfo.phone // 输入框绑定对象
        this.dialogAtrr.placeholder = "请输入您的手机号" // 输入框placeholder
        this.dialogAtrr.maxlength = 11 // 输入框长度控制
        this.dialogAtrr.codeplaceholder = "请输入验证码"
        this.dialogAtrr.codeInputValue = ""
        this.dialogAtrr.codeMaxlength = 6
        this.dialogAtrr.second = this.currentSecond
        this.dialogAtrr.info = "*如果手机号未注册将自动注册"
      }

    },

    querySearchAsync(queryString, cb) {
      insurancesAPi.getInsurancetByQuery(queryString,20).then((response) => {
          console.log(response.insurances.length)

          this.allInfos = response.insurances
        })
      let results = this.allInfos;
      // results = queryString
      //   ? results.filter(this.createFilter(queryString))
      //   : results;
      console.log(results)
      results = results.map((terminal) => {
        return {
          value: terminal.descri,
          name: terminal.mid,
        };
      });
      cb(results)
    },
    createFilter(queryString) {
      return (item) => {
        return item.descri.toUpperCase().match(queryString.toUpperCase());
      };
    },
    //微信回调方法
    loginCallback(name, token, openid) {
      // 打开手机登录层，绑定手机号，改逻辑与手机登录一致
      if (openid != '') {
        this.userInfo.openid = openid
        this.showLogin()
      } else {
        this.setCookies(name, token)
      }
    },

    // 绑定登录或获取验证码按钮
    btnClick() {
      // 判断是获取验证码还是登录
      if (this.dialogAtrr.loginBtn == "获取验证码") {
        this.userInfo.phone = this.dialogAtrr.inputValue;
        // 获取验证码
        this.getCodeFun();
      } else {
        // 登录
        this.login();
      }
    },

    // 绑定登录，点击显示登录层
    showLogin() {
      this.dialogUserFormVisible = true;
    },
    handleClose() {
      this.dialogUserFormVisible = false;
    },
    handleInterestClose(){

    },
    async login() {
      const code = this.dialogAtrr.codeInputValue;
      if (this.dialogAtrr.labelTips == "手机号登录") {
        // 避免重复提交
        if (this.dialogAtrr.loginBtn === "正在提交...") {
          this.$message.error("重复提交");
          return;
        }
        // 验证码校验
        if (!code || code.length !== 6) {
          this.$message.error("验证码必须输入且格式不正确");
          return;
        }
        this.dialogAtrr.loginBtn = "正在提交...";

        try {
          const loginResponse = await userInfoApi.loginWithPhoneCode(this.dialogAtrr.inputValue, code);
          //console.log("loginResponse", loginResponse);
          const name =
            loginResponse.data.uid.substring(0, 3) +
            "***" +
            loginResponse.data.uid.substring(9, 11);

          const successMessage = loginResponse.action === "register" ? '注册成功！欢迎使用企小保' : '登录成功！欢迎回来';
          this.userInfo.ID = loginResponse.data.uid
          this.userInfo.phone = loginResponse.data.uid
          this.$store.commit('UPDATE_USERINFO', this.userInfo);
          this.$message.success(successMessage);
          this.setCookies(name, loginResponse.data.token, loginResponse.action);
        } catch (error) {
          this.$message.error("登录失败，请重试"); // 根据实际情况处理错误消息
        } finally {
          this.dialogAtrr.loginBtn = "马上登录";
        }
      }
      else {
        console.log('登录了' + this.dialogAtrr.inputValue + '=' + code)
        // 避免重复提交
        if (this.dialogAtrr.loginBtn === "正在提交...") {
          this.$message.error("重复提交");
          return;
        }
        this.dialogAtrr.loginBtn = "正在提交...";
        try {
          const loginResponse = await userInfoApi.loginWithID(this.dialogAtrr.inputValue, code);
          console.log("loginResponse", loginResponse);

          if (loginResponse.success === true && 'user' in loginResponse) {
            const successMessage = '登录成功！欢迎回来';
            this.userInfo.uid = loginResponse.user.uid
            this.name = loginResponse.user.username
            this.isNewPeople = loginResponse.user.first
            if (loginResponse.user.first) {
              this.getRecommend()
            } else {
              this.handleClose();
              window.location.reload();
            }

            // const name = loginResponse.user.uid.substring(0, 3);
            this.$store.commit('UPDATE_USERINFO', loginResponse.user);
            this.$message.success(successMessage);
            // this.setCookies(name, loginResponse.user.token, loginResponse.action);
          } else {
            const registerResponse = await userInfoApi.registerWithID(this.dialogAtrr.inputValue, code);
            console.log("registerResponse", registerResponse);
            if (registerResponse.success === true) {
              this.$message.success('注册成功！欢迎使用企小保!正在登录...');
              const loginResponse = await userInfoApi.loginWithID(this.dialogAtrr.inputValue, code);
              if (loginResponse.success === true) {
                this.userInfo.ID = loginResponse.user.uid
                this.name = loginResponse.user.username
                this.isNewPeople = loginResponse.user.first
                if (loginResponse.user.first) {
                  this.getRecommend()
                } else {
                  this.handleClose();
                }
                this.$store.commit('UPDATE_USERINFO', loginResponse.user);
              } else {
                this.$message.error("账户名或密码错误，请重试");
              }
            } else {
              this.$message.error("登录失败，请重试2");
            }
          }
        } catch (error) {
          console.log(error)
          this.$message.error("登录失败，请重试3"); // 根据实际情况处理错误消息
        } finally {
          // this.dialogAtrr.loginBtn = "马上登录";
        }
      }

    },
    setCookies(name, token, action) {
      cookie.set("token", token, { domain: "localhost" });
      cookie.set("name", name, { domain: "localhost" });

      if (action === 'register') {
        this.showLogin();
        this.getRecommend();
      } else {
        window.location.reload();
      }
    },
    // 获取验证码
    getCodeFun() {
      this.userInfo.phone = this.dialogAtrr.inputValue;
      //console.log(this.userInfo.phone)
      if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.userInfo.phone)) {
        this.$message.error("手机号码不正确");
        return;
      }
      // 控制重复发送
      if (!this.dialogAtrr.sending) return;
      this.$refs.codeRef.focus();
      // 发送短信验证码
      this.timeDown();
      this.dialogAtrr.sending = false;
      userInfoApi
        .sendVerificationCode(this.userInfo.phone)
        .then((response) => {
          // 验证码发送成功的处理逻辑
          this.$message.success('验证码发送成功');
          this.timeDown();
        })
        .catch((e) => {
          // 验证码发送失败的处理逻辑
          this.$message.error('发送失败，重新发送');
          this.dialogAtrr.sending = true;
          this.dialogAtrr.second = 0;
        });
    },

    // 倒计时
    timeDown() {
      if (this.clearSmsTime) {
        clearInterval(this.clearSmsTime);
      }
      this.dialogAtrr.second = 60;

      // this.dialogAtrr.labelTips = "验证码已发送至" + this.userInfo.phone;
      this.clearSmsTime = setInterval(() => {
        --this.dialogAtrr.second;
        if (this.dialogAtrr.second < 1) {
          clearInterval(this.clearSmsTime);
          this.dialogAtrr.sending = true;
          this.dialogAtrr.second = 0;
        }
      }, 1000);
    },

    // 关闭登录层
    closeDialog() {
      if (this.clearSmsTime) {
        clearInterval(this.clearSmsTime);
      }
    },
    showInfo() {
      let userInfo = this.$store.getters.getUserInfo
      let token = cookie.get("token");
      if (token) {
        this.name = cookie.get("name");
      }
    },

    loginMenu(command) {
      //console.log(command)
      if ("/logout" == command) {
        this.$confirm("是否要退出登录", "提示", {
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

              cookie.set("name", "", { domain: "localhost" });
              cookie.set("token", "", { domain: "localhost" });
              this.$store.dispatch('loginOut');
              this.name = "";
              this.$router.push({ path: "/"})
              window.location.reload();
              // this.$router.go(0)

            } else if (e == 'close') {//取消
            }
          });

      } else {
        this.$router.push({ path: "/user", query: { "url": command } })
      }
    },

    weixinLogin() {
      this.dialogAtrr.showLoginType = "weixin";
      //初始化微信相关参数
      weixinApi.getLoginParam().then((response) => {
        var obj = new WxLogin({
          self_redirect: true,
          id: "weixinLogin", // 需要显示的容器id
          appid: response.data.appid, // 公众号appid wx*******
          scope: response.data.scope, // 网页默认即可
          redirect_uri: response.data.redirectUri, // 授权成功后回调的url
          state: response.data.state, // 可设置为简单的随机数加session用来校验
          style: "black", // 提供"black"、"white"可选。二维码的样式
          href: "", // 外部css文件url，需要https
        });
      });
    },

    phoneLogin() {
      this.dialogAtrr.showLoginType = "phone";
      this.showLogin();
    },
    showIndex() {
      this.$router.push({ path: "/" })
    },
    //在下拉框选择某一个内容，执行下面方法，跳转到详情页面中
    handleSelect(item) {
      //console.log(item)
      this.$router.push({ path: "/hosp/detail", query: { "id": item.name } })
    },
    handleproduct() {
      this.$router.push({ path: "/product/" })
    },
    show(hoscode) {
      this.$router.push({ path: "/hosp/", query: hoscode })
    },
    getRecommend() {
      this.isNewPeople = false
    },
    closeDrawer(msg) {
      this.dialogUserFormVisible = !msg
      this.open();
    },
    movetoShiming() {
      this.$router.push({ path: '/user', query: { "url": "shiming" } })
    },
    open() {
      const h = this.$createElement
      const hrender = h('p', null, [
        h('div', [
          h('div', '实名认证后方可购买保险'), // 传变量
          h('strong', '请在右上角下拉框，选择“实名认证”完成。'), // 传变量
        ], null)
      ])
      this.$notify({
        title: '新用户需完成实名认证！',
        dangerouslyUseHTMLString: true,
        message: hrender,
        position: 'bottom-right',
        // duration: 0
      });
    }
  },
  watch:{
    allInfos(nval){
      // this.$refs.auto_input.blur()
      // this.$refs.temp.focus()
    }
  }

};
</script>
<style scoped>
.el-menu-item {
  transition: none !important;
}

.el-menu-item.is-active {
  /* border-bottom: 2px solid #409EFF; */
  border-bottom: none !important;
  color: #303133;
}

.wechatIcon {
  color: aliceblue;
  width: 40px;
  height: 40px;
  font-size: 24px;
  line-height: 40px;
  border-radius: 25px;
  background-color: #27d96f;
  transition: all .3s;
  cursor: pointer;
  user-select: none;
}

.wechatIcon:hover {
  background-color: #22b35c;
}

.el-drawer {
  transition: all .3s !important;
}
</style>

