export default function ImageBox(props: {
  imgSrc: string | undefined;
  className?: string;
  containerClassName?: string;
}) {
  // Props;
  const { imgSrc, className, containerClassName } = props;

  return (
    <>
      <div className={`flex justify-center mb-10 ${containerClassName}`}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt="imgSrc"
            className={`rounded-xl ${className}`}
          />
        ) : (
          <>삽화</>
        )}
      </div>
    </>
  );
}
