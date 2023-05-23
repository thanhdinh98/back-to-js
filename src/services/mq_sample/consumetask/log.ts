import {
  HelloMsg
} from "../lib/meta"

export function LogHello(msg: Buffer) {
  try{
    let helloMsg: HelloMsg = JSON.parse(msg.toString())
    console.log(helloMsg.name)
  }catch(err) {
    throw err
  }
} 