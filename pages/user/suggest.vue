<template>
  <div>
    <div class="title">意见反馈</div>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="建议">
            <el-input type="textarea" v-model="form.desc" placeholder="请输入您的建议" rows="5"   maxlength="200"
  show-word-limit></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;">
            <el-button>取消</el-button>
            <el-button type="primary" @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>

    </el-row>

  </div>
</template>
<script>

export default {
  data() {
    return {
      form:{
        desc:""
      }
    };
  },
  created() {

  },
  methods: {
    onSubmit(){
      
    }
  },
};
</script>
