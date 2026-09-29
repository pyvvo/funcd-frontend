import { action } from 'storybook/actions';
import { FC, JSX, useEffect, useMemo, useState } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { IDecoratorParams } from './common';

export const ReactRouterLoggerDecorator = (
  Story: IDecoratorParams['Story'],
  props: IDecoratorParams['props']
) => {
  return <Logger Story={Story} props={props} />;
};

const Logger = ({
  Story,
  props
}: {
  Story: IDecoratorParams['Story'];
  props: IDecoratorParams['props'];
}) => {
  const location = useLocation();
  useEffect(() => {
    action('location')(location);
  }, [location]);

  return <Story />;
};

// https://divotion.com/blog/typescript-react-router-v6-inside-storybook-stories
export const ReactRouterDecorator = (
  Story: IDecoratorParams['Story'],
  props: IDecoratorParams['props']
) => {
  const { args } = props;

  return (
    <MemoryRouter>
      <Routes>
        <Route path="/*" element={<Story />} />
      </Routes>
    </MemoryRouter>
  );
};

// ################ ReactRouterDecoratorWithOutlet ################

const NotFound: FC = () => (
  <div>
    <h1>404 Not Found</h1>
    <p>Sorry, the page you requested could not be found.</p>
  </div>
);

export interface IStoryRoutes {
  to: string;
  element: JSX.Element;
}

export const ReactRouterDecoratorWithOutlet = (
  Story: IDecoratorParams['Story'],
  props: IDecoratorParams['props']
) => {
  const {
    args: { routes, ...rest }
  } = props;

  const [outlet, setOutlet] = useState(routes as IStoryRoutes[]);
  const memoizedRoutes = useMemo(() => {
    const rt = routes as IStoryRoutes[];
    return rt.map((route) => (
      <Route key={route.to} path={route.to} element={route.element} />
    ));
  }, [routes]);

  return (
    <MemoryRouter initialEntries={[outlet[0].to]}>
      <Routes>
        <Route path="/" element={<Story args={{ ...rest }} />}>
          {memoizedRoutes}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};
