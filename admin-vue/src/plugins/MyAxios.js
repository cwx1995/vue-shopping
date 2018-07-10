import axios from 'axios';

const MyAxios = {};
MyAxios.install = function (Vue) {
  // axios.defaults.baseURL = 'http://localhost:8080/';
  // Vue.prototype.$http = axios;
  // 创建自定义的axios实例
  const instance = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/'
  });
  Vue.prototype.$http = instance;
};
export default MyAxios;
