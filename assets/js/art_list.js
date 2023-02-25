$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义时间格式化的方法（自定义模板过滤器）
    template.defaults.imports.dataFormat = function (date) {
        // 创建时间对象
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '-' + hh + ':' + mm + ':' + ss
    }

    // 定义时间补零的方法
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义查询参数对象，包含各项文章列表的属性，请求的时候提交给服务器的数据
    var q = {
        pagenum: 1,  //页码值
        pagesize: 2, //每页显示条数
        cate_id: '', //文章分类id
        state: ''   //文章发布状态
    }

    // 初始化
    initTable()
    initCate()

    // 【获取文章列表数据】
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎把数据渲染到页面 <tbody>中
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用方法渲染分页板块（根据res.total可以获取文章的总数）
                renderPage(res.total)
            }
        })
    }

    // 【初始化 所有分类的下拉选项】
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类可选项
                var htmStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmStr)

                // 到此会出现下拉框没有选项的bug，主要分为两个原因：
                // 1.layui的渲染机制，一开始layui在加载时就开始进行渲染，只是这时<select>中没有任何选项
                // 2.之后发起的异步请求，模板才动态地把数据渲染到<select>中，此时新的数据并没有被layui监听到
                // 所以我们可以让layui再重新渲染一次表单
                form.render()
            }
        })
    }

    // 【筛选按钮：为form-search绑定 submit 事件】（筛选按钮已经是submit按钮）
    // 【筛选按钮：为form-search绑定 submit 事件】（筛选按钮已经是submit按钮）
    $('#form-search').submit(function (e) {
        // 阻止默认提交事件
        e.preventDefault()
        // 获取下拉选项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // 把这些值赋值给 查询参数对象q
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()

    })


    // 【渲染分页结构】
    // （根据文章列表数据的总数去动态渲染页数，在初始化文章列表时调用）
    function renderPage(total){
        // 使用 laypage.render() 渲染分页结构到标签中
        laypage.render({
            elem:'pageBox',     //目标容器id选择器(不需要#)
            count: total,       //总数据条数
            limit:q.pagesize,   //每页显示条数
            curr:q.pagenum,      //默认选中的分页

            // 【layout 自定义分页排版】
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,4,5,10],     //自定义条目数limit 中的页数

            // 【切换分页：jump回调函数】
            // jump回调会在两种情况下出发：1.点击分页触发jump回调  2.调用laypage.render()触发jump回调
            // 如果把初始化列表 initTable() 写在jump回调中就会导致第2种清空，
            // 触发死循环：jump回调 > initTable() > renderPage() > laypage.render() > jump回调 > initTable() .....

            // 解决办法：利用参数 first 判断是通过哪种方式触发jump回调（undefined为方式1，true为方式2），first 表示是否为首次渲染
            jump:function(obj,first){
                console.log(obj.curr);

                // 更新最新的页码值，渲染到当前页面
                q.pagenum = obj.curr
                // 更新最新的条目数，渲染到当前页面
                q.pagesize = obj.limit
                
                // 初始化列表(仅在点击分页触发jump回调时)
                if(!first){
                    initTable()
                }
            }
        })
    }

    // 【删除文章：为删除按钮 代理绑定点击事件】
    $('tbody').on('click','.btn-delete',function(){
        // 先获取到文章的id
        var id = $(this).attr('data-id')
        // 再获取当前列表中 删除按钮的个数  
        var len = $('.btn-delete').length

        // 询问框
        layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 发起删除请求
            $.ajax({
                method:'GET',
                url:'/my/article/delete'+id,
                success:function(res){
                    if(res.status !==0){
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功~')

                    // 此时数据删除完毕，如果此分页已没有内容，分页的页数会自动切换到前一夜，但是列表内容却依然为空，这是因为页码值没有进行变化
                    // 解决方法：判断当前列表内容是否为空，若为空则使页码值-1.可以通过当前列表中的删除按钮个数进行判断
                    // 但删除按钮个数为1时，说明删除操作完毕之后就没有数据了
                    if(len === 1){
                        // 页码值最小值为1！
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    // 最后刷新文章列表
                    initTable()
                }
            })
            
            layer.close(index);
          });
    })

})