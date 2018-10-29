<template>
  <div class="app-container">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 600px; margin-left:50px;'>
        <el-form-item :label="tableOptions[0]" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[1]" prop="coverUrl">
          <div class="imgblock" :style="{backgroundImage: 'url(' + temp.coverUrl + ')'}">
            <upload-img :imgfoulder="'facilities/covers'"></upload-img>
          </div>
          <p>{{msg}}</p>          
        </el-form-item>
        <el-form-item :label="tableOptions[3]" prop="modelNumber">
          <el-input v-model="temp.modelNumber"></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[2]" prop="photos">
          <upload-imgs :imgfoulder="'facilities/photos'"></upload-imgs>
        </el-form-item>        
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-left:130px;">
        <el-button v-if="modelId==undefined" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
  </div>

</template>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .imgblock{
    width: 148px;
    height: 148px;
    line-height: 146px;
    vertical-align: top;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>

<script>
import Bus from '@/api/bus'
import { fetchFacModel, createFacModel, updateFacModel } from '@/api/facilities'

import UploadImg from '@/components/uploadFiles/UploadImg'
import UploadImgs from '@/components/uploadFiles/UploadImgs'

export default {
  components: { UploadImg, UploadImgs },
  data() {
    return {
      msg: '只能上传jpg/png文件，且不超过500kb',
      tableOptions: ['名称', '封面', '照片', '型号'],
      temp: {
        id: undefined,
        typeId: this.$route.query.typeId,
        name: '',
        coverUrl: '',
        photos: [],
        modelNumber: ''
      },
      rules: {
        name: [{ required: true, message: '请输入器械名称', trigger: 'blur' }],
        coverUrl: [{ required: true, message: '请上传封面', trigger: 'change' }],
        photos: [{ required: true, message: '请上传图片', trigger: 'change' }],
        modelNumber: [{ required: true, message: '请输入器械型号' }]
      },
      inputVisible: false,
      inputValue: '',
      modelId: this.$route.query.modelId
    }
  },
  created() {
    this.isCreate()
    Bus.$on('facilities/covers', msg => {
      this.temp.coverUrl = msg
    })
    Bus.$on('facilities/photos-imgs', msg => {
      this.temp.photos = msg
    })
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    isCreate() {
      if (this.modelId) {
        this.getFacilities()
      }
    },
    getFacilities() {
      fetchFacModel(this.modelId).then(response => {
        this.temp = Object.assign({}, response.data.data)
        Bus.$emit('getCoverUrl', this.temp.coverUrl)
        this.listLoading = false
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createFacModel(this.temp).then(() => {
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
        if (valid) {
          updateFacModel(this.temp).then(() => {
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
    getSTime(val) {
      this.temp.openDate = this.$moment(val).format('YYYY-MM-DD')
    },
    handleClose(tag) {
      this.temp.tags.splice(this.temp.tags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.temp.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

