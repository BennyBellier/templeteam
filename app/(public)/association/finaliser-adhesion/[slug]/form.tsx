"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload } from "lucide-react";
import Image from "next/image";
import type { DropzoneOptions } from "react-dropzone";
import {
  type ControllerRenderProps,
  type FieldError,
  type Merge,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB

const PHOTO_ACCEPTED_FILE_TYPES = [
  "image/jpeg", // JPEG
  "image/png", // PNG
  "image/tiff", // TIFF
];

const MEDIC_ACCEPTED_FILE_TYPES = [
  "image/jpeg", // JPEG
  "image/png", // PNG
  "application/pdf", // PDF
];

const photoDropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", ".tiff"],
  },
  maxFiles: 1,
  maxSize: MAX_UPLOAD_SIZE,
  multiple: false,
} satisfies DropzoneOptions;

const medicDropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", ".pdf"],
  },
  maxFiles: 1,
  maxSize: MAX_UPLOAD_SIZE,
  multiple: false,
} satisfies DropzoneOptions;

const formSchema = z.object({
  photo: z
    .array(z.instanceof(File), {
      invalid_type_error: "La photo est obligatoire.",
    })
    .refine((files) => files.length > 0, "La photo est obligatoire.")
    .refine((files) => {
      return files?.every((file) => file.size <= MAX_UPLOAD_SIZE);
    }, `La taille du fichier doit faire moins de ${MAX_UPLOAD_SIZE}MB.`)
    .refine((files) => {
      return files?.every((file) =>
        PHOTO_ACCEPTED_FILE_TYPES.includes(file.type),
      );
    }, "Le fichier doit être de type PNG, JPEG ou TIFF.")
    .nullable(),
  medicalCertificate: z
    .array(z.instanceof(File), {
      invalid_type_error: "La certificat est obligatoire.",
    })
    .refine((files) => files.length > 0, "La certificat est obligatoire.")
    .refine((files) => {
      return files?.every((file) => file.size <= MAX_UPLOAD_SIZE);
    }, `La taille du fichier doit faire moins de ${MAX_UPLOAD_SIZE}MB.`)
    .refine((files) => {
      return files?.every((file) =>
        MEDIC_ACCEPTED_FILE_TYPES.includes(file.type),
      );
    }, "Le fichier doit être de type PNG, JPEG ou PDF.")
    .nullable(),
});

export const FormCompletion = ({
  memberId,
  fileId,
  photoExist: photoExist = true,
  medicExist: medicExist = true,
  refetch,
}: {
  memberId: string;
  fileId: string;
  photoExist?: boolean;
  medicExist?: boolean;
  refetch: () => Promise<void>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldFocusError: true,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let toastId = "";
    try {
      toastId = toast.loading("Sauvegarde des informations en cours...");

      if (values.photo?.[0]) {
        // Adding photo
        const formData = new FormData();

        formData.append("memberId", memberId);
        formData.append("photo", values.photo?.[0]);

        // Call API endpoint to store file
        const response = await fetch("/api/association.uploadPhoto", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          toast.error(
            "Erreur lors de la sauvegarde de la photo. Veuillez réessayer.",
            {
              id: toastId,
              duration: 3000,
            },
          );
          return;
        }
      }

      if (values.medicalCertificate?.[0]) {
        // Adding medic
        const formData = new FormData();

        formData.append("fileId", fileId);
        formData.append("medic", values.medicalCertificate?.[0]);

        // Call API endpoint to store file
        const response = await fetch("/api/association.uploadMedic", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          toast.error(
            "Erreur lors de la sauvegarde du certificat médicale. Veuillez réessayer.",
            {
              id: toastId,
              duration: 3000,
            },
          );
          return;
        }
      }

      toast.success("Inscription réussie !", {
        id: toastId,
        duration: 5000,
      });
      await refetch();
      form.reset();
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        id="registerForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full"
      >
        <Card className="mx-auto w-full min-w-52 max-w-xl">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <UploadZone
                  label="Photo (selfies acceptés)"
                  disabled={photoExist}
                  type="JPG, PNG ou TIFF"
                  field={field}
                  dropzoneConfig={photoDropZoneConfig}
                  error={form.control.getFieldState("photo")}
                />
              )}
            />
            <FormField
              control={form.control}
              name="medicalCertificate"
              render={({ field }) => (
                <UploadZone
                  label="Certificat Médical"
                  disabled={medicExist}
                  type="JPG, PNG ou PDF"
                  field={field}
                  dropzoneConfig={medicDropZoneConfig}
                  error={form.control.getFieldState("medicalCertificate")}
                />
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="h-full w-full rounded-b-lg rounded-l-none rounded-t-none hover:scale-100 focus-visible:scale-100 disabled:opacity-100"
            >
              Envoyer
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

const UploadZone = ({
  label,
  type,
  field,
  dropzoneConfig,
  error,
  disabled = false,
}: {
  label: string;
  type: string;
  field: ControllerRenderProps<
    {
      medicalCertificate: File[] | null;
      photo: File[] | null;
    },
    "medicalCertificate" | "photo"
  >;
  dropzoneConfig: DropzoneOptions;
  error: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  disabled?: boolean;
}) => (
  <FormItem>
    <FormLabel className={disabled ? "text-muted-foreground" : ""}>
      {label}
    </FormLabel>
    <FormControl>
      <FileUploader
        value={field.value}
        disabled={disabled}
        aria-required={!disabled}
        onValueChange={field.onChange}
        dropzoneOptions={{ ...dropzoneConfig }}
        reSelect
        className="relative col-span-2 rounded-lg bg-background p-0.5"
      >
        <FileInput
          className={cn(
            "group h-24 w-full outline-dashed outline-1 outline-foreground data-disabled:opacity-50",
            error && "outline-destructive",
          )}
        >
          <div className="flex h-full w-full flex-col items-center justify-center">
            <CloudUpload className="transition-colors group-hover:text-primary group-data-disabled:text-foreground" />
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Ajouter un fichier</span>
              &nbsp; ou glisser déposer
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{type}</p>
          </div>
        </FileInput>
        <FileUploaderContent>
          {field.value &&
            field.value.length > 0 &&
            field.value.map((file, i) => (
              <FileUploaderItem
                key={i}
                index={i}
                className="flex h-fit justify-center bg-card"
              >
                <div className="flex gap-2">
                  <div className="size-16">
                    <AspectRatio className="size-full">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="rounded-md object-cover"
                        fill
                      />
                    </AspectRatio>
                  </div>
                  <div className="flex flex-col justify-around">
                    <Typography as="span" className="">
                      {file.name.length > 20
                        ? file.name.slice(0, 16) +
                          "..." +
                          file.name.split(".")[1]
                        : file.name}
                    </Typography>
                    <Typography
                      as="span"
                      variant="quote"
                      className=" m-0 border-none p-0"
                    >
                      {(file.size / 1024 / 1024).toFixed(2)} Mb
                    </Typography>
                  </div>
                </div>
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
      </FileUploader>
    </FormControl>
    <FormMessage />
  </FormItem>
);
