// $.ajaxPrefilter() 可以在请求之前修改默认请求参数，这里的作用是自动拼接根路径
// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数,可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = 'http://www.liulongbin.top:3007' + options.url

  // 统一为有权限的接口(路径为/my/的为权限接口)，设置headers请求头
  // indexOf()用于查找字符串的位置并返回
  if(options.url.indexOf('/my/') !== -1){
    options.headers = {
      Authorization:localStorage.getItem('token') || ''
    }
  }
  
  // 全局挂载 complete 回调函数
  options.complete = function(res){
    //可以使用res.responseJSON 拿到服务器响应回来的数据，以此判断用户的登录信息是否正常
    if(res.responseJSON.status === 1 && res.responseJSON.message === '身份验证失败！'){
      // 1.强制清空token
      localStorage.removeItem('token')
      // 2.强制跳转回登陆页面
      location.href = '/login.html'
  }
  }
})
