<template>
    <!-- <el-col :span="8"> -->
    <div class="v-card clickable recommendBlock" @click="show(item.mid)">
        <div slot="header" class="blockHeader">
            <span :title="item.descri">{{ item.descri }}</span>
        </div>
        <div class="blockBody">
            {{ item.name }}
            <ul>
                <li><i class="el-icon-check"></i>年龄：{{ item.age }}</li>
                <li><i class="el-icon-check"></i>周期：{{ item.period }}</li>
                <li><i class="el-icon-check"></i>{{ item.genres }}</li>
            </ul>
            <el-image :src="require('@/assets/images/product' + Math.min(item.mid%4+1,4) + '.png')" :alt="item.descri"
                class="insurance-img"></el-image>
        </div>
    </div>
    <!-- </el-col> -->
</template>
  
<script>
import insurancesAPi from "@/api/insurances";
export default {
    name: 'InsuranceCard',
    props: ["item"],
    data() {
        return {
        }
    }, created() {
    },
    methods: {
        //点击某个医院名称，跳转到详情页面中
        show(hoscode) {
            this.$router.push({ path: "/hosp/detail", query: { "id": hoscode } })
        },
    },
}
</script>
<style scoped>
.recommendBlock {
    height: 190px;
    background-color: rgb(212, 241, 230);
    margin-bottom: 10px;
    overflow: hidden;
}

.recommendBlock:hover {
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
}

.recommendBlock:hover .blockBody .insurance-img {
    transform: scale(1.5);
    right: 50px;

}

.blockHeader {
    height: 40px;
    font-size: 18px;
    font-weight: bold;
    padding: 20px 20px 0;
}
.blockHeader span{
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
    display: inline-block;
    text-overflow: ellipsis;
}
.blockBody {
    height: 150px;
    padding-left: 20px;
    padding-top: 10px;
    position: relative;
}

.blockBody ul {
    margin-left: 10px;
    padding: 0;
    list-style: none;
}
.blockBody ul li{
    margin-top: 10px;
}
.blockBody ul li i {
    width: 14px;
    height: 14px;
    line-height: 14px;
    margin-right: 10px;
    background-color: #7ebd7a;
    border-radius: 7px;
    color: #fff;
}

.blockBody .insurance-img {
    zoom: 40%;
    position: absolute;
    bottom: 0;
    right: 0;
    transition: all .3s;
}

/* .blockBody .insurance-img:hover {
    transform: scale(1.5);
    right: 50px;

} */
</style>