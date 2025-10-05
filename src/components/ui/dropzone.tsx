"use client";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Trash2 as RemoveIcon } from "lucide-react";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  useDropzone,
  type DropzoneOptions,
  type DropzoneState,
  type FileRejection,
} from "react-dropzone";
import toast from "react-hot-toast";
import { DropzoneToast } from "./toaster";

type DirectionOptions = "rtl" | "ltr" | undefined;

type FileUploaderContextType = {
  dropzoneState: DropzoneState;
  isLOF: boolean;
  isFileTooBig: boolean;
  removeFileFromSet: (index: number) => void;
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  orientation: "horizontal" | "vertical";
  direction: DirectionOptions;
  disabled: boolean;
};

const FileUploaderContext = createContext<FileUploaderContextType | null>(null);

export const useFileUpload = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a FileUploaderProvider");
  }
  return context;
};

type FileUploaderProps = {
  value: File[] | null;
  reSelect?: boolean;
  onValueChange: (value: File[] | null) => void;
  dropzoneOptions: DropzoneOptions;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
};

export function AcceptFileTypeText(accept: Record<string, readonly string[]>): string {
  const extensions: string[] = [];

  // Each valeur off accept object
  for (const exts of Object.values(accept)) {
    extensions.push(...exts); // Add extension in list for return
  }

  return extensions.join(", ");
}

export const FileUploader = forwardRef<
  HTMLDivElement,
  FileUploaderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      dropzoneOptions,
      value,
      onValueChange,
      reSelect,
      orientation = "vertical",
      children,
      dir,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const [isFileTooBig, setIsFileTooBig] = useState(false);
    const [isLOF, setIsLOF] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const {
      accept = {
        "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      },
      maxFiles = 1,
      maxSize = 4 * 1024 * 1024,
      multiple = true,
    } = dropzoneOptions;

    const reSelectAll = maxFiles === 1 ? true : reSelect;
    const direction: DirectionOptions = dir === "rtl" ? "rtl" : "ltr";

    const removeFileFromSet = useCallback(
      (i: number) => {
        if (!value) return;
        const newFiles = value.filter((_, index) => index !== i);
        onValueChange(newFiles);
      },
      [value, onValueChange],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!value) return;

        const moveNext = () => {
          const nextIndex = activeIndex + 1;
          setActiveIndex(nextIndex > value.length - 1 ? 0 : nextIndex);
        };

        const movePrev = () => {
          const nextIndex = activeIndex - 1;
          setActiveIndex(nextIndex < 0 ? value.length - 1 : nextIndex);
        };

        const prevKey =
          orientation === "horizontal"
            ? direction === "ltr"
              ? "ArrowLeft"
              : "ArrowRight"
            : "ArrowUp";

        const nextKey =
          orientation === "horizontal"
            ? direction === "ltr"
              ? "ArrowRight"
              : "ArrowLeft"
            : "ArrowDown";

        if (e.key === nextKey) {
          moveNext();
        } else if (e.key === prevKey) {
          movePrev();
        } else if (e.key === "Enter" || e.key === "Space") {
          if (activeIndex === -1) {
            dropzoneState.inputRef.current?.click();
          }
        } else if (e.key === "Delete" || e.key === "Backspace") {
          if (activeIndex !== -1) {
            removeFileFromSet(activeIndex);
            if (value.length - 1 === 0) {
              setActiveIndex(-1);
              return;
            }
            movePrev();
          }
        } else if (e.key === "Escape") {
          setActiveIndex(-1);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [value, activeIndex, removeFileFromSet],
    );

    const onDrop = useCallback(
      (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        const files = acceptedFiles;

        if (!files) {
          toast.error("Fichier trop volumineux.");
          return;
        }

        const newValues: File[] = value ? [...value] : [];

        if (reSelectAll) {
          newValues.splice(0, newValues.length);
        }

        files.forEach((file) => {
          if (newValues.length < maxFiles) {
            newValues.push(file);
          }
        });

        onValueChange(newValues);

        if (rejectedFiles.length > 0) {
          rejectedFiles.map((rejectedFile) => {
            if (rejectedFile.errors[0]?.code === "file-too-large") {
              toast.error(
                <DropzoneToast
                  title="Fichier trop volumineux"
                  fileInfo={rejectedFile.file.name}
                  description={`La taille maximal est ${maxSize / 1024 / 1024}Mo.`}
                />,
              );
            } else if (rejectedFile.errors[0]?.code === "file-invalid-type") {
              toast.error(
                <DropzoneToast
                  title="Type de fichier invalide"
                  fileInfo={rejectedFile.file.name}
                  description={`Seulement les fichiers de types ${AcceptFileTypeText(accept)}.`}
                />,
              );
            } else if (rejectedFile.errors[0]?.code === "too-many-files") {
              toast.error(
                <DropzoneToast
                  title="Trop de fichiers"
                  description={`Seulement ${maxFiles} fichier${maxFiles > 1 ? "s sont acceptés" : " est accepté"}.`}
                />,
              );
            } else if (rejectedFile.errors[0]?.code === "file-too-small") {
              toast.error(
                <DropzoneToast
                  title="Fichier trop petit"
                  fileInfo={rejectedFile.file.name}
                  description={`La taille minimum accepté est ${dropzoneOptions.minSize ?? 0 / 1024 / 1024}Mo.`}
                />,
              );
            }
          });
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [reSelectAll, value],
    );

    useEffect(() => {
      if (!value) return;
      if (value.length === maxFiles) {
        setIsLOF(true);
        return;
      }
      setIsLOF(false);
    }, [value, maxFiles]);

    const opts = dropzoneOptions
      ? dropzoneOptions
      : { accept, maxFiles, maxSize, multiple };

    const dropzoneState = useDropzone({
      ...opts,
      onDrop,
      onDropRejected: () => setIsFileTooBig(true),
      onDropAccepted: () => setIsFileTooBig(false),
      disabled,
    });

    return (
      <FileUploaderContext.Provider
        value={{
          dropzoneState,
          isLOF,
          isFileTooBig,
          removeFileFromSet,
          activeIndex,
          setActiveIndex,
          orientation,
          direction,
          disabled,
        }}
      >
        <div
          ref={ref}
          tabIndex={0}
          onKeyDownCapture={handleKeyDown}
          className={cn(
            "grid w-full overflow-hidden focus:outline-none ",
            disabled && "opacity-50 cursor-not-allowed",
            className,
            {
              "gap-2": value && value.length > 0,
            },
          )}
          dir={dir}
          {...props}
        >
          {children}
        </div>
      </FileUploaderContext.Provider>
    );
  },
);

FileUploader.displayName = "FileUploader";

export const FileUploaderContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { orientation } = useFileUpload();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn("h-full w-full px-1")}
      ref={containerRef}
      aria-description="content file holder"
    >
      <div
        {...props}
        ref={ref}
        className={cn(
          "flex gap-1 rounded-xl",
          orientation === "horizontal" ? "flex-raw flex-wrap" : "flex-col",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
});

