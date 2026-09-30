import { FC, SVGProps } from 'react';

export interface IFuncdWordmark extends SVGProps<SVGSVGElement> {
  color?: string;
}

/**
 * Constructed outlines with tangent-aligned curves and rounded terminals.
 * The approved soft, extended proportions and spacing are drawn into the paths.
 * Run `yarn ui generate:logo` after editing to update assets/funcd-wordmark.svg.
 */
const FuncdWordmark: FC<IFuncdWordmark> = (props) => {
  const { color = '#FFFFFF', width = 160, height, ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-1 -1 398 81"
      fill="currentColor"
      fillRule="evenodd"
      color={color}
      role="img"
      aria-label="Funcd"
      focusable="false"
      {...rest}
      width={width}
      height={height}>
      <path
        data-part="letter-f"
        d="M50 0
      C57 0 63.3 0.6 68.8 2
      C70.3 2.38 71 3.35 71 5
      C71 7.7 69.7 12.4 67.6 14.65
      C67.04 15.25 66.3 15.6 65.3 15.6
      C62.4 15.6 57.7 14.5 50 14.5
      C36 14.5 28.5 18.8 28.5 27
      C28.5 27.55 28.95 28 29.5 28
      L49.5 28
      C52.5 28 54.2 30.3 54.2 35.1
      C54.2 39.9 52.5 42.2 49.5 42.2
      L29.3 42.2
      C28.75 42.2 28.3 42.65 28.3 43.2
      L28.3 70.7
      C28.3 75 24.4 78.3 19.5 78.3
      C14.6 78.3 10.7 75 10.7 70.7
      L10.7 43.2
      C10.7 42.65 10.25 42.2 9.7 42.2
      L4.5 42.2
      C1.5 42.2 0 40.5 0 37.5
      L0 32.7
      C0 29.7 1.5 28 4.5 28
      L9.8 28
      C10.35 28 10.8 27.55 10.8 27
      C10.8 10.2 23.4 0 50 0Z"
      />
      <path
        data-part="letter-u"
        transform="translate(63.83 0)"
        d="M8.8 25.2
      C13.66 25.2 17.6 28.56 17.6 32.7
      L17.6 50.5
      C17.6 59.4 25 64.1 39.5 64.1
      C54 64.1 61.7 59.4 61.7 50.5
      L61.7 32.7
      C61.7 28.56 65.64 25.2 70.5 25.2
      C75.36 25.2 79.3 28.56 79.3 32.7
      L79.3 51
      C79.3 69.6 65.2 78.7 39.5 78.7
      C13.8 78.7 0 69.6 0 51
      L0 32.7
      C0 28.56 3.94 25.2 8.8 25.2Z"
      />
      <path
        data-part="letter-n"
        transform="translate(149.22 0)"
        d="M0 51
      C0 33.2 14.5 26.2 39.5 26.2
      C65 26.2 78.9 33.6 78.9 51
      L78.9 70.8
      C78.9 75 75 78.3 70.2 78.3
      C65.4 78.3 61.5 75 61.5 70.8
      L61.5 53
      C61.5 45 54.2 40.6 39.5 40.6
      C24.8 40.6 17.6 45 17.6 53
      L17.6 70.8
      C17.6 75 13.7 78.3 8.8 78.3
      C3.9 78.3 0 75 0 70.8
      L0 51Z"
      />
      <path
        data-part="letter-c"
        transform="translate(233.16 0)"
        d="M41.5 24.1
      C54 24.1 64.4 26 71.6 29.6
      C73.9 30.75 75.1 32.3 75.1 34.5
      C75.1 38.9 71.2 43.1 67.3 43.1
      C64.3 43.1 60.5 40.4 55.5 39.2
      C51.2 38.168 46.7 37.8 41.5 37.8
      C25.3 37.8 17.6 42.5 17.6 51.4
      C17.6 60.3 25.3 65.2 41.5 65.2
      C46.7 65.2 51.2 64.832 55.5 63.8
      C60.5 62.6 64.3 59.7 67.3 59.7
      C71.2 59.7 75.1 63.9 75.1 68.5
      C75.1 70.7 73.9 72.45 71.6 73.6
      C64.4 77.2 54 78.9 41.5 78.9
      C14.8 78.9 0 69.5 0 51.4
      C0 33.3 14.8 24.1 41.5 24.1Z"
      />
      <path
        data-part="letter-d"
        transform="translate(313.05 0)"
        d="M74.2 0.4
      C79 0.4 82.8 3.6 82.8 7.6
      L82.8 51.5
      C82.8 69.2 68.4 78.9 42 78.9
      C14.5 78.9 0 69.4 0 51.5
      C0 33.4 14.5 24.1 42 24.1
      C51.5 24.1 58.8 25.8 64.6 28.6
      C65.2 28.89 65.5 28.6 65.5 28
      L65.5 7.6
      C65.5 3.6 69.4 0.4 74.2 0.4Z
      M42 37.7
      C26 37.7 17.5 42.4 17.5 51.5
      C17.5 60.6 26 65.4 42 65.4
      C58 65.4 65.3 60.6 65.3 51.5
      C65.3 42.4 58 37.7 42 37.7Z"
      />
    </svg>
  );
};

export default FuncdWordmark;
