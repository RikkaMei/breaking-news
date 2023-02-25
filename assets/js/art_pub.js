$(function () {
    var layer = layui.layer
    var form = layui.form


    initCate()
    // 初始化富文本编辑器
    initEditor()

    // 【加载文章分类】
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染文章分类的下拉表单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 最后别忘了重新渲染一次表单
                form.render()
            }
        }
        )
    }

    // 【文化封面裁剪】
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 【选择封面按钮】
    $('#btnChooseImage').on('click', function () {
        // 点击隐藏的文件选择框
        $('#coverFile').click()
    })

    // 【获取选择的封面：监听 coverFile文件选择框 的 change事件 】
    $('#coverFile').on('change', function (e) {
        // 获取选中的文件列表的数组
        var files = e.target.files[0]
        // 判断是否选择了文件
        if (files.length === 0) {
            return
        }
        // 为文件创建url地址
        var newImgURL = URL.createObjectURL(files)
        // 裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 【发布/存为草稿】
    // 默认文章发布状态
    var art_state = '已发布'
    // 存为草稿按钮
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 【提交表单数据】
    $('#form-pub').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault()

        // 1.基于 form表单，创建FormData对象（在发送post请求时，可以创建一个表单数据对象，将表单的数据存放在这个对象中直接提交给服务器）
        // (this)[0] 就是 #form-pub，用这种方式转化为 原生dom对象，才能调用 FormData()
        var fd = new FormData($(this)[0])

        // 2.追加 文件发布状态 属性
        // 但是提交的表单数据中不包括文章的发布状态，需要追加到表单数据对象中(以键值对形式)
        fd.append('state', art_state)

        // // 遍历表单中数据的键值
        // fd.forEach(function(v,k){
        //     console.log(k,v);
        // })

        // 3.将封面裁剪的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 4.将文件对象 存放到表格数据对象中
                fd.append('cover_img', blob)

                // 5.发起请求 提交表格数据
                publishArticle(fd)
            })

    })
    // 【定义文章发布方法】
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注！若向服务器提交 FormData 格式的数据，需添加一下两个配置项
            contenType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('文章发布成功~')
                console.log(res);

                // 成功发布后跳转页面
                location.href = '/article/art_list.html'
            }
        })
    }

})