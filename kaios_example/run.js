console.log("RUNNING run.js!");

window.onerror = function(msg, url, lineNo, columnNo, error){
    url = url.replace(/^(app:\/\/helloworld\.birh\.burh)\//,"");
    console.log(`WINDOW ERROR: kaios_example/${url}:${lineNo}:${columnNo}: ${msg}, ${error}!`);
}

var script = document.createElement('script');
script.src = "mq_js_bundle.js";

script.onload = function(){
  console.log("LOADED!");
  try {
    require(["./maq_tic_tac_toe.wasm.js"],
        function () {
            load_asmjs("./maq_tic_tac_toe.wasm.js");
        }
    )
  } catch (error) {
      console.log(`ERROR: ${error}`);
  }
}
script.onerror = function(ev){
    console.log(`ERROR: ${ev}!`);
}

document.getElementsByTagName('head')[0].appendChild(script);
