import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';

interface TaskInputProps {
  placeholder: string;
  disabled: boolean;
  onAddTask: (title: string) => Promise<void>;
}

/**
 * Input section for adding new tasks to the current list.
 */
export function TaskInput({ placeholder, disabled, onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || disabled) return;
    
    await onAddTask(title);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mt-4 mb-8">
      <Input
        placeholder={placeholder}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={disabled}
        className="flex-1 shadow-sm border-border-subtle"
      />
      <Button type="submit" disabled={disabled || !title.trim()} className="shadow-md shadow-primary/20">
        <Plus size={20} className="mr-1" />
        Add
      </Button>
    </form>
  );
}
