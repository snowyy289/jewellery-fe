import { create } from 'zustand';

interface ConfirmState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
    confirmText: string;
    cancelText: string;
    variant: 'danger' | 'warning' | 'info';
}

interface ConfirmStore extends ConfirmState {
    openConfirm: (options: Partial<Omit<ConfirmState, 'isOpen'>>) => void;
    closeConfirm: () => void;
    confirm: () => void;
    cancel: () => void;
}

const useConfirmStore = create<ConfirmStore>((set, get) => ({
    isOpen: false,
    title: 'Xác nhận',
    message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
    onConfirm: null,
    onCancel: null,
    confirmText: 'Xác nhận',
    cancelText: 'Hủy',
    variant: 'warning',
    
    openConfirm: (options) => set({ 
        isOpen: true, 
        ...options 
    }),
    
    closeConfirm: () => set({ 
        isOpen: false,
        onConfirm: null,
        onCancel: null
    }),
    
    confirm: () => {
        const { onConfirm, closeConfirm } = get();
        if (onConfirm) onConfirm();
        closeConfirm();
    },
    
    cancel: () => {
        const { onCancel, closeConfirm } = get();
        if (onCancel) onCancel();
        closeConfirm();
    }
}));

export const useConfirm = () => {
    const openConfirm = useConfirmStore(state => state.openConfirm);
    
    return (message: string, onConfirm: () => void, options?: {
        title?: string;
        confirmText?: string;
        cancelText?: string;
        variant?: 'danger' | 'warning' | 'info';
    }) => {
        openConfirm({
            message,
            onConfirm,
            title: options?.title || 'Xác nhận',
            confirmText: options?.confirmText || 'Xác nhận',
            cancelText: options?.cancelText || 'Hủy',
            variant: options?.variant || 'warning'
        });
    };
};

export default useConfirmStore;
