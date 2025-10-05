import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type RouterOutputs } from "@/server/api/root";
import { AlertCircle, CheckCircle, Mail, Phone, XCircle } from "lucide-react";
import { getGenderLabel, getInitials, getPaymentBadge } from "./utils";
import { Typography } from "@/components/ui/typography";

interface MemberCardProps {
  member: RouterOutputs["association"]["dashboard"]["getSeasonMemberList"][number];
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg">
      <CardHeader className="pb-8">
        <div className="flex items-start gap-5">
          <Avatar className="h-24 w-24 border-4 border-white shadow-xl ring-2 ring-primary/20">
            <AvatarImage
              src={member.photo}
              alt={member.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-2xl font-bold text-primary-foreground">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-balance text-2xl font-bold leading-tight text-foreground">
                {member.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {getGenderLabel(member.gender)} - {member.age} ans
              </p>
            </div>

            {getPaymentBadge(member.payment)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <section className="space-y-3">
          <h3 className="text-base font-bold text-foreground">Contact</h3>
          <div className="space-y-2.5">
            {member.mail ? (
              <a
                href={`mailto:${member.mail}`}
                className="group flex items-center gap-3 rounded-xl bg-primary/5 p-3 transition-colors hover:bg-primary/10"
              >
                <div className="rounded-lg bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-foreground">{member.mail}</span>
              </a>
            ) : (
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="rounded-lg bg-muted p-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Email non renseigné
                </span>
              </div>
            )}

            {member.phone ? (
              <a
                href={`tel:${member.phone}`}
                className="group flex items-center gap-3 rounded-xl bg-primary/5 p-3 transition-colors hover:bg-primary/10"
              >
                <div className="rounded-lg bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-foreground">{member.phone}</span>
              </a>
            ) : (
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="rounded-lg bg-muted p-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Téléphone non renseigné
                </span>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">
              Cours {member.courses.length > 0 && `(${member.courses.length})`}
            </h3>
          </div>
          {member.courses.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {member.courses.map((course, index) => (
                <Badge key={index} variant="outline">
                  {course}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun cours inscrit</p>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-foreground">
            Informations médicales
          </h3>
          <div className="space-y-3">
            <div
              className={`flex items-center justify-between rounded-xl p-4 ${
                member.medicalCertificate
                  ? "bg-success/10 border-success/20 border-2"
                  : "border-2 border-destructive/20 bg-destructive/10"
              }`}
            >
              <span className="text-sm font-medium text-foreground">
                Certificat médical
              </span>
              {member.medicalCertificate ? (
                <Badge
                  variant="default"
                  className="bg-success text-success-foreground hover:bg-sucess border-0 shadow-sm"
                >
                  <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                  Fourni
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="border-0 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive"
                >
                  <XCircle className="mr-1.5 h-3.5 w-3.5" />
                  Non fourni
                </Badge>
              )}
            </div>

            {member.medicalComment && (
              <div className="rounded-xl border-2 border-warning/30 bg-warning/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-warning/30 p-2">
                    <AlertCircle className="h-4 w-4 text-warning-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-semibold text-foreground">
                      Commentaire médical
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {member.medicalComment}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">
              Contact d&apos;urgence
            </h3>
          </div>
          {member.emergencyContact.length === 0 && (
            <Typography variant="muted" className="text-center">Aucun contact renseigné.</Typography>
          )}
          {member.emergencyContact.map((contact) => (
            <div
              key={contact.phone}
              className="rounded-xl border-2 border-destructive/20 bg-gradient-to-br from-destructive/10 to-destructive/5 p-4"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20 font-bold text-destructive">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {contact.name}
                  </span>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="group flex items-center gap-3 rounded-lg bg-background/50 p-3 transition-colors hover:bg-background"
                >
                  <Phone className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-foreground transition-colors group-hover:text-destructive">
                    {contact.phone}
                  </span>
                </a>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
