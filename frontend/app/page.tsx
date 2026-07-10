"use client";
import { useState, ChangeEvent, useRef, useEffect } from "react";

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!backend_url) {
  throw new Error(
    "Missing NEXT_PUBLIC_BACKEND_URL. Please create frontend/.env.local."
  );
}

type Source = {
  file: string;
  page: number;
};

type Message = {
  role: 'user' | 'bot';
  text: string;
  sources?: Source[];
};

// For the input section
type ChatInputProps = {
  input: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ input, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.overflowY = "hidden";

    const maxHeight = 5 * 24; // ~5 lines
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);

    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  return (
    <div className="p-0.5 bg-textareabackground rounded-xl">
      <textarea
        ref={textareaRef}
        rows={1}
        className="w-full p-4 text-base my-2 resize-none focus:outline-none"
        placeholder="Ask Anything"
        value={input}
        onChange={onChange}
        style={{ maxHeight: "120px", overflowY: "auto" }}
      />
    </div>
  );
};

// For the side bar
type SidebarProps = {
  onClearChat: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onClearChat }) => {
  return (
    <div className="bg-darkgraybackground flex flex-col px-2 py-2 border-r border-grayborder">
      <button onClick={onClearChat} className="hover:bg-hover p-1 rounded" aria-label="New Chat" >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          <path d="M12 7v6" />
          <path d="M9 10h6" />
        </svg>
      </button>
    </div>
  );
};


// --- Home Component ---
export default function Home() {
  const [input, setInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState("llama3:instruct");
  const [modelSelectorDisabled, setModelSelectorDisabled] = useState(false);
  
  //console.log("API URL:", backend_url);

  const clearChat = async (): Promise<void> => {
    try {
      setChatHistory([]); // Reset local chat state (UI)
      setModelSelectorDisabled(false);
      // Call backend to clear server-side chat history
      const res = await fetch(`${backend_url}/clearchat`, {
        method: "POST",
        headers: {
          "accept": "application/json"
        },
      });
      if (!res.ok) {
        console.error("Failed to clear chat history on server");
        return;
      }
      const data = await res.json();
      console.log(data.message); // "Chat history cleared."
    } catch (err) {
      console.error("Error clearing chat:", err);
    }
  };

  const fetchBotReply = async (userInput: string): Promise<{
  response: string;
  sources: { file: string; page: number }[];}> => {
    // This is a placeholder; eventually you'd call your Python backend.
    console.log("Sending to API:", userInput);
    //return new Promise((resolve) =>
    //  setTimeout(() => resolve(`Echo from server: ${userInput}`), 1000)
    //);
    const res = await fetch(`${backend_url}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({ prompt: userInput }),
    });

    const data = await res.json();
	return {
		response: data.response,
		sources: data.sources ?? []
	};
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    setModelSelectorDisabled(true);

    const newUserMessage: Message = { role: "user", text: input };
    setChatHistory((prev) => [...prev, newUserMessage]);
    setInput("");

    const botResponse = await fetchBotReply(input);

    const newBotMessage: Message = {
		role: "bot",
		text: botResponse.response,
		sources: botResponse.sources
	};

    setChatHistory((prev) => [...prev, newBotMessage]);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const models = [
    "llama3:instruct",
    "llama3.1:8b-instruct-q4_K_M",
    "mistral:7b-instruct-v0.2-q4_K_M",
  ];


  return (
    <div className="flex flex-row">
      {/* Sidebar */}
      <Sidebar onClearChat={clearChat} />

      <div className="w-full">
        {/* Top Bar */}
        <div className="flex border-b border-grayborder p-2">
          <div className="relative">
            <select
              disabled={modelSelectorDisabled}
              value={selectedModel}
              onChange={async (e) => {
                const newModel = e.target.value;
                setSelectedModel(newModel);
                try {
                  const res = await fetch(`${backend_url}/selectmodel`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "accept": "application/json"
                    },
                    body: JSON.stringify({ model: newModel }),
                  });

                  if (!res.ok) {
                    console.error("Model selection failed.");
                  } else {
                    const data = await res.json();
                    console.log("Model selection response:", data);
                  }
                } catch (err) {
                  console.error("Error selecting model:", err);
                }
              }}
              className="appearance-none bg-transparent pr-8 pl-2 py-1 rounded hover:bg-hover text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none"
            >
              {models.map((model) => (
                <option key={model} value={model} className="bg-white text-black dark:bg-gray-800 dark:text-white">
                  {model}
                </option>
              ))}
            </select>

            {/* Down arrow icon */}
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main screen */}
        <div className="flex flex-col h-[93vh] p-4">
          {/* Chat History */}
          <div id="chathistory" className="flex-1 mb-4 space-y-2 overflow-y-auto  flex flex-col">
            {chatHistory.map((msg, index) => (
              
			  
			  
			  <div
				  key={index}
				  className={`p-3 rounded-md max-w-[90%] whitespace-pre-wrap ${
					msg.role === "user"
					  ? "bg-textuserchatbackground self-end"
					  : "bg-textbotchatbackground self-start"
				  }`}
				>
				  <div>{msg.text}</div>

				  {msg.role === "bot" &&
					msg.sources &&
					msg.sources.length > 0 && (
					  <div className="mt-3 text-xs text-gray-500 border-t pt-2">
						<div className="font-semibold">Sources</div>

						{msg.sources.map((source, idx) => (
						  <div key={idx}>
							{source.file} (Page {source.page})
						  </div>
						))}
					  </div>
					)}
				</div>

			  
			  
			  
			  
            ))}
          </div>

          <div className="relative">
            {/* Chat Input */}
            <ChatInput input={input} onChange={handleChange} />

            <button onClick={handleSend} className="absolute bottom-2 right-2 px-6 py-2 m-2 bg-gray-500 text-white rounded-md cursor-pointer transition">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
