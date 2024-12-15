import { Typography } from "@/components/ui/typography";
import { associationPositionToText, cn } from "@/lib/utils";
import { ImageWithLoader } from "@/components/features/withLoader/ImageWithLoader";

type PositionProps = {
  index: number;
  position: {
    status: string;
    firstName: string;
    lastName: string;
    picture: string;
  };
};

export default function Position(props: PositionProps) {
  const positionText = associationPositionToText(props.position.status);

  return (
    <div
      className={cn(
        "flex h-80 w-full gap-6",
        props.index % 2 !== 0 ? "" : "flex-row-reverse",
      )}
    >
      <div className="relative h-fit w-full rounded-lg shadow-2xl">
        <ImageWithLoader
          src={"/img/team/" + props.position.picture}
          alt={`Picture of ${props.position.firstName} ${props.position.lastName}`}
          width={320}
          height={320}
        />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <Typography
          as="h1"
          variant="h2"
          className="justify-self-start font-bold tracking-wide"
        >
          {positionText}
        </Typography>
        <Typography as="span">
          {props.position.firstName} {props.position.lastName}
        </Typography>
      </div>
    </div>
  );
}
