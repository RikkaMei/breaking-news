var layer = layui.layer
// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
  // 纵横比
  aspectRatio: 1,
  // 指定预览区域
  preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)


//   【点击上传头像】
$('#btnChooseImage').on('click', function () {
  $('#file').click()
})

// 【选择头像】 为文件框绑定 change 事件,change()可以在表单发生改变时被触发
$('#file').on('change', function (e) {

  // console.log(e);

  // 获取用户选择的文件  e.target.files是一个数组，file 属性表示选中的文件，length 表示文件的数量
  var filelist = e.target.files
  if (filelist.length === 0) {
    return layer.msg('请选择照片！')
  }

  // 1.拿到用户选择的照片
  var file = e.target.files[0]
  // 2.根据选择的文件，创建一个对应的 URL 地址：
  var newImgURL = URL.createObjectURL(file)
  // 3.先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
  $image
    .cropper('destroy')      // 销毁旧的裁剪区域
    .attr('src', newImgURL)  // 重新设置图片路径
    .cropper(options)        // 重新初始化裁剪区域
})

// 【更新头像】
$('#btnUpload').on('click',function(){
  
  // 1.拿到裁剪之后的新头像(输出为base64格式)
  // base64格式一般用在小图片上，会比源文件大30%，优点是可以减少一些不必要的请求，提高加载速度
  var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

  // 2.调用接口，上传头像
  $.ajax({
    method:'POST',
    url:'/my/update/avatar',
    data:{
      avatar:dataURL,
    },
    success:function(res){
      if(res.status !==0){
        return layer.msg('更新失败！')
      }
      layer.msg('更新头像成功~！')

      // 更换成功后 同时渲染侧边栏
      window.parent.getUserInfo()
    }
  })
})