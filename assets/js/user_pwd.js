
$(function () {
    // 【创建表单校验规则】
    var form = layui.form

    form.verify({
        // 密码格式
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 新旧密码不能一致
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一样！'
                // return layer.msg('新旧密码不能一样！')
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 【发起请求更新密码】
    $('.layui-form').submit(function(e){
      // 阻止表单默认提交行为
      e.preventDefault()
      // 发起post请求
      $.ajax({
        method:'POST',
        url:'/my/updatepwd',
        // 序列化表单快速获取内容
        data:$(this).serialize(),
        success:function(res){
          if(res.satus !==0){
            return layer.msg('更新密码失败！')
          }
          layer.msg('更新密码成功')

          // 【重置表单】将jq元素加上[0] 转化为dom元素，才能使用reset()
          $('.layui-form')[0].reset()
        }
      })
    })
    
})