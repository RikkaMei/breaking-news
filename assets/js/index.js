// 入口函数
$(function () {
    // 调用getUserInfo()获取用户信息
    getUserInfo()

    // 【点击退出功能】 
    $('#btnLogout').on('click', function () {
        // 确定退出弹窗由layer的弹层组件-confirm来实现
        layer.confirm('确定退出登录吗？', { icon: 3, title: '提示' }, function (index) {
            // 退出登录后的实现功能:
            // 1.清空token
            localStorage.removeItem('token')
            // 2.跳转到登陆页面
            location.href = '/login.html'

            // （关闭confirm询问框）
            layer.close(index);
        });
    })

})


// 【获取用户基本信息】
function getUserInfo() {
    // 根据文档发起get请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头（因为身份验证机制需要Authorization字段） 
        // 请求头已整合至baseAPI.js
        // header:{
        //     // 获取之前存放的token,如果没有则为空
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success: function (res) {

            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
              }
            // console.log(localStorage.getItem('token'));
            // 【身份验证出错！】
            console.log(res);

            // 调用 renderAvatar() 渲染用户头像
            renderAvatar(res.data)
        }

        // 【登录跳转验证】 防止在未登录状态直接通过url跳转至主页，同样也可以挂载到baseAPI中全局调用
        // complete是ajax中的回调函数，在请求之后无论成功还是失败都会执行这个回调函数
        // complete:function(res){
            
        // }

    })
}

// 【渲染用户头像】
function renderAvatar(user) {
    // 1.获取用户名称（优先显示昵称，再显示用户名）
    var name = user.nickname || user.username
    
    // 2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.1 有头像时渲染用户头像(显示用户头像隐藏默认头像)
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('scr', user.user_pic).show()
        $('text-avatar').hide()
    } else {
        // 3.2 无头像时渲染默认头像
        $('.layui-nav-img').hide()
        // 设置默认头像取用户名第一个字母的大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()

    }
    
}