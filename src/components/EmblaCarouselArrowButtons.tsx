import type { PropsWithChildren } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";


type PropType = PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>;

/**
 * @description
 * A button with a left arrow for Embla Carousel
 *
 * @param props.children the children of the button
 * @param props.disabled whether the button is disabled or not
 *
 * @returns a button with a left arrow
 */
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

/**
 * @description
 * A button with a right arrow for Embla Carousel
 *
 * @param props.children the children of the button
 * @param props.disabled whether the button is disabled or not
 * 
 * @returns a button with a right arrow
 */
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
