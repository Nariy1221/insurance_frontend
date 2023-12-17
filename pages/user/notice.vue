<template>
  <div>
    <div class="title">消息中心</div>
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="标题">
                  <span>{{ props.row.title }}</span>
                </el-form-item>
                <el-form-item label="消息内容">
                  <span>{{ props.row.desc }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="index" width="80" label="序号" align="center">
          </el-table-column>
          <el-table-column label="状态" prop="isRead" width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isRead === 0 ? 'warning' : 'success'" disable-transitions>{{ scope.row.isRead ==0?"未读":"已读"  }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="标题" prop="title" width="150" align="center">
          </el-table-column>
          <el-table-column label="消息内容" prop="desc" align="center">
          </el-table-column>
          <el-table-column label="发布时间" prop="time" width="200" align="center">
          </el-table-column>
        </el-table>
        <el-pagination class="pagination" layout="prev, pager, next" :current-page="page" :total="total"
          :page-size="limit" @current-change="fetchData">
        </el-pagination>
      </el-col>

    </el-row>

  </div>
</template>
<script>

export default {
  data() {
    return {
      tableData: [{
        id: '12987122',
        title: '测试',
        time: '2023-11-11 20:20:20',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        isRead: 0,
      }, {
        id: '12987122',
        title: '测试1',
        time: '2023-11-11 20:20:20',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        isRead: 0,
      }, {
        id: '12987122',
        title: '测试2',
        time: '2023-11-11 20:20:20',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        isRead: 1,
      },

      ],
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
    };
  },
  created() {

  },
  methods: {
    fetchData(page = 1) {
      this.page = page;
      orderInfoApi
        .getPageList(this.page, this.limit, this.searchObj)
        .then((response) => {
          console.log(response.data);
          this.list = response.data.records;
          this.total = response.data.total;
        });
    },
    tableRowClassName({ row, rowIndex }) {
      // console.log(row.isRead)
      if (row.isRead == 0) {
        return 'warning-row';
      }
      // if (rowIndex === 1) {
      //   return 'warning-row';
      // } else if (rowIndex === 3) {
      //   return 'success-row';
      // }
      return '';
    }
  },
};
</script>
<style scoped>
.warning-row {
  background: oldlace;
}

.success-row {
  background: #f0f9eb;
}
</style>
