<template>
  <div>
    <div class="title">账号信息</div>
    <el-row>
      <el-col :span="15" :offset="2">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="个人信息" name="userInfo">

            <el-form ref="form" :model="form" label-width="100px">
              <el-form-item label="姓名"  >
                <el-input v-model="form.name" placeholder="填写投保人的真实姓名，不要使用别名或化名。"></el-input>
              </el-form-item>
              <el-form-item label="性别" >
                <el-radio-group v-model="form.sex">
                  <el-radio label="男" border></el-radio>
                  <el-radio label="女" border></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="出生日期" >
                <el-date-picker type="date" placeholder="选择投保人的出生日期" v-model="form.birthday" style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="职业" style="width: 100%;">
                <el-select v-model="form.occupation" placeholder="请选择投保人的职业" style="width: 100%;">
                  <el-option label="1-3类，低风险（办公室人群，外勤或轻微体力劳动者，设计部分机械操作）" value="1"></el-option>
                  <el-option label="4类，中风险（有一定危险性，如交警、制造工、电梯维修等）" value="2"></el-option>
                  <el-option label="5类，高风险（危险性较高的工作，如高空作业、刑警、电工等）" value="3"></el-option>
                  <el-option label="6类，高风险（高危职业，如消防员、水手、防爆警察等）" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="婚姻状况" >
                <el-radio-group v-model="form.marriage">
                  <el-radio label="未婚"></el-radio>
                  <el-radio label="已婚(有配偶)"></el-radio>
                  <el-radio label="丧偶"></el-radio>
                  <el-radio label="离婚"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="家庭年收入" >
                <el-radio-group v-model="form.income">
                  <el-radio style="margin-top: 10px;" label="1万以内"></el-radio>
                  <el-radio style="margin-top: 10px;" label="1-3万"></el-radio>
                  <el-radio style="margin-top: 10px;" label="3-8万"></el-radio>
                  <el-radio style="margin-top: 10px;" label="8-15万"></el-radio>
                  <el-radio style="margin-top: 10px;" label="15-30万"></el-radio>
                  <el-radio style="margin-top: 10px;" label="30-100万"></el-radio>
                  <el-radio style="margin-top: 10px;" label="100万以上"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="健康状况" >
                <el-input type="textarea" v-model="form.health" placeholder="填写投保人的健康状况，包括是否有慢性病、是否吸烟等。"></el-input>
              </el-form-item>
              <el-form-item label="医疗史">
                <el-input type="textarea" v-model="form.medical_history" placeholder="填写投保人的医疗史，包括手术史、住院史等。"></el-input>
              </el-form-item>
              <el-form-item label="家族病史">
                <el-input type="textarea" v-model="form.family_medical_history" placeholder="填写投保人的家族病史，包括父母、兄弟姐妹、祖辈等的疾病情况。"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button>重置</el-button>
              </el-form-item>
            </el-form>

          </el-tab-pane>
          <el-tab-pane label="修改密码" name="changePWD">
            <el-form label-position="right" label-width="80px" :model="userInfo">
              <!-- <el-form-item label="账号" required>
                <el-input v-model="userInfo.name" maxlength="20"></el-input>
              </el-form-item> -->
              <el-form-item label="旧密码" required>
                <el-input v-model="userInfo.oldPassword" type="password"></el-input>
              </el-form-item>
              <el-form-item label="新密码" required>
                <el-input v-model="userInfo.newPassword" type="password"></el-input>
              </el-form-item>
            </el-form>
            <el-button>重置</el-button>
            <el-button type="primary">提交</el-button>
          </el-tab-pane>
          <el-tab-pane label="其他" name="Internet">其他


          </el-tab-pane>
        </el-tabs>

      </el-col>
    </el-row>

  </div>
</template>
<script>

export default {
  data() {
    return {
      activeName: 'userInfo',
      userInfo: {
        oldPassword: "",
        newPassword: ""
      },
      form: {
        name: '',
        sex: '',
        birthday: '',
        occupation: '',
        marriage: '',
        income: '',
        health:'',
        medical_history: '',
        family_medical_history: ''
      }
    };
  },
  created() {
      this.form = this.$store.getters.getUserDetails
  },
  methods: {
    onSubmit(){
      this.$store.commit('UPDATE_USERDETAILS', this.form)
      console.log(this.form)
    }
  },
};
</script>
<style scoped>
.el-tabs__item {
  font-size: 14px !important;
}
</style>
