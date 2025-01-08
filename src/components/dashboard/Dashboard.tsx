import { useState, useRef, useEffect } from 'react';
import { History, SendHorizontal } from 'lucide-react';
import BotResponse from './BotResponse';
import { useMutation } from '@tanstack/react-query';
import { submitQuery } from '@/data/requests';


const Dashboard = () => {
  const [isInitial, setIsInitial] = useState(true);
  const [messages, setMessages] = useState<{
    type: 'user' | 'bot';
    content: string | {
      district: string[];
      location_route: string[];
      direction_route: string[];
      width: number[];
      height: number[];
      area: number[];
      type: string[];
      rate_sqft_1_months: number[];
      rate_sqft_3_months: number[];
      rate_sqft_6_months: number[];
      rate_sqft_12_months: number[];
      floor: string[];
      hoarding_id: number[];
      hoarding_code: string[];
      status: string[];
      location: string[];
      available: boolean[];
      lat: number[];
      long: number[];
    };
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
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: {
          district: ['Error'],
          location_route: ['Failed to get response. Please try again.'],
          direction_route: [],
          width: [],
          height: [],
          area: [],
          type: [],
          rate_sqft_1_months: [],
          rate_sqft_3_months: [],
          rate_sqft_6_months: [],
          rate_sqft_12_months: [],
          floor: [],
          hoarding_id: [],
          hoarding_code: [],
          status: [],
          location: [],
          available: [],
          lat: [],
          long: []
        }
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

  return (
    <div className="h-[80vh] w-full flex flex-col">
      {isInitial ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-left mb-8 w-[67%]">
            <div className="mb-6 text-5xl">
              <h1 className="font-semibold">Hi there,</h1>
              <p className="mt-2">What would you like to know?</p>
            </div>
          </div>
          
          <div className="w-full max-w-[70%] px-4">
            <form onSubmit={handleSubmit} className="relative">
              <input
                name="query"
                type="text"
                placeholder="Ask me anything..."
                className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="absolute right-0 top-0 bg-sidebar text-white px-4 py-3 rounded-tr-xl rounded-br-xl">
                <SendHorizontal className="w-5 h-5" />
              </button>
            </form>
            
            <div className="flex gap-2 mt-4 justify-center">
              <button className="flex items-center px-4 py-1 rounded-full border hover:bg-gray-50">
                <History className="w-5 h-5" />
                <span className="ml-2">Chat History</span>
              </button>
              <button className="px-4 py-1 rounded-full border hover:bg-gray-50">
                How can I create a new palette?
              </button>
              <button className="px-4 py-1 rounded-full border hover:bg-gray-50">
                What are the trending color combinations?
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 max-w-[90%] mx-auto w-full overflow-y-auto scrollbar-hide">
            {messages.map((message, index) => (
              <div key={index} className={`max-w-fit mb-4 ${message.type === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                {message.type === 'user' ? (
                  //@ts-ignore
                  <p className="p-3 rounded-lg border">{message.content}</p>
                ) : (
                  <BotResponse content={message.content} />
                )}
                <div ref={messagesEndRef}></div>
              </div>
            ))}
          </div>
          
          <div className="p-4 flex justify-center">
            <div className="w-full max-w-[70%]">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  name="query"
                  type="text"
                  placeholder="Ask me anything..."
                  className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="absolute right-0 top-0 bg-sidebar text-white px-4 py-3 rounded-tr-xl rounded-br-xl">
                  <SendHorizontal className="w-5 h-5" />
                </button>
              </form>

              <div className="flex gap-2 mt-4 justify-center">
                <button className="flex items-center px-4 py-1 rounded-full border hover:bg-gray-50">
                  <History className="w-5 h-5" />
                  <span className="ml-2">Chat History</span>
                </button>
                <button className="px-4 py-1 rounded-full border hover:bg-gray-50">
                  How can I create a new palette?
                </button>
                <button className="px-4 py-1 rounded-full border hover:bg-gray-50">
                  What are the trending color combinations?
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
