/* eslint-disable react/require-default-props */
import { FC, useEffect } from 'react';
import { Link, LinkProps, useMatch, useResolvedPath } from 'react-router-dom';

interface INavBarLink extends LinkProps {
  handleIsActive: (isActive: boolean) => void;
}

const NavBarLink: FC<INavBarLink> = (props) => {
  const { to, children, handleIsActive, ...rest } = props;
  const resolved = useResolvedPath(to);
  // A module stays active on its sub-pages (/workflows/transform); a home link at / only on itself.
  const pathname = useMatch({
    path: resolved.pathname,
    end: resolved.pathname === '/'
  })?.pathname;
  useEffect(() => {
    handleIsActive(Boolean(pathname));
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Link to={to} {...rest}>
      {children}
    </Link>
  );
};

export default NavBarLink;
