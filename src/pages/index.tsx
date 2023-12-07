import { useState, useEffect, useRef } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";

type Message = {
  author?: string;
  message: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [typingMessage, setTypingMessage] = useState("");
  const [typingProgress, setTypingProgress] = useState(0);

  useEffect(() => {
    getResponse("Hello, How can I help you?");
  }, []);

  const getResponse = (msg: string) => {
    setTypingMessage(msg);
    const typingInterval = setInterval(() => {
      setTypingProgress((currentProgress) => {
        if (currentProgress >= msg.length) {
          clearInterval(typingInterval);
          setMessages((currentMsg) => [
            ...currentMsg,
            { author: "bot", message: msg },
          ]);
          setTypingMessage("");
          setTypingProgress(0);
        }
        return currentProgress + 1;
      });
    }, 50); // adjust typing speed here
  };

  const sendMessage = async () => {
    setMessages((currentMsg) => [...currentMsg, { message }]);
    setMessage("");
    getResponse("Let me check...");
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (message) {
        sendMessage();
      }
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage]);

  return (
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center bg-gray-100 w-full h-full absolute inset-0">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-col justify-end bg-white h-full min-w-full rounded-md shadow-lg">
          <div className="h-full last:border-b-0 overflow-y-scroll pb-20 px-5">
            {messages.map((msg, i) => (
              <div
                className={`w-3/4 py-1 px-2 border-b border-gray-200 rounded-lg my-5
                text-left overflow-auto break-words
              ${
                msg.author !== "bot"
                  ? "ml-auto bg-blue-200"
                  : "mr-auto bg-green-200"
              }`}
                key={i}
              >
                {msg.message}
              </div>
            ))}
            {typingMessage && (
              <div
                className="w-3/4 py-1 px-2 border-b border-gray-200 rounded-lg my-5
                text-left overflow-auto break-words mr-auto bg-green-200"
                key={typingMessage}
              >
                {typingMessage.slice(0, typingProgress)}
                <span className="typing-indicator">|</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-gray-300 w-full flex rounded-bl-md">
            <input
              type="text"
              placeholder="New message..."
              value={message}
              className="outline-none py-2 px-2 rounded-bl-md flex-1 shadow-inner"
              onChange={(e) => setMessage(e.target.value)}
              onKeyUp={handleKeypress}
            />
            <div className="border-l border-gray-300 flex justify-center items-center  rounded-br-md group hover:bg-blue-500 transition-all">
              <button
                className="group-hover:text-white px-3 h-full"
                onClick={() => {
                  sendMessage();
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
