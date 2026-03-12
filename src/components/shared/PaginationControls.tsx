import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationControlsProps) {
  const { t } = useI18n();
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <Button
        variant="ghost"
        size="icon"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {start > 1 && (
        <>
          <Button variant={1 === currentPage ? 'default' : 'ghost'} size="icon" onClick={() => onPageChange(1)}>1</Button>
          {start > 2 && <span className="px-1 text-muted-foreground">...</span>}
        </>
      )}
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-muted-foreground">...</span>}
          <Button variant={totalPages === currentPage ? 'default' : 'ghost'} size="icon" onClick={() => onPageChange(totalPages)}>{totalPages}</Button>
        </>
      )}
      <Button
        variant="ghost"
        size="icon"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
