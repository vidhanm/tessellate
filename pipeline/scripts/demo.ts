/**
 * Offline walk-through of the whole pipeline, in demo-script order.
 *   npm run demo            (mock — no key needed)
 *   OPENAI_API_KEY=... MOCK_LLM=0 npm run demo   (live)
 */
import { tasks, isMock, getModel } from '../src/index.ts';
import {
  sampleForm16Text,
  sampleAISText,
  sampleBrokerCsv,
  sampleRecommendInput,
  sampleAskInput,
  samplePreflightInput,
  sampleNotice143_1Text,
  sampleFiledReturnSummary,
  sampleClusterInput,
} from '../fixtures/index.ts';

const rule = (title: string) => console.log(`\n${'─'.repeat(72)}\n${title}\n${'─'.repeat(72)}`);

console.log(`mode: ${isMock() ? 'MOCK (no network)' : `LIVE (${getModel()})`}`);

rule('1. Import — Form 16');
const form16 = await tasks.extractForm16.run({ text: sampleForm16Text });
console.log(
  `${form16.employer.name} (TAN ${form16.employer.tan}) — gross ₹${form16.grossSalary.total.toLocaleString('en-IN')}, ` +
    `std ded ₹${form16.standardDeduction.toLocaleString('en-IN')}, TDS ₹${form16.totalTdsDeducted.toLocaleString('en-IN')}, regime: ${form16.regimeIndicated}`,
);

rule('2. Import — AIS');
const ais = await tasks.extractAIS.run({ text: sampleAISText });
for (const entry of ais.entries) {
  console.log(`  ${entry.infoCode.padEnd(8)} ${entry.description.padEnd(32)} ₹${entry.amount} (TDS ₹${entry.tds})`);
}

rule('3. Import — broker statement');
const broker = await tasks.extractBrokerStatement.run({ text: sampleBrokerCsv });
console.log(`  ${broker.trades.length} trades, ${broker.dividends.length} dividends, ₹${broker.totals.dividendAmount} dividend total`);

rule('4. Decide — form and regime');
const advice = await tasks.recommendFormAndRegime.run(sampleRecommendInput);
console.log(`  EN: ${advice.form.headline.en} ${advice.regime.headline.en}`);
console.log(`  HI: ${advice.form.headline.hi} ${advice.regime.headline.hi}`);
for (const reason of advice.form.reasons) console.log(`    • ${reason.consequence.en}  [${reason.citation.ruleId}]`);

rule('5. Interview — one question');
const question = await tasks.askInPlainLanguage.run(sampleAskInput);
console.log(`  Q: ${question.question}`);
console.log(`  Why: ${question.whyWeAsk}`);

rule('6. Pre-flight — a failed check');
const preflight = await tasks.explainPreflight.run(samplePreflightInput);
console.log(`  ${preflight.title.en}: ${preflight.whatHappened.en}`);
preflight.remedy.forEach((step) => console.log(`    ${step.order}. ${step.action.en}`));

rule('7. Post-filing — notice reader');
const notice = await tasks.readNotice.run({ noticeText: sampleNotice143_1Text, filedReturn: sampleFiledReturnSummary });
console.log(`  ${notice.type} DIN ${notice.din} → ${notice.recommendedAction}`);
console.table(notice.differences.map(({ item, cpc, taxpayer, delta }) => ({ item, cpc, taxpayer, delta })));

rule('8. Officer console — systemic issues');
const clusters = await tasks.clusterOfficerIssues.run(sampleClusterInput);
console.log(`  ${clusters.headline}`);
for (const issue of clusters.issues) {
  console.log(`  ${issue.rank}. ${issue.title} — ${issue.caseCount}/${clusters.totalCases}: ${issue.upstreamFix.suggestion}`);
}

rule('9. Translate');
const hindi = await tasks.translate.run({ text: 'The new regime saves you more tax.' });
console.log(`  ${hindi.text}`);
