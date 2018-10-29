<template>
  <div>
    <div class="uploadVideo">
      <input  @change="fileChange" type="file" ref="videofile"/>
      <el-button  class="uploadVideoNow" type="primary">上传视频</el-button>      
    </div>

    <div id="resultBox"></div>
  </div>

</template>
<style>
  .uploadVideo{
    position: relative;
    width: 80px;
    height: 36px;
  }
  .uploadVideo input{
    position: absolute;
    top:0;
    left: 0;
    width: 100px;
    height: 36px;
    opacity: 0;
    z-index: 10;
  }
</style>


<script>
import Bus from '@/api/bus'
import $ from 'jquery'
import { getAuthVideo } from '@/api/getAuth'
export default{
  name: 'uploadVideo',
  data() {
    return {
      cosBox: '',
      videoFile: ''
    }
  },
  created() {
    // console.log($('#resultBox'))
  },
  methods: {
    addUploaderMsgBox() {
      var html = '<div class="uploaderMsgBox" name="box">'
      html += '视频名称：<span name="videoname"></span>；' +
      '计算sha进度：<span name="videosha">0%</span>；' +
      '上传进度：<span name="videocurr">0%</span>；' +
      'fileId：<span name="videofileId">   </span>；' +
      '上传结果：<span name="videoresult">   </span>；<br>' +
      '地址：<span name="videourl">   </span>；' +
      '<a href="javascript:void(0);" name="cancel" cosnum= act="cancel-upload">取消上传</a><br>'
      html += '</div>'
      $('#resultBox').append(html)
    },
    fileChange(e) {
      this.addUploaderMsgBox()
      this.videoFile = this.$refs.videofile.files[0]
      console.log(this.videoFile.type)
      $('#result').append(this.videoFile.name + '\n')
      /* eslint-disable */
      var resultMsg = qcVideo.ugcUploader.start({
        videoFile: this.videoFile,
        getSignature: this.getSignature,
        allowAudio: 1,
        success: function(result) {
          $('[name=videoresult]').text('上传成功')
          $('[name=cancel]').remove()
          this.cosBox = null
        },
        error: function(result) {
          $('[name=videoresult]').text('上传失败>>' + result.msg)
        },
        progress: function(result) {
          $('[name=videoname]').text(result.name)
          $('[name=videosha]').text(Math.floor(result.shacurr * 100) + '%')
          $('[name=videocurr]').text(Math.floor(result.curr * 100) + '%')
          $('[name=cancel]').attr('taskId', result.taskId)
          this.cosBox = result.cos
        },
        finish: function(result) {
          $('[name=videofileId]').text(result.fileId)
          $('[name=videourl]').text(result.videoUrl)
          Bus.$emit('uploadVideoSuccess',result.videoUrl)
          if (result.message) {
            $('[name=videofileId]').text(result.message)
          }
        }
      })
      if (resultMsg) {
        $('[name=box]').text(resultMsg)
      }
      // $('#form1')[0].reset()
    },
    getSignature(callback) {
      getAuthVideo().then(response => {
        callback(response.data.data)
      })
    }
  }

}

</script>