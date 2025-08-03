import { Kafka, Partitioners } from "kafkajs";
import { IMessage, MessageStore } from "./MessageStore";
import timeInsertFn from "./utils/insertUtil";
import { insertAndRetry } from "./utils/dbInsert";
import { config } from "dotenv";
config();

const kafka = new Kafka({
  clientId: "chatify",
  brokers: [process.env.Kafka_URL || "localhost:9092"],
});

export const timeThreshold =
  process.env.TIME_THRESHOLD || 2 * 24 * 60 * 60 * 1000; // 2 days
export const lengthThreshold = Number(process.env.LENGTH_THRESHOLD) || 20;
export const retryTopic = process.env.RETRY_TOPIC || "retry";
export const mainTopic = process.env.NMAIN_TOPIC || "persist";
export const retryProducer = kafka.producer({
  allowAutoTopicCreation: true,
  createPartitioner: Partitioners.LegacyPartitioner,
});
export const mainConsumer = kafka.consumer({
  groupId: process.env.MAIN_CONSUMER_GROUP_ID || "data-patch-service",
});
export const retryConsumer = kafka.consumer({
  groupId: process.env.RETRY_CONSUMER_GROUP_ID || "data-patch-service-retry",
});

/**
 * Initializes the kafka consumer and producer.
 * The consumer will subscribe to the 'persist' topic and
 * the producer will be used to send messages to the 'retry'
 * topic.
 */
const init = async () => {
  // Connect main consumer
  await mainConsumer
    .connect()
    .then(() => console.log("main Consumer connected"))
    .catch((err) =>
      console.log("failed to connect to kafka main consumer", err),
    );
  // Subscribe main consumer to the persist topic
  await mainConsumer.subscribe({
    topic: mainTopic,
    fromBeginning: true,
  });

  // Connect retry producer
  await retryProducer
    .connect()
    .then(() => console.log("retry Producer connected"))
    .catch((err) =>
      console.log("failed to connect to kafka retry producer", err),
    );
  // Connect retry consumer
  await retryConsumer
    .connect()
    .then(() => console.log("retry Consumer connected"))
    .catch((err) =>
      console.log("failed to connect to kafka retry consumer", err),
    );
  // Subscribe retry consumer to the retry topic
  await retryConsumer.subscribe({
    topic: retryTopic,
    fromBeginning: true,
  });
};

init().then(() => {
  timeInsertFn();
  mainConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data: IMessage = message.value
        ? JSON.parse(message.value.toString())
        : null;
      if (data) {
        MessageStore.getInstance().addMessage(data);
        if (MessageStore.getInstance().length >= lengthThreshold) {
          insertAndRetry(MessageStore.getInstance().messages);
        }
      }
    },
  });

  retryConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data: IMessage[] = message.value
        ? JSON.parse(message.value.toString())
        : null;
      if (data) {
        insertAndRetry(data);
      }
    },
  });
});
