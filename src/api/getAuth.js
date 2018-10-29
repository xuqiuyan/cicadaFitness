import request from '@/utils/request'
export function getAuthImg() {
  var date = new Date()
  return request({
    url: '/cos/authorization',
    method: 'get',
    data: { pathname: '/' + date.getTime() }
  })
}
export function getAuthVideo() {
  var date = new Date()
  return request({
    url: '/vod/sign',
    method: 'get',
    data: { pathname: '/' + date.getTime() }
  })
}
export function getImgName() {
  return request({
    url: '/newid',
    method: 'get'
  })
}
