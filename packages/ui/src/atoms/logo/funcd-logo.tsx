import React, { type FC, type SVGProps } from 'react';

interface IFuncdLogo extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  color?: string;
  /** Both dimensions, in pixels or a CSS length. Defaults to 48. */
  size?: number | string;
  /** The upper ribbon and input dot. Defaults to the theme's primary color. */
  accentColor?: string;
}

export type FuncdLogoProps = IFuncdLogo;

/**
 * The interlocking Funcd mark, drawn with editable Bézier paths.
 * Run `yarn ui generate:logo` after editing to update assets/funcd-logo.svg.
 */
const FuncdLogo: FC<IFuncdLogo> = (props) => {
  const {
    accentColor = 'var(--mantine-primary-color-9, #6D5CE7)',
    color = '#FFFFFF',
    size = 48,
    ...rest
  } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="120 96 1024 1024"
      fill="none"
      color={color}
      role="img"
      aria-label="Funcd"
      focusable="false"
      {...rest}
      width={size}
      height={size}>
      {/* Separate frame segments leave genuinely transparent crossing gaps. */}
      <g data-part="frame" fill="currentColor">
        <path
          data-part="frame-top-left"
          d="M270 814 268 355C268 287 325 231 392 231H864C909 231 946 255 967 294C938 296 910 301 885 307C878 305 871 305 863 305H398C366 305 341 327 341 355V810C316 813 293 814 270 814Z"
        />
        <path
          data-part="frame-bottom-right"
          d="M913 412C937 406 961 403 986 401V862C986 931 932 986 863 986H391C349 986 312 964 291 929C341 927 388 920 430 910H858C890 910 913 887 913 858Z"
        />
      </g>
      <path
        data-part="ribbon-input"
        fill="currentColor"
        d="M261 827C421 830 511 779 572 653L617 563C619 573 622 581 626 587L607 621 637 657C648 677 649 697 638 720C592 824 519 885 406 909C360 919 311 921 261 918C287 895 287 854 261 827Z"
      />
      <path
        data-part="ribbon-output"
        fill={accentColor}
        d="M1006 302C817 299 692 389 629 537C623 555 632 575 644 588L669 618 648 654 655 680C694 614 724 548 766 495C824 425 902 387 1006 388C982 366 982 324 1006 302Z"
      />
      <circle
        data-part="input-dot"
        cx="202"
        cy="875.5"
        r="59"
        fill={accentColor}
      />
      <circle
        data-part="output-dot"
        cx="1063"
        cy="344"
        r="56"
        fill="currentColor"
      />
    </svg>
  );
};

export default FuncdLogo;
