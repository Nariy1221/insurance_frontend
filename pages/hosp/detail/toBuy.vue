<template>
    <div>
        <el-row>
            <el-col :span="20" :offset="2" style="margin-top: 20px;margin-bottom: 20px;">
                <el-steps :active="stepActivate" align-center finish-status="success">
                    <el-step :title="item.title" v-for="(item, index) in stepInfo" :key="index"></el-step>
                </el-steps>
            </el-col>
            <el-col :span="24">
                <div class="common-header">
                    <div class="title-wrapper" style="text-align: center;margin-top: 20px;margin-bottom: 20px;">
                        <span style="font-size: 20px;font-weight: bold;">{{ hospital.descri }} </span><span
                            style="color: grey;">（{{ hospital.name }}）</span>
                        <!-- <div class="icon-wrapper"> -->

                        <!-- </div> -->
                    </div>
                </div>
            </el-col>
            <el-row justify="space-between">
                <el-col>
                    <step1 ref="step1" :item="hospital" v-if="stepActivate === 0" @transfer="getCanNext" :insured.sync="insuredFrom"></step1>
                    <step2 :item="hospital" v-if="stepActivate === 1" @price="handleDataFromChild"
                        @oldPrice="handleOldPriceFromChild"></step2>
                    <step3 :item="hospital" v-if="stepActivate === 2" :countdownTime="countdownTime" :theOrder.sync="orderInfo"
                        :receivedPrice="receivedPrice" :receivedOldPrice="receivedOldPrice" @choosePay="go2Pay"></step3>
                    <step4 :item="hospital" v-if="stepActivate === 3" :relatedList="relatList" @buyNewOne="buyNew"></step4>
                </el-col>
            </el-row>
            <el-row justify="space-between" style="margin-top: 20px;">
                <el-col :span="6" :offset="9">
                    <!-- 根据 stepActivate 的值来显示按钮 -->
                    <template v-if="stepActivate === 0">
                        <el-button type="submit" icon="" @click="resetFrom()">重置</el-button>
                        <el-button type="success" icon="el-icon-arrow-right" @click="nextStep()"
                            :disabled="!step1CanNext">下一步</el-button>
                    </template>
                    <template v-else-if="stepActivate === 1">
                        <el-button type="submit" icon="el-icon-arrow-left" @click="backStep()">上一步</el-button>
                        <el-button type="success" @click="nextStep()">确认支付</el-button>
                    </template>
                    <template v-else-if="stepActivate === 2">
                        <el-button type="submit" icon="el-icon-arrow-left" @click="backStep()">上一步</el-button>
                        <el-button type="success" @click="nextStep()">立即支付</el-button>
                    </template>
                    <template v-else-if="stepActivate === 3">
                    </template>
                </el-col>
            </el-row>

        </el-row>

        <el-dialog :title="'请使用' + whatMethod + '扫一扫'" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <span> {{ payMsg }}</span>
            <qriously :value="'1111'" :size="200" style="    margin-top: 10px;" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">暂不支付</el-button>
                <el-button type="success" @click="closeDialogVisible()">支付完成</el-button>
            </span>
        </el-dialog>
    </div>
</template>
  
