import React from 'react';
import { Undo2, Ban, ChevronLeft, ChevronRight, Plus, Palette } from 'lucide-react';
import Button from './ui/button';
import PropTypes from 'prop-types';

const Footer = ({
  handleUndo,
  handleBan,
  handleAddElement,
  handleBackgroundChange,
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
}) => {
  return (
    <footer className="flex justify-center p-4">
      <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-sm">
        {/* Undo and Ban Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-purple-900" onClick={handleUndo}>
            <Undo2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-purple-900" onClick={handleBan}>
            <Ban className="w-5 h-5" />
          </Button>
        </div>

        <div className="h-6 w-px bg-purple-200" />

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-purple-900"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-purple-900 min-w-[3ch] text-center">
            {currentPage}/{totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="text-purple-900"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="h-6 w-px bg-purple-200" />

        {/* Add Element and Background Change Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-purple-900" onClick={handleAddElement}>
            <Plus className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-purple-900" onClick={handleBackgroundChange}>
            <Palette className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  handleUndo: PropTypes.func.isRequired,
  handleBan: PropTypes.func.isRequired,
  handleAddElement: PropTypes.func.isRequired,
  handleBackgroundChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePrevPage: PropTypes.func.isRequired,
  handleNextPage: PropTypes.func.isRequired,
};

export default Footer;
