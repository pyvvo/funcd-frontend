import { JSONData } from '@/types';
import { flattenObj, getValuePath } from '@/utils';
import { useMemo } from 'react';

const emptyRows: JSONData[] = [];

interface IUseChartRows {
  data: JSONData;
  dataKey: string;
}

export const useChartRows = (params: IUseChartRows) => {
  const { data, dataKey } = params;

  const rows = useMemo(() => {
    const value = getValuePath(dataKey.split('.'), data);
    return Array.isArray(value) ? (value as JSONData[]) : emptyRows;
  }, [data, dataKey]);

  // ECharts datasets can't read nested fields, so dot paths become keys.
  const flatRows = useMemo(
    () => rows.map((row) => flattenObj(row) as JSONData),
    [rows]
  );

  return { rows, flatRows };
};
