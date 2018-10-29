<template>
    <div id="mapElement" >
      <div class="mapMask"></div>
      
      <div id="container">
        <i class="el-icon-close" @click="cancleMap"></i>
        <p class="title">请选择地址</p>
        <div id="mapContainer">
          <el-input v-model="keywords" placeholder="" id="searchInput"></el-input>      
          <div id="map"></div>
        </div> 
        <div align="right" style="padding:15px">
          <el-button  type="primary" @click="cancleMap">{{$t('table.cancel')}}</el-button>
          <el-button  type="primary" @click="returnMap">{{$t('table.confirm')}}</el-button> 
        </div>
        
      </div>    
    </div>    

</template>
<style>
#mapElement{
  position: fixed;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: hidden;
}
#mapElement .mapMask{
  position: absolute;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .5)
} 
#container {
  position: absolute;
  top: 10%;
  width: 60%;
  left: 20%;
  background:#fff;
  border-radius: 15px;
}
#container .title{
  line-height: 36px;
  height: 36px;
  margin:0;
  padding-left: 15px;
  font-size:18px;
}
#container .el-icon-close{
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 100;
  color: #000;
  cursor: pointer;
  font-size: 18px
}
#mapContainer{
  position: relative;
  width:100%;
  height:500px;
}
#map {
  position: absolute;
  top: 0;
  left: 0;
  width:100%;
  height:100%;
}
#searchInput {
  position: absolute;
  z-index: 1000;
  width:300px; 
  top:20px;
  left:80px
}
</style>
<script>
import Bus from '@/api/bus'
import qq from 'qq'

export default {
  name: 'TMap',
  data() {
    return {
      keywords: '',
      latLng: '',
      address: '',
      dialogFormVisible: false
    }
  },
  mounted() {
    this.getMap()
  },
  methods: {
    getMap() {
      const map = new qq.maps.Map(document.getElementById('map'), {
      // 地图的中心地理坐标。
        center: new qq.maps.LatLng(29.101, 119.6947),
        zoom: 11
      })
      // 标注
      var markers = []
      var ap = new qq.maps.place.Autocomplete(document.getElementById('searchInput'), { location: '金华市' })
      // 调用Poi检索类。用于进行本地检索、周边检索等服务。
      var searchService = new qq.maps.SearchService({
        // 检索成功的回调函数
        complete: results => {
          // 设置回调函数参数
          var pois = results.detail.pois
          const info = new qq.maps.InfoWindow({ map: map })
          var latlngBounds = new qq.maps.LatLngBounds()
          for (var i = 0, l = pois.length; i < l; i++) {
            var poi = pois[i]
            // 扩展边界范围，用来包含搜索到的Poi点
            latlngBounds.extend(poi.latLng)
            var marker = new qq.maps.Marker({
              map: map,
              position: poi.latLng
            })

            marker.setTitle(i + 1)
            markers.push(marker)
            qq.maps.event.addListener(marker, 'click', () => {
              info.open()
              info.setContent('<div style="width:280px;height:100px;">' + '<p style="font-size:14px;">名称：' + poi.name + '</p><p style="font-size:14px;">地址：' + poi.address + '</p></div>')
              info.setPosition(poi.latLng)
              this.latLng = poi.latLng
              this.address = poi.address
            })
          }
          // 调整地图视野
          map.fitBounds(latlngBounds)
        },
        // 若服务请求失败，则运行以下函数
        error: function() {
          console.log('出错了。')
        }
      })
      var clearOverlays = function(overlays) {
        let overlay = overlays.pop()
        while (overlay) {
          overlay.setMap(null)
          overlay = overlays.pop()
        }
      }
      // 联想菜单添加监听事件
      qq.maps.event.addListener(ap, 'confirm', function(res) {
        clearOverlays(markers)
        const all = this.place.address + '-' + this.place.name
        searchService.search(all)
      })
    },
    cancleMap() {
      this.dialogFormVisible = false
    },
    returnMap() {
      this.dialogFormVisible = false
      const msg = {}
      msg.address = this.address
      msg.longitude = this.latLng.lng
      msg.latitude = this.latLng.lat
      Bus.$emit('selectMap', msg)
    }
  },
  created() {
    Bus.$on('isShowMap', msg => {
      this.dialogFormVisible = msg
    })
  },
  watch: {
    dialogFormVisible(curVal, oldVal) {
      if (curVal === false) {
        document.getElementById('mapElement').style.visibility = 'hidden'
      } else {
        document.getElementById('mapElement').style.visibility = 'visible'
      }
    }
  }
}
</script>
