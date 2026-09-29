import { z, ZodError } from 'zod';
import { errorResponse, response } from '../utils/utils';
const confTemplate = z.object({
  path: z.object({ front: z.string(), back: z.optional(z.string()) })
});

const featureConf = z.record(z.string(), confTemplate);
export type Conf = z.infer<typeof featureConf>;

export const validConf = (conf: Conf) => {
  try {
    const res = featureConf.parse(conf);
    return response(res);
  } catch (err) {
    return errorResponse(<ZodError>err);
  }
};
