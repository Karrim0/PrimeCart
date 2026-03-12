import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function QuantitySelector({ value, onChange, min = 1, max = 99, disabled }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-s-lg rounded-e-none"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-8 text-center text-sm font-medium price-text">{value}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-e-lg rounded-s-none"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
