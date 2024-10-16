import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Book,
  Calendar,
  FileText,
  Home,
  Mail,
  Phone,
  Stethoscope,
} from "lucide-react";

export type MemberInformationProps = {
  info: {
    firstname: string;
    lastname: string;
    birthdate: Date;
    gender: string;
    mail: string | null;
    phoneNumber: string | null;
    address: string;
    city: string;
    postalCode: string;
    medicalComment: string | null;
    picture: string | null;
    medicalCertificate: string | null;
    memberships: string[];
    MemberEmergencyContact: {
      name: string;
      phone: string;
    }[];
  } | null;
};

export const MemberInformation = ({
  info,
  ...props
}: MemberInformationProps) => {
  return;
};

export default function MemberCard(props: MemberInformationProps) {
  const info = props.info!;
  return (
    <Card className="mx-auto min-w-52 max-w-xl">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-20 w-20 overflow-hidden rounded-full">
          {info.picture && (
            <AvatarImage
              src={`/association/members/photo/${info.picture}`}
              alt={`${info.firstname} ${info.lastname}`}
            />
          )}
          <AvatarFallback>{`${info.firstname[0]}${info.lastname[0]}`}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl">{`${info.firstname} ${info.lastname}`}</CardTitle>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Né(e) le {info.birthdate?.toLocaleDateString()}
          </p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-muted-foreground" />
          <span>{info.address + ", " + info.postalCode + " " + info.city}</span>
        </div>
        {info.mail && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{info.mail}</span>
          </div>
        )}
        {info.phoneNumber && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{info.phoneNumber}</span>
          </div>
        )}
        <Separator />
        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <Book className="h-4 w-4" />
            Cours
          </h3>
          <div className="flex flex-wrap gap-2">
            {info.memberships.map((cours, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="hover:bg-foreground"
              >
                {cours}
              </Badge>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <Stethoscope className="h-4 w-4" />
            Commentaires médicaux
          </h3>
          <p className="text-sm">{info.medicalComment}</p>
        </div>
        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <FileText className="h-4 w-4" />
            Certificat médical
          </h3>
          <p
            className={`text-sm ${!info.medicalCertificate && "text-destructive"}`}
          >
            {info.medicalCertificate ? "Reçu !" : "Manquant !"}
          </p>
        </div>
        <Separator />
        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4" />
            Contacts d'urgence
          </h3>
          <ul className="space-y-2">
            {info.MemberEmergencyContact.map((contact, index) => (
              <li key={index} className="text-sm">
                <strong>{contact.name}</strong> :{" "}
                {contact.phone}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
