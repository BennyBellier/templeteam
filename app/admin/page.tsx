import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/server/db";

export default async function AdminDashboard() {
  const members = await prisma.member.findMany();

  return (
    <Table>
      <TableCaption>Liste des adhérents</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Photo</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Prénom</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-scroll">
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>{member.picture}</TableCell>
            <TableCell>{member.firstname}</TableCell>
            <TableCell>{member.lastname}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
