
const CloseSessionAlert = ({onClose, onSessionClose}) => {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 xl:w-[28vw] lg:w-[42vw] md:w-[52vw] w-[72vw] h-auto p-8 rounded-2xl bg-white text-theme-black">
        <h1 className="text-center mb-6 text-2xl font-[500] text-theme-black">
          Are you sure you want to close session?
        </h1>
        <div className="flex flex-row justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 mr-4 text-center text-base rounded-md cursor-pointer text-gray-600 border border-stroke"
          >
            Cancel
          </button>
          <button
            onClick={onSessionClose}
            className="flex items-center justify-center px-6 py-2 text-center text-base cursor-pointer rounded-md text-white bg-[#246588]"
          >
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloseSessionAlert;
