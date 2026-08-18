import test from 'node:test';
import assert from 'node:assert/strict';

process.env.MOCK_LLM = '1';
delete process.env.OPENAI_API_KEY;

import { tasks, taskNames, isMock, usingMock } from '../src/index.ts';
import {
  sampleForm16Text,
  sampleAISText,
  sampleBrokerCsv,
  sampleRecommendInput,
  sampleAskInput,
  samplePreflightInput,
  sampleNotice143_1Text,
  sampleNotice139_9Text,
  sampleFiledReturnSummary,
  sampleClusterInput,
} from '../fixtures/index.ts';
import { countWords } from '../src/schemas/common.ts';

test('mock mode is on when MOCK_LLM=1', () => {
  assert.equal(isMock(), true);
});

test('all nine tasks are registered and shaped alike', () => {
  assert.equal(taskNames.length, 9);
  for (const name of taskNames) {
    const task = tasks[name];
    assert.equal(task.name, name, `${name}: name field matches registry key`);
    assert.equal(typeof task.run, 'function');
    assert.equal(typeof task.runWithMeta, 'function');
    assert.ok(task.description.length > 10, `${name}: has a description`);
    assert.ok(task.systemPrompt.includes('NEVER invent a number'), `${name}: carries the shared preamble`);
  }
});

test('extractForm16 returns the Form 16 fields', async () => {
  const out = await tasks.extractForm16.run({ text: sampleForm16Text });
  assert.equal(out.employer.tan, 'BLRN02931E');
  assert.equal(out.grossSalary.total, 1180000);
  assert.equal(out.standardDeduction, 75000);
  assert.equal(out.regimeIndicated, 'new');
  assert.equal(out.tdsByQuarter.length, 4);
  assert.equal(
    out.tdsByQuarter.reduce((sum, q) => sum + q.taxDeducted, 0),
    out.totalTdsDeducted,
    'quarterly TDS adds up to the printed total',
  );
  assert.deepEqual(
    out.tdsByQuarter.map((q) => q.quarter),
    ['Q1', 'Q2', 'Q3', 'Q4'],
  );
  assert.equal(out.uncertain, false);
});

test('extractAIS returns one entry per reported row', async () => {
  const out = await tasks.extractAIS.run({ text: sampleAISText, pan: 'BQZPN1234F' });
  assert.equal(out.entries.length, 6);
  const dividends = out.entries.filter((e) => e.infoCode === 'SFT-015');
  assert.equal(dividends.length, 3);
  assert.equal(
    dividends.reduce((sum, e) => sum + e.amount, 0),
    1040,
    'the ₹1,040 of dividend from the hook story',
  );
  for (const entry of out.entries) {
    assert.ok(entry.infoCode.length > 0);
    assert.ok(entry.amount >= 0);
  }
  assert.equal(out.flags.vdaTransactions, false);
});

test('extractBrokerStatement separates trades from dividends', async () => {
  const out = await tasks.extractBrokerStatement.run({ text: sampleBrokerCsv, broker: 'Zerodha' });
  assert.equal(out.trades.length, 3);
  assert.equal(out.dividends.length, 3);
  assert.equal(out.trades.filter((t) => t.type === 'mf').length, 1);
  assert.equal(out.trades.filter((t) => t.type === 'equity').length, 2);
  assert.equal(out.totals.dividendAmount, 1040);
  assert.deepEqual(out.unparsedRows, []);
  for (const trade of out.trades) {
    assert.ok(trade.sellValue >= 0 && trade.buyValue >= 0);
    assert.ok(['stcg', 'ltcg', 'unclear'].includes(trade.gainType));
  }
});

test('recommendFormAndRegime echoes the deterministic decision and never invents numbers', async () => {
  const out = await tasks.recommendFormAndRegime.run(sampleRecommendInput);
  assert.equal(out.form.value, sampleRecommendInput.deterministic.chosenForm);
  assert.equal(out.regime.value, sampleRecommendInput.deterministic.recommendedRegime);
  assert.ok(out.form.reasons.length >= 1);
  assert.ok(out.regime.reasons.length >= 1);
  for (const reason of [...out.form.reasons, ...out.regime.reasons]) {
    assert.ok(reason.citation.ruleId.length > 0, 'every reason cites a rule');
    assert.ok(reason.citation.ruleText.length > 10);
    assert.ok(reason.consequence.hi.length > 0, 'reasons are bilingual');
  }
  // The saving quoted in the headline must be the number code handed over.
  assert.ok(
    out.regime.headline.en.includes('15,925') && out.regime.headline.hi.includes('15,925'),
    'the rupee saving is quoted verbatim in both languages',
  );
  assert.ok(out.confidence > 0 && out.confidence <= 1);
});

