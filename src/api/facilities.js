import request from '@/utils/request'
export function fetchFacilitiesList() {
  return request({
    url: '/facilities/types',
    method: 'get'
  })
}
export function fetchFacilities(id) {
  return request({
    url: '/facilities/types/' + id,
    method: 'get'
  })
}

export function createFacilities(data) {
  return request({
    url: '/facilities/types',
    method: 'post',
    data
  })
}

export function updateFacilities(data) {
  return request({
    url: '/facilities/types/' + data.id,
    method: 'put',
    data
  })
}
export function deleteFacilities(id) {
  return request({
    url: '/facilities/types/' + id,
    method: 'delete'
  })
}
/** ***************************/
export function fetchFacModelList(id) {
  // 获取一类器械列表
  return request({
    url: '/facilities?type=' + id,
    method: 'get'
  })
}

export function fetchFacModel(id) {
  // 获取器械
  return request({
    url: '/facilities/' + id,
    method: 'get'
  })
}

export function createFacModel(data) {
  return request({
    url: '/facilities/',
    method: 'post',
    data
  })
}

export function updateFacModel(data) {
  return request({
    url: '/facilities/' + data.id,
    method: 'put',
    data
  })
}

export function deleteFacModel(id) {
  return request({
    url: '/facilities/' + id,
    method: 'delete'
  })
}

