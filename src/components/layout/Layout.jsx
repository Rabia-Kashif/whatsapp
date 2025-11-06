import Home from "../../pages/Home";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Home />
      </main>
    </div>
  );
};

export default Layout;
