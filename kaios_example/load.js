window.MyLogs += "RUNNED load.js!\n";
try {
    load_asmjs("./maq_tic_tac_toe.wasm.js");
} catch (error) {
    window.MyLogs += `ERROR: ${error}\n`;
}