
$(function () {

  // 切换到注册界面
  $('#link_reg').on('click', () => {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 切换到登陆界面
  $('#link_login').on('click', () => {
    $('.reg-box').hide()
    $('.login-box').show()
  })

  // 【表单验证规则】

  // 从layui获取form对象
  var form = layui.form
  // 设置弹出层，用于弹出提示信息
  var layer = layui.layer

  // 自定义表单验证规则
  form.verify({
    // 密码格式
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 确认密码判断
    repwd: function (value) {
      // value为当前表单中输入的内容
      // 需获取第一次密码的值，来与第二次密码进行比较 val()返回指定的值
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致！'
      }
    }
  })

  // 【监听注册表单的提交事件】
  $('#form_reg').on('submit', function (e) {
    // 阻止默认提交行为
    e.preventDefault()
    // 发起ajax的POST请求

    // 获取表单中输入的账号密码
    var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    // 因为使用了自定义拼接根路径的脚本，所以url可以简化
    $.post(
      '/api/reguser', data, function (res) {
        // 如果请求失败，返回提示信息
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('注册成功')
        // 注册完成后自动切换到登陆界面
        $('#link_login').click()
      }
    )
  })

  // 【监听登录表单的提交事件】
  $('#form_login').on('submit', function (e) {
    // 阻止默认提交行为
    e.preventDefault()
    // 发起ajax请求
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // serialize()序列化表单元素，用于快速获取表单元素
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          // console.log(res.message);
          return layer.msg('登陆失败！')
        }
        layer.msg('登陆成功')
        console.log(res.token);
        // 登陆成功后获得的 token 保存到localStorage中
        localStorage.setItem('token', res.token)
        // 最后跳转到后台主页 （location.href可以进行网页重定向等功能
        location.href = '/index.html'
      }
    })
  })

})