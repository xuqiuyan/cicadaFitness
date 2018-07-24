<template>
  <div>
    <ul id="photosList" v-for="(url, index) in photos" :key="index">
        <li :style="{backgroundImage: 'url(' + url + ')'}"></li>
    </ul>
    <upload-img data="UploadImgs"></upload-img>
  </div>
</template>
<style>
  #photosList{
    position: relative;
    list-style: none;
    margin: 0;
  }
  #photosList li{
    float: left;
    margin-right: 10px;
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
      options: {
        Bucket: 'static-1257000451',
        Region: 'ap-shanghai'
      },
      msg: '只能上传jpg/png文件，且不超过500kb',
      cos: '',
      photos: ''
    }
  },
  created() {
    Bus.$on('getPhotosUrl', msg => {
      this.photos = msg
    })
    Bus.$on('getPhotoUrl', msg => {
      this.photos = this.photos.push(msg)
      console.log()
    })
  },
  methods: {
  }
}

</script>