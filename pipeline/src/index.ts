/**
 * @saral/pipeline — every OpenAI-model task the product makes.
 *
 * Nothing here knows about React, Next, or any HTTP framework: import a task,
 * call `run(input)`, get a zod-validated object back. With MOCK_LLM=1 or no
 * OPENAI_API_KEY, every task returns a canned fixture instead of calling out,
 * so the whole product runs offline.
 */

export { extractForm16 } from './tasks/extractForm16.ts';
export { extractAIS } from './tasks/extractAIS.ts';
export { extractBrokerStatement } from './tasks/extractBrokerStatement.ts';
export { recommendFormAndRegime } from './tasks/recommendFormAndRegime.ts';
export { askInPlainLanguage } from './tasks/askInPlainLanguage.ts';
export { explainPreflight } from './tasks/explainPreflight.ts';
export { readNotice } from './tasks/readNotice.ts';
export { clusterOfficerIssues } from './tasks/clusterOfficerIssues.ts';
export { translate } from './tasks/translate.ts';

export {
  DEFAULT_MODEL,
  SHARED_PREAMBLE,
  TaskSchemaError,
  getClient,
  getModel,
  isMock,
  usingMock,
  withMock,
} from './client.ts';
export type { RunOptions, TaskDefinition, TaskMeta, TaskResult } from './client.ts';

export * as schemas from './schemas/index.ts';

import { extractForm16 } from './tasks/extractForm16.ts';
import { extractAIS } from './tasks/extractAIS.ts';
import { extractBrokerStatement } from './tasks/extractBrokerStatement.ts';
import { recommendFormAndRegime } from './tasks/recommendFormAndRegime.ts';
import { askInPlainLanguage } from './tasks/askInPlainLanguage.ts';
import { explainPreflight } from './tasks/explainPreflight.ts';
import { readNotice } from './tasks/readNotice.ts';
import { clusterOfficerIssues } from './tasks/clusterOfficerIssues.ts';
import { translate } from './tasks/translate.ts';

/** Registry — handy for a generic /api/pipeline/[task] route and for tests. */
export const tasks = {
  extractForm16,
  extractAIS,
  extractBrokerStatement,
  recommendFormAndRegime,
  askInPlainLanguage,
  explainPreflight,
  readNotice,
  clusterOfficerIssues,
  translate,
} as const;

export type TaskName = keyof typeof tasks;
export const taskNames = Object.keys(tasks) as TaskName[];
