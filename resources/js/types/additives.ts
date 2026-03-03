export type Additive = {
    id: number;
    date: string | null;
    lit: number | null;
    supplier_id: number | null;
    document: string | null;
    status: 'open' | 'closed';
    created_at: string;
    updated_at: string;
    supplier?: { id: number; name: string } | null;
    [key: string]: unknown;
};
