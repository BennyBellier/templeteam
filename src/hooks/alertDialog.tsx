"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAlertDialog } from "@/stores/useDialogStore";


const AlertDialogs: React.FC = () => {
  const dialogs = useAlertDialog((state) => state.dialogs);

  const dialogToShow = dialogs[0];

  if (!dialogToShow) return null;

  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogToShow.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogToShow.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={dialogToShow.action.onClick}>{dialogToShow.action.label}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { AlertDialogs };