export type MoistureAbsorptionSetting = {
    id: number;
    humidity_gravel: number | null;
    humidity_sand: number | null;
    absorption_gravel: number | null;
    absorption_sand: number | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
