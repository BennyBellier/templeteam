import Image from "next/image";
import { Typography } from "@/components/ui/typography";
import { associationPositionToText, cn } from "@/lib/utils";
import { ImageWithLoader } from "@/components/features/withLoader/ImageWithLoader";

type PositionProps = {
    index: number
    position: {
        status: string,
        firstName: string,
        lastName: string,
        picture: string
    }
  };
  
  export default function Position(props: PositionProps) {
    const positionText = associationPositionToText(props.position.status);

    return (
        <div className={cn("flex gap-6 h-80 w-full", props.index % 2 !== 0 ? "" : "flex-row-reverse")}>
            <div className="relative w-full shadow-2xl h-fit">
                <ImageWithLoader 
                src={"/img/team/" + props.position.picture}
                alt={`Picture of ${props.position.firstName} ${props.position.lastName}`}
                width={320}
                height={320} 
                />
            </div>
            <div className="flex flex-col justify-center items-center gap-6 w-full">
                <Typography as="h1" variant="h2" className="font-bold justify-self-start tracking-wide" >{positionText}</Typography>
                <Typography as="span">{props.position.firstName} {props.position.lastName}</Typography>
            </div>
        </div>
    );
}