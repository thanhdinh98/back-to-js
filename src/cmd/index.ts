import {
  StartWorker
}from "../services/mq_sample/worker"
import {
  InitializeMqBroker
} from "../../common/comrabitmq/rabbitmq"

(async function(){
  await InitializeMqBroker()
  StartWorker()
})()