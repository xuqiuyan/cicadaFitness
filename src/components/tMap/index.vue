<template>    
    <div id="container">
      <el-input v-model="keywords" placeholder="" id="searchInput" style="width:300px;  position: absolute;
  z-index: 10000; top:20px;left:80px"></el-input>      
      <div id="map"></div>
    </div>
</template>

<script>

// import remoteLoad from '@/api/remoteLoadJs'
import qq from 'qq'
export default {
  name: 'TMap',
  data() {
    return {
      keywords: '',
      latLng: '',
      address: ''
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
      var marker = new qq.maps.Marker({ position: new qq.maps.LatLng(29.101, 119.6947), map: map })
      // 地址解析
      const geocoder = new qq.maps.Geocoder()
      // 标注信息框
      const info = new qq.maps.InfoWindow({ map: map })
      // 视图调整
      const latlngBounds = new qq.maps.LatLngBounds()
      var ap = new qq.maps.place.Autocomplete(document.getElementById('searchInput'))
      // 调用Poi检索类。用于进行本地检索、周边检索等服务。
      // var searchService = new qq.maps.SearchService({ map: map })
      // 联想菜单添加监听事件
      qq.maps.event.addListener(ap, 'confirm', function(res) {
        const all = this.place.address + this.place.name
        geocoder.getLocation(all)
      })
      // 添加监听事件  获取鼠标点击事件
      qq.maps.event.addListener(map, 'click', function(event) {
        // // 地址和经纬度之间进行转换服务
        geocoder.getAddress(event.latLng)
      })
      // 设置服务请求成功的回调函数
      geocoder.setComplete(result => {
        if (result.detail.gps_type) {
          this.latLng = result.detail.location
          this.address = result.detail.address
        } else {
          this.latLng = result.detail.nearPois[0].latLng
          this.address = result.detail.nearPois[0].address + result.detail.nearPois[0].name
        }
        map.setCenter(this.latLng)// 设置地图中心
        marker.setPosition(this.latLng)// 设置标注
        latlngBounds.extend(this.latLng)// 设置视图
        map.fitBounds(latlngBounds)// 调整视图
        // 点击Marker会弹出反查结果
        info.open()
        info.setContent('<div>' + this.address + '</div>')
        info.setPosition(this.latLng)
      })
      // 若服务请求失败，则运行以下函数
      geocoder.setError(function() {
        console.log('出错了，请输入正确的地址！！！')
      })
    }
  },
  created: function() {

  }
}
</script>
<style>
#container {
  position: relative;
  width:100%;
  min-height:500px;
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
}
</style>