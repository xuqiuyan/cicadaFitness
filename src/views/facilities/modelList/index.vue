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
          <img :src="scope.row.coverUrl" alt="" width="50px">
        </template>
      </el-table-column>
      <el-table-column  align="center" :label="tableOptions[0]">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" :label="tableOptions[3]">
        <template slot-scope="scope">
          <span>{{scope.row.modelNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="tableOptions[4]" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">{{$t('table.edit')}}</el-button>
          <el-button type="primary" size="mini" @click="handleDetail(scope.row.id)">详情</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">{{$t('table.delete')}}
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
import { fetchFacModelList, deleteFacModel } from '@/api/facilities'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'facModelTable',
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
      tableOptions: ['器械名称', '封面', '照片', '型号', '操作'],
      temp: {
        id: undefined,
        typeId: undefined,
        name: '',
        coverUrl: '',
        photos: [],
        modelNumber: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      typeId: this.$route.query.typeId
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
      fetchFacModelList(this.typeId).then(response => {
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
    handleDelete(id) {
      deleteFacModel(id).then(response => {
        this.listLoading = false
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleCreate() {
      this.$router.push({ path: '/facilities/modelList/newOrEdit', query: { typeId: this.typeId }})
    },
    handleUpdate(id) {
      this.$router.push({ path: '/facilities/modelList/newOrEdit', query: { modelId: id }})
    },
    handleDetail(id) {
      this.$router.push({ path: '/facilities/modelList/detail', query: { modelId: id }})
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
