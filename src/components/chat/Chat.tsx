import { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Hourglass } from 'lucide-react';
import BotResponse from './BotResponse';
import { useMutation } from '@tanstack/react-query';
import { submitQuery } from '@/data/requests';
import toast from 'react-hot-toast';

type MessageContent = string | {
  district?: string[];
  location?: string[];
  direction_route?: string[];
  width?: number[];
  height?: number[];
  area?: number[];
  type?: string[];
  rate_sqft_1_months?: number[];
  rate_sqft_3_months?: number[];
  rate_sqft_6_months?: number[];
  rate_sqft_12_months?: number[];
  floor?: string[];
  hoarding_id?: number[];
  hoarding_code?: string[];
  status?: string[];
  location_coordinates?: string[];
  available?: boolean[];
  lat?: number[];
  long?: number[];
  [key: string]: (string | number | boolean)[] | undefined;
};

const Chat = () => {
  const [isInitial, setIsInitial] = useState(true);
  
  const [messages, setMessages] = useState<{
    type: 'user' | 'bot';
    content: MessageContent;
  }[]>([]);
  
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const chatMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await submitQuery(query);
      return response;
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: data.response
      }]);
    },
    onError: () => {
      toast.error('Failed to get response. Please try again.',{
        position: 'top-right',
      });
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Failed to get response. Please try again.'
      }]);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('query') as HTMLInputElement;
    const query = input.value;
    
    if (query.trim()) {
      setIsInitial(false);
      setMessages(prev => [...prev, { type: 'user', content: query }]);
      chatMutation.mutate(query);
      input.value = '';
    }
  };

  const handleQueryClick = (query: string) => {
    setIsInitial(false);
    setMessages(prev => [...prev, { type: 'user', content: query }]);
    chatMutation.mutate(query);
  };

  return (
    <div className="h-[85vh] w-full flex flex-col">
      {isInitial ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-left mb-8 w-[67%]">
            <div className="mb-6 text-5xl gradient-text">
              <h1 className="font-semibold">Hi there,</h1>
              <p className="mt-2 font-semibold">What would you like to know?</p>
            </div>
          </div>
          
          <div className="w-full max-w-[70%] px-4">
            <form onSubmit={handleSubmit} className="relative">
              <input
                name="query"
                type="text"
                placeholder="Ask me anything..."
                className="w-full px-4 py-4 pr-20 rounded-xl border border-[#D9D9D9] text-[#818181] text-lg font-normal outline-none"
              />
              <button type="submit" className="absolute right-0 top-0 bg-sidebar text-white px-5 py-5 rounded-tr-xl rounded-br-xl">
                <SendHorizontal className="w-5 h-5" />
              </button>
            </form>
            
            <div className="flex gap-2 mt-4 justify-center">
              <button 
                className="px-4 py-1 rounded-full border bg-sidebar-15 text-sidebar"
                onClick={() => handleQueryClick("How many hoardings are available now?")}
              >
                How many hoardings are available now?
              </button>
              <button 
                className="px-4 py-1 rounded-full border bg-sidebar-15 text-sidebar"
                onClick={() => handleQueryClick("List all the hoardings in kerala")}
              >
                List all the hoardings in kerala
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 w-full max-w-screen-lg mx-auto overflow-y-auto scrollbar-hide">
            {messages.map((message, index) => (
              <div key={index} className={`max-w-fit ${message.type === 'user' ? 'ml-auto' : 'mr-auto mb-12'}`}>
                {message.type === 'user' ? (
                  // @ts-ignore
                  <p className="p-3 gradient-text text-2xl font-medium">{message.content}</p>
                ) : (
                  // Inside the messages mapping where BotResponse is rendered
                  <BotResponse 
                  //@ts-expect-error Type error
                    content={
                      typeof message.content === 'object' 
                        ? Object.entries(message.content).length === 1
                          ? message.content // Single column response
                          : Object.fromEntries(
                              Object.entries(message.content).map(([key, value]) => [
                                key, 
                                Array.isArray(value) && value.length === 0 ? '-' : value
                              ])
                            )
                        : message.content
                    } 
                  />
                )}
                <div ref={messagesEndRef}></div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="max-w-fit mb-4 mr-auto">
                <div className="p-3 rounded-lg flex items-center gap-2 text-[#818181]">
                  <Hourglass className="w-4 h-4 animate-spin" />
                  <span>Handling request...</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 flex justify-center">
            <div className="w-full max-w-[70%]">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  name="query"
                  type="text"
                  placeholder="Ask me anything..."
                  disabled={chatMutation.isPending}
                  className={`w-full px-4 py-4 pr-20 rounded-xl border border-[#D9D9D9] text-[#818181] text-lg font-normal outline-none ${chatMutation.isPending ? 'bg-gray-100' : ''}`}
                />
                <button 
                  type="submit" 
                  disabled={chatMutation.isPending}
                  className={`absolute right-0 top-0 bg-sidebar text-white px-5 py-5 rounded-tr-xl rounded-br-xl ${chatMutation.isPending ? 'opacity-50' : ''}`}
                >
                  <SendHorizontal className="w-5 h-5" />
                </button>
              </form>

              <div className="flex gap-2 mt-4 justify-center">
                <button 
                  className="px-4 py-1 rounded-full border bg-sidebar-15 text-sidebar" 
                  onClick={() => handleQueryClick("How many hoardings are available now?")}
                  disabled={chatMutation.isPending}
                >
                  How many hoardings are available now?
                </button>
                <button 
                  className="px-4 py-1 rounded-full border bg-sidebar-15 text-sidebar"
                  onClick={() => handleQueryClick("List all the hoardings in kerala")}
                  disabled={chatMutation.isPending}
                >
                  List all the hoardings in kerala
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;