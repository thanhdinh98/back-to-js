"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogHello = void 0;
function LogHello(msg) {
    try {
        var helloMsg = JSON.parse(msg.toString());
        console.log(helloMsg.name);
    }
    catch (err) {
        throw err;
    }
}
exports.LogHello = LogHello;
