
import { useAppSelector } from "./redux";

const useChat = () => {
  const { loading, id, messages, members } = useAppSelector(
    (state) => state.chat
  );

  return {
    loading,
    id,
    messages,
    members,
  };
};

export default useChat;
