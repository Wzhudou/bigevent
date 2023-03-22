$(function() {
    const layer = layui.layer;
    const form =layui.form;
    // 获取文章分类类别
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                const htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    // 步骤一、添加类别功能
    $('#btnAddCate').on('click', function() {
        var indexAdd = layer.open({
            title: '添加文章类别',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
          }); 
    })
    // 通过代理的形式为form-add添加表单绑定事件：因为这个表单是动态渲染的
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        // 由于这个接口数据库的问题，所以目前不能新增数据
        $.ajax({
          method: 'POST',
          url: '/my/article/addcates',
          data: $(this).serialize(),
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('新增分类失败！')
            }
            initArtCateList()
            layer.msg('新增分类成功！')
            // 根据索引，关闭对应的弹出层
            layer.close(indexAdd)
          }
        })
      })



    // 步骤二： 编辑文章类别
    $('tbody').on('click', '#btnEdit', function(e) {
        // 弹出层
        var indexEdit = layer.open({
            title: '修改文章类别',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
          }); 

          const id = $(this).attr('data-id');
        //   console.log(id);
        // 发起请求获取对应的数据,并填充表单数据信息
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // form表单加lay-filter用于快速填充表单元素
                form.val('form-edit', res.data);
            }
        })
    })

    // 通过代理形式为修改分类的表单绑定submit事件
    // 数据库问题不能新增类别，并且 最新和 新闻 管理员不允许修改
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !==0) {
                    return layer.msg('更新数据失败')
                }
                layer.msg('更新数据成');
                // 关闭layer弹出层
                layer.close(indexEdit);
                initArtCateList();

            }
        })
    })

    // 步骤三： 删除文章类别
    $('tbody').on('click', '#btnDelete', function() {
        // console.log('ok');
        const id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !==0) {
                        return layer.msg(res.message)
                    } 
                    layer.msg('删除分类成功');
                    layer.close(index);
                    initArtCateList();
                }
            })
            
            // layer.close(index);
          });
    })



})