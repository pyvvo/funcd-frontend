import { within } from 'storybook/test';

export const getReactiveRef = (
  canvasElement: HTMLElement,
  fieldKey: string
) => {
  const canvas = within(canvasElement);
  const fieldRef = canvas.getByTestId(fieldKey);
  const submitRef = canvas.getByTestId('submit');
  const resultRef = canvas.getByTestId<HTMLTextAreaElement>('form-result');
  return { fieldRef, submitRef, resultRef };
};

export const getChartRef = (canvasElement: HTMLElement, chartKey: string) => {
  const canvas = within(canvasElement);
  const chartRef = canvas.getByTestId(chartKey);
  const resultRef = canvas.getByTestId<HTMLTextAreaElement>('chart-result');
  return { chartRef, resultRef };
};
