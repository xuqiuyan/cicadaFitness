<template>
  <div>
    <ul id="photosList">
        <li v-for="(url, index) in photos" :key="index" :style="{backgroundImage: 'url(' + url + ')'}">
          <div class="delete" @click="deleteImg(index)">
            <el-icon name="delete"></el-icon>
          </div>          
        </li>
    </ul>
    <upload-img :fathername="fathername"></upload-img>
  </div>
</template>
<style>
  #photosList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  #photosList li{
    float: left;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    line-height: 146px;
    vertical-align: top;
    background-size: contain;
    background-position: center;
    text-align: center;
  }
  #photosList li .delete{
    background:rgba(255, 255, 255, 0.9);
    display: inline-block;
    width: 36px;
    height:36px;
    margin-top: 55px;
    line-height: 36px;
    border-radius: 3px;
    opacity: 0;
    cursor: pointer;
  }
  #photosList li:hover .delete{
    opacity: 1;
    transition: all
  }
</style>

<script>
import Bus from '@/api/bus'
// import COS from 'cos-js-sdk-v5'
// import getAuth from '@/api/getAuth'

import UploadImg from '@/components/uploadFiles/UploadImg'

export default {
  name: 'UploadImgs',
  components: { UploadImg },
  data() {
    return {
      fathername: 'uploadImgs',
      options: {
        Bucket: 'static-1257000451',
        Region: 'ap-shanghai'
      },
      msg: '只能上传jpg/png文件，且不超过500kb',
      cos: '',
      photos: []
    }
  },
  created() {
    Bus.$on('getPhotosUrl', msg => {
      // 获取店铺图片列表
      this.photos = msg
    })
    Bus.$on('uploadImgSuccess', msg => {
      // 上传图片完成
      this.photos.push(msg)
      Bus.$emit('setPhotosUrl', this.photos)
    })
  },
  methods: {
    deleteImg(i) {
      this.photos.splice(i, 1)
      Bus.$emit('setPhotosUrl', this.photos)
    }
  }
}

</script>