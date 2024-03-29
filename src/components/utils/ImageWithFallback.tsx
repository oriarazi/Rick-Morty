import { forwardRef, useState } from "react";
import "../../styles/sass/components/utils/ImageWithFallback.scss";

interface IImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: (
    imgProps: React.ImgHTMLAttributes<HTMLImageElement>
  ) => JSX.Element;
}

const defaultFallback: IImageWithFallbackProps["fallback"] = ({
  className,
}) => <div className={`${className} skelton__fallback`} />;

const ImageWithFallback: React.FC<IImageWithFallbackProps> = forwardRef<
  HTMLImageElement,
  IImageWithFallbackProps
>(({ fallback = defaultFallback, ...imgProps }, ref) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <>
      {!isImageLoaded && fallback(imgProps)}
      <img
        loading="lazy"
        {...imgProps}
        ref={ref}
        className={`${imgProps.className} img__with-fallback`}
        onLoad={(e) => {
          setIsImageLoaded(true);
          imgProps.onLoad?.(e);
        }}
        is-fetched={isImageLoaded.toString()}
      />
    </>
  );
});

export default ImageWithFallback;
