<template>
  <div>
    <div class="title">实名认证</div>
    <el-row v-show="userInfo.authStatus == 0">
      <el-col :span="20" :offset="2">
        <div class="status-bar">
          <span class="iconfont"></span>
          完成实名认证后，正常进行购买，为了不影响后续步骤，建议提前实名认证。
        </div>
      </el-col>
      <el-col :span="12" :offset="2">
        <el-form :model="userAuah" label-width="110px" label-position="left">
          <el-form-item prop="name" label="姓名：" class="form-normal" required>
            <div class="name-input">
              <el-input v-model="userAuah.name" placeholder="请输入联系人姓名全称" class="input v-input" />
            </div>
          </el-form-item>
          <el-form-item prop="certificatesType" label="证件类型：" required>
            <el-select v-model="userAuah.certificatesType" placeholder="请选择证件类型" class="v-select patient-select">
              <el-option v-for="item in certificatesTypeList" :key="item.index" :label="item.name" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="certificatesNo" label="证件号码：" required>
            <el-input v-model="userAuah.certificatesNo" placeholder="请输入证件号码" class="input v-input" />
          </el-form-item>
          <el-form-item prop="name" label="上传证件：" required>
            <div class="upload-wrapper">
              <div class="avatar-uploader">
                <el-upload class="avatar-uploader" :action="fileUrl" :show-file-list="false"
                  :on-success="onUploadSuccess">
                  <div class="upload-inner-wrapper">
                    <img v-if="userAuah.certificatesUrl" :src="userAuah.certificatesUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div v-show="!userAuah.certificatesUrl" class="text">
                      上传证件合照
                    </div>
                  </div>
                </el-upload>
              </div>
              <el-image :src="require('@/assets/images/auth_example.png')" class="example"></el-image>
              <!-- <img src="//img.114yygh.com/static/web/auth_example.png" class="example" /> -->
            </div>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="20" :offset="2">
        <div class="bottom-wrapper">
          <div class="button-wrapper">
            <div class="v-button" size="small" @click="saveUserAuah()">
              {{ submitBnt }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row v-show="userInfo.authStatus != 0">
      <el-col :span="20" :offset="2">
        <div class="status-bar">
          <span class="iconfont"></span>
          您已成功完成实名认证！
        </div>
      </el-col>
      <el-col :span="20" :offset="2">
        <div class="context-container">
          <div>
            <el-form :model="userAuah" label-width="110px" label-position="right">
              <el-form-item prop="name" label="姓名：" class="form-normal">
                <div class="name-input">
                  {{ userAuah.name }}
                </div>
              </el-form-item>
              <el-form-item prop="name" label="证件类型：">
                {{ userAuah.certificatesType }}
              </el-form-item>
              <el-form-item prop="name" label="证件号码：">
                {{ userAuah.certificatesNo }}
              </el-form-item>
            </el-form>
          </div>
        </div>

      </el-col>
    </el-row>

  </div>
  <!-- footer -->
</template>

<script>
import dictApi from "@/api/dict";
import userInfoApi from "@/api/userInfo";

const defaultForm = {
  name: "",
  certificatesType: "",
  certificatesNo: "",
  certificatesUrl: "",
};
export default {
  data() {
    return {
      userAuah: defaultForm,
      certificatesTypeList: ["居民身份证", "护照"],
      fileUrl: "http://localhost/api/oss/file/fileUpload",
      userInfo: {
        ID: "",
        param: {},
        authStatus: 0
      },
      submitBnt: "提交",
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.showInfo();
      this.getUserInfoById();
      // this.getDict();
    },

    showInfo() {
      let userInfo = this.$store.getters.getUserInfo
      if (userInfo) {
        this.userInfo.ID = userInfo.ID
        this.userInfo.authStatus = this.$store.getters.getAuthStatus||0
        this.userAuah = this.$store.getters.getCertificates
      }
    },
    getUserInfoById() {
      
      if (this.userInfo.authStatus != 0) {
        // userInfoApi.getUserInfoById(this.userInfo.ID).then((response) => {
        //   this.userInfo = response.data;
        // });
      }
    },
    saveUserAuah() {
      this.$store.commit('UPDATE_CERTIFICATES', this.userAuah)
      this.userInfo.authStatus = 1
      this.$store.commit('UPDATE_AUTHSTATUS',1)
      this.$message.success('恭喜您实名认证成功！');
      return;

      if (this.submitBnt == "正在提交...") {
        this.$message.info("重复提交");
        return;
      }
      this.submitBnt = "正在提交...";
      userInfoApi
        .saveUserAuth(this.userInfo.ID, this.userAuah)
        .then((response) => {
          this.$message.success("提交成功");
          console.log(response);
          this.userInfo.authStatus = 1
          let userInfo = this.$store.getters.getUserInfo
          userInfo.authStatus = this.userInfo.authStatus
          userInfo.autonym = this.userAuah
          this.$store.commit('UPDATE_USERINFO', userInfo);
          window.location.reload();
        })
        .catch((e) => {
          this.submitBnt = "提交";
        });
    },
    // getDict() {
    //   dictApi.findByDictCode("CertificatesType").then((response) => {
    //     this.certificatesTypeList = response.data;
    //   });
    // },
    onUploadSuccess(response, file) {
      if (response.code !== 200) {
        this.$message.error("上传失败");
        return;
      }
      // 填充上传文件列表
      this.userAuah.certificatesUrl = file.response.data;
    },
  },
};
</script>
<style>
.title {
  letter-spacing: 1px;
  font-weight: 700;
  color: #333;
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 20px;
}

.status-bar {
  padding: 20px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin-bottom: 20px;
}


.el-upload {
  border: 1px solid #4990f1;
  cursor: pointer;
  position: relative;
  overflow: hidden
}

.upload-wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex
}

.upload-wrapper .example {
  height: 125px;
  width: 160px;
  margin-left: 40px
}

.upload-inner-wrapper {
  width: 160px;
  height: 125px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  color: #4990f1
}

.upload-inner-wrapper .icon {
  font-size: 36px
}

.upload-inner-wrapper .text {
  font-size: 14px;
  margin-top: 5px
}

.uploaded-img {
  height: 100%
}
</style>
