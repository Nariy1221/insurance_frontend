<template>
    <div class="personal-order">
        <div class="title">被保人管理</div>
        <el-row>
            <el-col :span="20" :offset="2">
                <el-form :inline="true">
                    <el-form-item label="被保人：">
                        <el-input v-model="searchObj.patientId" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="search-button v-link highlight clickable selected" @click="fetchData()">
                            查询
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="search-button v-link highlight clickable selected" @click="showDialog()">
                            添加被保人
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="24">
                <div class="table">
                    <el-empty description="描述文字" v-show="insuredForm.length == 0"></el-empty>
                    <el-table :data="insuredForm" stripe style="width: 100%;" :key="Math.random()"
                        v-show="insuredForm.length != 0">
                        <!-- <el-table-column label="就诊时间" width="120">
                <template slot-scope="scope">
                  {{ scope.row.reserveDate }}
                  {{ scope.row.reserveTime === 0 ? "上午" : "下午" }}
                </template>
              </el-table-column> -->
                        <el-table-column type="index" width="80" label="序号" align="center">
                        </el-table-column>
                        <el-table-column prop="name" label="姓名" align="center">
                            <template slot-scope="scope">
                                <el-link>{{ scope.row.name }}</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="relation" label="关系" width="120" align="center">
                        </el-table-column>
                        <el-table-column prop="cardID" label="证件号" width="200" align="center">
                        </el-table-column>
                        <el-table-column prop="phone" label="联系方式" align="center" width="150">
                        </el-table-column>
                        <!-- <el-table-column prop="status" label="订单状态" width="100" align="center">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.status == '完成' ? 'success' : 'warning'" disable-transitions>{{
                                    scope.row.status }}</el-tag>
                            </template>
                        </el-table-column> -->
                        <el-table-column label="操作" width="200" align="center">
                            <template slot-scope="scope">

                                <el-button type="text" class="v-link highlight clickable selected"
                                    @click="showDialog(scope.row)">编辑</el-button>
                                <el-button type="text" class="v-link highlight clickable selected"
                                    @click="show(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 分页 -->
                <el-pagination class="pagination" layout="prev, pager, next" :current-page="page" :total="total"
                    :page-size="limit" @current-change="fetchData">
                </el-pagination>
            </el-col>
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

    <!-- footer -->
</template>
<script>
// import "~/assets/css/hospital_personal.css";
// import "~/assets/css/hospital.css";
import insuredPeopleInfo from '@/components/blocks/insuredPeopleInfo'
import orderInfoApi from "@/api/order";
import insuranceApi from '@/api/insurances'
// import patientApi from "@/api/patient";
export default {
    components: { insuredPeopleInfo },
    data() {
        return {
            list: [
                // {
                //   "custormer_id": "111111",
                //   "insurance_id": "12312",
                //   "amount": "12312312",
                //   "payment_type": "支付宝",
                //   "status": "完成",
                //   "create_time": "2023-11-11 20:20:10",
                //   "code":"1231231231"
                // }
            ], // banner列表
            insuranceList: [],
            total: 0, // 数据库中的总记录数
            page: 1, // 默认页码
            limit: 10, // 每页记录数
            searchObj: {}, // 查询表单对象
            patientList: [],
            statusList: [],
            orderVisible: false,
            radio: '1',
            deadline2: Date.now() + 1000 * 60 * 60 * 8,
            dialogFormVisible: false,
            dialogOpt: {
                title: '新建被保人',
                buttonLabel: '添  加',
            },
            defaultForm: {
                id: '',
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
            insuredForm: [],
            currentForm: {},
            isShow:true
        };
    },
    created() {
        this.orderId = this.$route.query.orderId;
        this.fetchData();
        // this.findPatientList();
        // this.getStatusList();
    },
    methods: {
        showDialog(item) {
            if (item)
                this.currentForm = { ...item }
            else {
                this.currentForm = { ...this.defaultForm }
                this.currentForm.id = this.insuredForm.length + 1
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
        fetchData() {
            let uid = this.$store.getters.getUserInfo.uid
            let insuredTemp = this.$store.getters.getInsuranceExcept
            this.insuredForm = insuredTemp
            // orderInfoApi.getOrderList(uid).then((response) => {
            //     console.log(response)
            //     if (response.success)
            //         this.list = response.order
            //     // this.list.push(response.order)
            // })
            // insuranceApi.getInsurancetByMid(this.list[0].insurance_id).then((response) => {
            //       console.log(response)
            //       this.insuranceList.push(response.insurance)
            // })
        },
        findPatientList() {
            // patientApi.findList().then((response) => {
            //   this.patientList = response.data;
            // });
        },
        handleDialogCommit() {
            if (this.dialogOpt.title == '新建被保人') {
                this.insuredForm.push(this.currentForm)

            } else {
                let item = this.insuredForm.find(item => item.id == this.currentForm.id);
                let index = this.insuredForm.indexOf(item)
                this.insuredForm[index] = this.currentForm
            }
            console.log(this.insuredForm)
            this.$store.commit('UPDATE_INSURANCE', this.insuredForm)
            this.dialogFormVisible = false
        },
        getStatusList() {
            orderInfoApi.getStatusList().then((response) => {
                this.statusList = response.data;
            });
        },
        changeSize(size) {
            console.log(size);
            this.limit = size;
            this.fetchData(1);
        },
        show(person) {
            this.$confirm("是否要删除被保人：" + person.name, "提示", {
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
                        let item = this.insuredForm.find(item => item.id == person.id);
                        let index = this.insuredForm.indexOf(item)
                        console.log(index)
                        this.insuredForm.slice(index, 0)
                        this.$store.commit('UPDATE_INSURANCE', this.insuredFrom)
                        this.$router.go(0)
                    } else if (e == 'close') {

                    }
                });
            // this.orderVisible = true

            // window.location.href = "/order/show?orderId=" + id;
        },
        onSubmit() {

        },
        download(id) {
            this.$refs.toPDF.download();
        },
        handleClose() {
            this.orderVisible = false
        },
    },
};
</script>
  