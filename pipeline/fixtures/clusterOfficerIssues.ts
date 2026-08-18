import type { ClusterInput, ClusterOutput, SystemicIssue } from '../src/schemas/clusterOfficerIssues.ts';

/** How each check code rolls up into a systemic issue, with the upstream fix. */
const ROLLUP: Record<
  string,
  { key: string; title: string; pattern: string; fix: SystemicIssue['upstreamFix'] }
> = {
  AIS_INCOME_NOT_DECLARED: {
    key: 'ais-gap',
    title: 'AIS income left out of the return',
    pattern: 'Small dividend and savings-interest lines sit in AIS but never reach Schedule OS, mostly for first-time filers.',
    fix: {
      suggestion: 'Pre-fill Schedule OS from AIS at import and make the filer confirm rather than type, so omission is impossible.',
      stage: 'import',
      effort: 'medium',
      expectedReduction: 'would clear most AIS-gap cases before pre-flight even runs',
    },
  },
  DIVIDEND_QUARTERLY_MISSING: {
    key: 'ais-gap',
    title: 'AIS income left out of the return',
    pattern: 'Dividend is declared as a lump sum with no quarterly split, so 234C interest cannot be computed.',
    fix: {
      suggestion: 'Carry the credit date from AIS and the broker statement into the quarterly breakup automatically.',
      stage: 'import',
      effort: 'low',
      expectedReduction: 'removes the warning wherever a dated source exists',
    },
  },
  FORM_MISMATCH_CG_ON_ITR1: {
    key: 'wrong-form',
    title: 'Capital gains filed on a form that cannot hold them',
    pattern: 'Filers who sold shares or mutual funds start on ITR-1 and only discover the problem at pre-flight.',
    fix: {
      suggestion: 'Run form selection immediately after the broker statement is imported, before any interview question is asked.',
      stage: 'import',
      effort: 'low',
      expectedReduction: 'converts a late failure into an invisible correct default',
    },
  },
  LTCG_112A_ABOVE_THRESHOLD_ITR1: {
    key: 'wrong-form',
    title: 'Capital gains filed on a form that cannot hold them',
    pattern: '112A gains above ₹1.25 lakh keep landing on ITR-1 because the carve-out is misread as unlimited.',
    fix: {
      suggestion: 'Re-evaluate form selection whenever the 112A total changes, not only at the start of the interview.',
      stage: 'computation',
      effort: 'low',
      expectedReduction: 'catches every case where gains grow past the threshold mid-interview',
    },
  },
  MULTI_EMPLOYER_DOUBLE_STD_DED: {
    key: 'multi-employer',
    title: 'Job switchers double-count standard deduction and rebate',
    pattern: 'Two Form 16s in one year, each with its own standard deduction and sometimes its own 87A rebate.',
    fix: {
      suggestion: 'Aggregate all Form 16s into one salary head at import and apply standard deduction once at the head level.',
      stage: 'import',
      effort: 'medium',
      expectedReduction: 'eliminates both the double deduction and the double rebate',
    },
  },
  MULTI_EMPLOYER_87A_TWICE: {
    key: 'multi-employer',
    title: 'Job switchers double-count standard deduction and rebate',
    pattern: 'Both employers applied the 87A rebate, so tax looked nil until CPC recomputed on the combined salary.',
    fix: {
      suggestion: 'Compute rebate only on aggregated income and warn at import when a second Form 16 arrives.',
      stage: 'computation',
      effort: 'low',
      expectedReduction: 'removes the surprise demand for job switchers',
    },
  },
  REGIME_DEDUCTION_NOT_ALLOWED: {
    key: 'regime-deductions',
    title: 'Old-regime deductions claimed under the new regime',
    pattern: '80C, 80D and HRA carried over from last year while the return itself defaults to the new regime.',
    fix: {
      suggestion: 'Grey out disallowed sections the moment the regime is set, and explain why each one disappeared.',
      stage: 'interview',
      effort: 'low',
      expectedReduction: 'stops the claim being entered at all',
    },
  },
  BANK_NOT_PREVALIDATED: {
    key: 'refund-plumbing',
    title: 'Refunds blocked by unvalidated bank accounts',
    pattern: 'Refund cases reach submission with no pre-validated account, so the refund silently fails afterwards.',
    fix: {
      suggestion: 'Ask for and pre-validate the refund account as soon as the computation shows a refund, not at submission.',
      stage: 'preflight',
      effort: 'low',
      expectedReduction: 'moves the fix weeks earlier for every refund case',
    },
  },
  PAN_AADHAAR_NOT_LINKED: {
    key: 'refund-plumbing',
    title: 'Refunds blocked by unvalidated bank accounts',
    pattern: 'PAN-Aadhaar linkage is unresolved, which stops both pre-validation and refund release.',
    fix: {
      suggestion: 'Check linkage during onboarding and surface the ₹1,000 fee up front instead of at submission.',
      stage: 'import',
      effort: 'low',
      expectedReduction: 'gives filers weeks of notice instead of minutes',
    },
  },
  TDS_CLAIMED_GT_26AS: {
    key: 'tds-mismatch',
    title: 'TDS claimed does not match 26AS',
    pattern: 'TDS is typed from the Form 16 total while 26AS shows a different figure, usually a missing Q4 challan.',
    fix: {
      suggestion: 'Claim TDS strictly from the 26AS import and show the Form 16 figure alongside as a comparison only.',
      stage: 'import',
      effort: 'medium',
      expectedReduction: 'removes the manual entry that causes the mismatch',
    },
  },
  TDS_IN_26AS_NOT_CLAIMED: {
    key: 'tds-mismatch',
    title: 'TDS claimed does not match 26AS',
    pattern: 'Credit sitting in 26AS is never claimed, so filers quietly lose refund they are entitled to.',
    fix: {
      suggestion: 'Auto-claim every 26AS line and let the filer remove one, rather than expecting them to add it.',
      stage: 'import',
      effort: 'low',
      expectedReduction: 'recovers unclaimed credit in every affected case',
    },
  },
  STIPEND_194J_AS_SALARY: {
    key: 'stipend-head',
    title: 'Stipends with 194J TDS declared as salary',
    pattern: 'Interns receive 194J TDS but report the money as salary, so the head and the deductor disagree.',
    fix: {
      suggestion: 'Read the TDS section from AIS and propose the matching head before asking the salary question.',
      stage: 'interview',
      effort: 'medium',
      expectedReduction: 'aligns the head with the deductor for intern personas',
    },
  },
};

