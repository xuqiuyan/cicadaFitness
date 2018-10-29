import request from '@/utils/request'
export function fetchList() {
  return request({
    url: '/shops',
    method: 'get'
  })
}

export function fetchShop(id) {
  return request({
    url: '/shops/' + id,
    method: 'get'
  })
}

export function createShop(data) {
  return request({
    url: '/shops',
    method: 'post',
    data
  })
}

export function updateShop(data) {
  return request({
    url: '/shops/' + data.id,
    method: 'put',
    data
  })
}

export function deleteShop(id) {
  return request({
    url: '/shops/' + id,
    method: 'delete'
  })
}
