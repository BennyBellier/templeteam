"use client";

import {
  Layout,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/TrpcProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormCard } from "app/association/inscription/formCard";
import { CloudUpload, TriangleAlert } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { DropzoneOptions } from "react-dropzone";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import MemberCard, { MemberInformationProps } from "./MemberCard";

const PICTURE_MAX_UPLOAD_SIZE = 1024 * 1024 * 10; // 10MB

const PICTURE_ACCEPTED_FILE_TYPES = [
  "image/jpeg", // JPEG
  "image/png", // PNG
  "image/tiff", // TIFF
];

const MEDICAL_CERTIFICATE_MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB

const MEDICAL_CERTIFICATE_ACCEPTED_FILE_TYPES = [
  "image/jpeg", // JPEG
  "image/png", // PNG
  "application/pdf", // PDF
];

const pictureDropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", ".tiff"],
  },
  maxFiles: 1,
  maxSize: PICTURE_MAX_UPLOAD_SIZE,
  multiple: false,
} satisfies DropzoneOptions;

const medicalCertificateDropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", ".pdf"],
  },
  maxFiles: 1,
  maxSize: MEDICAL_CERTIFICATE_MAX_UPLOAD_SIZE,
  multiple: false,
} satisfies DropzoneOptions;

const formSchema = z.object({
  picture: z
    .array(z.instanceof(File), { message: "La photo est obligatoire." })
    .refine((files) => {
      return files?.every((file) => file.size <= PICTURE_MAX_UPLOAD_SIZE);
    }, `La taille du fichier doit faire moins de ${PICTURE_MAX_UPLOAD_SIZE}MB.`)
    .refine((files) => {
      return files?.every((file) =>
        PICTURE_ACCEPTED_FILE_TYPES.includes(file.type),
      );
    }, "Le fichier doit être de type PNG, JPEG ou TIFF.")
    .nullable(),
  medicalCertificate: z
    .array(z.instanceof(File), { message: "Le certificat est obligatoire." })
    .refine((files) => {
      return files?.every(
        (file) => file.size <= MEDICAL_CERTIFICATE_MAX_UPLOAD_SIZE,
      );
    }, `La taille du fichier doit faire moins de ${MEDICAL_CERTIFICATE_MAX_UPLOAD_SIZE}MB.`)
    .refine((files) => {
      return files?.every((file) =>
        MEDICAL_CERTIFICATE_ACCEPTED_FILE_TYPES.includes(file.type),
      );
    }, "Le fichier doit être de type PNG, JPEG ou PDF.")
    .nullable(),
});

type MemberInformation = {
  isError: boolean;
  isFetched: boolean;
  isAlreadyUpdated: boolean;
} & MemberInformationProps;

type UploadFileResponse = {
  status: string;
  message: string;
  filePaths: {
    photo: string;
    document: string;
  };
};

