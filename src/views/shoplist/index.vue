<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="tableOptions[0]" v-model="listQuery.name">
      </el-input>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.region" :placeholder="tableOptions[2]">
        <el-option v-for="item in  regionOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
            
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      
      
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
      <!-- <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">{{$t('table.reviewer')}}</el-checkbox> -->
      
    </div>
    <br/>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;min-height:1000px;">
      <el-table-column align="center" :label="tableOptions[8]" width="100px">
        <template slot-scope="scope">
          <img :src="scope.row.coverUrl" alt="" width="50px">
        </template>
      </el-table-column>
      <el-table-column  align="center" :label="tableOptions[0]">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column   :label="tableOptions[3]">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.manager}}</span>
          
        </template>
      </el-table-column>
      <el-table-column  align="center" :label="tableOptions[2]">
        <template slot-scope="scope">
          <span>{{scope.row.region}}</span>
        </template>
      </el-table-column>      
      <el-table-column align="center" :label="tableOptions[11]" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{$t('table.delete')}}
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

<script>
import { fetchList } from '@/api/shop'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const regionOptions = [
  { key: 'JH', display_name: '金华' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const regionKeyValue = regionOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        region: undefined
      },
      tableOptions: ['名称', '地址', '所在区域', '店长', '简介', '操房数量', '总面积', '私教面积', '店铺封面', '店铺照片', '开店时间', '操作'],
      importanceOptions: [1, 2, 3],
      regionOptions,
      temp: {
        id: undefined,
        name: '',
        region: '',
        longitude: '',
        latitude: '',
        address: '',
        manager: '',
        introduction: '',
        classrooms: '',
        totalArea: '',
        personalArea: '',
        coverUrl: '',
        photos: '',
        openDate: ''
      },
      rules: {
        address: [{ required: true, message: 'region is required', trigger: 'change' }],
        introduction: '',
        classrooms: '',
        totalArea: '',
        personalArea: '',
        coverUrl: '',
        photos: '',
        openDate: [{ type: 'date', required: true, message: 'openDate is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        manager: [{ required: true, message: 'name is required', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
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
    },
    typeFilter(type) {
      return regionKeyValue[type]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        console.log(response.data)
        this.list = response.data.data

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      // this.resetTemp()
      // this.dialogStatus = 'create'
      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
      // <router-link to="/shoplist/newOrEdit">新增</router-link>
      this.$router.push({ path: '/shoplist/newOrEdit' })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log('handleUpdate' + this.temp.id)
      this.$router.push({ path: '/shoplist/newOrEdit', query: { shopid: this.temp.id }})
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
        const tHeader = ['名称', '地址', '所在区域', '店长', '简介', '操房数量', '总面积', '私教面积', '店铺封面', '店铺照片', '开店时间']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
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
    // ,
    // resolvePath(...paths) {
    //   return path.resolve(this.basePath, ...paths)
    // }
  }
}
</script>
