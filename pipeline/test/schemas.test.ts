import test from 'node:test';
import assert from 'node:assert/strict';

process.env.MOCK_LLM = '1';

import { tasks, taskNames } from '../src/index.ts';
import { strictify, toJsonSchema } from '../src/schemas/common.ts';
import { z } from 'zod';
import {
  extractForm16Fixture,
  extractAISFixture,
  extractBrokerStatementFixture,
  recommendFormAndRegimeFixture,
  askInPlainLanguageFixture,
  explainPreflightFixture,
  readNotice143_1Fixture,
  readNotice139_9Fixture,
  clusterOfficerIssuesFixture,
  translateFixture,
  sampleRecommendInput,
  sampleAskInput,
  samplePreflightInput,
  sampleClusterInput,
} from '../fixtures/index.ts';

/** Walk a JSON schema, calling back on every object node. */
function walk(node: unknown, visit: (obj: Record<string, unknown>) => void): void {
  if (Array.isArray(node)) {
    for (const item of node) walk(item, visit);
    return;
  }
  if (node === null || typeof node !== 'object') return;
  const obj = node as Record<string, unknown>;
  visit(obj);
  for (const value of Object.values(obj)) walk(value, visit);
}

test('every task exposes an OpenAI-compatible strict JSON schema', () => {
  for (const name of taskNames) {
    const schema = tasks[name].jsonSchema;
    assert.equal(schema.type, 'object', `${name}: root is an object`);
    assert.equal(schema.$schema, undefined, `${name}: no $schema key (OpenAI rejects it)`);

    walk(schema, (node) => {
      if (node.type === 'object') {
        assert.equal(node.additionalProperties, false, `${name}: additionalProperties must be false`);
        const properties = Object.keys((node.properties as Record<string, unknown>) ?? {});
        assert.deepEqual(
          [...(node.required as string[])].sort(),
          [...properties].sort(),
          `${name}: strict mode requires every property to be listed in required`,
        );
      }
      // Constraint keywords strict mode rejects must have been stripped.
      for (const banned of ['minLength', 'maxLength', 'pattern', 'minimum', 'maximum', 'minItems', 'format']) {
        assert.equal(node[banned], undefined, `${name}: "${banned}" must not survive into the wire schema`);
      }
    });
  }
});

test('every task schema carries the uncertainty contract', () => {
  for (const name of taskNames) {
    const properties = tasks[name].jsonSchema.properties as Record<string, unknown>;
    assert.ok(properties.uncertain, `${name}: has an "uncertain" field`);
    assert.ok(properties.uncertaintyNotes, `${name}: has "uncertaintyNotes"`);
  }
});

test('strictify inlines constraints and refuses to lose properties', () => {
  const schema = toJsonSchema(
    z.object({
      a: z.string().min(3).max(5),
      b: z.array(z.number()).min(1),
      c: z.object({ d: z.boolean() }),
    }),
    'sample',
  );
  assert.deepEqual((schema.required as string[]).sort(), ['a', 'b', 'c']);
  assert.equal(schema.additionalProperties, false);
  const c = (schema.properties as Record<string, Record<string, unknown>>).c;
  assert.deepEqual(c.required, ['d']);
  assert.equal(c.additionalProperties, false);
  assert.equal((schema.properties as Record<string, Record<string, unknown>>).a.minLength, undefined);
});

test('strictify leaves non-object values alone', () => {
  assert.equal(strictify('hello'), 'hello');
  assert.equal(strictify(42), 42);
  assert.equal(strictify(null), null);
  assert.deepEqual(strictify([1, 2]), [1, 2]);
});

test('all canned fixtures satisfy their output schema', () => {
  const cases: Array<[string, z.ZodTypeAny, unknown]> = [
    ['extractForm16', tasks.extractForm16.outputSchema, extractForm16Fixture],
    ['extractAIS', tasks.extractAIS.outputSchema, extractAISFixture],
    ['extractBrokerStatement', tasks.extractBrokerStatement.outputSchema, extractBrokerStatementFixture],
    [
      'recommendFormAndRegime',
      tasks.recommendFormAndRegime.outputSchema,
      recommendFormAndRegimeFixture(tasks.recommendFormAndRegime.inputSchema.parse(sampleRecommendInput)),
    ],
    [
      'askInPlainLanguage/en',
      tasks.askInPlainLanguage.outputSchema,
      askInPlainLanguageFixture(tasks.askInPlainLanguage.inputSchema.parse(sampleAskInput)),
    ],
    [
      'askInPlainLanguage/hi',
      tasks.askInPlainLanguage.outputSchema,
      askInPlainLanguageFixture(
        tasks.askInPlainLanguage.inputSchema.parse({ ...sampleAskInput, language: 'hi' }),
      ),
    ],
    [
      'explainPreflight',
      tasks.explainPreflight.outputSchema,
      explainPreflightFixture(tasks.explainPreflight.inputSchema.parse(samplePreflightInput)),
    ],
    ['readNotice/143(1)', tasks.readNotice.outputSchema, readNotice143_1Fixture],
    ['readNotice/139(9)', tasks.readNotice.outputSchema, readNotice139_9Fixture],
    [
      'clusterOfficerIssues',
      tasks.clusterOfficerIssues.outputSchema,
      clusterOfficerIssuesFixture(tasks.clusterOfficerIssues.inputSchema.parse(sampleClusterInput)),
    ],
    [
      'translate',
      tasks.translate.outputSchema,
      translateFixture(tasks.translate.inputSchema.parse({ text: 'You should file ITR-2.' })),
    ],
  ];

  for (const [label, schema, fixture] of cases) {
    const result = schema.safeParse(fixture);
    assert.ok(result.success, `${label}: ${result.success ? '' : JSON.stringify(result.error.issues, null, 2)}`);
  }
});

test('every fixture that claims certainty has no uncertainty notes, and vice versa', () => {
  const outputs = [
    extractForm16Fixture,
    extractAISFixture,
    extractBrokerStatementFixture,
    readNotice143_1Fixture,
    readNotice139_9Fixture,
    translateFixture(tasks.translate.inputSchema.parse({ text: 'Never seen this string before.' })),
  ];
  for (const output of outputs) {
    if (output.uncertain) assert.ok(output.uncertaintyNotes.length > 0, 'uncertain fixtures explain why');
    else assert.equal(output.uncertaintyNotes.length, 0, 'certain fixtures carry no notes');
  }
});

test('bilingual fixtures always fill both languages in Devanagari where required', () => {
  const devanagari = /[ऀ-ॿ]/;
  const notice = readNotice143_1Fixture;
  for (const [label, pair] of Object.entries({
    rootCause: notice.rootCause,
    actionRationale: notice.actionRationale,
    summary: notice.summary,
    deadlineWarning: notice.deadlineWarning,
  })) {
    assert.ok(pair.en.trim().length > 0, `${label}.en is filled`);
    assert.match(pair.hi, devanagari, `${label}.hi is Devanagari`);
    assert.doesNotMatch(pair.hi, /^[\x00-\x7F]+$/, `${label}.hi is not plain ASCII transliteration`);
  }
});

test('the shared preamble states every non-negotiable', () => {
  const preamble = tasks.translate.systemPrompt;
  for (const promise of [
    'NEVER invent a number',
    'NEVER compute or re-compute tax',
    'CITE THE RULE',
    'SAY WHEN YOU ARE NOT SURE',
    'HINDI IN DEVANAGARI',
    'SIMPLE WORDS',
  ]) {
    assert.ok(preamble.includes(promise), `preamble states: ${promise}`);
  }
});