test('recommendFormAndRegime follows a different deterministic decision', async () => {
  const alternative = {
    ...sampleRecommendInput,
    deterministic: {
      ...sampleRecommendInput.deterministic,
      chosenForm: 'ITR-1' as const,
      recommendedRegime: 'old' as const,
      savingsVsAlternative: 4200,
      requiresForm10IEA: true,
    },
  };
  const out = await tasks.recommendFormAndRegime.run(alternative);
  assert.equal(out.form.value, 'ITR-1');
  assert.equal(out.regime.value, 'old');
  assert.ok(out.regime.deadlineNote.en.includes('10-IEA'), 'Form 10-IEA mentioned only when required');
  assert.deepEqual(out.regime.deductionsLostIfSwitching, []);
});

test('askInPlainLanguage respects the 30/60 word budgets in both languages', async () => {
  for (const language of ['en', 'hi'] as const) {
    const out = await tasks.askInPlainLanguage.run({ ...sampleAskInput, language });
    assert.equal(out.language, language);
    assert.ok(countWords(out.question) <= 30, `${language}: question ≤ 30 words`);
    assert.ok(countWords(out.whyWeAsk) <= 60, `${language}: whyWeAsk ≤ 60 words`);
    assert.ok(countWords(out.example) <= 30, `${language}: example ≤ 30 words`);
    assert.ok(out.question.trim().endsWith('?'), 'the question is a question');
    assert.ok(out.glossary.length >= 1, 'glossary terms are supplied');
    assert.equal(out.prefillHint, sampleAskInput.persona.knownFacts[0]);
  }
});

test('askInPlainLanguage falls back for an unknown field id', async () => {
  const out = await tasks.askInPlainLanguage.run({ fieldId: 'ScheduleFA.foreignAssets', language: 'hi' });
  assert.equal(out.fieldId, 'ScheduleFA.foreignAssets');
  assert.equal(out.language, 'hi');
  assert.ok(countWords(out.question) <= 30);
  assert.equal(out.prefillHint, null);
});

test('askInPlainLanguage returns Devanagari for hi', async () => {
  const out = await tasks.askInPlainLanguage.run({ ...sampleAskInput, language: 'hi' });
  assert.match(out.question, /[ऀ-ॿ]/, 'Hindi output uses Devanagari script');
  assert.match(out.whyWeAsk, /[ऀ-ॿ]/);
});

test('explainPreflight explains a failed check with a remedy and a citation', async () => {
  const out = await tasks.explainPreflight.run(samplePreflightInput);
  assert.equal(out.code, 'AIS_INCOME_NOT_DECLARED');
  assert.equal(out.severity, 'fail');
  assert.equal(out.blocksSubmission, true);
  assert.ok(out.remedy.length >= 1);
  assert.deepEqual(
    out.remedy.map((step) => step.order),
    out.remedy.map((_, index) => index + 1),
    'remedy steps are numbered in order',
  );
  assert.equal(out.citation.ruleId, 'AIS_INCOME_NOT_DECLARED');
  assert.ok(out.whatHappened.en.includes('19,440'), 'quotes the number the engine supplied');
  assert.match(out.whatHappened.hi, /[ऀ-ॿ]/);
});

test('explainPreflight handles a warn-severity and an unknown code', async () => {
  const out = await tasks.explainPreflight.run({
    check: { code: 'SCHEDULE_FA_HINT', severity: 'warn', facts: { flag: 'foreign remittance seen' } },
  });
  assert.equal(out.blocksSubmission, false);
  assert.equal(out.severity, 'warn');
  assert.ok(out.remedy.length >= 1);
  assert.equal(out.citation.ruleId, 'SCHEDULE_FA_HINT');
});

test('readNotice diffs a 143(1) intimation and recommends a remedy', async () => {
  const out = await tasks.readNotice.run({
    noticeText: sampleNotice143_1Text,
    filedReturn: sampleFiledReturnSummary,
  });
  assert.equal(out.type, '143(1)');
  assert.equal(out.din, 'CPC/2627/A1/2610445123');
  assert.equal(out.netOutcome.kind, 'demand');
  assert.equal(out.netOutcome.amount, 6180);
  assert.ok(out.differences.length >= 3);
  for (const row of out.differences) {
    assert.equal(row.delta, row.cpc - row.taxpayer, `${row.item}: delta equals cpc minus taxpayer`);
  }
  assert.equal(out.recommendedAction, 'revised_139_5');
  assert.ok(out.draftedResponse.includes(out.din!), 'the drafted response cites the DIN');
  assert.match(out.summary.hi, /[ऀ-ॿ]/);
});

test('readNotice recognises a 139(9) defective-return notice', async () => {
  const out = await tasks.readNotice.run({
    noticeText: sampleNotice139_9Text,
    filedReturn: sampleFiledReturnSummary,
  });
  assert.equal(out.type, '139(9)');
  assert.equal(out.recommendedAction, 'respond_139_9');
  assert.ok(out.errorCodes.includes('31'));
  assert.equal(out.netOutcome.kind, 'defect');
  assert.ok(out.deadlineWarning.en.includes('15 days'));
});

