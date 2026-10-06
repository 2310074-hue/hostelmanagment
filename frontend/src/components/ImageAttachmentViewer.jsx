import React, { useState } from "react";
import Modal from "./Modal";

const ImageAttachmentViewer = ({ image, imageName, title = "Attachment Preview" }) => {
  const [showModal, setShowModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!image && !imageName) return null;

  // Determine if image is a base64 data URL, regular URL, or just a filename
  const isDirectImage = typeof image === "string" && (
    image.startsWith("data:image/") ||
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:")
  );

  const displayFileName = imageName || (typeof image === "string" && !image.startsWith("data:") ? image : "attached_image.jpg");
  
  // Fallback placeholder image (SVG data URL) if only filename exists from previous mock submissions
  const placeholderSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect fill="%23f0f4f8" width="600" height="400"/><rect x="20" y="20" width="560" height="360" rx="12" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2" stroke-dasharray="6,6"/><circle cx="300" cy="160" r="45" fill="%232952e3" opacity="0.15"/><path d="M285 175 L285 145 L315 145 L315 175 Z M275 185 L325 185" stroke="%232952e3" stroke-width="3" fill="none" stroke-linecap="round"/><text x="300" y="240" font-family="system-ui, sans-serif" font-size="18" font-weight="600" fill="%231e293b" text-anchor="middle">Attached File: ${encodeURIComponent(displayFileName)}</text><text x="300" y="270" font-family="system-ui, sans-serif" font-size="13" fill="%2364748b" text-anchor="middle">Click to view attachment details</text></svg>`;

  const imageSrc = isDirectImage ? image : placeholderSvg;

  const handleDownload = () => {
    if (isDirectImage) {
      const link = document.createElement("a");
      link.href = imageSrc;
      link.download = displayFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const win = window.open();
      if (win) {
        win.document.write(`<html><head><title>${displayFileName}</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#0f172a;color:#fff;font-family:sans-serif;"><h3>Attachment: ${displayFileName}</h3></body></html>`);
      }
    }
  };

  const handleOpenNewTab = () => {
    if (isDirectImage) {
      const win = window.open();
      if (win) {
        win.document.write(`<img src="${imageSrc}" style="max-width:100%;max-height:100%;display:block;margin:auto;" />`);
      }
    } else {
      handleDownload();
    }
  };

  const resetModal = () => {
    setZoomLevel(1);
    setShowModal(false);
  };

  return (
    <div className="attachment-viewer-wrapper mt-3">
      <label className="form-label fw-bold text-secondary mb-2 d-flex align-items-center gap-1">
        <i className="bi bi-paperclip text-primary fs-5"></i> Attached Photo / Document:
      </label>

      {/* Thumbnail Card */}
      <div 
        className="card border attachment-card p-2 bg-light shadow-sm"
        style={{ maxWidth: "340px", cursor: "pointer", transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
        onClick={() => setShowModal(true)}
      >
        <div className="position-relative overflow-hidden rounded" style={{ height: "160px", background: "#e9ecef" }}>
          <img
            src={imageSrc}
            alt={displayFileName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="attachment-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white"
               style={{ background: "rgba(15, 27, 61, 0.65)", opacity: 0, transition: "opacity 0.2s ease" }}>
            <i className="bi bi-zoom-in fs-2 mb-1"></i>
            <span className="badge bg-primary px-2 py-1">Click to View Full Size</span>
          </div>
        </div>

        <div className="card-body p-2 d-flex justify-content-between align-items-center">
          <div className="text-truncate me-2" title={displayFileName}>
            <small className="fw-semibold text-dark d-block text-truncate">
              <i className="bi bi-image me-1 text-primary"></i>
              {displayFileName}
            </small>
            <span className="badge bg-success-subtle text-success border border-success-subtle py-0" style={{ fontSize: "0.7rem" }}>
              {isDirectImage ? "Image Loaded" : "Attached"}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-primary py-1 px-2 d-flex align-items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
          >
            <i className="bi bi-eye"></i> View
          </button>
        </div>
      </div>

      {/* Full-Screen Preview Modal */}
      <Modal
        show={showModal}
        onClose={resetModal}
        title={
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-file-earmark-image text-primary"></i>
            <span>{title} - <small className="text-muted fw-normal">{displayFileName}</small></span>
          </div>
        }
        footer={
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                title="Zoom Out"
              >
                <i className="bi bi-zoom-out"></i>
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setZoomLevel(1)}
                title="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                title="Zoom In"
              >
                <i className="bi bi-zoom-in"></i>
              </button>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={handleOpenNewTab}
              >
                <i className="bi bi-box-arrow-up-right me-1"></i> Open Tab
              </button>
              {isDirectImage && (
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={handleDownload}
                >
                  <i className="bi bi-download me-1"></i> Download
                </button>
              )}
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={resetModal}
              >
                Close
              </button>
            </div>
          </div>
        }
      >
        <div 
          className="text-center p-3 bg-dark rounded d-flex align-items-center justify-content-center overflow-auto"
          style={{ minHeight: "350px", maxHeight: "65vh" }}
        >
          <img
            src={imageSrc}
            alt={displayFileName}
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
              transition: "transform 0.15s ease",
              maxWidth: "100%",
              maxHeight: "60vh",
              objectFit: "contain",
              borderRadius: "4px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ImageAttachmentViewer;
