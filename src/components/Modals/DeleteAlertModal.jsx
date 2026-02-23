const DeleteAlertModal = ({ onClose, onDelete, isDeleting }) => {
  return (
    <div className="flex items-center justify-center h-screen max-lg:text-sm">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 xl:w-[28vw] lg:w-[42vw] md:w-[52vw] w-[90vw] h-auto p-8 rounded-2xl bg-white ">
        <h1 className="text-center mb-6 text-lg lg:text-2xl font-[500]">
          Are you sure you want to delete record?
        </h1>
        <div className="flex flex-row justify-center">
          <button
            onClick={onClose}
            className="min-w-26 px-6 py-2 mr-4 text-center  rounded-md cursor-pointer border border-stroke hover:bg-gray-200 "
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center min-w-26 px-6 py-2 text-center  cursor-pointer rounded-md text-white bg-red-600 hover:bg-red-500"
          >
            <span>{isDeleting ? "Deleting..." : "Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAlertModal;
