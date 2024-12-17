import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { prisma } from "@/server/db";

export default async function AdminDashboard() {
  const members = await prisma.member.findMany({ orderBy: { lastname: "asc" } });
  console.log(await prisma.member.count());
  const memberCount = await prisma.member.count();

  return (
    <>
    <div>{memberCount}</div>

    <Table>
      <TableCaption>Liste des adhérents</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">Photo</TableHead>
          <TableHead className="w-fit">Nom</TableHead>
          <TableHead>Prénom</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <Avatar>
                <AvatarImage
                  src={`/static/association/members/photo/${member.picture}`}
                  alt={`${member.lastname} ${member.firstname}`}
                />
                <AvatarFallback className="capitalize">{`${member.lastname.charAt(0)}${member.firstname.charAt(0)}`}</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>{member.lastname}</TableCell>
            <TableCell>{member.firstname}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}