export function clusterOfficerIssuesFixture(input: ClusterInput): ClusterOutput {
  const totalCases = new Set(input.checks.map((c) => c.caseId)).size;

  const groups = new Map<
    string,
    { title: string; pattern: string; fix: SystemicIssue['upstreamFix']; codes: Set<string>; cases: Set<string>; personas: Set<string> }
  >();

  for (const check of input.checks) {
    const meta = ROLLUP[check.code];
    const key = meta?.key ?? check.code;
    const existing = groups.get(key) ?? {
      title: meta?.title ?? `Repeated failures of ${check.code}`,
      pattern: meta?.pattern ?? `Cases repeatedly fail ${check.code} with no single obvious cause.`,
      fix: meta?.fix ?? {
        suggestion: `Add an earlier guard for ${check.code} so the problem is caught before submission.`,
        stage: 'preflight' as const,
        effort: 'medium' as const,
        expectedReduction: 'unknown without more cases',
      },
      codes: new Set<string>(),
      cases: new Set<string>(),
      personas: new Set<string>(),
    };
    existing.codes.add(check.code);
    existing.cases.add(check.caseId);
    if (check.personaTag) existing.personas.add(check.personaTag);
    groups.set(key, existing);
  }

  const issues: SystemicIssue[] = [...groups.values()]
    .sort((a, b) => b.cases.size - a.cases.size)
    .slice(0, input.topN)
    .map((group, index) => ({
      rank: index + 1,
      title: group.title,
      codes: [...group.codes].sort(),
      caseCount: group.cases.size,
      shareOfCases: totalCases ? Number((group.cases.size / totalCases).toFixed(3)) : 0,
      affectedPersonas: [...group.personas].sort(),
      pattern: group.pattern,
      upstreamFix: {
        ...group.fix,
        expectedReduction: `${group.fix.expectedReduction} (${group.cases.size} of ${totalCases} cases here)`,
      },
    }));

  const top = issues[0];
  return {
    totalCases,
    totalChecks: input.checks.length,
    issues,
    headline: top
      ? `${top.caseCount} of ${totalCases} cases fail for one reason: ${top.title.toLowerCase()}.`
      : 'No failed checks in this batch.',
    uncertain: false,
    uncertaintyNotes: [],
  };
}
