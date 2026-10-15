import {
  apiBase,
  IRoute,
  RouteInputType,
  RouteNameType,
  RouteOutputType,
  routes,
  RoutesType
} from './contract';

export interface IApiError {
  status: number;
  message: string;
}

export type ApiResultType<TData> =
  | { data: TData; error: undefined }
  | { data: undefined; error: IApiError };

type ApiType = {
  [K in RouteNameType]: (
    ...args: unknown extends RouteInputType<RoutesType[K]>
      ? []
      : [input: RouteInputType<RoutesType[K]>]
  ) => Promise<ApiResultType<RouteOutputType<RoutesType[K]>>>;
};

interface IRequestInput {
  id?: string;
  query?: Record<string, unknown>;
  body?: unknown;
}

const request = async (
  route: IRoute,
  input: IRequestInput = {}
): Promise<ApiResultType<unknown>> => {
  const { id, query, body } = input;
  const path = route.path.replace(':id', encodeURIComponent(id ?? ''));
  const search = new URLSearchParams(
    Object.entries(query ?? {})
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => [key, String(value)])
  ).toString();

  try {
    const response = await fetch(
      `${apiBase}${path}${search ? `?${search}` : ''}`,
      {
        method: route.method.toUpperCase(),
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
      }
    );
    const json = await response.json();
    if (!response.ok) {
      return {
        data: undefined,
        error: { status: response.status, message: json.message }
      };
    }
    // A response that breaks the contract is an error too.
    const parsed = route.response.safeParse(json);
    return parsed.success
      ? { data: parsed.data, error: undefined }
      : {
          data: undefined,
          error: { status: 500, message: parsed.error.message }
        };
  } catch (error) {
    return {
      data: undefined,
      error: { status: 0, message: (error as Error).message }
    };
  }
};

// One function per route of the contract: `api.listDevices({ query })`,
// `api.getDevice({ id })`, `api.createDevice({ body })`.
const api = Object.fromEntries(
  Object.entries(routes).map(([name, route]) => [
    name,
    (input?: IRequestInput) => request(route, input)
  ])
) as ApiType;

export default api;
