<template>
    <div class="">
        <div class="hospital-detail">
            <div class="common-header">
                <el-card class="box-card1">
                    <el-row>
                        <el-col :span="19">
                            <el-row>
                                <el-col :span="14">
                                    <div class="firstLine">
                                        <span class="hospital-title">
                                            保险名称：
                                        </span>
                                        <span class="hospital-info">{{ insurance.descri }}</span>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="firstLine">
                                        <span class="hospital-title">
                                            保险类型：
                                        </span>
                                        <span class="hospital-info">{{ insurance.genres }}</span>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="14">
                                    <div class="SecondLine">
                                        <span class="hospital-title">
                                            适用人群：
                                        </span>
                                        <span class="hospital-info">{{ insurance.age }}</span>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="SecondLine">
                                        <span class="hospital-title">
                                            保险期限：
                                        </span>
                                        <span class="hospital-info">{{ insurance.period }}</span>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <div class="SecondLine">
                                    <span class="hospital-title">
                                        产品简介：
                                    </span>
                                    <div class="hospital-info" @click="introductionScheme()">
                                        <span class="iconfont"></span><a class="hostypeString" :href="insurance.url"> {{
                                            insurance.scope }}</a>
                                    </div>
                                    <div class="icon-wrapper">
                                    </div>
                                </div>
                            </el-row>
                        </el-col>
                        <el-col :span="3"  style="text-align: center;">
                            <el-row>
                                <img src='../../../assets/images/logo.png' style="width: 90px;" />
                            </el-row>
                            <el-row class="tag-price">
                                ￥{{ insurance.price }} 起
                            </el-row>
                            <el-row>
                                <div class="grid-content bg-purple-light">
                                    <div class="grid-content bg-purple-light" @click="InsurcanceBuy()">
                                        <el-button type="warning" :disabled="isLogin">立即购买</el-button>
                                    </div>
                                </div>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-card>
            </div>
            <el-card stretch="true" :body-style="{ padding: '0px' }">
                <el-tabs type="border-card" class="flex">
                    <el-tab-pane label="保障计划">
                        <div>
                            <table class="bordered-table">
                                <thead>
                                    <tr style="font-size: 16px;line-height: 50px;">
                                        <th style="width: 300px; margin-bottom: 0; padding: 0;">保障项目</th>
                                        <th v-for="version in scheme" :key="version.name"
                                            :style="'width: 250px; padding :0px; margin-bottom:0px;'">
                                            <div :class="{ 'highlighted': version.name === highlightedColumn }"
                                                @mouseover="highlightColumn(version.name)" @mouseout="unhighlightColumn">
                                                {{ version.name }}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in projectName" :key="item.项目名称">
                                        <td>{{ item.项目名称 }}</td>
                                        <td v-for="version in scheme" :key="version.name" style="User-select: none"
                                            :class="{ 'highlighted': version.name === highlightedColumn }"
                                            @mouseover="highlightColumn(version.name)" @mouseout="unhighlightColumn">
                                            {{ version.保障项目.find(proj => proj.项目名称 === item.项目名称).费用范围 }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>必选责任保费</td>
                                        <td v-for="version in scheme" :key="version.name"
                                            :class="{ 'highlighted': version.name === highlightedColumn }"
                                            style="cursor: pointer;font-weight: bold;"
                                            @mouseover="highlightColumn(version.name)" @mouseout="unhighlightColumn">
                                            {{ version.price }}元
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="special-version">
                            <h3>特别说明</h3>
                        </div>
                        <div v-for="(clause, key) in specialVersion" :key="key">
                            <p>{{ clause }}</p>
                        </div>
                        <div class="special-version">
                            <h3>隐私条款说明</h3>
                        </div>
                        <div>{{ specialVersion.条款9 }} </div>

                    </el-tab-pane>
                    <el-tab-pane label="投保须知">
                        <div class="special-version">
                            <h3>条款说明</h3>
                        </div>
                        <div v-for="(clause, key) in InsuranceNotes.clause[0]" :key="key">
                            <p>{{ clause }}</p>
                        </div>
                        <div class="special-version">
                            <h3>健康告知</h3>
                            <div v-for="(condition, key) in InsuranceNotes.conditions[0]" :key="key">
                                <p v-if="typeof condition === 'string'">{{ condition }}</p>
                                <div v-else>
                                    <p v-for="(subCondition, index) in condition" :key="index">{{ index }}{{ subCondition }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="special-version">
                            <h3>投保说明</h3>
                            <div v-for="(illustrate, key) in InsuranceNotes.illustrate[0]" :key="key">
                                <p>{{ key }}{{ illustrate }}</p>
                            </div>
                        </div>
                        <div class="special-version">
                            <h3>投保人声明</h3>
                            <div v-for="(acknowledgement, key) in InsuranceNotes.acknowledgement[0]" :key="key">
                                <p>{{ key }}、{{ acknowledgement }}</p>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="理赔流程">
                        <div class="special-version-liucheng">
                            <h3>理赔流程</h3>
                        </div>
                        <el-steps align-center :space="600" style="height: 100px;">
                            <el-step title="申请" icon="el-icon-edit" status="process" description="填写投保单，包括健康告知书"></el-step>
                            <el-step title="审核" icon="el-icon-tickets" status="process"
                                description="审核投保资料，核保通过后，出具投保确认函"></el-step>
                            <el-step title="寄送" icon="el-icon-position" status="process"
                                description="根据短信提示邮寄理赔单证原件"></el-step>
                            <el-step title="赔付" icon="el-icon-coin" status="process"
                                description="核赔人员通过，确定理赔金额后3个工作日内进行赔付"></el-step>
                        </el-steps>
                        <div class="special-version">
                            <h3>赔付资料</h3>
                        </div>
                        <div class="document">
                            <p v-for="(document, index) in InsuranceNotes.documents" :key="index">{{ document }}</p>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="常见问题">
                        <div class="faq">
                            <span v-for="(item, index) in questionAnswer" :key="index">
                                <div class="faq-item">
                                    <div>
                                        <p class="question"><i class="el-icon-question"></i> {{ item.question }}</p>
                                        <p><i class="el-icon-info"></i> {{ item.answer }}</p>
                                    </div>
                                </div>
                            </span>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>
  
<script>
import department from '@/temp_data/department'
import insurancesAPi from "@/api/insurances";
import specialVersion from "@/temp_data/specialversion"
import InsuranceNotes from "@/temp_data/Insurancenotes"
import questionanswer from "@/temp_data/questionAnswer"
import blockList from '@/temp_data/blockList'
export default {
    props: ["item","isNotLogin"],
    data() {
        return {
            activeIndex: 0,
            hoscode: 0,
            insurance: {},
            bookingRule: {},
            scheme: blockList[0].scheme,
            projectName: blockList[0].scheme[0].保障项目,
            departmentVoList: department,
            tabPosition: 'left',
            specialVersion: specialVersion,
            highlightedColumn: null,
            InsuranceNotes: InsuranceNotes,
            questionAnswer: questionanswer.faq,
        };
    },

    created() {
        this.hoscode = this.$route.query.id;
        this.init()
    },

    methods: {
        unhighlightColumn() {
            this.highlightedColumn = null;
        },
        highlightColumn(columnName) {
            this.highlightedColumn = columnName;
        },
        InsurcanceDetail() {
            this.$router.push({ path: "/hosp/detail", query: { "id": this.hoscode } })
        },
        InsurcanceBuy() {
            this.$emit('InsurcanceBuy', this.hoscode)
        },
        introductionScheme() {
            const scrollAmount = 340;
            window.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        },
        init() {
            insurancesAPi.getInsurancetByMid(this.hoscode).then((response) => {
                this.insurance = response.insurance;
                // this.scheme = response.data.scheme;
                // this.projectName = response.data.scheme[0].保障项目;
            });
        },
    },
    computed:{
        isLogin(){
            return this.isNotLogin
        }
    },
    watch: {   // 使用监听的方式，监听数据的变化
        // item(val) {
        //     this.insurance = val;
        // }
    }
};
</script>
<style scoped>
.document {
    margin-left: 30px;
}

.faq-item {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px 0;
    border-radius: 10px 10px 10px 10px;
    background-color: #FFF8F5;
}

.faq-item .question {
    font-weight: bold;
}

.highlighted {
    color: #ec8a28;
    background-color: #fedea4;
}

.special-version {
    margin-bottom: 10px;
    margin-top: 20px;
}

.special-version-liucheng {
    margin-bottom: 30px;
    margin-top: 20px;
    padding: 0;
}

h3 {
    border-left: 5px solid #FF8800;
    /* background-color: #FF8800; */
    display: inline;
    padding: 5px 15px;
    color: #FF8800;
    /* border-radius: 0px 10px 0 10px; */
}

.bordered-table {
    border-collapse: collapse;
    background-color: #FFF8F5;
}

.bordered-table th,
.bordered-table td {
    border: 1px solid #FFE4DD;
    padding: 8px;
    text-align: center;
}

.box-card1 {
    margin-bottom: 10px;
}

.box-card {
    margin-bottom: 3px;
}

.hospital-title {
    font-size: 18px;
    font-weight: bold;
}

.firstLine,
.SecondLine {
    margin-bottom: 20px;
    margin-top: 10px;
}

.hospital-info .hostypeString:hover {
    cursor: pointer;
    color: blue;
}

.hospital-title,
.hospital-info {
    display: inline-block;
}

.hospital-info {
    color: #717171;
    font-size: 15px;
}

.tag-price {
    color: rgb(226, 148, 15);
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.hospital-detail .info-wrapper {
    width: 100%;
    padding-left: 0;
    padding-top: 0;
    margin-top: 0;
    flex-direction: inherit;
}


.hospital-detail .info-wrapper .text {
    font-size: 14px;
}

.hospital-detail .content-wrapper p {
    text-indent: 0;
}
</style>
