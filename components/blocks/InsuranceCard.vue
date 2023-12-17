<template>
    <el-col :span="8">
        <div class="v-card clickable insuranceBlock" @click="show(item.mid)">
            <div slot="header" class="blockHeader">
                <span :title="item.descri">{{ item.descri }}</span>
                <div v-show="'hightlight' in item">
                    <div class="hightIcon">
                        <i class="el-icon-star-off"></i>
                    </div>
                    <div class="hightLight">{{ item.hightlight }}</div>
                </div>
            </div>
            <div class="blockBody">
                <span :title="item.name">
                {{ item.name }}</span>

                <div class="tagLine" v-show="item.tag != 0">
                    <el-tag type="danger" size="small" v-for="(tag, index) in tags" :key="index"
                        style="margin-left: 5px;">{{ tag }}</el-tag>
                </div>
                <div class="priceLine">
                    <div class="newPrice" v-show="hasDown == 1">折合<span style="font-size: 20px;font-weight: bold;">{{
                        item.price }}</span><span style="color:rgb(160, 160, 160);">元/年</span><span
                            class="oldPrice">原价20000元/年</span></div>
                    <div class="newPrice" style="color:rgb(160, 160, 160);" v-show="hasDown == 0">现价<span
                            style="font-size: 20px;font-weight: bold;color: black;">{{ item.price
                            }}</span>元/年</div>
                </div>
            </div>
            <div class="infoLine">
                <div class="info">了解更多</div>
            </div>
        </div>
    </el-col>
</template>
  
<script>
export default {
    name: 'InsuranceCard',
    props: ["item"],
    data() {
        return {
            insurance:{},
            tags:[],
            hasDown:0
        }
    }, 
    created(){
        this.insurance = this.item
        this.tags.push(this.item.genres)
        this.tags.push(this.item.age)
    },
    methods: {
        //点击某个医院名称，跳转到详情页面中
        show(hoscode) {
            this.$router.push({ path: "/hosp/detail", query: { "id": hoscode } })
        },
    },
    watch:{
        item: function(nval){
            this.insurance = nval;
            this.tags[0] = nval.genres
            this.tags[1] = nval.age
        },
    }

}
</script>
<style scoped>
.insuranceBlock {
    /* width: 280px; */
    width: 100%;
    height: 200px;
    margin: 10px 10px;
    /* padding: 20px 20px; */
    display: inline-block;
    vertical-align: top;
    /* border: 1px solid #000; */
    text-align: left;
    border-radius: 10px;
    /* background: #e3e2e4; */
    /* box-shadow:  20px 20px 60px #c1c0c2,
             -20px -20px 60px #ffffff; */
}

.blockHeader {
    font-size: 18px;
    font-weight: bold;
    padding: 20px 20px 0;

}
.blockHeader>span,.blockBody>span{
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
    display: inline-block;
    text-overflow: ellipsis;
}
.hightIcon {
    position: absolute;
    top: -22px;
    left: -20px;
    height: 40px;
    width: 40px;
    background-color: #60ba0b;
    border-radius: 50%;
    border: 2px solid #fff;
    z-index: 200;
    text-align: center;
    box-sizing: border-box;

}

.hightIcon i {
    line-height: 36px;
    color: #fff;
    font-size: 20px;
}

.hightLight {
    position: absolute;
    top: -10px;
    left: 0;
    min-width: 100px;
    height: 20px;
    background-color: #60ba0b;
    font-size: 12px;
    font-weight: 400;
    text-align: right;
    color: #fff;
    padding-right: 10px;
    line-height: 20px;
    border-radius: 20px;
}

.blockBody {
    /* padding-top: 10px; */
    padding: 10px 20px 0;
}

.tagLine {
    /* margin-left: 10px; */
    margin-top: 10px;
}

.priceLine {
    position: absolute;
    bottom: 50px;
    line-height: 20px;
}

.newPrice {
    color: #ea1d1d;

}

.oldPrice {
    margin-left: 10px;
    color: rgb(200, 200, 200);
    font-size: 12px;
    text-decoration: line-through;
}

.infoLine {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 35px;
    line-height: 35px;
    background-color: #6598f2;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 0 0 10px 10px;
}

.infoLine:after {
    content: " ";
    width: 0%;
    height: 100%;
    background: #FFD401;
    line-height: 35px;
    text-align: center;
    position: absolute;
    transition: all 0.4s ease-in-out;
    right: 0;
    bottom: 0;
}

.insuranceBlock:hover .infoLine::after {
    right: auto;
    left: 0;
    bottom: 0;
    width: 100%;
}

.infoLine .info {
    text-align: center;
    text-decoration: none;
    width: 100%;
    /* padding: 18px 25px; */
    color: #fff;
    /* font-size: 1.125em; */
    /* font-weight: 700; */
    letter-spacing: 0.3em;
    z-index: 3000;
    transition: all 0.3s ease-in-out;
}

.insuranceBlock:hover .info {
    text-align: center;
    text-decoration: none;
    width: 100%;
    color: #183153;
    animation: scaleUp 0.3s ease-in-out;
}

@keyframes scaleUp {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(0.95);
    }

    100% {
        transform: scale(1);
    }
}
</style>