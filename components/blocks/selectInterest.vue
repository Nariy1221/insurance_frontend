<template>
    <!-- <el-col :span="8"> -->
    <div>
        <el-row>
            <el-col :span="20" :offset="2">
                <div class="title">
                    选择你的兴趣，为了让我们更好地了解你的需求。
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20" :offset="2">
                <el-row style="width: 100%; height: 450px;overflow: auto;padding: 10px;" :gutter="10">
                    <!-- <el-col :span="8" v-for="item in 12" :key="item" style="margin-bottom: 10px;">
                        <div style="height: 140px;background-color: aqua;"></div>
                    </el-col> -->
                    <el-checkbox-group v-model="checkboxGroup" size="small" >
                        <el-checkbox :label="item" border class="ckWithImg" v-for="(item, index) in checkOptions"
                            :key="index">
                        <div style="position: absolute;left:0;bottom:0;color:#FAFAFA;z-index: 1;font-weight: 700;width: 100%;height: 40px;background-color: rgba(0,0,0,.2); text-align: center;line-height: 40px;">{{ item }}</div>

                        <el-image :src="require('@/assets/images/genres/'+(index+1)+'.jpg')" style="position: absolute;top:0;left: 0;height: 100%;opacity: .8;"></el-image>

                        </el-checkbox>
                        <!-- <el-checkbox label="备选项2" border></el-checkbox> -->
                    </el-checkbox-group>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8" :offset="2" style="margin-bottom: 10px;">
                我感兴趣的类型有：
            </el-col>
            <el-col :span="20" :offset="2">
                <el-tag :key="tag" v-for="tag in checkboxGroup" :disable-transitions="false" type="success"
                    style="margin-left: 5px;">
                    {{ tag }}
                </el-tag>
            </el-col>
        </el-row>
        <el-row justify="space-around">
            <el-col :span="4" :offset="8">
                <el-button @click="hadChoosed('skip')">跳过</el-button>
            </el-col>
            <el-col :span="4" :offset="1">
                <el-button type="success" @click="hadChoosed('ok')">完成</el-button>
            </el-col>
        </el-row>

    </div>
    <!-- </el-col> -->
</template>
  
<script>
import insurancesAPi from "@/api/insurances";
import userInfoApi from '@/api/userInfo'
export default {
    data() {
        return {
            checkOptions: [],
            checkboxGroup: [],
        }
    },
    created() {
        this.getAllType();
    },
    mounted() {
        let interest = this.$store.getters.getUserInfo.prefGenres
        if (interest) {
            this.checkboxGroup = interest
        }
    },
    methods: {
        hadChoosed(val) {
            if (val === 'skip') {
                this.checkboxGroup = this.checkOptions.slice(0, this.checkOptions.length)
            }
            //console.log(this.checkboxGroup);
            if (this.checkboxGroup.length === 0) {
                this.$message.error("请至少选择1个兴趣");
                return;
            }
            let genres = [this.checkboxGroup[0]]
            for (let i = 1 ; i < this.checkboxGroup.length ;i++){
                genres.push(this.checkboxGroup[i])
            }
            console.log(genres)
            let uid = this.$store.getters.getUserInfo.uid
            userInfoApi.savePrefer(uid,genres).then((response) => {
                if (response.success) {
                    this.$emit('checkboxGroup', this.checkboxGroup)
                    this.$store.commit('UPDATE_USERINTEREST', { interest: this.checkboxGroup })
                    this.$emit('hadChoosed', true)
                    this.$router.go(0)
                }
            });

        },
        getAllType() {
            console.log(this.$store.getters.getInterestOptions)
            this.checkOptions = this.$store.getters.getInterestOptions.interest.filter(type => type !== '全部')
            // insurancesAPi.getAllType().then((response) => {
            //     //console.log("所有类型", response.data.types);
            //     // 去除 "全部" 类型
            //     this.checkOptions = response.data.types.filter(type => type !== '全部');
            //     if (this.checkboxGroup.length === 0)
            //         this.checkboxGroup = this.checkOptions.slice(0, 3)
            // });
        },
    },
}
</script>
<style scoped>
.title {
    text-align: center;
    /* margin-bottom: 20px; */
}

.el-row {
    margin-bottom: 10px;
}

.ckWithImg {
    width: 32%;
    height: 140px !important;
    /* background-color: aqua; */
    position: flex;
    padding-top: 110px !important;
    margin: 0 3px 3px 0 !important;
}
</style>