import {
  Producer as RabbitMqProducer,
  NewRabbitMqProducer
} from "./rabbitmq"

class Producer {
  rabbitMqProducer: RabbitMqProducer;
  constructor(rabbitMqProducer: RabbitMqProducer){
    this.rabbitMqProducer = rabbitMqProducer
  }

  Publish(msg: Buffer){
    try {
      this.rabbitMqProducer.Publish(msg)
    }catch(err){
      throw err
    }
  }
}

export async function NewProducer(queue: string): Promise<Producer> {
  let producer = new Producer(await NewRabbitMqProducer(queue))
  return producer
}