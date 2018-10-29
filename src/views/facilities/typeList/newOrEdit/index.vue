<template>
  <div class="app-container">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 600px; margin-left:50px;'>
        <el-form-item :label="tableOptions[0]" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[1]" prop="logoUrl">
          <div class="imgblock" :style="{backgroundImage: 'url(' + temp.logoUrl + ')'}">
            <upload-img :imgfoulder="imgfoulder"></upload-img>
          </div>
          <p>{{msg}}</p>          
        </el-form-item>
        <el-form-item :label="tableOptions[2]" prop="videoUri">
          <upload-video></upload-video>
        </el-form-item>
        <el-form-item :label="tableOptions[3]" prop="profile">
          <el-input v-model="temp.profile"></el-input>
        </el-form-item>
        <el-form-item :label="tableOptions[4]" prop="introduction">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入店铺简介" v-model="temp.introduction">
          </el-input>
        </el-form-item>        
        <el-form-item :label="tableOptions[5]" prop="tags">
          <el-tag
            size="small" 
            :key="tag"
            v-for="tag in temp.tags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-left:130px;">
        <el-button v-if="facid==undefined" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
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
import { fetchFacilities, createFacilities, updateFacilities } from '@/api/facilities'
// import waves from '@/directive/waves' // 水波纹指令fetchShop,
// import { parseTime } from '@/utils'
import UploadImg from '@/components/uploadFiles/UploadImg'
import uploadVideo from '@/components/uploadFiles/uploadVideo'

const regionOptions = [
  { key: 'JH', display_name: '金华' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const regionKeyValue = regionOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  components: { UploadImg, uploadVideo },
  data() {
    return {
      imgfoulder: 'facilities/types/logo',
      imgHead: '',
      msg: '只能上传jpg/png文件，且不超过500kb',
      tableOptions: ['名称', 'logo', '视频', '简介', '详情', '标签'],
      temp: {
        id: undefined,
        name: '',
        logoUrl: '',
        videoUri: '',
        profile: '',
        introduction: '',
        tags: []
      },
      rules: {
        name: [{ required: true, message: '请输入店名', trigger: 'blur' }],
        logoUrl: [{ required: true, message: '请上传图片', trigger: 'change' }],
        videoUri: [{ required: true, message: '请上传视频', trigger: 'change' }],
        profile: [{ required: true, message: '请输入器械简介' }],
        introduction: [{ required: true, message: '请输入器械详情', trigger: 'blur' }],
        tags: [{ required: true, message: '请添加标签', trigger: 'change' }]
      },
      facid: this.$route.query.facid,
      inputVisible: false,
      inputValue: ''
    }
  },
  filters: {
    typeFilter(type) {
      return regionKeyValue[type]
    }
  },
  created() {
    this.isCreate()
    Bus.$on('uploadLogoSuccess', msg => {
      console.log(msg)
      this.temp.logoUrl = msg
    })
    Bus.$on('uploadVideoSuccess', msg => {
      this.temp.videoUri = msg
    })
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    isCreate() {
      if (this.facid) {
        this.getFacilities()
      }
    },
    getFacilities() {
      fetchFacilities(this.facid).then(response => {
        this.temp = Object.assign({}, response.data.data)
        Bus.$emit('getCoverUrl', this.temp.coverUrl)
        this.listLoading = false
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createFacilities(this.temp).then(() => {
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
          updateFacilities(this.temp).then(() => {
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

