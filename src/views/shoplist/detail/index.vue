<template>
  <div class="app-container">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="tableOptions[0]" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[1]" prop="address">
          <el-input v-model="temp.address"></el-input>
        </el-form-item>
        <!-- <el-form-item :label="tableOptions[2]" prop="region">
          <el-select class="filter-item" v-model="temp.region" placeholder="请选择区域">
            <el-option v-for="item in  regionOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="tableOptions[3]" prop="manager">
          <el-input v-model="temp.manager"></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[4]" prop="introduction">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入店铺简介" v-model="temp.introduction">
          </el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[5]" prop="classrooms">
          <el-input v-model="temp.classrooms"></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[6]" prop="totalArea">
          <el-input v-model="temp.totalArea"></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[7]" prop="personalArea">
          <el-input v-model="temp.personalArea"></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[8]" prop="coverUrl">
        </el-form-item>
        <el-form-item :label="tableOptions[9]" prop="photos">
        </el-form-item>
        <el-form-item :label="tableOptions[10]" prop="openDate">
          <el-date-picker v-model="temp.openDate" type="date" placeholder="请选择开店时间">
          </el-date-picker>
        </el-form-item>        
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-left:80px;">
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
  </div>
</template>

<script>
import { createShop, updateShop } from '@/api/shop'
// import waves from '@/directive/waves' // 水波纹指令fetchShop,
// import { parseTime } from '@/utils'

const regionOptions = [
  { key: 'JH', display_name: '金华' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const regionKeyValue = regionOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  data() {
    return {
      tableOptions: ['名称', '地址', '所在区域', '店长', '简介', '操房数量', '总面积', '私教面积', '店铺封面', '店铺照片', '开店时间', '操作'],
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
      dialogStatus: this.$route.params.status
    }
  },
  filters: {
    // statusFilter(status) {
    //   const statusMap = {
    //     published: 'success',
    //     draft: 'info',
    //     deleted: 'danger'
    //   }
    //   return statusMap[status]
    // },
    typeFilter(type) {
      return regionKeyValue[type]
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        console.log('createData')
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createShop(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        console.log('updateData')
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateShop(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

