import { usePage } from '@inertiajs/react';
import { Droplets } from 'lucide-react';
import { useState } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { MoistureAbsorptionModal } from '@/components/moisture-absorption-modal';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem as BreadcrumbItemType, MoistureAbsorptionSetting } from '@/types';

function formatValue(value: number | null): string {
    return value != null ? String(value) : '—';
}

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const pageProps = usePage().props as { moistureAbsorption?: MoistureAbsorptionSetting | null };
    const moistureAbsorption = pageProps.moistureAbsorption ?? null;

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <SidebarTrigger className="-ml-1 shrink-0" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setModalOpen(true)}
                    className="ml-auto flex shrink-0 items-center gap-4 rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    title="Humedad y absorción (clic para configurar o editar)"
                >
                    <Droplets className="size-5 shrink-0" />
                    {moistureAbsorption ? (
                        <span className="hidden gap-4 sm:flex">
                            <span title="Humedad grava">H.Grava: {formatValue(moistureAbsorption.humidity_gravel)}</span>
                            <span title="Humedad arena">H.Arena: {formatValue(moistureAbsorption.humidity_sand)}</span>
                            <span title="Absorción grava">A.Grava: {formatValue(moistureAbsorption.absorption_gravel)}</span>
                            <span title="Absorción arena">A.Arena: {formatValue(moistureAbsorption.absorption_sand)}</span>
                        </span>
                    ) : (
                        <span className="hidden sm:inline">Humedad y absorción</span>
                    )}
                </Button>
            </header>
            <MoistureAbsorptionModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                setting={moistureAbsorption}
            />
        </>
    );
}
