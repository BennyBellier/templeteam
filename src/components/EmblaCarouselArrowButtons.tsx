import type { PropsWithChildren } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";


type PropType = PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>;

export const PrevButton: React.FC<PropType> = (props) => {
  const { children, disabled, ...restProps } = props;

  return (
    <button
      className={`ease embla__button embla__button--next z-10 flex h-16 w-16 cursor-pointer items-center justify-center duration-200 hover:scale-110 ${disabled ? 'hover:scale-100 opacity-30' : ''} `}
      type="button"
      {...restProps}
    >
      <HiOutlineChevronLeft className="h-[65%] w-[65%]" />
      {children}
    </button>
  );
};

export const NextButton: React.FC<PropType> = (props) => {
  const { children, disabled, ...restProps } = props;

  return (
    <button
      className={`ease hover:scale-110 z-10 flex h-16 w-16 cursor-pointer items-center justify-center duration-200 embla__button embla__button--next ${disabled ? 'hover:scale-100 opacity-30' : ''} `}
      type="button"
      {...restProps}
    >
      <HiOutlineChevronRight className="h-[65%] w-[65%]" />
      {children}
    </button>
  );
};
