<template>
    <div style="padding: 20px 40px;">
        <div class="a4" id="paper">
            <el-row class="pdfRef">
                <el-col :span="24">
                    <div class="left-wrapper v-link selected">
                        <img style="width: 40px" width="40" height="40" src="~assets/images/logo.png" />
                        <span class="text">企小保保险购买统一平台</span>
                    </div>
                    <el-divider></el-divider>
                </el-col>
            </el-row>

            <el-row class="pdfRef">
                <el-col :span="24" class="title">
                    {{ co }}电子保险单
                </el-col>
                <el-col :span="24" class="subTitle">
                    QiXiaoBao.com Insurance CO.LTD.
                </el-col>
                <el-col :span="12" :offset="12" class="insuranceCode">
                    保单号码：<span style="color: orange;">121312312312312</span>
                </el-col>
            </el-row>
            <el-row class="pdfRef">
                <el-col :span="24" class="paperInfo">
                    鉴于投保人已向本保险人投保{{ insurance.name }},并按本保险合同约定交付保险费，保险人同意按照{{ co }}{{ insurance.name }}的预定承担保险责任，特立本保险单为凭。
                    与本保险单有关的附加条款、特约条款以及投保单是本保险单不可分割的组成部分。如有任何问题，请拨打电话：{{ tel }}，进行咨询。
                </el-col>
            </el-row>
            <el-row class="pdfRef">
                <el-col :span="24" class="tableTitle">
                    明细表
                </el-col>
                <el-col :span="24">
                    <table cellspacing="0">
                        <thead>
                            <tr class="table-row">
                                <th class="table-first">产品名称</th>
                                <th colspan="2">
                                    <div class="contents">{{ insurance.name }}</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="table-row">
                                <td rowspan="3" class="table-first">投保人</td>
                                <td colspan="2">姓名：<div class="contents">{{ applicationForm.name }}</div>
                                </td>
                            </tr>
                            <tr class="table-row">
                                <td>证件类型：<div class="contents">{{ applicationForm.region }}</div>
                                </td>
                                <td>证件号码：<div class="contents">{{ applicationForm.cardID }}</div>
                                </td>
                            </tr>
                            <tr class="table-row">
                                <td colspan="2">手机号：<div class="contents">{{ applicationForm.phone }}</div>
                                </td>
                            </tr>
                            <tr class="table-row">
                                <td rowspan="3" class="table-first">被投保人</td>
                                <td colspan="2">姓名：<div class="contents">{{ insuranceForm.name }}</div>
                                </td>
                            </tr>
                            <tr class="table-row">
                                <td>证件类型：<div class="contents">{{ insuranceForm.region }}</div>
                                </td>
                                <td>证件号码：<div class="contents">{{ insuranceForm.cardID }}</div>
                                </td>
                            </tr>
                            <tr class="table-row">
                                <td colspan="2">手机号：<div class="contents">{{ insuranceForm.phone }}</div>
                                </td>
                            </tr>
                            <tr class="table-row">
                                <td colspan="3">被投保人与投保人关系：<div class="contents">{{ insuranceForm.relation }}</div>
                                </td>
                            </tr>
                            <tr class="table-row">
                                <td colspan="3">免责声明：<div class="contents">{{ claim }}</div>
                                </td>
                            </tr>
                            <tr class="table-row" style="text-align: center;">
                                <td colspan="2">保险责任名称</td>
                                <td style="border-left: none;">保险金额</td>
                            </tr>
                            <tr class="table-row" style="text-align: center;" v-for="(item, index) in insurance.details"
                                :key="index">
                                <td colspan="2" style="border-top: none;">
                                    <div class="contents">{{ item.name }}</div>
                                </td>
                                <td style="border-top: none;border-left: none;">
                                    <div class="contents">{{ Number(item.price).toFixed(2) }}</div>
                                </td>
                            </tr>
                            <tr class="table-row">
                                <td colspan="2">总保险费：（大写）<div class="contents">{{ orderInfo.capitalPrice }}元整</div>
                                </td>
                                <td style="text-align: center;border-left: none;">（小写）<div class="contents">￥{{
                                    Number(orderInfo.price
                                    ).toFixed(2) }}元</div>
                                </td>
                            </tr>
                            <tr class="table-row">
                                <td colspan="3">保险期间：<div class="contents">
                                    <span class="timeHightlight">{{ orderInfo.sTime.year }}</span> 年
                                    <span class="timeHightlight">{{ orderInfo.sTime.month }}</span> 月
                                    <span class="timeHightlight">{{ orderInfo.sTime.day }}</span> 日
                                    <span class="timeHightlight">{{ orderInfo.sTime.hour }}</span> 时 - 
                                    <span class="timeHightlight">{{ orderInfo.eTime.year }}</span> 年
                                    <span class="timeHightlight">{{ orderInfo.eTime.month }}</span> 月
                                    <span class="timeHightlight">{{ orderInfo.eTime.day }}</span> 日
                                    <span class="timeHightlight">{{ orderInfo.eTime.hour }}</span> 时
                            
                            </div>
                                </td>
                            </tr>
                            <tr class="table-row">
                                <td colspan="3">适用条款：<div class="contents" v-for="(item, index) in insurance.terms"
                                        :key="index">{{ item }}</div>
                                </td>
                            </tr>
                            <tr class="table-row">
                                <td colspan="3">保险合同争议解决方式：<div class="contents">{{ insurance.dispute }}</div>
                                </td>
                            </tr>
                            <tr class="table-row">
                                <td colspan="3">司法管辖：<div class="contents">{{ insurance.legel }}</div>
                                </td>
                            </tr>
                            <tr class="table-last-row">
                                <td class="table-first">客户提示</td>
                                <td colspan="2">
                                    <div class="contents" v-for="(item, index) in insurance.tips" :key="index">{{ item }}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </el-col>
            </el-row>

        </div>
        <el-button type="success" @click="download()">下载</el-button>
    </div>
