load_asmjs = (function() {
    var cached_function = load_asmjs;

    return function() {
        window.MyLogs += "RUNNING load_asmjs!\n";
        var result = cached_function.apply(this, arguments);

        return result;
    };
})();