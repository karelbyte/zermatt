export type Operator = {
    id: number;
    name: string;
    address: string | null;
    phone: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
