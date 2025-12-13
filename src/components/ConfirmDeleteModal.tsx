"use client";

import { useState } from "react";

type Props = {
  entityName: string;
  itemName: string;
  onConfirm: () => void;
  disabled?: boolean;
};

export default function ConfirmDeleteModal({
  entityName,
  itemName,
  onConfirm,
  disabled,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
        disabled={disabled}
      >
        Delete
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-100 border border-dark-200 rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete <strong>{entityName}</strong>:{" "}
              <span className="text-red-400">{itemName}</span>?
              <br />
              <span className="text-sm text-gray-400">
                This action cannot be undone.
              </span>
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
