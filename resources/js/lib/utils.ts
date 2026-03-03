import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Formats a date string or object to DD/MM/YYYY.
 * Handles YYYY-MM-DD strings as local time to avoid timezone shifts.
 */
export function formatDate(value: string | Date | null): string {
    if (!value) return '—';

    // If it looks like a time (HH:MM or HH:MM:SS), just return it
    if (typeof value === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
        return value;
    }

    try {
        let date: Date;

        if (typeof value === 'string') {
            // Match YYYY-MM-DD pattern at the start of the string
            const dateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (dateMatch) {
                const year = parseInt(dateMatch[1], 10);
                const month = parseInt(dateMatch[2], 10) - 1; // 0-indexed
                const day = parseInt(dateMatch[3], 10);
                date = new Date(year, month, day);
            } else {
                date = new Date(value);
            }
        } else {
            date = value;
        }

        if (isNaN(date.getTime())) return String(value);

        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    } catch {
        return String(value);
    }
}
