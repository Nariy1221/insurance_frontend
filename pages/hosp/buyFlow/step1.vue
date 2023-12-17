<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card class="card-box">
                    <div slot="header" class="clearfix">
                        <span class="form-title">投保人信息</span>
                    </div>
                    <div class="grid-content bg-purple">
                        <el-form :inline="true" :model="applicantForm" :rules="rules" ref="applicantForm"
                            label-width="120px" class="demo-applicantForm">
                            <el-form-item label="投保人姓名" prop="name">
                                <el-input v-model="applicantForm.name" style="width:300px"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号" prop="phone">
                                <el-input v-model="applicantForm.phone" style="width:300px"></el-input>
                            </el-form-item>
                            <el-form-item label="证件类型" prop="region">
                                <el-select v-model="applicantForm.region" placeholder="请选择证件类型" style="width:300px">
                                    <el-option label="居民身份证" value="居民身份证"></el-option>
                                    <el-option label="护照" value="护照"></el-option>
                                    <el-option label="外国人永久居留证" value="外国人永久居留证" style="margin-bottom: 10px;"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="证件号" prop="cardID">
                                <el-input v-model="applicantForm.cardID" style="width:300px"></el-input>
                            </el-form-item>

                            <el-form-item label="投保时间" required>
                                <el-date-picker v-model="applicantForm.date1" type="datetime" format="yyyy-MM-dd"
                                    placeholder="投保时间" disabled style="width:300px">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="特殊说明" prop="specialInstructions">
                                <el-input type="textarea" v-model="applicantForm.specialInstructions"
                                    style="width:300px"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="24">
                <el-card class="card-box">
                    <div slot="header" class="clearfix">
                        <span class="form-title">被投保人信息</span>
                        <div style="float: right;width: 300px;margin-right:10px;text-align: right;"
                            v-show="historyTags.length != 0">
                            <span style="color: grey;">历史记录：</span>
                            <el-tag :key="index" v-for="(tag, index) in historyTags" class="historyTag"
                                :disable-transitions="false" type="success" @click="loadHistory(tag)" size="small">
                                <el-popover placement="top-start" :title="tag.insuranceExceptName" width="200"
                                    trigger="hover"
                                    :content="tag.relationShip + '-' + tag.insuranceExceptIdNumber + '-' + tag.insuranceExceptPhoneNumber">
                                    <span slot="reference">{{ tag.relationShip }}
                                    </span> </el-popover>
                            </el-tag>
                        </div>
                    </div>
                    <div class="grid-content bg-purple">
                        <el-row :gutter="10">
                            <el-col :span="6" v-for="(item, index) in insuredForm" :key="index">
                                <div style="" class="people_blocks"
                                    :class="checkGroup.indexOf(item) == -1 ? '' : 'activate'"
                                    @click.stop="setActivate(item)">
                                    <div style="position: absolute;right: 25px; top: 10px;" class="close"
                                        @click="showDialog(item)">
                                        <i class="el-icon-edit"></i>
                                    </div>
                                    <div style="position: absolute;right: 5px; top: 10px;" class="close">

                                        <el-popconfirm title="确定删除吗？" @confirm="deletePeople(item)">
                                            <i class="el-icon-close" slot="reference"></i>
                                        </el-popconfirm>
                                    </div>

                                    <div>{{ item.name }} <el-tag
                                            :type="checkGroup.indexOf(item) == -1 ? 'info' : 'success'">{{ item.relation
                                            }}</el-tag></div>
                                    <div style="font-size: 12px;color: #676767;">{{ item.sex }} {{ item.age }}{{ item.age?'岁':'' }}</div>
                                </div>

                            </el-col>

                            <el-col :span="6">
                                <div class="people_blocks" @click="showDialog()"
                                    style="font-size: 16px;background-color: #83b0f8;color:#FAFAFA;font-weight: 600;">
                                    <i class="el-icon-circle-plus-outline" style="margin:0 10px 5px 0;font-size: 20px;"></i>
                                    新建被投保人
                                </div>
                                <!-- <div style="height: 100px; background-color: antiquewhite;"> -->

                                <!-- </div> -->
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-divider></el-divider>
                            </el-col>
                            <el-col :span="24" style="display: flex;align-items: center;">
                                当前被投保人：
                                <div v-for="(item, index) in checkGroup" :key="index">
                                    <el-tag type="success" closable @close="handleClose(item)" style="margin-right: 6px;">{{
                                        item.name }}</el-tag>
                                </div>
                                （共 {{ checkGroup.length }} 位被保人）
                            </el-col>


                        </el-row>
                        <!-- <el-form :model="insuredForm" :rules="rules" ref="insuredForm" label-width="120px"
                            class="demo-insuredForm">

                            <el-form-item label="被投保人姓名" prop="name">
                                <el-input v-model="insuredForm.name" placeholder="请输入被投保人姓名"></el-input>
                            </el-form-item>
                            <el-form-item label="证件类型" prop="region">
                                <el-select v-model="insuredForm.region" placeholder="请选择证件类型" style="width: 100%;">
                                    <el-option label="居民身份证" value="居民身份证"></el-option>
                                    <el-option label="护照" value="护照"></el-option>
                                    <el-option label="外国人永久居留证" value="外国人永久居留证" style="margin-bottom: 10px;"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="证件号" prop="cardID">
                                <el-input v-model="insuredForm.cardID" placeholder="请选择被投保人证件号"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号" prop="phone">
                                <el-input v-model="insuredForm.phone" placeholder="若无，则填写投保人手机号"></el-input>
                            </el-form-item>
                            <el-form-item label="与投保人关系" prop="relation">
                                <el-select v-model="insuredForm.relation" placeholder="请选择与投保人的关系" style="width: 100%;"
                                    @change="whatRelation">
                                    <el-option :label="item.label" :value="item.label" v-for="item in relationOption"
                                        :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="特殊说明" prop="specialInstructions">
                                <el-input type="textarea" v-model="insuredForm.specialInstructions"></el-input>
                            </el-form-item>
                        </el-form> -->
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row style="text-align: center;margin-top: 10px;">
            <el-checkbox style="margin:0 10px;" v-model="checked" @change="transfer"></el-checkbox><span>我已阅读<el-link
                    type="success">《投保须知》</el-link>和<el-link type="success">《保险条款》</el-link></span>
        </el-row>
        <el-dialog :title="dialogOpt.title" :visible.sync="dialogFormVisible">
            <el-row>
                <el-col :span="22">
                    <insuredPeopleInfo :data="currentForm" :destroy-on-close="true"></insuredPeopleInfo>
                </el-col>
            </el-row>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDialogCommit">{{ dialogOpt.buttonLabel }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
