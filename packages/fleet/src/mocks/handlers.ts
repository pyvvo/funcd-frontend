import { delay, http, HttpResponse } from 'msw';
import { z } from 'zod';
import {
  apiBase,
  IRoute,
  RouteNameType,
  RoutesType,
  routes
} from '../api/contract';
import { db } from './db';

interface IResolverInput<TRoute extends IRoute> {
  id: string;
  query: TRoute['query'] extends z.ZodType ? z.output<TRoute['query']> : never;
  body: TRoute['body'] extends z.ZodType ? z.output<TRoute['body']> : never;
}

// A route's mock: the query and the body are validated against the contract
// (400 when they break it), and an undefined result is a 404.
const mock = <TName extends RouteNameType>(
  name: TName,
  resolve: (
    input: IResolverInput<RoutesType[TName]>
  ) => z.input<RoutesType[TName]['response']> | undefined
) => {
  const route: IRoute = routes[name];
  return http[route.method](
    `${apiBase}${route.path}`,
    async ({ params, request }) => {
      await delay(300);
      const query = route.query?.safeParse(
        Object.fromEntries(new URL(request.url).searchParams)
      );
      const body =
        route.body &&
        route.body.safeParse(await request.json().catch(() => undefined));
      const invalid = [query, body].find((result) => result && !result.success);
      if (invalid?.error) {
        return HttpResponse.json(
          { message: z.prettifyError(invalid.error) },
          { status: 400 }
        );
      }
      const result = resolve({
        id: String(params.id),
        query: query?.data,
        body: body?.data
      } as IResolverInput<RoutesType[TName]>);
      return result === undefined
        ? HttpResponse.json({ message: 'Not found' }, { status: 404 })
        : HttpResponse.json(result, {
            status: route.method === 'post' && !params.id ? 201 : 200
          });
    }
  );
};

export const handlers = [
  mock('getStats', () => db.stats()),
  mock('listSites', () => db.sites()),
  mock('listDevices', ({ query }) => db.listDevices(query)),
  mock('getDevice', ({ id }) => db.findDevice(id)),
  mock('createDevice', ({ body }) => db.createDevice(body)),
  mock('updateDevice', ({ id, body }) => db.updateDevice(id, body)),
  mock('deleteDevice', ({ id }) => db.removeDevice(id)),
  mock('restartDevice', ({ id }) => db.restartDevice(id)),
  mock('getReadings', ({ id, query }) => db.readings(id, query.range ?? '24h')),
  mock('listAlerts', ({ query }) => db.listAlerts(query)),
  mock('acknowledgeAlert', ({ id }) => db.setAlertStatus(id, 'acknowledged')),
  mock('resolveAlert', ({ id }) => db.setAlertStatus(id, 'resolved')),
  mock('listAlertRules', () => db.listRules()),
  mock('createAlertRule', ({ body }) => db.createRule(body)),
  mock('updateAlertRule', ({ id, body }) => db.updateRule(id, body)),
  mock('listAutomations', () => db.listAutomations()),
  mock('getAutomation', ({ id }) => db.findAutomation(id)),
  mock('updateAutomation', ({ id, body }) => db.updateAutomation(id, body)),
  mock('deleteAutomation', ({ id }) => db.removeAutomation(id)),
  mock('runAutomation', ({ id }) =>
    db.findAutomation(id)
      ? {
          automationId: id,
          status: 'triggered' as const,
          at: new Date().toISOString()
        }
      : undefined
  )
];
