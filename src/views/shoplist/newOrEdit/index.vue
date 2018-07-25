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
        <el-form-item :label="tableOptions[2]" prop="region">
          <el-input v-model="temp.region"></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[1]" prop="address">
          <el-input v-model="temp.address" @focus="getMap"></el-input>
        </el-form-item>  
        <el-form-item :label="tableOptions[5]" prop="classrooms">
          <el-input v-model.number="temp.classrooms" type="number"><template slot="append">个</template></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[6]" prop="totalArea">
          <el-input v-model.number="temp.totalArea" type="number"><template slot="append">㎡</template></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[7]" prop="personalArea">
          <el-input v-model.number="temp.personalArea" type="number"><template slot="append">㎡</template></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[8]" prop="photos">
          <div style="width:148px;height:148px;" :style="{backgroundImage: 'url(' + temp.coverUrl + ')'}">
            <upload-img :imgfoulder="imgfoulder"></upload-img>
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
      <div slot="footer" class="dialog-footer" style="margin-left:130px;">
        <el-button v-if="shopid==undefined" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
      <t-map></t-map>
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
      imgfoulder: 'covers',
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
        classrooms: 0,
        totalArea: 0,
        personalArea: 0,
        coverUrl: '',
        photos: [],
        openDate: new Date()
      },
      rules: {
        address: [{ required: true, message: '请选择店铺地址' }],
        introduction: [{ required: true, message: '请输入店铺简介', trigger: 'blur' }],
        classrooms: [
          { required: true, message: '请输入操房数量', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        totalArea: [
          { required: true, message: '请填写店铺总面积', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        personalArea: [
          { required: true, message: '请填写私教面积', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        coverUrl: [{ required: true, message: '请上传店铺封面', trigger: 'change' }],
        photos: [{ required: true, message: '请上传店铺照片', trigger: 'change' }],
        openDate: [{ required: true, message: '请填写开店时间' }],
        name: [{ required: true, message: '请输入店名', trigger: 'blur' }],
        manager: [{ required: true, message: '请输入店长', trigger: 'blur' }],
        region: [{ required: true, message: '请输入所在区域', trigger: 'blur' }]
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
    Bus.$on('uploadHeadSuccess', msg => {
      this.temp.coverUrl = msg
    })
    Bus.$on('setPhotosUrl', msg => {
      this.temp.photos = msg
    })
    Bus.$on('selectMap', msg => {
      this.temp.address = msg.address
      this.temp.longitude = msg.longitude
      this.temp.latitude = msg.latitude
    })
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    isCreate() {
      console.log(this.shopid)
      if (this.shopid) {
        this.getShop()
      }
    },
    getShop() {
      fetchShop(this.shopid).then(response => {
        this.temp = Object.assign({}, response.data.data)
        Bus.$emit('getCoverUrl', this.temp.coverUrl)
        Bus.$emit('getPhotosUrl', this.temp.photos)
        this.listLoading = false
      })
    },
    createData() {
      console.log('createData')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
      console.log('updateData')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateShop(this.temp).then(() => {
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
      Bus.$emit('isShowMap', true)
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

