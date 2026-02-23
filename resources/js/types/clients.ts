export type Client = {
    id: number;
    name: string;
    address: string | null;
    phone: string | null;
    rfc: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Work = {
    id: number;
    client_id: number;
    name: string;
    description: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
    client?: { id: number; name: string };
    [key: string]: unknown;
};

export type ClientOption = {
    id: number;
    name: string;
};
