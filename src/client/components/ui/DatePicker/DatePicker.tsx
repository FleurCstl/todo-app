import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import * as Popover from "@radix-ui/react-popover";
import "./DatePicker.css";

interface DatePickerProps {
  date?: string | null;
  onSelect: (date: string | null) => void;
  className?: string;
}

export function DatePicker({ date, onSelect, className = "" }: DatePickerProps) {
  const selectedDate = date ? new Date(date) : undefined;
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (day: Date | undefined) => {
    onSelect(day ? day.toISOString().split('T')[0] : null);
    setIsOpen(false);
  };

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 ${
              date 
                ? 'bg-primary/10 border-primary/30 text-primary shadow-sm hover:border-primary/50' 
                : 'bg-bg border-border-subtle/50 text-text-muted hover:border-primary/30'
            }`}
          >
            <CalendarIcon size={16} className={date ? 'text-primary' : 'text-primary/70'} />
            <span className="text-[13px] font-medium leading-none">
              {selectedDate ? format(selectedDate, "d MMM") : "Set deadline"}
            </span>
            
            {date && (
              <button
                type="button"
                onClick={clearDate}
                className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-primary/20 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Clear deadline"
              >
                <X size={12} />
              </button>
            )}
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="z-50 bg-white rounded-2xl shadow-xl border border-border-subtle p-3 animate-in fade-in zoom-in duration-200"
            sideOffset={8}
            align="start"
          >
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              className="rdp-custom"
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
