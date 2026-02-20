import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    action?: ReactNode;
    className?: string;
};

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/70 bg-muted/20 px-6 py-16 text-center',
                className,
            )}
        >
            <div className="flex size-14 items-center justify-center rounded-full bg-muted/60">
                <Icon className="size-7 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-base font-medium">{title}</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {description}
            </p>
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
