export type Olla = {
    id: number;
    number: string;
    capacity: number | null;
    active: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
