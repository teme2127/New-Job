import React from 'react';

export default function ErrorModal({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ×
        </button>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Error</h3>
        <p className="text-sm text-gray-600">{message}</p>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
