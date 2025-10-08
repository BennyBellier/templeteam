"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/dropzone";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { uploadFile } from "@/lib/uploadFile";
import { cn, handleResult } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckBig, CloudUpload, FileText, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { DropzoneOptions } from "react-dropzone";
import {
  type ControllerRenderProps,
  type FieldError,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { uploadMedicalCertificateForMember } from "./action";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 10; // 10MB

const MEDIC_ACCEPTED_FILE_TYPES = [
  "image/jpeg", // JPEG
  "image/png", // PNG
  "application/pdf", // PDF
];

const medicDropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", ".pdf"],
  },
  maxFiles: 1,
  maxSize: MAX_UPLOAD_SIZE,
  multiple: false,
} satisfies DropzoneOptions;

const formSchema = z.object({
  medicalCertificates: z
    .array(z.instanceof(File))
    .refine((files) => {
      return files?.every((file) => file.size <= MAX_UPLOAD_SIZE);
    }, `La taille du fichier doit faire moins de ${MAX_UPLOAD_SIZE}MB.`)
    .refine((files) => {
      return files?.every((file) =>
        MEDIC_ACCEPTED_FILE_TYPES.includes(file.type),
      );
    }, "Le fichier doit être de type PNG, JPEG ou PDF."),
});

type InputType = z.infer<typeof formSchema>;

export const MedicForm = ({
  memberId,
  medicExist,
}: {
  memberId: string;
  medicExist: boolean;
}) => {
  const router = useRouter();
  const form = useForm<InputType>({
    resolver: zodResolver(formSchema),
    shouldFocusError: true,
    defaultValues: {
      medicalCertificates: [],
    },
  });

  const onSubmit = async (values: InputType) => {
    const toastId = toast.loading("Enregistrement du certificat...");

    const { medicalCertificates } = values;

    if (!medicalCertificates[0]) {
      toast.error("Vous devez sélectionner un document.", { duration: 5000 });
      return;
    }

    const medicalCertificate = medicalCertificates[0];

    const medic_filename = await handleResult(
      uploadFile(medicalCertificate),
      toastId,
    );

    if (!medic_filename) return;

    const res = await handleResult(
      uploadMedicalCertificateForMember({
        memberId,
        medic_filename,
      }),
      toastId,
    );

    if (!res) return;

    toast.success(res, {
      id: toastId,
      duration: 3000,
    });
    form.reset();
    router.refresh();
  };

  return (
    <Form {...form}>
      <form
        id="registerForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full"
      >
        <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-6">
          {medicExist ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
              <div className="rounded-full bg-green-500/10 p-4">
                <CircleCheckBig className="h-12 w-12 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Certificat renseigné</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Nous avons bien reçu le document
                </p>
              </div>
            </div>
          ) : (
            <>
              <FormField
                control={form.control}
                name="medicalCertificates"
                render={({ field }) => (
                  <UploadZone
                    disabled={medicExist}
                    field={field}
                    dropzoneConfig={medicDropZoneConfig}
                    error={
                      form.control.getFieldState("medicalCertificates").error
                    }
                  />
                )}
              />
              <Button type="submit" className="w-full">
                Envoyer
              </Button>
            </>
          )}
        </CardContent>
      </form>
    </Form>
  );
};

const UploadZone = ({
  field,
  dropzoneConfig,
  error,
  disabled = false,
}: {
  field: ControllerRenderProps<
    {
      medicalCertificates: File[];
    },
    "medicalCertificates"
  >;
  dropzoneConfig: DropzoneOptions;
  error?: FieldError;
  disabled?: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const getFileIcon = (type: string) => {
    if (type === "application/pdf")
      return <FileText className="size-6 text-red-500 sm:size-8" />;
    return <ImageIcon className="size-6 text-blue-500 sm:size-8" />;
  };

  return (
    <FormItem>
      <FormControl>
        <FileUploader
          value={field.value ?? null}
          disabled={disabled}
          aria-required={!disabled}
          onValueChange={field.onChange}
          dropzoneOptions={{ ...dropzoneConfig }}
          reSelect
          className="w-full overflow-hidden rounded-lg bg-background p-0.5"
        >
          <FileInput
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "group w-full max-w-full overflow-hidden p-4 outline-dashed outline-1 outline-border transition-colors data-disabled:opacity-50 sm:p-8",
              isDragging
                ? "bg-primary/5 outline-primary"
                : "outline-border hover:outline-primary/50",
              error && "outline-destructive",
            )}
          >
            <div className="flex w-full max-w-full flex-col items-center justify-center gap-2 overflow-hidden text-center sm:gap-3">
              <div className="rounded-full bg-primary/10 p-3 sm:p-4">
                <CloudUpload className="size-5 transition-colors group-data-disabled:text-foreground sm:size-6" />
              </div>
              <div className="w-full max-w-full space-y-1 overflow-hidden px-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                  <span className="font-semibold">
                    Cliquez pour ajouter un fichier
                  </span>
                  <span className="hidden sm:inline">
                    &nbsp; ou glisser déposer
                  </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, JPG ou PNG (max. 10MB)
                </p>
              </div>
            </div>
          </FileInput>
          <FileUploaderContent className="w-full max-w-full overflow-hidden">
            {field.value &&
              field.value.length > 0 &&
              field.value.map((file, i) => (
                <FileUploaderItem
                  key={i}
                  index={i}
                  className="h-auto w-full max-w-full overflow-hidden bg-muted/50 p-3 sm:p-4"
                >
                  <div className="flex w-full min-w-0 items-center gap-2 overflow-hidden sm:gap-3">
                    <div className="flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="min-w-0 max-w-full flex-1 overflow-hidden">
                      <p
                        className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium sm:text-sm"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </FileUploaderItem>
              ))}
          </FileUploaderContent>
        </FileUploader>
      </FormControl>
      <FormMessage disabled={disabled} />
    </FormItem>
  );
};
