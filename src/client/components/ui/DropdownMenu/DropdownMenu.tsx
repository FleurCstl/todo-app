import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import './DropdownMenu.css';

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button 
        className={`dropdown-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="More options"
      >
        <MoreVertical size={18} />
      </button>
      
      {isOpen && (
        <div className="dropdown-menu animate-in">
          <div className="dropdown-menu-content" onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ onClick, children, icon: Icon }: { onClick: () => void, children: React.ReactNode, icon?: any }) {
  return (
    <button className="dropdown-item" onClick={onClick}>
      {Icon && <Icon size={14} className="dropdown-item-icon" />}
      <span>{children}</span>
    </button>
  );
}
