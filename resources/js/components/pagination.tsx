import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
    className?: string;
}

export function Pagination({ links, className = '' }: PaginationProps) {
    if (links.length <= 3) return null; // Don't show if there's only one page (prev, 1, next)

    return (
        <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
            {links.map((link, i) => {
                const isFirst = i === 0;
                const isLast = i === links.length - 1;

                // Decode common Laravel pagination labels
                let label = link.label;
                if (label.toLowerCase().includes('previous') || label.includes('«') || label.includes('&laquo;')) {
                    label = '« Anterior';
                } else if (label.toLowerCase().includes('next') || label.includes('»') || label.includes('&raquo;')) {
                    label = 'Siguiente »';
                }

                if (!link.url) {
                    return (
                        <Button
                            key={i}
                            variant="ghost"
                            size="sm"
                            disabled
                            className="text-muted-foreground"
                        >
                            <span dangerouslySetInnerHTML={{ __html: label }} />
                        </Button>
                    );
                }

                return (
                    <Button
                        key={i}
                        variant={link.active ? 'default' : 'ghost'}
                        size="sm"
                        asChild
                    >
                        <Link href={link.url}>
                            <span dangerouslySetInnerHTML={{ __html: label }} />
                        </Link>
                    </Button>
                );
            })}
        </div>
    );
}
