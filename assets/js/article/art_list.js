$(function() {
    const layer = layui.layer;
    const form = layui.form;
    // 分页方法
    const layPage = layui.laypage;
    // 定义查询参数对象，需要将请求参数对象提交到服务器
    let query = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date);

        const y = dt.getFullYear();
        const m = padZero(dt.getMonth() + 1);
        const d = padZero(dt.getDate());

        const hh = padZero(dt.getHours());
        const min = padZero(dt.getMinutes());
        const ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + " " + hh + ':' + min + ':' + ss;
    }
    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    initTable();
    // 步骤一：获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: query,
            success: function(res) {
                if (res.status !==0) {
                    return layer.msg('获取文章列表失败!')
                }
                // 为空，为了便于观察，mock的数据
                if (!res.data.length) {
                    return;
                }
                // 使用模板引擎渲染页面的数据
                const htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    // 步骤二：初始化文章分类的方法
    initCate();
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败!')
                }
                // 调用模板引擎渲染分类的可选项
                const htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 由于通知layui重新渲染表单区域的ui结构
                form.render();

            }
        })
    }

    // 步骤三：筛选功能
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        const cate_id = $('[name=cate_id]').val();
        const state = $('[name=state]').val();
        // 为查询参数对象对应的属性赋值
        query.cate_id = cate_id;
        query.state = state;

        // 根据最新筛选条件，重新渲染表格数据
        initTable()

    })

    //步骤四： 分页功能
    function renderPage(total) {
        // 调用laypage.render()方法渲染分页结构
        layPage.render({
            elem: 'pageBox', // 分页容器id
            count: total, // 总数据条数
            limit: query.pagesize, // 每页显示数据
            curr: query.pagenum, // 默认选中的分页
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 只要调用的layPage.render()方法，就会调用junp方法
            jump: function(obj, first) { // 分页发生切换的时候，触发jump回调
                // 把最新的页码值赋值到query这个串参数对象中
                query.pagenum = obj.curr;
                query.pagesize = obj.limit; // 把最新的条目数赋值到query中
                // 根据最新的query获取对应的数据列表，并渲染表格
                // 通过first值判断是哪种方式触发的回调，如果first为true，表示调用了layPage.render(), 否则点击页码为undefined
                if (!first) {
                    initTable();
                }
            }
        })
    }

    // 步骤五：删除功能
    $('tbody').on('click', '#btnDelete', function() {
        const id = $(this).attr('data-id');
        // 获取当前页删除按钮的个数 ==》知道当前页面有几条数据（点击删除按钮，还未确定删除时的当前页个数）
        const len  = $('.btn-delete').length;
        console.log(length);
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 文章id
            $.ajax({
                method: 'GET',
                url:'/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功');
                    
                    // 当数据删除完成后，需要判断当前这一页是否还有剩余的数据，
                    // 如果没有，则将页码值-1，然后调用initTable()
                    if (len === 1) {
                        // 如果len为1，这说明删除后页面没有数据
                        // query.pagenum--
                        // 页码值最小为1
                        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
          });
    })

})