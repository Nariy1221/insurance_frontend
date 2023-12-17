<template>
    <div>
        <!-- <el-card class="box-card"> -->
        <el-row :gutter="10">
            <el-col :span="12">
                <div class="grid-content bg-purple outbox-card-fangan">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span class="form-title">投保人信息</span>
                        </div>
                        <div class="form-row">
                            <span class="info-title">姓&emsp;&emsp;名</span>
                            <span class="info">{{ applicantForm.name }}</span>
                        </div>
                        <div class="form-row">
                            <span class="info-title">证件类型</span>
                            <span class="info">{{ applicantForm.region }}</span>
                        </div>
                        <div class="form-row">
                            <span class="info-title">证件号码</span>
                            <span class="info">{{ applicantForm.cardID }}</span>
                        </div>
                        <div class="form-row">
                            <span class="info-title">手机号码</span>
                            <span class="info">{{ applicantForm.phone }}</span>
                        </div>
                        <div class="form-row">
                            <span class="info-title">投保时间</span>
                            <span class="info">{{ formattedDate }}</span>
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="12" v-for="(item, index) in insuredFormTemp" :key="index">
                <div class="grid-content bg-purple-light outbox-card-fangan">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span class="form-title">被投保人信息 ({{ index + 1 }})</span>
                        </div>
                        <div class="form-row">
                            <span class="info-title">姓&emsp;&emsp;名</span>
                            <span class="info">{{ item.name }}</span>
                        </div>
                        <div class="form-row">
                            <span class="info-title">证件类型</span>
                            <span class="info">{{ item.region }}</span>
                        </div>
                        <div class="form-row">
                            <span class="info-title">证件号码</span>
                            <span class="info">{{ item.cardID }}</span>
                        </div>
                        <div class="form-row">
                            <span class="info-title">手机号码</span>
                            <span class="info">{{ item.phone }}</span>
                        </div>
                        <div class="form-row">
                            <span class="info-title">关&emsp;&emsp;系</span>
                            <span class="info">{{ item.relation }}</span>
                        </div>

                    </el-card>
                </div>
            </el-col>
        </el-row>

        <el-card class="outbox-card-fangan">
            <div slot="header" class="clearfix">
                <span class="form-title">保单信息</span>
            </div>
            <div class="form-row">
                <div class="form-line">
                    <div class="form-row">
                        <span class="form-col1">保险生效时间： {{ formattedDate }}</span>
                    </div>
                    <div class="form-row">
                        <span class="form-col2">保险有效期： {{ hospital.period }}</span>
                    </div>
                </div>
            </div>
        </el-card>
        <el-card class="outbox-card-fangan">
            <div slot="header" class="clearfix">
                <span class="form-title">特别备注</span>
            </div>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                        <span class="form-row">投保人备注：&emsp;{{ applicantForm.specialInstructions }}</span>
                        <span class="form-row" v-for="(item, index) in insuredFormTemp" :key="index">被投保人 ({{ index + 1
                        }})备注：{{ item.health }} {{ item.medical_history }} {{ item.family_medical_history }}</span>
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <!-- </el-card> -->
        <el-card class="outbox-card-fangan">
            <div slot="header" class="clearfix">
                <span class="form-title">选择方案</span>
            </div>
            <el-form :label-position="labelPosition" label-width="80px" :model="selectContents">
                <el-form-item label="方案选择">
                    <el-select v-model="selectContents.schemeName" placeholder="方案选择">
                        <el-option v-for="(item, index) in scheme" :key="index" :label="item.name" :value="item.name"
                            :style="index === scheme.length - 1 ? 'margin-bottom: 10px;' : ''"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-table :data="selectedSchemeDetails" border style="width: 100%">
                <el-table-column fixed prop="项目名称" label="保障项目" align="center"></el-table-column>
                <el-table-column prop="费用范围" label="保额" align="center"></el-table-column>
            </el-table>
        </el-card>
        <el-card class="outbox-card">
            <div class="form-row">
                <div class="form-title">
                    方案选择
                </div>
                <div style=" margin-left: 35px;">
                    {{ selectContents.schemeName }}
                </div>
            </div>
            <div class="form-row">
                <div class="form-title">
                    优惠选择
                </div>
                <div style=" margin-left: 35px;">
                    <el-form :label-position="labelPosition" :model="selectContents" size="small">
                        <el-form-item>
                            <el-select v-model="selectContents.selectedDiscount" placeholder="请选择折扣力度">
                                <el-option v-for="(discount, index) in discountOptions" :key="discount.value"
                                    :label="discount.label" :value="discount.value"
                                    :style="index === discountOptions.length - 1 ? 'margin-bottom: 10px;' : ''"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>

            </div>
            <div class="form-row">
                <div class="form-title">
                    应付金额
                </div>
                <div class="price">
                    ￥{{ totalPrice.toFixed(2) }}
                    <span class="oldPrice">（{{ hospital.price?(hospital.price).toFixed(2):0 }} 元/人）</span>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>