test('clusterOfficerIssues counts distinct cases, not rows', async () => {
  const out = await tasks.clusterOfficerIssues.run(sampleClusterInput);
  const distinctCases = new Set(sampleClusterInput.checks.map((c) => c.caseId)).size;
  assert.equal(out.totalCases, distinctCases);
  assert.equal(out.totalChecks, sampleClusterInput.checks.length);
  assert.ok(out.issues.length <= sampleClusterInput.topN);
  assert.ok(out.issues.length >= 1);

  for (const [index, issue] of out.issues.entries()) {
    assert.equal(issue.rank, index + 1);
    assert.ok(issue.caseCount >= 1 && issue.caseCount <= distinctCases);
    assert.ok(issue.shareOfCases > 0 && issue.shareOfCases <= 1);
    assert.ok(issue.upstreamFix.suggestion.length > 10, 'each issue proposes an upstream fix');
    assert.ok(countWords(issue.upstreamFix.suggestion) <= 40);
  }
  // Ranked by case count, descending.
  const counts = out.issues.map((i) => i.caseCount);
  assert.deepEqual(counts, [...counts].sort((a, b) => b - a));
  // Both multi-employer codes roll into one systemic issue.
  const multiEmployer = out.issues.find((i) => i.codes.includes('MULTI_EMPLOYER_DOUBLE_STD_DED'));
  assert.ok(multiEmployer);
  assert.ok(multiEmployer.codes.includes('MULTI_EMPLOYER_87A_TWICE'));
  assert.equal(multiEmployer.caseCount, 2, 'C-1006 counted once despite two failed checks');
});

test('translate returns Devanagari and keeps tax terms in English', async () => {
  const out = await tasks.translate.run({ text: 'Standard deduction is allowed only once, not once per employer.' });
  assert.match(out.text, /[ऀ-ॿ]/);
  assert.ok(out.text.includes('(standard deduction)'));
  assert.deepEqual(out.termsKeptInEnglish, ['standard deduction']);
  assert.equal(out.uncertain, false);
});

test('translate admits uncertainty rather than faking a translation', async () => {
  const out = await tasks.translate.run({ text: 'A sentence the mock has never seen about capital gains.' });
  assert.equal(out.uncertain, true);
  assert.ok(out.uncertaintyNotes.length >= 1);
  assert.ok(out.termsKeptInEnglish.includes('capital gains'));
});

test('runWithMeta reports mock metadata without touching the network', async () => {
  const { data, meta } = await tasks.translate.runWithMeta({ text: 'You should file ITR-2.' });
  assert.equal(meta.mocked, true);
  assert.equal(meta.model, null);
  assert.equal(meta.attempts, 0);
  assert.equal(meta.usage, null);
  assert.ok(meta.latencyMs >= 0);
  assert.equal(data.text, 'आपको ITR-2 भरना चाहिए।');
});

test('usingMock forces mock mode even when a key is present', async () => {
  process.env.OPENAI_API_KEY = 'sk-not-a-real-key';
  process.env.MOCK_LLM = '0';
  try {
    assert.equal(isMock(), false);
    const out = await usingMock(() => tasks.translate.run({ text: 'You should file ITR-2.' }));
    assert.equal(out.text, 'आपको ITR-2 भरना चाहिए।');
  } finally {
    delete process.env.OPENAI_API_KEY;
    process.env.MOCK_LLM = '1';
  }
});

test('input validation rejects malformed input before any call', async () => {
  await assert.rejects(() => tasks.extractForm16.run({ text: '' }), /too_small|String must contain/i);
  await assert.rejects(() => tasks.extractAIS.run({}), /Required|invalid_type/i);
  await assert.rejects(
    () => tasks.askInPlainLanguage.run({ fieldId: 'ScheduleOS.dividend', language: 'ta' }),
    /invalid_enum_value|Invalid enum/i,
  );
});

test('every task can be driven through the generic registry', async () => {
  const inputs: Record<string, unknown> = {
    extractForm16: { text: sampleForm16Text },
    extractAIS: { text: sampleAISText },
    extractBrokerStatement: { text: sampleBrokerCsv },
    recommendFormAndRegime: sampleRecommendInput,
    askInPlainLanguage: sampleAskInput,
    explainPreflight: samplePreflightInput,
    readNotice: { noticeText: sampleNotice143_1Text, filedReturn: sampleFiledReturnSummary },
    clusterOfficerIssues: sampleClusterInput,
    translate: { text: 'You should file ITR-2.' },
  };
  for (const name of taskNames) {
    const result = await tasks[name].run(inputs[name]);
    assert.equal(typeof result, 'object', `${name} returned an object`);
    assert.equal(typeof (result as { uncertain: boolean }).uncertain, 'boolean', `${name} exposes uncertain`);
    assert.ok(Array.isArray((result as { uncertaintyNotes: string[] }).uncertaintyNotes), `${name} exposes notes`);
  }
});
