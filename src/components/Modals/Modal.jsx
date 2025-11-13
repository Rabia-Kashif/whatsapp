import { useEffect } from "react";
import ReactDOM from "react-dom";
const Modal = ({ open, onClose, children }) => {
  useEffect(() => {
    document.body.style.overflowY = open ? "hidden" : "scroll";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, [open]);
  if (!open) return null;
  return ReactDOM.createPortal(
    <>
      <div
        className="fixed top-0 right-0 left-0 bottom-0 bg-black/20 z-50"
        onClick={onClose}
      />
      <div className="fixed z-50">{children}</div>
    </>,
    document.querySelector("#modal-root")
  );
};

export default Modal;
