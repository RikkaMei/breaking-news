
// 入口函数
$(function () {
    var form = layui.form
    var layer = layui.layer

    // 【自定义表单验证规则】
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度在6个字符之内！'
            }
        }
    })

    initUserInfo()

    // 【初始化用户信息】
    function initUserInfo() {
        $.ajax({
            method:'GET',
            // url 导入baseAPI.js 自动拼接
            url:'/my/userinfo',
            // 登录后判断状态
            success:function(res){
                if(res.status !== 0){
                    return lazyrouter.msg('获取用户信息失败')
                }

                // 调用form.val('filter', object); 快速为表单赋值
                // 但是res.data有 id 属性，而没有id的表单，所以需要创建一个隐藏的表单来存放id
                form.val('formUserInfo',res.data)
            }
        })
    }

    // 【重置按钮】
    // 默认会把表单内容全部清空，但我们只需要重置为修改之前的内容(保留登录用户)
    $('#btnReset').on('click',function(e){
        // 阻止默认重置行为
        e.preventDefault()
        // 再调用一下初始化成默认的数据
        initUserInfo()

    })

    // 【更新用户信息（监听表单提交事件）】
    $('.layui-form').submit(function(e){
        // 阻止默认表单提交行为
        e.preventDefault()

        // 发起ajax post 数据请求
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            // 提交的数据为表单中的内容，这里会把表单序列化为字符串 
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg('更新信息失败！')
                }
                layer.msg('更新信息成功')

                // 当更新成功后还要调用副页面的 getUserInfo() ，重新渲染用户头像和其他信息
                // 但是此页面是直接被渲染到<iframe>中的，和副页面的层级关系是：副页面 > <iframe>
                // [window表示<iframe>的最大页面，它的父级正好是副页面]
                window.parent.getUserInfo()
            }
        })
    })
})

