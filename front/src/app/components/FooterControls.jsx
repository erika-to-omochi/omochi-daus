'use client';

import React from 'react';
import { Undo2, Ban, ChevronLeft, ChevronRight, Plus, Palette } from "lucide-react";
import Button from "./ui/button";

export default function FooterControls({
  onUndo,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  onAddElement,
  onBackgroundChange
}) {
  return (
    <footer className="flex justify-center">
      <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-sm">
        {/* Undo and Delete Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-purple-900" onClick={onUndo}>
            <Undo2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-purple-900" onClick={onDelete}>
            <Ban className="w-5 h-5" />
          </Button>
        </div>

        <div className="h-6 w-px bg-purple-200" />

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-purple-900" onClick={() => onPageChange(currentPage - 1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-purple-900 min-w-[3ch] text-center">
            {currentPage}/{totalPages}
          </span>
          <Button variant="ghost" size="icon" className="text-purple-900" onClick={() => onPageChange(currentPage + 1)}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="h-6 w-px bg-purple-200" />

        {/* Add and Background Change Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-purple-900" onClick={onAddElement}>
            <Plus className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-purple-900" onClick={onBackgroundChange}>
            <Palette className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
