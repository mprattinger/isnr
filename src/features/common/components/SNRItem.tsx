import { cn } from "bec-react-components";

interface ISNRItemProps {
  isHeader?: boolean;
  header?: string;
  no?: number;
  snr?: string;
}

export const SNRItem = (props: ISNRItemProps) => {
  return (
    <div
      className={cn(
        props.isHeader && "font-bold",
        "flex w-1/3 p-1 self-center"
      )}
    >
      <div
        className={cn(
          "flex grow p-2 rounded",
          !props.isHeader && "bg-green-300"
        )}
      >
        <div className="mr-4">{props.isHeader ? "#" : props.no}</div>
        <div className="flex grow ">
          {props.isHeader && props.isHeader ? props.header : props.snr}
        </div>
        <div></div>
      </div>
    </div>
  );
};
