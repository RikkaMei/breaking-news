$(function () {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    // 【获取文章分类的列表】
    function initArtCateList() {
        // 发送get请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // 将数据和表格模板渲染成字符串
                var htmlStr = template('tpl-table', res)
                // 最后将字符串渲染到<tbody>中
                $('tbody').html(htmlStr)
            }
        })
    }


    // 【添加类别按钮】
    // 弹出层变量（用于关闭弹出层）
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        // 弹出层
        indexAdd = layer.open({
            type: 1,     //type表示弹出层类型
            area: ['500px', '250px'],
            title: '添加文章分类',
            // 渲染 添加分类 弹出层
            content: $('#dialog-add').html()
        })
    })

    // 【添加文章分类：为form-add 表单代理绑定 submit 事件】
    // 但是form-add 表单是后面通过js模板渲染到页面的，网页加载完之后此表单还不存在，所以只能通过【代理的方式】绑定submit事件
    // 通过已存在元素 body 代理 form-add 来绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        // 发送POST请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // 序列化快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg('新增分类失败！')

                }
                // 成功之后刷新分类列表
                initArtCateList()
                layer.msg('新增分类成功~')
                // 关闭弹出层
                layer.close(indexAdd)

            }
        })
    })

    // 【编辑文章按钮：为 btn-edit 按钮 代理绑定点击事件】
    // 弹出层变量，用于关闭弹出层 
    var indexEdit = null
    // 渲染到tbody中时 .btn-edit就是tbody的子类
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出层
        indexEdit = layer.open({
            type: 1,     //type表示弹出层类型
            area: ['500px', '250px'],
            title: '修改文章分类',
            // 渲染 添加分类 弹出层
            content: $('#dialog-edit').html()
        })

        // 获取文章的id
        var id = $(this).attr('data-id')
        //  使用id发起get请求，返回对应的内容渲染到编辑框里
        $.ajax({
            method: 'GET',
            // url加上id以获取对应的数据
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res);
                // form.val() 快速设置为表单的值（只有一个参数时为获取值）  
                // 因为res.data中还有一项id的属性，但表格中并不需要id ，可以设置一个隐藏域标签来存放id为日后使用
                form.val('form-edit', res.data)
            }
        })
    })

    // 确认修改并刷新文章：为 form-edit 代理绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            methed: 'POST',
            url: '/my/article/updatecate',
            // 序列化获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新数据分类成功~')
                // 关闭弹出层
                layer.close(indexEdit)

                // 最后还需刷新文章列表
                initArtCateList()
            }
        })
    })

    // 【删除按钮：为 btn-delete 代理绑定点击事件】
    $('tbody').on('click', '.btn-delete', function () {
        // 获取文章的id
        var id = $(this).attr('data-id')
        // 设置删除提示框
        layer.confirm('确定删除吗？', { icon: 3, title: '提示' }, function (index) {
            //提交删除请求
            $.ajax({
                methed:'GET',
                url:'/my/article/deletecate'+id,
                success:function(res){
                    if(res.status !==0){
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功~')
                    layer.close(index);
                    // 最后刷新文章列表
                    initArtCateList()
                }
            })

            
        });
    })

})