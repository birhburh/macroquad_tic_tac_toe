window.MyLogs = "\n";
window.MyLogs += "RUNNED hello_log.js!\n";

window.onerror = function(msg, url, lineNo, columnNo, error){
    url = url.replace(/^(app:\/\/helloworld\.birh\.burh)\//,"");
    window.MyLogs += `WINDOW ERROR: kaios_example/${url}:${lineNo}:${columnNo}: ${msg}, ${error}!\n`;
}

var script = document.createElement('script');
script.src = "mq_js_bundle.js";

script.onload = function(){
  window.MyLogs += "LOADED!\n";
  var script = document.createElement('script');
  script.src = "load.js";
  document.getElementsByTagName('head')[0].appendChild(script);
}
script.onerror = function(ev){
    window.MyLogs += `ERROR: ${ev}!\n`;
}

document.getElementsByTagName('head')[0].appendChild(script);