import FormData from "@/temp_data/FormData"
import department from '@/temp_data/department'
import discountOptions from '@/temp_data/coupon'
import insurancesAPi from "@/api/insurances";
import blockList from '@/temp_data/blockList'
export default {
    name: 'step2',
    props: ["item"],
    data() {
        return {
            hoscode: 0,
            department: department,
            hospital: { "scheme": [] },
            scheme: blockList[0].scheme,
            applicantForm: {},
            insuredForm: {},
            activeName: 'scheme',
            labelPosition: "left",
            selectContents: {
                schemeName: "普通版",
                selectedDiscount: 1.0,
            },

            discountOptions: discountOptions,

        };
    },
    methods: {
        init() {
            this.hoscode = this.$route.query.id;
            this.applicantForm = FormData[0]
            console.log("this.hospital", this.hospital);
            insurancesAPi.getInsurancetByMid(this.hoscode).then((response) => {
                const insurance = response.insurance;
                this.hospital = insurance
            });
        },
    },
    created() {
        this.init();
    },
    computed: {
        totalPrice() {
            if (this.hospital && this.hospital.price && this.insuredFormTemp) {
                return this.hospital.price * this.insuredFormTemp.length;
            } else {
                return 0; // 或者你认为合适的默认值
            }
        },
        insuredFormTemp() {
            let insuredTemp = this.$store.getters.getInsuranceExcept
            let insuredFormTemp = insuredTemp
            return insuredFormTemp
        },
        formattedDate: function () {
            const originalDateString = this.applicantForm.date1;
            const date = new Date(originalDateString);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        },

        discountedPrice() {
            const selected = this.scheme.find(scheme => scheme.name === this.selectContents.schemeName);
            const originalPrice = selected ? selected.price : 0;
            const finalPrice = originalPrice * this.selectContents.selectedDiscount;
            console.log(this.selectContents.selectedDiscount);
            this.$emit('price', finalPrice);
            return finalPrice;
        },
        selectedSchemeDetails() {
            // 根据当前选择的方案名称筛选出对应的保障项目详情
            const selectedScheme = this.scheme.find(item => item.name === this.selectContents.schemeName);
            return selectedScheme ? selectedScheme["保障项目"] : [];
        },
        originalPrice() {
            const selected = this.scheme.find(scheme => scheme.name === this.selectContents.schemeName);
            const oldPrice = selected ? selected.price : 0;
            this.$emit('oldPrice', oldPrice);
            return oldPrice;
        }
    },
}
</script>


<style scoped>
.form-title {
    font-size: 18px;
    font-weight: bold;
    color: #6d6c6c;
}

.form-line {
    display: flex;
    justify-content: space-between;

}

.el-card {
    margin-top: 10px;
}

.el-form-item {
    margin-top: 10px;
    margin-bottom: 10px;
}

.el-card ::v-deep .el-card__header {
    padding: 10px 10px;
    background-color: rgb(212, 241, 230);
}

.form-card>>>.el-card__body {
    padding: 0;
}

.outbox-card-beizhu>>>.el-card__header {
    padding: 10px 0px 10px 25px;
    background-color: rgb(231, 231, 231);
}

.outbox-card-fangan>>>.el-card__header {
    padding: 10px 0px 10px 25px;
    background-color: rgb(212, 241, 230);
}

.outbox-card-fangan>>>.el-card__body {
    padding: 0px 25px 10px 25px;
}

/* 使用深度选择器覆盖 scoped 样式 */
.outbox-card-fangan>>>.el-tabs__item:hover {
    color: #1f8438;
}

.outbox-card-fangan>>>.el-tabs__item.is-active {
    color: #1f8438 !important;
}

.outbox-card-fangan>>>.el-tabs__active-bar {
    background-color: #229922 !important;
    width: 20px;
}

.outbox-card-fangan>>>.box .el-tabs__item {
    min-width: 450px;
    text-align: center;
}

.form-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 8px;
    margin-top: 8px;
    color: #787878;
}

.form-row p {
    margin: 0;
    padding-right: 20px;
    font-size: 15px;

}

.price {
    font-size: 23px;
    font-weight: bold;
    color: rgb(226, 148, 15);
    margin-left: 35px;
    margin-right: 20px;
}

.oldPrice {
    margin-left: 15px;
    color: rgb(200, 200, 200);
    font-size: 12px;
    /* text-decoration: line-through; */
}

.outbox-card .outbox-card-beizhu .outbox-card-fangan {
    margin-top: 10px;
}


.info-title {
    flex: 1;
}

.info {
    flex: 4;
}

.form-col1 {
    margin-right: 250px;
}
</style>


