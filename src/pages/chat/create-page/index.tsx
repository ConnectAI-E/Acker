import useChatList from '@/hooks/useChatList';
import useSupabase from '@/hooks/useSupabase';
import AssistantWrapper from '@/components/assistant-wrapper';
import type { Assistant } from '@/global';

function CreatePage() {
  const { handleNewChat } = useChatList();

  const { session } = useSupabase();

  const handleChat = (assistant: Assistant) => {
    const { id, prompt } = assistant;
    const chat = { systemMessage: prompt, assistantId: id, assistant };
    handleNewChat(chat);
  };

  return (
    <div className="w-full h-full overflow-auto p-5 bg-gray-100 dark:bg-[#17191f]">
      <AssistantWrapper onClickItem={handleChat} session={session} /> 
    </div>
  );
}

export default CreatePage;
