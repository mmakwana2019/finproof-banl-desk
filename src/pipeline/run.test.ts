import test from "node:test";
import assert from "node:assert/strict";
import { verifyCitation, evaluateRecommendation, computeRiskScore, runPacket } from "./run.ts";
import type { FinCase } from "../types.ts";

test("verifyCitation matches exact and whitespace-relaxed text in documents", () => {
  const docs = [
    {
      id: "doc1",
      title: "Utility Bill",
      kind: "Proof of Address" as const,
      body: "Service Address: Flat 402, Sunshine Apts, Mahatma Gandhi Road, Bangalore 560001.",
    },
  ];

  assert.equal(verifyCitation("Flat 402, Sunshine Apts", docs), true);
  assert.equal(verifyCitation("flat 402,  sunshine apts", docs), true);
  assert.equal(verifyCitation("Nonexistent Address 999", docs), false);
});

test("evaluateRecommendation returns Approve when all checks pass", () => {
  const checks = [
    { ruleId: "R1", title: "ID Check", quote: "Priya Sharma", pass: true, plain: "Matches ID" },
    { ruleId: "R2", title: "DOB Check", quote: "14/08/1992", pass: true, plain: "DOB matches" },
  ];
  assert.equal(evaluateRecommendation(checks), "Approve");
});

test("evaluateRecommendation returns Query on single medium/low failure", () => {
  const checks = [
    { ruleId: "R1", title: "ID Check", quote: "Priya Sharma", pass: true, plain: "Matches ID" },
    { ruleId: "R2", title: "Address Check", quote: "Sunshine Apts", pass: false, plain: "Minor variance", severity: "medium" as const },
  ];
  assert.equal(evaluateRecommendation(checks), "Query");
});

test("evaluateRecommendation returns Escalate on high severity failure or multiple failures", () => {
  const checksHigh = [
    { ruleId: "R1", title: "Fraud Watchlist", quote: "Match Found", pass: false, plain: "On sanctions list", severity: "high" as const },
  ];
  assert.equal(evaluateRecommendation(checksHigh), "Escalate");

  const checksMulti = [
    { ruleId: "R1", title: "Qty Check", quote: "550 vs 500", pass: false, plain: "Mismatch" },
    { ruleId: "R2", title: "Tax Rate", quote: "10% vs 8.5%", pass: false, plain: "Mismatch" },
  ];
  assert.equal(evaluateRecommendation(checksMulti), "Escalate");
});

test("computeRiskScore scales proportionally with failures", () => {
  const noFails = [
    { ruleId: "R1", title: "T1", quote: "Q1", pass: true, plain: "P" },
  ];
  const lowScore = computeRiskScore(noFails);
  assert.ok(lowScore <= 10, "Risk score with no fails should be very low");

  const highFails = [
    { ruleId: "R1", title: "T1", quote: "Q1", pass: false, plain: "F", severity: "high" as const },
    { ruleId: "R2", title: "T2", quote: "Q2", pass: false, plain: "F", severity: "high" as const },
  ];
  const highScore = computeRiskScore(highFails);
  assert.ok(highScore >= 80, "Risk score with high severity fails should be high");
});

test("runPacket produces end-to-end result with steps and notes", () => {
  const sampleCase: FinCase = {
    id: "test-case-1",
    sector: "Banking",
    workflow: "Retail KYC",
    party: "Priya Sharma",
    reference: "KYC-2026-8812",
    summary: "KYC verification for retail account",
    recommendation: "Query",
    documents: [
      {
        id: "d1",
        title: "Digilocker Aadhaar",
        kind: "Identity",
        body: "Full Name: Priya Sharma. Permanent Address: Flat 402, Sunshine Heights, MG Road, Bengaluru 560001.",
      },
    ],
    rules: [
      { id: "AML-KYC-01", name: "Name Concordance", text: "Customer name must match identity card." },
    ],
    checks: [
      {
        ruleId: "AML-KYC-01",
        title: "Name Match",
        quote: "Full Name: Priya Sharma",
        pass: true,
        plain: "Name verified accurately.",
      },
    ],
  };

  const result = runPacket(sampleCase);
  assert.equal(result.id, "test-case-1");
  assert.equal(result.recommendation, "Approve");
  assert.equal(result.steps.length, 4);
  assert.ok(result.staffNote.includes("Priya Sharma"));
  assert.ok(result.customerNote.includes("Priya Sharma"));
});

test("all pre-seeded corpus cases have exact valid document citations", async () => {
  const { initialCases } = await import("../corpus/cases.ts");
  for (const kase of initialCases) {
    for (const check of kase.checks) {
      const verified = verifyCitation(check.quote, kase.documents);
      assert.equal(
        verified,
        true,
        `Case "${kase.id}" check "${check.title}" quote "${check.quote}" must exist in documents`,
      );
    }
  }
});
