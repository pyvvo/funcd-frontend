/* eslint-disable react/require-default-props */
/* oxlint-disable react/jsx-no-constructed-context-values */
import { FC, ReactNode } from 'react';
import { ThemeContext, IThemeContext } from './theme.context';

interface IThemeProvider {
  theme: IThemeContext;
  children: ReactNode;
}

const ThemeProvider: FC<IThemeProvider> = ({ theme, children }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);
export default ThemeProvider;
