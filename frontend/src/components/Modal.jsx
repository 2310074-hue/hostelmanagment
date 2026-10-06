import React from "react";

// A simple reusable Bootstrap-styled modal (no external modal library needed).
// Usage: <Modal show={show} onClose={...} title="..." size="lg"> content </Modal>
const Modal = ({ show, onClose, title, children, footer, size = "lg" }) => {
  if (!show) return null;
  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className={`modal-dialog modal-dialog-centered ${size ? `modal-${size}` : ""}`} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
};

export default Modal;
