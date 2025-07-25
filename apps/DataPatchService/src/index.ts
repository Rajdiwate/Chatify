import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "chatify",
  brokers: ["localhost:9092"],
});

export const consumer = kafka.consumer({ groupId: "data-patch-service" });

const init = async () => {
  await consumer
    .connect()
    .then(() => console.log("kafka connected"))
    .catch((err) => console.log("failed to connect to kafka producer", err));
  await consumer.subscribe({
    topic: "persist",    
    fromBeginning: true
  });
};

init().then(() => {
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic: topic.toString(),
        partition: partition.toString(),
        offset: message.offset.toString(),
        key: message.key?.toString(),
        value: message.value?.toString(),
      });
    },
  });
});
