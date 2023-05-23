import {
  Consumer as RabbitMqConsumer,
  NewRabbitMqConsumer,
} from "./rabbitmq"

type ConsumeTask = (msg: Buffer)=> void

class Consumer {
  rabbitMqConsumer: RabbitMqConsumer;
  constructor(consumer: RabbitMqConsumer){
    this.rabbitMqConsumer = consumer
  } 

  Start(consumeTask: ConsumeTask){
    let run = async ()=>{
      while(true){
        try {
          let msg = await this.rabbitMqConsumer.ConsumeMessage()
          if(!msg){
            continue
          }
          consumeTask(msg.Raw)
          this.rabbitMqConsumer.CommitMessage()
        }catch(err){
          throw err
        }
      }
    }
    run()
  }
}

export async function NewConsumer(queue: string): Promise<Consumer> {
  let consumer = new Consumer(await NewRabbitMqConsumer(queue))
  return consumer
}