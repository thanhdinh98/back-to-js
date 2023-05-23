
import { NewProducer } from "../../../../common/comrabitmq/producer"
import {
  HelloMsg
} from "../lib/meta"
import {
  SAMPLE_QUEUE
} from "../lib/consts"

export async function SayHello(msg: HelloMsg) {
  try{
    let producer = await NewProducer(SAMPLE_QUEUE)
    let msgBuff = Buffer.from(JSON.stringify(msg))
    producer.Publish(msgBuff)
  }catch(err) {
    throw err
  }
} 