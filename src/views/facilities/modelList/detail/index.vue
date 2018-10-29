<template>
  <div class="app-container">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 600px; margin-left:50px;'>
        <el-form-item :label="tableOptions[0]" prop="name">
          <span>{{temp.name}}</span>
        </el-form-item>
        <el-form-item :label="tableOptions[1]" prop="logoUrl">
          <div class="imgblock" :style="{backgroundImage: 'url(' + temp.logoUrl + ')'}"></div>  
        </el-form-item>
        <el-form-item :label="tableOptions[2]" prop="videoUri">
          <video :src="temp.videoUri" controls="controls"></video>
        </el-form-item>
        <el-form-item :label="tableOptions[3]" prop="profile">
          <span>{{temp.profile}}</span>
        </el-form-item>
        <el-form-item :label="tableOptions[4]" prop="introduction">
          <span>{{temp.introduction}}</span>
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
  video{
    width:300px;
  }
</style>

<script>
import { fetchFacilities } from '@/api/facilities'

export default {
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
      facid: this.$route.query.facid
    }
  },
  created() {
    this.isCreate()
  },
  methods: {
    isCreate() {
      if (this.facid) {
        this.getFacilities()
      }
    },
    getFacilities() {
      fetchFacilities(this.facid).then(response => {
        this.temp = Object.assign({}, response.data.data)
        this.listLoading = false
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

