const MobileNotSupported = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-3xl font-bold mb-4">Mobile Not Supported</h1>
      <p className="text-gray-600">
        This application is only accessible on desktop browsers. Please switch
        to a desktop device.
      </p>
    </div>
  );
};

export default MobileNotSupported;
