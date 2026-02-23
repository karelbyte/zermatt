export type Design = {
    id: number;
    concrete_type_id: number;
    added: number | null;
    slump: number | null;
    fc: number | null;
    cement: number | null;
    sand: number | null;
    gravel: number | null;
    water: number | null;
    created_at: string;
    updated_at: string;
    concrete_type?: { id: number; type: string; concept: string | null };
    [key: string]: unknown;
};

export type ConcreteTypeOption = {
    id: number;
    type: string;
    concept: string | null;
};
