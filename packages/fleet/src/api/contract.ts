import { z } from 'zod';

// The fleet API: every schema and route lives here. The client, the mock
// handlers and the OpenAPI spec (`yarn fleet gen:openapi`) all derive from it.

export const DeviceTypeSchema = z.enum([
  'temperature',
  'humidity',
  'power',
  'water'
]);
export const DeviceStatusSchema = z.enum(['online', 'offline', 'warning']);
export const SeveritySchema = z.enum(['info', 'warning', 'critical']);
export const AlertStatusSchema = z.enum(['open', 'acknowledged', 'resolved']);

export const SiteSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    deviceCount: z.number().int()
  })
  .meta({ id: 'Site' });

export const DeviceSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    type: DeviceTypeSchema,
    siteId: z.string(),
    status: DeviceStatusSchema,
    firmware: z.string(),
    battery: z.number().min(0).max(100),
    lastSeenAt: z.iso.datetime(),
    reportingIntervalSec: z.number().int().positive(),
    tags: z.array(z.string())
  })
  .meta({ id: 'Device' });

export const DeviceInputSchema = DeviceSchema.pick({
  name: true,
  type: true,
  siteId: true,
  reportingIntervalSec: true,
  tags: true
})
  .extend({ name: z.string().min(1) })
  .meta({ id: 'DeviceInput' });

export const DevicePageSchema = z
  .object({
    items: z.array(DeviceSchema),
    total: z.number().int(),
    offset: z.number().int(),
    limit: z.number().int()
  })
  .meta({ id: 'DevicePage' });

export const ReadingsSchema = z
  .object({
    deviceId: z.string(),
    unit: z.string(),
    points: z.array(
      z.object({ timestamp: z.iso.datetime(), value: z.number() })
    )
  })
  .meta({ id: 'Readings' });

export const AlertSchema = z
  .object({
    id: z.string(),
    deviceId: z.string(),
    deviceName: z.string(),
    severity: SeveritySchema,
    message: z.string(),
    status: AlertStatusSchema,
    createdAt: z.iso.datetime()
  })
  .meta({ id: 'Alert' });

export const AlertRuleSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    metric: DeviceTypeSchema,
    operator: z.enum(['>', '<']),
    threshold: z.number(),
    severity: SeveritySchema,
    enabled: z.boolean()
  })
  .meta({ id: 'AlertRule' });

export const AlertRuleInputSchema = AlertRuleSchema.omit({ id: true }).extend({
  name: z.string().min(1)
});

// The automation's flow, as the HmFlow editor saves it.
export const FlowSchema = z
  .object({
    nodes: z.array(z.looseObject({ id: z.string() })),
    edges: z.array(z.looseObject({ id: z.string() }))
  })
  .meta({ id: 'AlertRuleInput' });

export const AutomationSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    enabled: z.boolean(),
    updatedAt: z.iso.datetime(),
    flow: FlowSchema
  })
  .meta({ id: 'Automation' });

export const AutomationInputSchema = AutomationSchema.pick({
  name: true,
  description: true,
  enabled: true,
  flow: true
}).meta({ id: 'AutomationInput' });

export const AutomationRunSchema = z.object({
  automationId: z.string(),
  status: z.literal('triggered'),
  at: z.iso.datetime()
});

export const StatsSchema = z
  .object({
    online: z.number().int(),
    offline: z.number().int(),
    warning: z.number().int(),
    openAlerts: z.number().int(),
    readingsPerHour: z.number().int(),
    byType: z.array(
      z.object({ type: DeviceTypeSchema, count: z.number().int() })
    ),
    activity: z.array(z.object({ hour: z.string(), readings: z.number() }))
  })
  .meta({ id: 'Stats' });

export const ErrorSchema = z
  .object({ message: z.string() })
  .meta({ id: 'Error' });

const DeletedSchema = z.object({ id: z.string() });

export type SiteType = z.infer<typeof SiteSchema>;
export type DeviceType = z.infer<typeof DeviceSchema>;
export type DeviceInputType = z.infer<typeof DeviceInputSchema>;
export type DeviceKindType = z.infer<typeof DeviceTypeSchema>;
export type DeviceStatusType = z.infer<typeof DeviceStatusSchema>;
export type DevicePageType = z.infer<typeof DevicePageSchema>;
export type ReadingsType = z.infer<typeof ReadingsSchema>;
export type AlertType = z.infer<typeof AlertSchema>;
export type AlertStatusType = z.infer<typeof AlertStatusSchema>;
export type SeverityType = z.infer<typeof SeveritySchema>;
export type AlertRuleType = z.infer<typeof AlertRuleSchema>;
export type AlertRuleInputType = z.infer<typeof AlertRuleInputSchema>;
export type AutomationType = z.infer<typeof AutomationSchema>;
export type AutomationInputType = z.infer<typeof AutomationInputSchema>;
export type StatsType = z.infer<typeof StatsSchema>;

