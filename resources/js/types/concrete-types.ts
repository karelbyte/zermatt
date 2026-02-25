export type ConcreteType = {
    id: number;
    type: string;
    concept: string | null;
    description: string | null;
    active: boolean | null;
    base_price: string | number | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
