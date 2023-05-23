import cronjob from "node-cron"
import {
  NewConsumer,
} from "../../../common/comrabitmq/consumer";
import {
  SAMPLE_QUEUE
} from "./lib/consts";
import {
  LogHello
} from "./consumetask/log"
import {
  SayHello
} from "./crontask/sayhello"

export async function StartWorker(){
  let runProducer = async() =>{
    try{
      cronjob.schedule("* * * * * *", ()=>{
        SayHello({
          name: "hi"
        })
      })
    }catch(err){
      console.error(err)
    }
  }
  runProducer()

  let runConsumer = async()=>{
    try{
      let consumer = await NewConsumer(SAMPLE_QUEUE)
      consumer.Start(LogHello)
    }catch(err){
      console.error(err);
    }
  }
  runConsumer()
}