export interface IRoute {
  method: 'get' | 'post' | 'put' | 'delete';
  path: string;
  summary: string;
  query?: z.ZodObject;
  body?: z.ZodType;
  response: z.ZodType;
}

export const routes = {
  getStats: {
    method: 'get',
    path: '/stats',
    summary: 'Fleet overview',
    response: StatsSchema
  },
  listSites: {
    method: 'get',
    path: '/sites',
    summary: 'List the sites',
    response: z.array(SiteSchema)
  },
  listDevices: {
    method: 'get',
    path: '/devices',
    summary: 'List the devices, a page at a time',
    query: z.object({
      search: z.string().optional(),
      siteId: z.string().optional(),
      status: DeviceStatusSchema.optional(),
      offset: z.coerce.number().int().min(0).optional(),
      limit: z.coerce.number().int().min(1).max(100).optional()
    }),
    response: DevicePageSchema
  },
  getDevice: {
    method: 'get',
    path: '/devices/:id',
    summary: 'Get a device',
    response: DeviceSchema
  },
  createDevice: {
    method: 'post',
    path: '/devices',
    summary: 'Register a device',
    body: DeviceInputSchema,
    response: DeviceSchema
  },
  updateDevice: {
    method: 'put',
    path: '/devices/:id',
    summary: 'Update a device',
    body: DeviceInputSchema,
    response: DeviceSchema
  },
  deleteDevice: {
    method: 'delete',
    path: '/devices/:id',
    summary: 'Delete a device',
    response: DeletedSchema
  },
  restartDevice: {
    method: 'post',
    path: '/devices/:id/restart',
    summary: 'Restart a device',
    response: DeviceSchema
  },
  getReadings: {
    method: 'get',
    path: '/devices/:id/readings',
    summary: "A device's readings over a range",
    query: z.object({ range: z.enum(['24h', '7d']).optional() }),
    response: ReadingsSchema
  },
  listAlerts: {
    method: 'get',
    path: '/alerts',
    summary: 'List the alerts, newest first',
    query: z.object({
      status: AlertStatusSchema.optional(),
      deviceId: z.string().optional()
    }),
    response: z.array(AlertSchema)
  },
  acknowledgeAlert: {
    method: 'post',
    path: '/alerts/:id/acknowledge',
    summary: 'Acknowledge an alert',
    response: AlertSchema
  },
  resolveAlert: {
    method: 'post',
    path: '/alerts/:id/resolve',
    summary: 'Resolve an alert',
    response: AlertSchema
  },
  listAlertRules: {
    method: 'get',
    path: '/alert-rules',
    summary: 'List the alert rules',
    response: z.array(AlertRuleSchema)
  },
  createAlertRule: {
    method: 'post',
    path: '/alert-rules',
    summary: 'Create an alert rule',
    body: AlertRuleInputSchema,
    response: AlertRuleSchema
  },
  updateAlertRule: {
    method: 'put',
    path: '/alert-rules/:id',
    summary: 'Update an alert rule',
    body: AlertRuleInputSchema,
    response: AlertRuleSchema
  },
  listAutomations: {
    method: 'get',
    path: '/automations',
    summary: 'List the automations',
    response: z.array(AutomationSchema)
  },
  getAutomation: {
    method: 'get',
    path: '/automations/:id',
    summary: 'Get an automation',
    response: AutomationSchema
  },
  updateAutomation: {
    method: 'put',
    path: '/automations/:id',
    summary: 'Save an automation',
    body: AutomationInputSchema,
    response: AutomationSchema
  },
  deleteAutomation: {
    method: 'delete',
    path: '/automations/:id',
    summary: 'Delete an automation',
    response: DeletedSchema
  },
  runAutomation: {
    method: 'post',
    path: '/automations/:id/run',
    summary: 'Run an automation once',
    response: AutomationRunSchema
  }
} as const satisfies Record<string, IRoute>;

export type RoutesType = typeof routes;
export type RouteNameType = keyof RoutesType;

// What a call to a route takes: the `:id` of its path, its query and its body.
export type RouteInputType<TRoute extends IRoute> =
  (TRoute['path'] extends `${string}:id${string}` ? { id: string } : unknown) &
    (TRoute['query'] extends z.ZodType
      ? { query?: z.input<TRoute['query']> }
      : unknown) &
    (TRoute['body'] extends z.ZodType
      ? { body: z.input<TRoute['body']> }
      : unknown);

export type RouteOutputType<TRoute extends IRoute> = z.output<
  TRoute['response']
>;

export const apiBase = '/api';
