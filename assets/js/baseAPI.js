// 每次调用$.get、$.post 或$ajax 的时候，会先调用这个函数$.ajaxPrefilter(）
// 在这个函数中可以拿到给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
})