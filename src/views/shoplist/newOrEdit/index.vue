<template>
  <div class="app-container">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 600px; margin-left:50px;'>
        <el-form-item :label="tableOptions[0]" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[3]" prop="manager">
          <el-input v-model="temp.manager"></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[10]" prop="openDate">
          <el-date-picker v-model="temp.openDate" type="date" placeholder="请选择开店时间">
          </el-date-picker>          
        </el-form-item>  
        <el-form-item :label="tableOptions[1]" prop="address">
          <el-input v-model="temp.address" @focus="getMap"></el-input>
        </el-form-item>  
        <el-form-item :label="tableOptions[5]" prop="classrooms">
          <el-input v-model="temp.classrooms"><template slot="append">个</template></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[6]" prop="totalArea">
          <el-input v-model="temp.totalArea"><template slot="append">㎡</template></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[7]" prop="personalArea">
          <el-input v-model="temp.personalArea"><template slot="append">㎡</template></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[8]" prop="photos">
          <div style="width:148px;height:148px;" :style="{backgroundImage: 'url(' + temp.coverUrl + ')'}">
            <upload-img></upload-img>
          </div>
          <p>{{msg}}</p>          
        </el-form-item>
        <el-form-item :label="tableOptions[9]" prop="photos">
          <upload-imgs></upload-imgs>
        </el-form-item>        
        <el-form-item :label="tableOptions[4]" prop="introduction">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入店铺简介" v-model="temp.introduction">
          </el-input>
        </el-form-item>      
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-left:80px;">
        <el-button v-if="shopid==''" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
      <el-dialog title="请选择地址" :visible.sync="dialogFormVisible" >
        <t-map ref="tMap"></t-map>
        <div slot="footer" class="dialog-footer">
          <el-button  type="primary" @click="cancleMap">{{$t('table.cancel')}}</el-button>
          <el-button  type="primary" @click="returnMap">{{$t('table.confirm')}}</el-button>
        </div>
      </el-dialog>
      
  </div>

</template>

<script>
import Bus from '@/api/bus'
import { fetchShop, createShop, updateShop } from '@/api/shop'
// import waves from '@/directive/waves' // 水波纹指令fetchShop,
// import { parseTime } from '@/utils'
import UploadImg from '@/components/uploadFiles/UploadImg'
import UploadImgs from '@/components/uploadFiles/UploadImgs'

import TMap from '@/components/tMap'
const regionOptions = [
  { key: 'JH', display_name: '金华' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const regionKeyValue = regionOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  components: { UploadImg, UploadImgs, TMap },
  data() {
    return {
      dialogFormVisible: false,
      imgHead: '',
      msg: '只能上传jpg/png文件，且不超过500kb',
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
        photos: [],
        openDate: ''
      },
      rules: {
        address: [{ required: true, message: '请选择店铺地址', trigger: 'blur' }],
        introduction: [{ required: true, message: '请输入店铺简介', trigger: 'blur' }],
        classrooms: [{ type: 'number', required: true, message: '请输入操房数量', trigger: 'change' }],
        totalArea: [{ type: 'number', required: true, message: '请填写店铺总面积', trigger: 'change' }],
        personalArea: [{ type: 'number', required: true, message: '请填写私教面积', trigger: 'change' }],
        coverUrl: [{ required: true, message: '请上传店铺封面', trigger: 'change' }],
        photos: [{ required: true, message: '请上传店铺照片', trigger: 'change' }],
        openDate: [{ type: 'date', required: true, message: '请填写开店时间', trigger: 'change' }],
        name: [{ required: true, message: '请输入店名', trigger: 'blur' }],
        manager: [{ required: true, message: '请输入店长', trigger: 'blur' }]
      },
      shopid: this.$route.query.shopid
    }
  },
  filters: {
    typeFilter(type) {
      return regionKeyValue[type]
    }
  },
  created() {
    this.isCreate()
    Bus.$on('uploadImgSuccess', msg => {
      this.temp.coverUrl = msg
      console.log(msg)
    })
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    isCreate() {
      if (this.shopid) {
        this.getShop()
      }
    },
    getShop() {
      fetchShop(this.shopid).then(response => {
        this.temp = Object.assign({}, response.data.data)
        this.temp.photos = [this.temp.coverUrl, this.temp.coverUrl]
        // this.imgList = JSON.stringify(this.temp.photos)
        Bus.$emit('getCoverUrl', this.temp.coverUrl)
        Bus.$emit('getPhotosUrl', this.temp.photos)
        this.listLoading = false
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
    },
    getMap() {
      this.dialogFormVisible = true
    },
    cancleMap() {
      console.log('cancleMap')
    },
    returnMap() {
      this.dialogFormVisible = false
      var tmp = this.$refs.tMap
      this.temp.address = tmp.address
      this.temp.latLng = tmp.latLng
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