export default function Playground() {
  const id = useSearchParams().get("id") ?? "";
  const [isMutating, setIsMutating] = useState(false);

  const { data, isLoading, error, refetch } =
    trpc.association.getMemberAllinformations.useQuery({
      memberId: id,
    });

  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldFocusError: true,
  });

  //* UPDATE Table
  const memberMutationPictureAndCertificate =
    trpc.association.addMemberPictureAndCertificate.useMutation({
      onSuccess: () => {
        setIsMutating(false);
        refetch();
        form.reset();
      },
      onMutate: () => {
        setIsMutating(true);
      },
    });

  if (isLoading) {
    return (
      <Layout noReferences>
        <LayoutHeader>
          <LayoutTitle>Playground</LayoutTitle>
        </LayoutHeader>
        <LayoutSection className="gap-6 md:flex-row">
          <Card
            className={cn(
              "ease flex h-full w-full flex-col overflow-hidden transition-transform duration-500",
            )}
          >
            <Skeleton className="h-[500px] w-full" />
          </Card>
          <Card
            className={cn(
              "ease flex h-full w-full flex-col overflow-hidden transition-transform duration-500",
            )}
          >
            <Skeleton className="h-[28rem] w-full" />
          </Card>
        </LayoutSection>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout noReferences>
        <LayoutHeader>
          <LayoutTitle>Playground</LayoutTitle>
        </LayoutHeader>
        <LayoutSection className="gap-6 md:flex-row">
          <Alert variant="destructive" className="max-w-lg">
            <TriangleAlert className="h-6 w-6" />
            <AlertTitle>L&apos;adhérent n&apos;existe pas !</AlertTitle>
            <AlertDescription>
              Veuillez réessayer ou contactez un administrateur.
            </AlertDescription>
          </Alert>
        </LayoutSection>
      </Layout>
    );
  }

  if (
    data.medicalCertificate &&
    data.medicalCertificate.length > 0 &&
    data.picture
  ) {
    return (
      <Layout noReferences>
        <LayoutHeader>
          <LayoutTitle>Playground</LayoutTitle>
        </LayoutHeader>
        <LayoutSection className="gap-6 md:flex-row">
          <MemberCard info={data} />
        </LayoutSection>
      </Layout>
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let toastId = undefined;
    console.log(
      form.getFieldState("picture"),
      form.getFieldState("medicalCertificate"),
    );
    try {
      toastId = toast.loading("Envoie du message en cours...");
      if (values.picture?.[0] && values.medicalCertificate?.[0] && data) {
        // Extract file from form submit
        const picture = values.picture[0];
        const document = values.medicalCertificate[0];

        // File name generation for cloud storage
        const fileID = `${uuidv4()}_${Date.now()}`;

        // Generate FormData
        const formData = new FormData();

        // Picture
        formData.append("photo", picture);
        formData.append(
          "photoFilename",
          `${fileID}${picture.name.slice(picture.name.lastIndexOf("."))}`,
        );

        // Medical Certificate (alias Document)
        formData.append("document", document);
        formData.append(
          "documentFilename",
          `${fileID}${document.name.slice(picture.name.lastIndexOf("."))}`,
        );

        // Call API endpoint to store files
        const response = await fetch("/api/association.uploadFiles", {
          method: "POST",
          body: formData,
        });

        const result: UploadFileResponse = await response.json();

        if (!response.ok) {
          toast.error("Erreur lors de la mise à jour des informations.", {
            id: toastId,
            duration: 3000,
          });
        }

        memberMutationPictureAndCertificate.mutate({
          memberId: id,
          pictureFilename: result.filePaths.photo,
          certificateFilename: result.filePaths.document,
        });

        toast.success("Certificat et photo correctement sauvegardé.", {
          id: toastId,
          duration: 3000,
        });

        if (memberMutationPictureAndCertificate.error) {
          toast.success(
            "Impossible de lier le certificat et/ou la photo à l'adhérent ! Veuillez nous contacter via l'adresse support@templeteam.fr",
            {
              id: toastId,
              duration: 5000,
            },
          );
        }
      }
      console.log(values);
    } catch (err) {
      console.log(err);

      toast.error("une erreur s'est produite. Veuillez réessayer.", {
        id: toastId,
        duration: 3000,
      });
    }
  }

  return (
    <Layout noReferences>
      <LayoutHeader>
        <LayoutTitle>Playground</LayoutTitle>
      </LayoutHeader>
      <LayoutSection className="gap-6 md:flex-row">
        <MemberCard info={data} />
        <Form {...form}>
          <form id="registerForm" onSubmit={form.handleSubmit(onSubmit)}>
            <FormCard
              title="Documents"
              description="Documents complémentaires pour confirmé l'inscription !"
              classNames={{ Card: "max-w-md" }}
              button={
                <Button
                  type="submit"
                  disabled={isMutating}
                  className="h-full w-full rounded-b-lg rounded-l-none rounded-t-none hover:scale-100 focus-visible:scale-100 disabled:opacity-100"
                >
                  Envoyer
                </Button>
              }
            >
              <FormField
                control={form.control}
                name="picture"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Photo (selfies acceptés)</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        aria-required
                        onValueChange={field.onChange}
                        dropzoneOptions={pictureDropZoneConfig}
                        reSelect
                        className="relative col-span-2 rounded-lg bg-background p-0.5"
                      >
                        <FileInput
                          className={cn(
                            "group h-24 w-full outline-dashed outline-1 outline-foreground data-disabled:opacity-50",
                            form.control.getFieldState("picture").error &&
                              "outline-destructive",
                          )}
                        >
                          <div className="flex h-full w-full flex-col items-center justify-center">
                            <CloudUpload className="transition-colors group-hover:text-primary group-data-disabled:text-foreground" />
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Ajouter un fichier
                              </span>
                              &nbsp; ou glisser déposer
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              JPG, PNG ou TIFF
                            </p>
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
                                    <Typography
                                      as="span"
                                      className="col-start-2"
                                    >
                                      {file.name}
                                    </Typography>
                                    <Typography
                                      as="span"
                                      variant="quote"
                                      className="col-start-2 m-0 border-none p-0"
                                    >
                                      {Math.round(file.size / 1024)}Kb
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
                )}
              />
              <FormField
                control={form.control}
                name="medicalCertificate"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Certificat Médical</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        aria-required
                        onValueChange={field.onChange}
                        dropzoneOptions={medicalCertificateDropZoneConfig}
                        reSelect
                        className="relative col-span-2 rounded-lg bg-background p-0.5"
                      >
                        <FileInput
                          className={cn(
                            "group h-24 w-full outline-dashed outline-1 outline-foreground data-disabled:opacity-50",
                            form.control.getFieldState("medicalCertificate")
                              .error && "outline-destructive",
                          )}
                        >
                          <div className="flex h-full w-full flex-col items-center justify-center">
                            <CloudUpload className="transition-colors group-hover:text-primary group-data-disabled:text-foreground" />
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Ajouter un fichier
                              </span>
                              &nbsp; ou glisser déposer
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              JPG, PNG ou PDF
                            </p>
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
                                    <Typography
                                      as="span"
                                      className="col-start-2"
                                    >
                                      {file.name}
                                    </Typography>
                                    <Typography
                                      as="span"
                                      variant="quote"
                                      className="col-start-2 m-0 border-none p-0"
                                    >
                                      {Math.round(file.size / 1024)}Kb
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
                )}
              />
            </FormCard>
          </form>
        </Form>
      </LayoutSection>
    </Layout>
  );
}
