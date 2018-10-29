<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="tableOptions[0]" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
            
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>

    </div>
    <br/>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;">
      <el-table-column align="center" :label="tableOptions[1]" width="100px">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="" width="50px">
        </template>
      </el-table-column>
      <el-table-column  align="center" :label="tableOptions[0]">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" :label="tableOptions[5]">
        <template slot-scope="scope">
          <span class="tags" v-for="(tag, index) in scope.row.tags" :key="index">{{tag}}</span>
        </template>
      </el-table-column>  
      <el-table-column  align="center" :label="tableOptions[3]">
        <template slot-scope="scope">
          <span>{{scope.row.profile}}</span>
        </template>
      </el-table-column>
          
      <el-table-column align="center" :label="tableOptions[6]" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handlelModelList(scope.row.id)">型号</el-button>  
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">{{$t('table.edit')}}</el-button>
          <el-button type="primary" size="mini" @click="handleDetail(scope.row.id)">详情</el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row.id)">{{$t('table.delete')}}
          </el-button>                  
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style>
  .tags{
    display: inline-block;
    margin: 3px;
    padding:2px 5px;
    border-radius: 3px;
    background: #e8e8e8;
  }
</style>

<script>
import { fetchFacilitiesList, deleteFacilities } from '@/api/facilities'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'facilitiesTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        region: undefined
      },
      list: null,
      total: null,
      listLoading: true,
      tableOptions: ['名称', 'logo', '视频', '简介', '详情', '标签', '操作'],
      temp: {
        id: undefined,
        name: '',
        logoUrl: '',
        videoUri: '',
        profile: '',
        introduction: '',
        tags: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchFacilitiesList().then(response => {
        this.list = response.data.data
        this.listLoading = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(id) {
      deleteFacilities(id).then(response => {
        this.listLoading = false
        this.getList()
      })
    },
    handleCreate() {
      this.$router.push({ name: 'facTypeNewOrEdit' })
    },
    handleUpdate(id) {
      this.$router.push({ path: '/facilities/typeList/newOrEdit', query: { facid: id }})
    },
    handleDetail(id) {
      this.$router.push({ path: '/facilities/typeList/detail', query: { facid: id }})
    },
    handlelModelList(id) {
      this.$router.push({ path: '/facilities/modelList', query: { typeId: id }})
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['名称', '地址', '所在区域', '店长', '简介', '操房数量', '总面积', '私教面积', '开店时间']
        const filterVal = ['name', 'address', 'region', 'manager', 'introduction', 'classrooms', 'totalArea', 'personalArea', 'openDate']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '店铺列表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
