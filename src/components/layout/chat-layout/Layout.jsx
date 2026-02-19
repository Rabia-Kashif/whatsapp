import ChatDashboardSidebar from "./Sidebar";

const ChatLayout = ({ children }) => {
  return (
    <div className="flex">
      <ChatDashboardSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default ChatLayout;
