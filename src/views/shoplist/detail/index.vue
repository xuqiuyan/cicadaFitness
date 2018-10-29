<template>
  <div class="app-container">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 600px; margin-left:50px;'>
        <el-form-item :label="tableOptions[0]" prop="name">
          <span>{{temp.name}}</span>
        </el-form-item>
        <el-form-item :label="tableOptions[3]" prop="manager">
          <span>{{temp.manager}}</span>
        </el-form-item>
        <el-form-item :label="tableOptions[10]" prop="openDate">
          <span>{{temp.openDate}}</span>      
        </el-form-item>  
        <el-form-item :label="tableOptions[2]" prop="region">
          <span>{{temp.region}}</span> 
        </el-form-item>
        <el-form-item :label="tableOptions[1]" prop="address">
          <span>{{temp.address}}</span> 
        </el-form-item>  
        <el-form-item :label="tableOptions[5]" prop="classrooms">
          <span>{{temp.classrooms}}个</span>          
        </el-form-item>
        <el-form-item :label="tableOptions[6]" prop="totalArea">
          <span>{{temp.totalArea}}㎡</span>
        </el-form-item>
        <el-form-item :label="tableOptions[7]" prop="personalArea">
          <span>{{temp.personalArea}}㎡</span>
        </el-form-item>
        <el-form-item :label="tableOptions[8]" prop="photos">
          <div class="imgblock" :style="{backgroundImage: 'url(' + temp.coverUrl + ')'}">
          </div>     
        </el-form-item>
        <el-form-item :label="tableOptions[9]" prop="photos">
          <ul class="imglist clear">
            <li v-for="(item, index) in temp.photos" :key="index">
              <div class="imgblock" :style="{backgroundImage: 'url(' + item + ')'}"></div> 
            </li>
          </ul>

        </el-form-item>        
        <el-form-item :label="tableOptions[4]" prop="introduction">
          <span>{{temp.introduction}}</span>
        </el-form-item>      
      </el-form>
  </div>

</template>

<script>
import { fetchShop } from '@/api/shop'

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
        classrooms: 0,
        totalArea: 0,
        personalArea: 0,
        coverUrl: '',
        photos: [],
        openDate: new Date()
      },
      shopid: this.$route.query.shopid
    }
  },
  created() {
    this.isCreate()
  },
  methods: {
    isCreate() {
      if (this.shopid) {
        this.getShop()
      }
    },
    getShop() {
      fetchShop(this.shopid).then(response => {
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
.imgblock{
  width: 148px;
  height: 148px;
  line-height: 146px;
  vertical-align: top;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
.imglist {
  margin: 0;
  list-style: none;
}
.imglist li{
  margin-right: 10px;
  float: left;
  width: 148px;
  height: 148px;
}
</style>

