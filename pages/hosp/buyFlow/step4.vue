<template>
    <div>
        <el-card class="box-card">
            <el-result icon="success" title="恭喜您！投保成功" subTitle="可在“订单管理”页面查看细节">
                <template slot="extra">
                    <el-button type="success" @click="downloadExcel()">下载电子保单</el-button>
                    <el-button type="submit" @click="checkOrder()">查看订单</el-button>
                    <el-button type="submit" @click="back()">再买一份</el-button>
                </template>
            </el-result>
        </el-card>
        <el-card>
            <div slot="header" class="clearfix">
                <span>猜您可能还想了解</span>
            </div>
            <div class="bujv" id="bujv">
                <el-row :gutter="40">
                    <el-col :span="8" v-for="(item,index) in relatList.slice(0,3)" :key="index">
                        <div class="grid-content bg-purple pdfRef">
                            <div class="grid-content bg-purple">
                                <el-card :body-style="{ padding: '0px' }">
                                    <img src="../../../assets/images/image.png" class="image">
                                    <div>
                                        <span class="info-title">{{ item.descri }}</span>
                                        <p class="info">{{ item.name }}</p>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                    </el-col>
                    <!-- <el-col :span="8">
                        <div class="grid-content bg-purple pdfRef">
                            <div class="grid-content bg-purple">
                                <el-card :body-style="{ padding: '0px' }">
                                    <img src="../../../assets/images/image.png" class="image">
                                    <div>
                                        <span class="info-title">{{ hospital.hosname }}</span>
                                        <p class="info">{{ hospital.param.hostypeString }}</p>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content bg-purple pdfRef">
                            <div class="grid-content bg-purple">
                                <el-card :body-style="{ padding: '0px' }">
                                    <img src="../../../assets/images/image.png" class="image">
                                    <div>
                                        <span class="info-title">{{ hospital.hosname }}</span>
                                        <p class="info">{{ hospital.param.hostypeString }}</p>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                    </el-col> -->
                </el-row>
            </div>
        </el-card>
        <toPDF ref="toPDF" style="position: absolute;right: 1500px;top: 0;"></toPDF>
    </div>
</template>
<script>
import toPDF from "@/pages/toPDFTemplate"
import blockList from "@/temp_data/blockList"
import department from '@/temp_data/department'
import { htmlPdf }  from '@/utils/htmlToPDF.js'
export default {
    name: 'step4',
    props: ["item","relatedList"],
    components:{toPDF},
    data() {
        return {
            department: department,
            hospital: blockList[2],
            relatList:[]
        }
    },
    created(){
        this.init();
        console.log("收到",this.relatList)
    },
    methods: {
        init(){

        },
        back() {
            this.$emit('buyNewOne',0)
            // this.$router.push("/")
        },
        downloadExcel(){
            this.$refs.toPDF.download();
            // console.log(document)
            // var fileName= '投资评审报告'
	        // const fileList = document.getElementsByClassName('pdfRef')   // 很重要
            // htmlPdf(fileName, document.querySelector('#bujv'), fileList)
        },
        checkOrder(){
            this.$router.push({path:'/user',query:{"url":"/order"}})
        }
    },
    watch:{
        relatedList(val){
            console.log("4",val)
            this.relatList = val
        }
    }
}
</script>
<style scoped>
.box-card {
    margin-bottom: 5px;
}

.clearfix {
    margin-left: 420px;
    font-size: 15px;
    color: #787878;
}

.bujv {
    margin-left: 120px;
    margin-right: 120px;
}

.info-title {
    font-size: 18px;
    color: #787878;
    margin: 10px;
}

.info {
    font-size: 14px;
    color: #787878;
}
</style>