import FormData from "@/temp_data/FormData"
import insuranceApi from "@/api/insurances";
import insuredPeopleInfo from '@/components/blocks/insuredPeopleInfo'
export default {
    name: 'step1',
    props: ["item","insured"],
    components: { insuredPeopleInfo },
    data() {
        return {
            checked: false,
            isComplete: false,
            checkGroup: [],
            dialogFormVisible: false,
            dialogOpt: {
                title: '新建被保人',
                buttonLabel: '添  加',
            },
            defaultForm: {
                id:'',
                name: '',
                sex: '',
                region: '',
                cardID: '',
                relation: '',
                birthday: '',
                phone: '',
                occupation: '',
                marriage: '',
                health: '',
                medical_history: '',
                family_medical_history: ''
            },
            currentForm: {

            },
            applicantForm: {
                cardID: "",
                name: '',
                region: '居民身份证',
                date1: Date.now(),
                phone: '',
                type: [],
                specialInstructions: '',
            },
            insuredForm: [{
                id:1,
                cardID: "111111111",
                name: '张三',
                region: '居民身份证',
                relation: '父母',
                sex: '男',
                age: 55,
                phone: '112312312123',
                birthday: '',
                occupation: '',
                marriage: '',
                health: '',
                medical_history: '',
                family_medical_history: ''
            }, {
                id:2,
                cardID: "111111111",
                name: '李四',
                region: '居民身份证',
                relation: '配偶',
                sex: '男',
                age: 22,
                phone: '112312312123',
                birthday: '',
                occupation: '',
                marriage: '',
                health: '',
                medical_history: '',
                family_medical_history: ''
            }, {
                id:3,
                cardID: "111111111",
                name: '王五',
                region: '居民身份证',
                relation: '子女',
                sex: '男',
                age: 1,
                phone: '112312312123',
                birthday: '',
                occupation: '',
                marriage: '',
                health: '',
                medical_history: '',
                family_medical_history: ''
            },],
            historyTags: [],
            relationOption: [
                { "id": 1, "label": "父母" },
                { "id": 2, "label": "配偶" },
                { "id": 3, "label": "子女" },
                { "id": 4, "label": "其他家庭成员" },
                { "id": 5, "label": "近亲属" },
                { "id": 6, "label": "本人" },
                { "id": 7, "label": "其他" },
            ],
            rules: {
                cardID: [
                    { required: true, message: '请输入证件号码', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                region: [
                    { required: true, message: '请选择证件类型', trigger: 'change' }
                ],
                relation: [
                    { required: true, message: '请输入与投保人的关系', trigger: 'change' }
                ],
                date1: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'blur' }
                ],
            }
        };
    },
    created() {

        this.applicantForm.name = this.$store.state.userInfo.username
        this.applicantForm.region = '居民身份证'
        this.applicantForm.cardID = this.$store.state.user.cardID
        this.applicantForm.phone = this.$store.state.user.phone
        this.init();
    },
    methods: {
        init() {
            FormData[0] = this.applicantForm
            FormData[1] = this.insuredForm
            // insuranceApi.getHistoryByUserId('111', 3).then((response) => {
            //     console.log('history', response.data)
            //     this.historyTags = response.data
            // })
        },
        reset() {
            this.quickComplete("", "", "", "", "")
        },
        setActivate(item) {
            let temp = this.checkGroup.indexOf(item)
            if (temp != -1) {
                this.checkGroup.splice(temp, 1)
            } else {
                this.checkGroup.push(item)
            }
        },
        deletePeople(val) {
            console.log(val)
            let item =this.insuredForm.find(item => item.id == val.id);
            let index = this.insuredForm.indexOf(item)
            this.insuredForm.splice(index,1)
            this.checkGroup = []
        },
        showDialog(item) {
            if (item)
                this.currentForm = { ...item }
            else{
                this.currentForm = { ...this.defaultForm }
                this.currentForm.id = this.insuredForm.length +1
            }
                
            if (!item) {
                this.dialogOpt = {
                    title: '新建被保人',
                    buttonLabel: '添  加',
                }
                
            } else {
                this.dialogOpt = {
                    title: '编辑被保人',
                    buttonLabel: '修  改',
                }
            }
            this.dialogFormVisible = true
        },
        handleDialogCommit(){
            if(this.dialogOpt.title == '新建被保人'){
                this.insuredForm.push(this.currentForm)
            }else{
                let item =this.insuredForm.find(item => item.id == this.currentForm.id);
                let index = this.insuredForm.indexOf(item)
                this.insuredForm[index] = this.currentForm
            }
            this.dialogFormVisible = false
        },
        handleClose(val) {
            let temp = this.checkGroup.indexOf(val)
            this.checkGroup.splice(temp, 1)
        },
        transfer() {
            // this.validateFrom()

            let isComplete = this.checkGroup.length > 0
            this.$emit('transfer', { isCheck: this.checked, isComplete: isComplete })
        },
        validateFrom() {
            let isApplicantFormValidate = false;
            let isInsuredFormValidate = false;
            this.$refs['insuredForm'].validate((valid) => {
                if (valid) {
                    isInsuredFormValidate = true;
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
            this.$refs['applicantForm'].validate((valid) => {
                if (valid) {
                    isApplicantFormValidate = true;
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
            this.isComplete = isInsuredFormValidate && isApplicantFormValidate
        },
        loadHistory(tag) {

            this.quickComplete(tag.relationShip, tag.insuranceExceptName, tag.insuranceExceptLicenseType, tag.insuranceExceptIdNumber, tag.insuranceExceptPhoneNumber)
            this.$message({ message: '已读取' + tag.insuranceExceptName + '（' + tag.relationShip + '）的信息', type: 'success' });

        },
        whatRelation() {
            if (this.insuredForm.relation == "本人")
                this.quickComplete("本人", "", "", "", "")
        },
        quickComplete(relation, name, region, cardID, phone) {
            if (relation == '本人') {
                this.insuredForm.name = this.applicantForm.name
                this.insuredForm.region = this.applicantForm.region
                this.insuredForm.cardID = this.applicantForm.cardID
                this.insuredForm.phone = this.applicantForm.phone
                this.insuredForm.relation = relation
                FormData[1] = this.insuredForm
                return
            }
            this.insuredForm.name = name
            this.insuredForm.region = region
            this.insuredForm.cardID = cardID
            this.insuredForm.phone = phone
            this.insuredForm.relation = relation
            FormData[1] = this.insuredForm
        }
    },
    watch:{
        checkGroup(nval){
            console.log(nval)
            this.$emit("update:insured",nval)
        }
    }


}
</script>
<style scoped>
.card-box {
    /* margin-left: 10px; */
    margin-bottom: 10px;
}

.el-card ::v-deep .el-card__header {
    padding: 10px 0px 10px 25px;
    background-color: rgb(212, 241, 230);
}

.historyTag {
    margin-left: 5px;
    cursor: pointer;
}

.historyTag:hover {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .04);
}

.form-title {
    font-size: 18px;
    font-weight: bold;
    color: #6d6c6c;
}

.people_blocks {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    margin: 5px;
    background-color: #f1f4f9;
    border-radius: 10px;
    cursor: pointer;
    color: #353535;
    border: 3px solid #ebf1fc;
    font-size: 16px;
    flex-direction: column;
    position: relative;
}

.people_blocks:hover {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .04);
    /* background-color: #dcf0e7b7; */
}

.people_blocks:hover .close {
    display: block;
}

.activate {
    border: 3px solid rgb(212, 241, 230);
    background-color: #dcf0e7b7;
}

.close {
    font-size: 14px;
    text-align: center;
    display: none;

}

.close i {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    line-height: 20px;
    transition: all ease .3s;
}

.close i:hover {
    background-color: #dddede;
}
</style>