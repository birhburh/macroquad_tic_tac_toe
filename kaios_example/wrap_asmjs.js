load_asmjs = (function() {
    var cached_function = load_asmjs;

    return function() {
        console.log("RUNNING load_asmjs!");
        var result = cached_function.apply(this, arguments);

        return result;
    };
})();