<script>
import "~/assets/css/hospital_personal.css";
import orderApi from "@/api/order";
import cookie from "js-cookie";
import userInfoApi from '@/api/userInfo'
import blockList from "@/temp_data/blockList"
import step1 from '@/pages/hosp/buyFlow/step1'
import step2 from '@/pages/hosp/buyFlow/step2'
import step3 from '@/pages/hosp/buyFlow/step3'
import step4 from '@/pages/hosp/buyFlow/step4'
import FormData from "@/temp_data/FormData"
// import countdownInstance from '@/scripts/countdown.js'
export default {
    props: ["item","relatedList"],
    // mixins: [countdownInstance],
    components: {
        step1,
        step2,
        step3,
        step4,
    },
    data() {
        return {
            hoscode: this.item.hoscode,
            activeIndex: 0,
            hospital: this.item,
            bookingRule: {},
            departmentVoList: [],
            stepInfo: [
                { title: "填写投保信息" },
                { title: "确认投保信息" },
                { title: "保费支付" },
                { title: "完成" },
            ],
            stepActivate: 0,
            countdownTime: '',
            dialogVisible: false,
            receivedPrice: 0,
            receivedOldPrice: 0,
            hotlist: blockList.slice(0, 5),
            step1CanNext: false,
            choosePayMethod: 1,
            payMsg:'扫描二维码支付',
            insuredFrom:[],
            relatList:[],
            orderInfo:{
                    payment_type:'',
                    status:'未完成',
                    create_time:'',
                    code:''
            },
        };
    },
    beforeDestroy() {
    },
    created() {
        this.hospital = this.item
        this.hoscode = this.hospital.hoscode;
        // console.log(this.hospital)
        this.init();

    },
    mounted() {
        console.log("收到",this.relatedList)
        let step = this.$store.getters.getBuyFlow.step
        if (step < 4) {
            this.stepActivate = step
        }
        this.$on('countdown-updated', (time) => {
            this.countdownTime = time;
        });
        let body = document.querySelector('body')
        window.addEventListener('beforeunload', this._beforeunloadHandler)

    },
    methods: {
        resetFrom() {
            // console.log(this.$refs)
            this.$refs.step1.reset();//需要先挂载
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        buyNew(msg) {
            this.stepActivate = msg
            this.$store.commit('UPDATA_BUYFLOW', { url: "toBuy", step: 0 })
        },
        _beforeunloadHandler(event) {
            event.preventDefault();
            event.returnValue = '您未完成购买流程，是否确认离开'
            return '您未完成购买流程，是否确认离开'
        },
        getCanNext(msg) {
            this.step1CanNext = msg.isCheck && msg.isComplete
        },
        go2Pay(msg) {
            console.log('payMethod', msg.payMethod)
            this.choosePayMethod = msg.payMethod

        },
        handleDataFromChild(data) {
            // console.log(data)
            this.receivedPrice = data;

        },
        handleOldPriceFromChild(data) {
            // console.log(data)
            this.receivedOldPrice = data;
        },

        //返回
        backIndex() {
            this.$router.push("/")
        },
        //支付成功关闭窗口，并跳转到step4
        closeDialogVisible() {
            this.dialogVisible = false;
            this.stepActivate++;
            this.cancelOrder('已完成',this.whatMethod)
        },
        backStep() {
            if (this.stepActivate > 0 && this.stepActivate < 2) {
                this.stepActivate--;
                return;
            }

            this.$confirm("支付未完成, 是否要取消订单", "提示", {
                confirmButtonText: "否",
                cancelButtonText: "是",
                type: "warning",
                distinguishCancelAndClose: true,    // 重要，设置为true才会把右上角X和取消区分开来
                closeOnClickModal: false
            })
                .then(() => {

                })
                .catch((e) => {
                    if (e == 'cancel') {
                        this.stepActivate--;
                        this.cancelOrder('已取消')
                    } else if (e == 'close') {

                    }
                });

        },
        nextStep() {
            //每一步增加条件
            if (this.stepActivate === 0) {
                console.log("111",this.insuredFrom)
                if (this.insuredFrom.length>0) {
                    // this.stepActivate++
                    console.log("111",this.insuredFrom)
                    // let data = {
                    //     insuranceExceptName: FormData[1].name,
                    //     insuranceExceptLicenseType: FormData[1].region,
                    //     insuranceExceptIdNumber: FormData[1].cardID,
                    //     insuranceExceptPhoneNumber: FormData[1].phone,
                    //     relationShip: FormData[1].relation,
                    //     insuranceExceptRemark: FormData[1].specialInstructions,
                    // }
                    this.$store.commit('UPDATE_INSURANCE', this.insuredFrom)
                    this.toNewPage();
                }
                else {
                    this.errorMessage();
                }
            }
            else if (this.stepActivate === 1) {
                this.createOrder();
                // this.startCountdown();
                // this.stepActivate++
            }
            else if (this.stepActivate === 2) {
                // this.payMoney();
                this.dialogVisible = true
            }
        },
        toNewPage() {
            window.scrollTo(0, 0)
            this.stepActivate++
        },
        //错误提示
        errorMessage() {
            this.$message({
                message: '请将表单补充完整',
                type: 'error'
            });
        },
        payMoney() {
            // alert(this.choosePayMethod)
        },
        createOrder() {
            let uid = this.$store.getters.getUserInfo.uid
            // console.log(uid,this.item.mid)
            orderApi.createOrder(uid, this.item.mid).then((response) => {
                if (response.success === true) {
                    this.toNewPage()
                    this.$message({
                        message: '订单创建成功',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: '订单创建异常，请重试',
                        type: 'error'
                    });
                }
                // console.log("insurance", this.insurance)
            });

        },
        cancelOrder(val,method){
            let uid = this.$store.getters.getUserInfo.uid
            this.orderInfo.status = val
            this.orderInfo.payment_type = method
            // console.log(uid,this.item.mid)
            let data = {
                uid,
                mid:this.item.mid,
                newData:this.orderInfo
            }
            orderApi.updateOrder(data).then((response) => {
                if (response.success === true) {
                    
                } else {
                }
                // console.log("insurance", this.insurance)
            });
        },
        checkFormDataCompleteness(formData) {
            for (const data of formData) {
                if (
                    data.id === "" ||
                    data.name === "" ||
                    data.region === "" ||
                    data.date1 === "" ||
                    data.phone === ""
                ) {
                    return true; // 数据不完整
                }
            }
            return true; // 数据完整
        },
        init() {
        },

        schedule(depcode) {
            // // 登录判断
            // let token = cookie.get("token");
            // if (!token) {
            //     loginEvent.$emit("loginDialogEvent");
            //     return;
            // }

            // //判断认证
            // userInfoApi.getUserInfo().then((response) => {
            //     let authStatus = response.data.authStatus;
            //     // 状态为2认证通过
            //     if (!authStatus || authStatus != 2) {
            //         window.location.href = "/user";
            //         return;
            //     }
            // });

            // window.location.href =
            //     "/hosp/schedule?hoscode=" +
            //     this.hospital.hoscode +
            //     "&depcode=" +
            //     depcode;
        },

        move(index, depcode) {
            this.activeIndex = index;
            document.getElementById(depcode).scrollIntoView();
        },

    },
    computed: {
        whatMethod() {
            return this.choosePayMethod == 1 ? '微信' : this.choosePayMethod == 2 ? '支付宝' : '银联'
        }
    },
    watch: {
        stepActivate(newval, oldval) {
            this.$emit('currentStep', newval)
        },
        item(val) {
            this.hospital = val
        },
        relatedList(val){
            console.log('val',val)
            this.relatList = val
        }
    }

};
</script>
<style scoped></style>
