import request from '@/utils/request'
export default function getAuth() {
  var date = new Date()
  return request({
    url: '/cos/authorization',
    method: 'get',
    data: { pathname: '/' + date.getTime() }
  })
}
