import { create } from "zustand";

interface Dialog {
  title: string;
  description: string;
  action: {
    label: string;
    onClick: () => void;
  };
}

interface AlertDialogState {
  dialogs: Dialog[];
  addDialog: (dialog: Dialog) => void;
  removeDialog: (dialog: Dialog) => void;
}

const useAlertDialog = create<AlertDialogState>((set, get) => ({
  dialogs: [],
  addDialog: (dialog) => set({ dialogs: [...get().dialogs, dialog] }),
  removeDialog: (dialog) =>
    set({ dialogs: get().dialogs.filter((d) => d !== dialog) }),
}));

export { useAlertDialog };
