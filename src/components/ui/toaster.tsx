import { Toaster as ReactHotToaster } from "react-hot-toast";
import { Typography } from "./typography";

export function Toaster() {
  return <ReactHotToaster position="bottom-right" />;
}

export type DropzoneToastProps = {
  title: string,
  fileInfo?: string,
  description: string,
}

export const DropzoneToast = (props: DropzoneToastProps) => {
  return (
    <div>
      <Typography variant="h3" className="text-sm">
        {props.title} : {props.fileInfo}
      </Typography>
      <Typography variant="muted">{props.description}</Typography>
    </div>
  );
};