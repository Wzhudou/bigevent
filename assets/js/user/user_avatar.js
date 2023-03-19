$(function() {


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


    // 上传图片按钮
    $('#btnChooseImage').on('click', function() {
        $('#file').click();
    });
    // 为文件选择框绑定change事件
    $('#file').on('change', function(e) {
        // console.log(e);
        // 获取用户选择的文件
        const fileList = e.target.files;
        if (fileList.length === 0) return layui.layer.msg('请选择照片');

        // 拿到用户选择的文件
        const file = fileList[0];
        // 将文件转化为路径
        const imageURL = URL.createObjectURL(file);
        // 重新初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imageURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
        
    });

    // 上传文件到后端
    $('#btnUpload').on('click', function() {
        // 拿到用户裁剪后的图像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 调用接口上传
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {avatar: dataURL},
            success: function(res) {
                if (res.status !== 0) return layer.layui.msg('更换头像失败!');
                layui.layer.msg('更换头像成功');
                window.parent.getUserInfo();
            }
        })
    })
})