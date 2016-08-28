    function Router() {
        this.cache = {};
        //将url/callback 以key/value形式储存在cache内
        this.on = function (key, value) {
            var cache = this.cache;
            cache[key] = value;
        };
        //匹配hash对应的回调函数,并触发
        this.trigger = function (hash) {
            var cache = this.cache;
            for (var r in cache) {
                var reg = this.initRegexps(r);
                if (reg.test(hash)) {
                    var callback = cache[r] || function () {
                        };
                    var params = this.getParams(reg, hash);
                    callback.apply(this, params);
                }
            }

        };
        //初始化 添加监听浏览器hashchange 以及dom loaded函数
        this.init = function () {
            window.addEventListener('hashchange', function () {
                var hash = location.hash.slice(1);
                router.trigger(hash);
            });
            window.addEventListener('load', function () {
                var hash = location.hash.slice(1);
                router.trigger(hash);
            })
        };
        /**
         *将cache内的key 做正则处理,并返回
         * 第一个正则 匹配诸如/,.+-?$#{}[]] 关键字  并在关键字前面加转译字符\
         * 第二个正则 匹配() 标示()内部内容可有可无
         * 第三个正则 匹配: 在/后面可以由接受任意字符,直到遇到下一个/
         * 第四个正则 匹配* 在*后面可以由接受任意字符
         */
        this.initRegexps = function (route) {
            route = route.replace(/[/,.+\-?$#{}\[\]]/g, '\\$&')
                .replace(/\((.*?)\)/g, '(?:$1)?')
                .replace(/(\/\w?:\w+)+/g, '\/([^/]+)')
                .replace(/\*\w*/g, '([^?]*?)');

            return new RegExp('^' + route + '$');
        };

        //将匹配的正则返回,为回调函数提供参数
        this.getParams = function (reg, hash) {
            return reg.exec(hash).slice(1);
        }
    }





