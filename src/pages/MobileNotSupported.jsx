import { useNavigate } from "react-router-dom";

const MobileNotSupported = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    localStorage.removeItem("auth_token");
    navigate("/", { replace: true });
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-3xl font-bold mb-4">Mobile Not Supported</h1>
      <p className="text-gray-600">
        This application is only accessible on desktop browsers. Please switch
        to a desktop device.
      </p>
      <button
        onClick={handleBack}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
      >
        Back to Login
      </button>
    </div>
  );
};

export default MobileNotSupported;
