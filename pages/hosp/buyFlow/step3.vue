<template>
    <div>
        <el-card class="box-card1">
            <div slot="header" class="clearfix">
                <span class="info" v-show="!isOverTime">
                    请在<span class="countdown"> <el-statistic format="mm分钟ss秒" :value="deadline2" time-indices
                            style="display: inline-block; width: 150px;">
                        </el-statistic></span>内完成支付，超时将自动取消订单
                </span>
                <span class="info" v-show="isOverTime">
                    已超时，请重新创建订单。
                </span>
            </div>
            <table>
                <tr>
                    <td class="colored-cell text-center">订单号</td>
                    <!-- 这里进行模拟, hoscode 并不是订单号 -->
                    <td class="text-center">{{ orderInfo.code }}</td>
                    <td class="colored-cell text-center">产品名称</td>
                    <td class="text-center">{{ hospital.descri }}</td>
                </tr>
                <tr>
                    <td class="colored-cell text-center">保障起期</td>
                    <td class="text-center">{{ formattedDate }}</td>
                    <td class="colored-cell text-center">保障有效期</td>
                    <td class="text-center">{{ hospital.period }}</td>
                </tr>
            </table>
        </el-card>
        <el-card class="box-card2">
            <div slot="header" class="clearfix">
                <span class="info-title">优惠金额</span>
                <span class="price-little">{{ receivedPrice - receivedOldPrice }}</span><span class="info">
                    {{ (receivedPrice / receivedOldPrice) * 10 }}折保险折扣卷 </span>
            </div>
            <div>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple-dark">
                            <span class="info-title">实付保费</span>
                            <span class="price">￥ {{ orderInfo.amount }}</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <el-card class="box-card3">
            <div slot="header" class="clearfix">
                <span class="info-title">支付方式</span>
            </div>
            <div>
                <el-radio v-model="radio" label="1"><img src="../../../assets/images/weiixin.png" style="width:45px;"
                        alt=""></el-radio>
                <el-radio v-model="radio" label="2"><img src="../../../assets/images/zhifubao.png" style="width: 45px;"
                        alt=""></el-radio>
                <el-radio v-model="radio" label="3"><img src="../../../assets/images/yinlian.png" style="width: 60px;"
                        alt=""></el-radio>
            </div>
        </el-card>
    </div>
</template>
<script>
import FormData from "@/temp_data/FormData"
import blockList from "@/temp_data/blockList"
import department from '@/temp_data/department'
import orderInfoApi from '@/api/order.js'
// import Countdown from '../../../utils/countdown.js'

export default {
    // mixins: [Countdown],
    name: 'step3',
    props: ["item", 'countdownTime', 'receivedPrice', 'receivedOldPrice'],
    data() {
        return {
            department: department,
            // hospital: blockList[0],
            applicantForm: FormData[0],
            insuredForm: FormData[1],
            orderInfo:[],
            radio: '1',
            formattedTime: "05分59秒",
            deadline2: '',
        }
    },
    methods: {
    },
    created() {
        // this.hospital = this.item
        console.log(this.item)
        let uid = this.$store.getters.getUserInfo.uid
        orderInfoApi.getOrderList(uid).then((response) => {
            console.log(response)
            this.orderInfo = response.order[0]
            if(this.orderInfo.create_time == null){
                this.orderInfo.create_time = new Date()
            }
            if(this.orderInfo.code == null){
                this.orderInfo.code = this.orderInfo.customer_id + '' + this.orderInfo.insurance_id
            }
            console.log(this.orderInfo.create_time)
            // console.log(this.deadline2,Date.parse(response.order.create_time) )
            this.deadline2 = Date.parse(this.orderInfo.create_time) + 1000 * 60 * 10
        })

    },
    beforeDestroy() {
    },
    computed: {
        formattedDate: function () {
            // 原始日期时间字符串
            const originalDateString = this.orderInfo.create_time;

            // 解析日期时间字符串为 JavaScript Date 对象
            const date = new Date(originalDateString);

            // 提取日期和时间的各个部分
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');

            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        },
        isOverTime(){
            return Date.now() - this.deadline2 > 0
        },
        hospital:function(){
            return this.item
        }

    },
    watch: {
        radio(newVal) {
            this.$emit('choosePay', { payMethod: newVal })
            // this.formattedTime = newTime; // 当 countdownTime 变化时，更新 formattedTime
        },
    },
}
</script>
<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
}

table,
th,
td {
    border: 1px solid rgb(235, 255, 240);
}

.colored-cell {
    background-color: rgb(212, 241, 230)
        /* 设置背景颜色，可以根据需要更改颜色值 */
}

.text-center {
    text-align: center;
    /* 让文本居中显示 */
    padding: 8px;
    font-size: 14px;
    color: rgb(111, 110, 110);
}

.box-card2 {
    margin-top: 5px;
    margin-bottom: 5px;
}

.box-card1>>>.el-card__header {
    padding: 5px 0px 7px 20px;
    background-color: rgb(252, 245, 202);
}

.box-card1>>>.el-card__body {
    padding: 0px;
}

.box-card2>>>.el-card__header {
    padding: 5px 0px 7px 20px;
    background-color: rgb(212, 241, 230)
}

.box-card3>>>.el-card__header {
    padding: 5px 0px 7px 20px;
    background-color: rgb(239, 240, 239);
}

.info-title {
    flex: 1;
}

.info {
    flex: 4;
}

.price-little {
    font-size: 18px;
    font-weight: bold;
    color: rgb(226, 148, 15);
    margin-left: 60px;
    margin-right: 15px;
}

.price {
    font-size: 25px;
    font-weight: bold;
    color: rgb(226, 148, 15);
    margin-left: 20px;
    margin-right: 20px;
}

.info-title {
    color: rgb(111, 110, 110);
}

.info {
    color: rgb(111, 110, 110);
}

.countdown {
    color: rgb(208, 36, 36);
}
</style>