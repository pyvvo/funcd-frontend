import { JSONData } from '@/types';
import { IChartCustomProps } from './chart-custom-props';

export interface IConditionalChartProp<TRow extends JSONData> {
  bar: { customProps: IChartCustomProps<TRow>['bar'] };
  line: { customProps: IChartCustomProps<TRow>['line'] };
  pie: { customProps: IChartCustomProps<TRow>['pie'] };
}
