import clsx from "clsx";
import { FilteredImage } from "../filtered-image";
import Label from "../label";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  cssFilter,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  cssFilter?: string;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
} & React.ComponentProps<typeof FilteredImage>) {
  return (
    <div
      className={clsx(
        "group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-white dark:bg-black",
        {
          relative: label,
          "border-2 border-white": active,
          "border-neutral-200 dark:border-neutral-800": !active,
        },
      )}
    >
      {props.src ? (
        <FilteredImage
          className={clsx("relative h-full w-full object-contain", {
            "transition duration-300 ease-in-out group-hover:scale-105":
              isInteractive,
          })}
          cssFilter={cssFilter}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
