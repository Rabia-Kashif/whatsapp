import profile from "../../assets/images/profile_fallback.png";
import { bsIcons } from "../../global/icons";
import userProfile from "../../assets/images/user.png";
const Sidebar = () => {
  // Sample chat data - you can replace this with your actual data
  const chats = [
    {
      id: 1,
      name: "John Smith",
      message: "Testing",
      time: "08:21",
      unread: 5,
      avatar: profile,
    },
    {
      id: 2,
      name: "Jane Doe",
      message: "Hello there!",
      time: "12:15",
      unread: 2,
      avatar: profile,
    },
    {
      id: 3,
      name: "Bob Johnson",
      message: "How are you?",
      time: "6:47",
      unread: 0,
      avatar: profile,
    },
    {
      id: 4,
      name: "Samantha Lee",
      message: "See you tomorrow!",
      time: "09:35",
      unread: 0,
      avatar: profile,
    },
    {
      id: 5,
      name: "William Chen",
      message: "Thanks for your help!",
      time: "5:22",
      unread: 0,
      avatar: profile,
    },
  ];

  return (
    <div className="w-[400px] h-screen bg-white border-r border-gray-300">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between bg-gray-100">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={userProfile}
            alt="Profile"
            className="w-full h-full p-1 object-cover bg-gray-300"
          />
        </div>
        <div>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <span className="h-20">{bsIcons.BsThreeDotsVertical}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full bg-gray-100 py-2 pl-10 pr-4 rounded-lg outline-none"
          />
          <p
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={16}
          >
            {bsIcons.BsSearch}
          </p>
        </div>
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto h-[calc(100vh-136px)]">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="px-4 py-3 flex items-center border-b border-gray-300 hover:bg-gray-100 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{chat.name}</h3>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 truncate">{chat.message}</p>
                {chat.unread > 0 && (
                  <span className="bg-cyan-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
