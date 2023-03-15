$(function() {
    // 点击 去注册账号 的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });

    // 点击 去登录 的链接
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 自定义校验规则
    // 从layui中获取form对象
    const form = layui.form;
    // 获取layer对象
    const layer = layui.layer;
    // 通过form.verify(）函数来自定义校验规则
    form.verify({
        'pwd': [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: function(value) {
            // 拿到确认密码的值，
            // 需要拿到密码框中的内容
            const pwd = $('.reg-box [name=password]').val();
            // 进行判断两次密码是否相等
            if (value !== pwd) {
                return '两次密码不一致';
            }
        }
    });

    // 监听注册表单的注册提交事件
    // 根url：http://www.liulongbin.top:3007
    // const path = 'http://www.liulongbin.top:3007';
    $('#form_reg').on('submit', function(e) {
        // 阻止默认的提交行为
        e.preventDefault();
        // 发起post请求
        const data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val(),
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !==0) return layer.msg(res.message);
            layer.msg('注册成功，请登录');
            // 模拟人的点击行为
            $('#link_login').click()
        })
    });

    // 监听表单的登录提交事件
    $('#form_login').submit(function(e){
        // 阻止默认的提交行为
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: $(this).serialize(), // 快速获取表单中的数据
            success: function(res) {
                if(res.status !== 0) return layer.msg('登录失败');
                layer.msg('登录成功');
                console.log(res.token);
                // 将登录成功得到的token字符串保存到localStorage中
                localStorage.setItem('token', res.token);
                // 跳转到首页
                location.href = '/index.html'
            }
        })
    });

})