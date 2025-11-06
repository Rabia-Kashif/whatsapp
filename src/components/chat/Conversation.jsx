import React, { useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";

const Conversation = () => {
  // sample conversation data
  const contact = {
    name: "John Smith",
    number: "+1 555 123 4567",
    avatar: "https://i.pravatar.cc/150?img=1",
  };

  const messages = [
    { id: 1, side: "left", text: "Can you send me that file?", time: "08:58" },
    { id: 2, side: "left", text: "Yet another message here..", time: "09:05" },
    { id: 3, side: "left", text: "Can you send me that file?", time: "15:42" },
    {
      id: 4,
      side: "left",
      text: "Let's meet at the coffee shop.",
      time: "18:03",
    },
    {
      id: 5,
      side: "left",
      text: "No problem, we can reschedule.",
      time: "16:08",
    },
    { id: 6, side: "right", text: "sure.", time: "09:01" },
    { id: 7, side: "right", text: "What time should we meet?", time: "12:30" },
    {
      id: 8,
      side: "right",
      text: "I'll be there in 10 minutes.",
      time: "10:12",
    },
    {
      id: 9,
      side: "right",
      text: "Sorry, I can't make it today.",
      time: "13:25",
    },
  ];

  const scrollRef = useRef(null);
  useEffect(() => {
    // scroll to bottom on mount
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-gray-100 border-b border-gray-300">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{contact.name}</div>
          <div className="text-xs text-gray-500">{contact.number}</div>
        </div>
        <div className="ml-4">
          <button className="px-3 py-1 bg-rose-800 text-white text-sm rounded-md">
            Close Chat
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6"
        style={{ backgroundColor: "#f2efe9" }}
      >
        <div className="flex justify-center mb-4">
          <div className="text-xs bg-white px-3 py-1 rounded-md text-gray-600">
            TODAY
          </div>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.side === "right" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  m.side === "right"
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-gray-900"
                } rounded-lg px-4 py-2 shadow-sm max-w-[70%] relative`}
              >
                <div className="text-sm">{m.text}</div>
                <div className="text-xs text-gray-300 mt-1 text-right">
                  {m.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input area (no attach option) */}
      <div className="px-4 py-3 bg-white border-t border-gray-300">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message here .."
            className="flex-1 border rounded-full px-4 py-2 outline-none border-gray-300 bg-gray-100"
          />
          <button className="p-2 cursor-pointer bg-cyan-700 hover:bg-cyan-800 text-white rounded-full">
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
