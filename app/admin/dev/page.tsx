/* "use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/TrpcProvider";
import { send } from "./sendMessage";

export default function Page() {
  const members = trpc.association.getEndofTrialsInfos.useQuery();
  const handleClick = async () => {
    console.log(members.data);

    if (members.data) {
      // eslint-disable-next-line prefer-const
      for (let member of members.data) {
        const cours = {
          templeRun: member.membership.includes("templeRun"),
          templeGymJunior: member.membership.includes("templeGymJunior"),
          templeGym: member.membership.includes("templeGym"),
          templeBreak: member.membership.includes("templeBreak"),
        };

        console.log(member.id, cours);

        if (member.mail) {
          await send(member.mail, { memberId: member.id, cours });
        }

        await send("inscription@templeteam.fr", { memberId: member.id, cours });
      }
    }
  };

  return (
    <Button onClick={handleClick} disabled={members.isLoading}>
      Envoyer mail
    </Button>
  );
}
 */