FileUploaderContent.displayName = "FileUploaderContent";

export const FileUploaderItem = forwardRef<
  HTMLDivElement,
  { index: number } & React.HTMLAttributes<HTMLDivElement>
>(({ className, index, children, ...props }, ref) => {
  const { removeFileFromSet, activeIndex, disabled } = useFileUpload();
  const isSelected = index === activeIndex;
  return (
    <div
      ref={ref}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "h-6 cursor-pointer justify-between p-1 hover:scale-100",
        className,
        isSelected ? "bg-muted" : "",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      {...props}
    >
      <div className="flex h-full w-full items-center gap-1.5 font-medium leading-none tracking-tight">
        {children}
      </div>
      <button type="button" onClick={() => !disabled && removeFileFromSet(index)} disabled={disabled} className={disabled ? "cursor-not-allowed opacity-50" : ""} >
        <span className="sr-only">remove item {index}</span>
        <RemoveIcon className="mr-2 h-4 w-4 duration-200 ease-in-out hover:stroke-destructive" />
      </button>
    </div>
  );
});

FileUploaderItem.displayName = "FileUploaderItem";

export const FileInput = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { dropzoneState, isFileTooBig, isLOF, disabled } = useFileUpload();
  const rootProps = disabled || isLOF ? {} : dropzoneState.getRootProps();
  return (
    <div
      ref={ref}
      {...props}
      className={`relative w-full ${
        disabled || isLOF ? "cursor-not-allowed " : "cursor-pointer "
      }`}
    >
      <div
        className={cn(
          `w-full rounded-lg duration-300 ease-in-out
         ${
           dropzoneState.isDragAccept
             ? "border-green-500"
             : dropzoneState.isDragReject || isFileTooBig
               ? "border-red-500"
               : "border-gray-300"
         }`,
          className,
        )}
        data-disabled={disabled || isLOF}
        {...rootProps}
      >
        {children}
      </div>
      <Input
        ref={dropzoneState.inputRef}
        disabled={disabled || isLOF}
        {...dropzoneState.getInputProps()}
        className={`${disabled || isLOF ? "cursor-not-allowed" : ""}`}
      />
    </div>
  );
});

FileInput.displayName = "FileInput";
