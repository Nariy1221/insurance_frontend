<template>
    <div>
        <el-form ref="form" :model="form" label-width="150px" style="text-align: left;">
            <el-form-item label="姓名" required style="width:500px">
                <el-input v-model="form.name" placeholder="填写投保人的真实姓名，不要使用别名或化名。"></el-input>
            </el-form-item>

            <el-form-item label="与投保人关系" required prop="relation" style="width:500px">
                <el-select v-model="form.relation" placeholder="请选择与投保人的关系">
                    <el-option :label="item.label" :value="item.label" v-for="item in relationOption"
                        :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="证件类型" prop="region" required style="width:500px">
                <el-select v-model="form.region" placeholder="请选择证件类型">
                    <el-option label="居民身份证" value="居民身份证"></el-option>
                    <el-option label="护照" value="护照"></el-option>
                    <el-option label="外国人永久居留证" value="外国人永久居留证" style="margin-bottom: 10px;"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="证件号" prop="cardID" required style="width:500px">
                <el-input v-model="form.cardID"></el-input><el-button type="text" @click="parseIDCard">快速填入</el-button><span
                    style="color:#898989">（根据身份证号快速填入信息）</span>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item label="性别" required style="width:400px">
                <el-radio-group v-model="form.sex">
                    <el-radio label="男" border></el-radio>
                    <el-radio label="女" border></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="出生日期" required style="width:500px">
                <el-date-picker type="date" placeholder="选择投保人的出生日期" v-model="form.birthday"
                    style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="年龄" required style="width:500px">
                <el-input v-model="form.age" placeholder="填写被投保人年龄。"></el-input>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item label="联系方式" style="width:500px">
                <el-input v-model="form.phone" placeholder="填写被投保人联系方式。"></el-input>
            </el-form-item>
            <el-form-item label="职业">
                <el-select v-model="form.occupation" placeholder="请选择投保人的职业">
                    <el-option label="从事较轻体力工作的人，如办公室职员、教师、学生等" value="1"></el-option>
                    <el-option label="工作场合与工作内容都有一定职业风险，如快递人员、交警、治安人员等" value="2"></el-option>
                    <el-option label="高危职业，比如刑警、消防员等" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="婚姻状况">
                <el-radio-group v-model="form.marriage">
                    <el-radio label="未婚"></el-radio>
                    <el-radio label="已婚(有配偶)"></el-radio>
                    <el-radio label="丧偶"></el-radio>
                    <el-radio label="离婚"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="健康状况">
                <el-input type="textarea" v-model="form.health" placeholder="填写投保人的健康状况，包括是否有慢性病、是否吸烟等。"></el-input>
            </el-form-item>
            <el-form-item label="医疗史">
                <el-input type="textarea" v-model="form.medical_history" placeholder="填写投保人的医疗史，包括手术史、住院史等。"></el-input>
            </el-form-item>
            <el-form-item label="家族病史">
                <el-input type="textarea" v-model="form.family_medical_history"
                    placeholder="填写投保人的家族病史，包括父母、兄弟姐妹、祖辈等的疾病情况。"></el-input>
            </el-form-item>
            <!-- <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item> -->
        </el-form>
    </div>
</template>
  
<script>
const defaultForm = {
    name: '',
    sex: '',
    region: '',
    cardID: '',
    relation: '',
    birthday: '',
    age:'',
    phone: '',
    occupation: '',
    marriage: '',
    health: '',
    medical_history: '',
    family_medical_history: ''
}
export default {
    props:{
        data:{
            type:Object,
            default:() => {}
        }
    },
    data() {
        return {
            form: {
                name: '',
                sex: '',
                region: '',
                cardID: '',
                relation: '',
                birthday: '',
                age:'',
                phone: '',
                occupation: '',
                marriage: '',
                health: '',
                medical_history: '',
                family_medical_history: ''
            },
            relationOption: [
                { "id": 1, "label": "父母" },
                { "id": 2, "label": "配偶" },
                { "id": 3, "label": "子女" },
                { "id": 4, "label": "其他家庭成员" },
                { "id": 5, "label": "近亲属" },
                { "id": 6, "label": "本人" },
                { "id": 7, "label": "其他" },
            ],
        }
    },
    created() {
        this.form = this.data
    },
    mounted() {

    },
    methods: {
        parseIDCard() {
            this.form.age = ''
            this.form.birthday = ''
            this.form.sex = ''
            var idCard = this.form.cardID
            // 正则表达式匹配身份证号格式
            var reg = /^\d{17}[\dXx]$/;

            if (reg.test(idCard)) {
                // 提取出生日期
                var birthday = idCard.substring(6, 14);
                var year = birthday.substring(0, 4);
                var month = birthday.substring(4, 6);
                var day = birthday.substring(6, 8);
                this.form.birthday = year + '-' + month + '-' + day
                // 计算年龄
                var currentYear = new Date().getFullYear();
                var age = currentYear - parseInt(year);
                this.form.age = age
                // 提取性别
                var genderCode = parseInt(idCard.charAt(16));
                var gender = genderCode % 2 === 0 ? "女" : "男";
                this.form.sex = gender
                return {
                    birthday: year + "-" + month + "-" + day,
                    age: age,
                    gender: gender
                };
            }

            return null; // 身份证号格式不正确
        },
    },
    watch:{
        data(nval){
            this.form = nval
        },
        form(nval){
            this.$emit("update:data",nval)
        }
    }
}
</script>
<style scoped></style>