import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type ConfirmModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'destructive';
    onConfirm: () => void;
    loading?: boolean;
};

/**
 * Modal de confirmación reutilizable para acciones destructivas o críticas.
 * Usar en listados (eliminar registro) o cualquier flujo que requiera confirmación.
 *
 * @example
 * const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
 * <ConfirmModal
 *   open={!!itemToDelete}
 *   onOpenChange={(open) => !open && setItemToDelete(null)}
 *   title="¿Eliminar elemento?"
 *   description="Esta acción no se puede deshacer."
 *   confirmLabel="Eliminar"
 *   variant="destructive"
 *   loading={isDeleting}
 *   onConfirm={() => { ... router.delete(...); }}
 * />
 */
export function ConfirmModal({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'default',
    onConfirm,
    loading = false,
}: ConfirmModalProps) {
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onPointerDownOutside={(e) => loading && e.preventDefault()}
                onEscapeKeyDown={(e) => loading && e.preventDefault()}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
                <DialogFooter className="gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        type="button"
                        variant={variant === 'destructive' ? 'destructive' : 'default'}
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading && <Spinner className="mr-2 size-4" />}
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
