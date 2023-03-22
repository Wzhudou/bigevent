$(function() {
    const layer = layui.layer;
    const form = layui.form;
    
    //步骤一 定义加载文章分类的方法
    initCate();
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !==0) {
                    layer.msg('初始化文章分类失败!')
                }

                // 调用模板引擎渲染文章分类下拉
                const htmlStr = template('tpl_cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记住调用form.render()重新渲染
                form.render();
            }
        })
    }


    // 步骤二：初始化富文本编辑器
    initEditor();


    // 步骤三：裁剪功能
      // 1. 初始化图片裁剪器
        var $image = $('#image')
        
        // 2. 裁剪选项
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        
        // 3. 初始化裁剪区域
        $image.cropper(options)

    // 步骤四：选择封面 --- 模拟点击上传
    $('#btnChooseImage').on('click', function() {
        $('#coverfile').click();
    })
    // 监听coverfile的change事件，获取用户选择的文件列表
    $('#coverfile').on('change', function(e) {
        // 获取文件的列表数据
        const files = e.target.files;
        // 判断是否选择文件
        if (!files.length) {
            return;
        }
        // 选择文件--
        // （1）根据选择的文件，创建一个对应的 URL 地址：
        const newImgURL = URL.createObjectURL(files[0]);
        // (2) 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
        })


    // 步骤五： 发布文章
    // （1）定义文章的发布状态
    var art_state = '已发布';
    
    // (2) 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    });
    $('#btnSave1').on('click', function() {
        art_state = '已发布';
    });

    // (3) 为form绑定点击提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // (3.1)基于form表单快速创建formData对象
        const fd = new FormData($(this)[0]);
        // (3.2)文章发布状态存到表单中
        fd.append('state', art_state);
        // 将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // (3.3)将文件对象存储到fd中
                fd.append('cover_img', blob);
                publishArticle(fd);
            })
    })
    // (4) 发起ajax请求
    function publishArticle(fd) {
        $.ajax({
          method: 'POST',
          url: '/my/article/add',
          data: fd,
          // 注意：如果向服务器提交的是 FormData 格式的数据，
          // 必须添加以下两个配置项
          contentType: false,
          processData: false,
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('发布文章失败！')
            }
            layer.msg('发布文章成功！')
            // 发布文章成功后，跳转到文章列表页面
            location.href = '/article/art_list.html'
          }
        })
    }

})