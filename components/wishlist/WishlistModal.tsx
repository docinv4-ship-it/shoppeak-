"use client";

import React, { useState } from "react";
import { useShopStore, ProductItem } from "@/store/useShopStore";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
}

export default function WishlistModal({ isOpen, onClose, product }: WishlistModalProps) {
  const { wishlistBoards, createNewBoard, saveToBoard } = useShopStore();
  const [newBoardName, setNewBoardName] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);

  if (!isOpen || !product) return null;

  const handleSave = (boardName: string) => {
    saveToBoard(boardName, product);
    onClose();
  };

  const handleCreateAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    
    createNewBoard(newBoardName.trim());
    saveToBoard(newBoardName.trim(), product);
    setNewBoardName("");
    setShowCreateInput(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h3 className="text-lg font-bold text-white tracking-tight">Save to Shopping Board</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-2 bg-neutral-950/50 rounded-xl border border-neutral-800/60">
            <img src={product.product_main_image_url} alt={product.product_title} className="w-12 h-12 object-cover rounded-lg" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-200 truncate">{product.product_title}</p>
              <p className="text-sm font-bold text-amber-500">${product.sale_price}</p>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {wishlistBoards.map((board) => (
              <button
                key={board.slug}
                onClick={() => handleSave(board.name)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-800/40 hover:bg-neutral-800 border border-transparent hover:border-neutral-700/60 transition-all text-left text-sm text-neutral-200 font-semibold group"
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-500 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5M5 19v-4a2 2 0 012-2h11a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2z" />
                  </svg>
                  <span>{board.name}</span>
                </div>
                <span className="text-xs text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded-full">{board.products.length}</span>
              </button>
            ))}
          </div>

          {!showCreateInput ? (
            <button
              onClick={() => setShowCreateInput(true)}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-neutral-700 hover:border-amber-500/50 text-neutral-400 hover:text-amber-400 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create New Board
            </button>
          ) : (
            <form onSubmit={handleCreateAndSave} className="space-y-2 animate-slideDown">
              <input
                type="text"
                placeholder="Folder name (e.g., Summer Outfits)..."
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                maxLength={30}
                required
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500 placeholder-neutral-600 transition-colors"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateInput(false)}
                  className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-xs font-bold transition-colors shadow-lg shadow-amber-500/10"
                >
                  Create & Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
