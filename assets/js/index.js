$(function() {
    // 获取用户基本信息
    getUserInfo();

    const layer = layui.layer;
    // 退出登录功能
    $('#btnLogout').on('click', function(res) {
        // 提示用户是否退出
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, 
            function(index){     
                // 清除本地缓存中的token
                localStorage.removeItem('token');
            
                // 重新跳转到登录页面
                location.href = 'login.html';

                // 关闭confirm询问框
                layer.close(index);
            });
    });
});


// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 调用renderAvatar渲染用户的头像
            renderAvatar(res.data);
        }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    const name = user.nickname || user.username;
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 按需渲染用户的头像
    if (user.user_pic) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        const first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
}