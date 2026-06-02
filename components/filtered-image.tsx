import Image from "next/image";

interface FilteredImageProps {
  src: string;
  alt: string;
  cssFilter?: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function FilteredImage({
  src,
  alt,
  cssFilter,
  className = "",
  ...imageProps
}: FilteredImageProps) {
  const style = cssFilter ? { filter: cssFilter } : undefined;

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...imageProps}
    />
  );
}
