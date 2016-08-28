function Router() {
    this.cache = {};
    this.on = function (key, value) {
        var cache = this.cache;
        cache[key] = value;
    };
    this.trigger = function (key) {
        var cache = this.cache;
        for (var r in cache) {
            var reg = this.initRegexps(r);
            if (reg.test(key)) {
                var callback = cache[r] || function () {
                    };
                var params = this.getParams(reg, key);
                callback.apply(this, params);
            }
        }

    };
    this.init = function () {
        window.addEventListener('hashchange', function () {
            var hash = location.hash.slice(1);
            router.trigger(hash);
        });
        window.addEventListener('load', function () {
            var hash = location.hash.slice(1) || 'default';
            router.trigger(hash);
        })
    };

    this.initRegexps = function (route) {
        route = route.replace(/[/,.+\-?$#{}\[\]]/g, '\\$&')
            .replace(/(\/\w?:\w+)+/g, '\/.+')
            .replace(/\*\w*/g, '([^?]*?)')
            .replace(/\((.*?)\)/g, '(?:$1)?');
        return new RegExp('^' + route + '$');
    };


    this.getParams = function (reg, key) {
        return reg.exec(key).slice(1);
    }
}