</template>
<script>
import { htmlPdf } from '@/utils/htmlToPDF.js'
import { numToCapital } from '@/utils/numToCapital'
let specialversion = [
    "1.相应服务的费用额度和范围以产品保险条款和保险方案为准，超出保险责任范围内的需自费。",
    "2.救援公司电话协调并妥善安排相关服务，不保证派遣专员至现场进行协助。",
    "3.本保险每一被保险人限投一份，多投无效。",
    "4.您提供的个人信息、数据和隐私我们不会提供给任何未获授权的第三方。"
]
let insuranceDetails = [{
    "name": "意外伤害身故和残疾",
    "price": "500000"
},
{
    "name": "意外伤害医疗(含门诊及住院)",
    "price": "100000"
},
{
    "name": "身故伤残保险责任",
    "price": "100000"
},
{
    "name": "重大疾病",
    "price": "100000"
},
{
    "name": "疾病身故、全残",
    "price": "500000"
},
{
    "name": "住院医疗",
    "price": "150000"
},
{
    "name": "意外住院津贴",
    "price": "10000"
}]
export default {
    name: 'toPDF',
    data() {
        return {
            co: "企小保在线财产保险股份有限公司",
            tel: "99899",
            insurance: {
                name: "孩之宝综合意外险",
                details: insuranceDetails,
                terms: ["《在线人身意外伤害保险条款》", "《在线附加意外伤害医疗保险条款》"],
                dispute: "提交xx仲裁委员会",
                legel: "中华人民共和国管辖（港澳台除外）",
                tips: specialversion,
            },
            applicationForm: {
                cardID: "37xxxxxxxxxxxxxxxx",
                name: "张三",
                region: "居民身份证",
                phone: "139111111111",
            },
            insuranceForm: {
                cardID: "37xxxxxxxxxxxxxxxx",
                name: "张三",
                region: "居民身份证",
                phone: "139111111111",
                relation: "本人"
            },
            orderInfo: {
                startTime: "2023-11-11 08:00:00",
                endTime: "2025-11-11 24:00:00",
                price: "500",
                capitalPrice: "numToCapital(Number(this.price))",
                sTime: {
                    year: "",
                    month: "",
                    day: "",
                    hour: ""
                },
                eTime: {
                    year: "",
                    month: "",
                    day: "",
                    hour: ""
                }
            },
            claim: "除另有约定外，本保险合同每次xxxx医疗免赔xxxx元",

        }
    },
    mounted() {
        this.orderInfo.capitalPrice = numToCapital(Number(this.orderInfo.price), true)
        this.parseTIme()
    },
    methods: {
        parseTIme() {
            let startTime = new Date(this.orderInfo.startTime)
            this.orderInfo.sTime.year = startTime.getFullYear()
            this.orderInfo.sTime.month = startTime.getMonth()
            this.orderInfo.sTime.day = startTime.getDate()
            this.orderInfo.sTime.hour = startTime.getHours()
            let endTime = new Date(this.orderInfo.endTime)
            this.orderInfo.eTime.year = endTime.getFullYear()
            this.orderInfo.eTime.month = endTime.getMonth()
            this.orderInfo.eTime.day = endTime.getDate()
            this.orderInfo.eTime.hour = endTime.getHours()
        },
        download() {
            var fileName = this.insuranceForm.name+'-企小保'+this.insurance.name+'电子保单'
            const fileList = document.getElementsByClassName('pdfRef')   // 很重要
            htmlPdf(fileName, document.querySelector('#paper'), fileList)
        }
    },
    computed: {

    }
}

</script>
<style scoped>
.a4 {
    width: 841px;
    height: 1189px;
    background-color: #fff;
    padding: 20px 40px;
}

.title {
    text-align: center;
    letter-spacing: 2px;
    font-size: 20px;
    font-weight: 700;
}

.subTitle {
    text-align: center;
    font-size: 16px;
}

.insuranceCode {
    text-align: right;
    margin-top: 10px;
    margin-bottom: 10px;
    /* font-size: 16px; */
    /* font-weight: 600; */
}

.paperInfo {
    text-indent: 2em;
    line-height: 25px;
}

.tableTitle {
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
    letter-spacing: 10px;
    font-size: 18px;
    font-weight: 700;
}

table {
    border-right: 1px solid #000000;
    border-bottom: 1px solid #000000;
    width: 100%;
    font-weight: 600;
    height: 850px;
}

table th {
    border-left: 1px solid #000000;
    border-top: 1px solid #000000;
    padding: 5px 10px;
}

table td {
    border-left: 1px solid #000000;
    border-top: 1px solid #000000;
    padding: 5px 10px;
}


.table-row {
    width: 100%;
    /* height: 40px; */
}

.table-first {
    text-align: center;
    width: 148px;
}

table .contents {
    font-weight: 500;
    display: inline-block;
}
.timeHightlight{
    font-weight: 600;
    color: orange;
}
</style>