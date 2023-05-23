import amqplib from "amqplib";
import locks from "locks";
import {
  Msg
} from "./meta";

let conn: amqplib.Connection;
let mutex: locks.Mutex = locks.createMutex();

export async function InitializeMqBroker() {
  if(conn == null) {
    mutex.lock(function(){})
    if(conn == null) {
      try {
        conn = await amqplib.connect(process.env.RBMQ_URI)
      }catch(err) {
        throw err
      }
    }
    mutex.unlock()
  }
}

export class Consumer {
  channel: amqplib.Channel;
  queue: string;
  private currentMsg?: amqplib.GetMessage | null;
  constructor(channel: amqplib.Channel, queue: string){
    this.channel = channel;
    this.queue = queue;
  }
  
  async ConsumeMessage(): Promise<Msg | null>{
    try{
      // Check or create queue
      this.channel.assertQueue(this.queue, {
        durable: true
      })
      this.channel.prefetch(1)
      let msg = await this.channel.get(this.queue, {
        noAck: false,
      })
      if(!msg){
        return null
      }
      this.currentMsg = msg
      let rMsg: Msg = new Msg(this.currentMsg?.content, this.currentMsg?.fields.routingKey)
      return rMsg
    }catch(err) {
      throw err
    }
  }

  CommitMessage(){
    try{
      // Check or create queue
      this.channel.assertQueue(this.queue)
      if(!this.currentMsg) {
        throw new Error("No msg found!")
      }
      this.channel.ack(this.currentMsg)
      this.currentMsg = null
    }catch(err) {
      throw err
    }
  }
}

export async function NewRabbitMqConsumer(queue: string): Promise<Consumer> {
  try {
    let consumer: Consumer = new Consumer(await conn.createChannel(), queue)
    return consumer
  }catch(err){
    throw err
  }
}

export class Producer {
  channel: amqplib.Channel;
  queue: string;
  constructor(channel: amqplib.Channel, queue: string) {
    this.channel = channel;
    this.queue = queue;
  }

  Publish(msg: Buffer) {
    try{
      // Check or create queue
      this.channel.assertQueue(this.queue, {
        durable: true
      })
      this.channel.sendToQueue(this.queue, msg)
    }catch(err){
      throw err
    }
  }
}

export async function NewRabbitMqProducer(queue: string): Promise<Producer> {
  try {
    let producer: Producer = new Producer(await conn.createChannel(), queue)
    return producer
  }catch(err){
    throw err
  }
}