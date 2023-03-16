// 每次调用$.get、$.post 或$ajax 的时候，会先调用这个函数$.ajaxPrefilter(）
// 在这个函数中可以拿到给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;

    // 同一为有权限的接口，设置headers
    if (options.url.includes('/my/')) {
        options.headers = {
            // 请求头配置对象
            Authorization: localStorage.getItem('token') || ''
        }
    
    }

    // 全局同一挂在complete回调函数
    options.complete =  function(res) {
        // 无论成功失败都会调用complete函数
        // 在complete中可以使用responseJSON拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 强制清空token
                localStorage.removeItem('token')
                // 强制跳转登录页
                location.href = 'login.html';
            }
    }
})