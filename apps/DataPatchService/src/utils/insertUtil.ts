import { retryProducer, retryTopic, timeThreshold } from "..";
import { IMessage, MessageStore } from "../MessageStore";
import { batchInsert, insertAndRetry } from "./dbInsert";

export const retry = async (data: IMessage[]) => {
  await retryProducer.send({
    topic: retryTopic,
    messages: [{ value: JSON.stringify(data) }],
  });
};

export default () => {
  setInterval(async () => {
    insertAndRetry(MessageStore.getInstance().messages);
  }, timeThreshold);
};
