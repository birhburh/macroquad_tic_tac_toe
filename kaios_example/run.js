window.MyLogs = "\n";
window.MyLogs += "RUNNING hello_log.js!\n";

window.onerror = function(msg, url, lineNo, columnNo, error){
    url = url.replace(/^(app:\/\/helloworld\.birh\.burh)\//,"");
    window.MyLogs += `WINDOW ERROR: kaios_example/${url}:${lineNo}:${columnNo}: ${msg}, ${error}!\n`;
}

var script = document.createElement('script');
script.src = "mq_js_bundle.js";

script.onload = function(){
  window.MyLogs += "LOADED!\n";
  try {
      load_asmjs("./maq_tic_tac_toe.wasm.js");
  } catch (error) {
      window.MyLogs += `ERROR: ${error}\n`;
  }
}
script.onerror = function(ev){
    window.MyLogs += `ERROR: ${ev}!\n`;
}

document.getElementsByTagName('head')[0].appendChild(script);
