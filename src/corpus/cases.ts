import type { FinCase } from "../types.ts";

export const initialCases: FinCase[] = [
  {
    id: "kyc-priya-sharma",
    sector: "Banking",
    workflow: "Retail Onboarding & AML-KYC Verification",
    party: "Priya Sharma",
    reference: "KYC-2026-8812",
    summary: "Customer identity verified against National UID Registry. Proof of address (electricity bill) shows street naming alias variation ('Sunshine Apts' vs 'Sunshine Heights').",
    recommendation: "Query",
    similarCaseCount: 42,
    benchmarkRate: "94.2% approved after alias confirmation",
    documents: [
      {
        id: "doc-aadhaar",
        title: "DigiLocker Identity Card (UIDAI)",
        kind: "Identity",
        date: "2026-09-12",
        referenceNumber: "AADH-XXXX-XXXX-9021",
        body: `REPUBLIC OF INDIA - UNIQUE IDENTIFICATION AUTHORITY OF INDIA
AADHAAR SECURE DIGITAL VERIFICATION RECORD

Holder Name: Priya Sharma
Father's Name: Ramesh Sharma
Date of Birth: 14/08/1992
Gender: Female
Address of Record:
Flat 402, Sunshine Heights, 12th Cross, MG Road,
Bengaluru, Karnataka - 560001
Biometric Status: Verified (Level 2 match)
Mobile Linking: +91 98450 XXXXX (Active)`,
      },
      {
        id: "doc-utility",
        title: "BESCOM Electricity Utility Bill",
        kind: "Proof of Address",
        date: "2026-09-28",
        referenceNumber: "BESCOM-BLR-0092182",
        body: `BANGALORE ELECTRICITY SUPPLY COMPANY LIMITED (BESCOM)
MONTHLY CONSUMPTION INVOICE

Consumer Name: Priya S. Sharma
Account ID: 0881920042
Connection Category: LT-2(a) Domestic
Service Address:
Flat 402, Sunshine Apts, Mahatma Gandhi Road,
Bangalore, Karnataka 560001
Billing Month: September 2026
Payment Status: Paid online on 02/10/2026
Due Date: 15/10/2026`,
      },
    ],
    rules: [
      {
        id: "AML-KYC-01",
        name: "Official Identity Name Concordance",
        text: "The applicant's full legal name on the identity credential must correspond with the banking application form without discrepancy.",
        category: "Identity Verification",
        regulatorySource: "RBI Master Direction - KYC Direction, Section 16",
      },
      {
        id: "AML-KYC-04",
        name: "Proof of Address (PoA) Consistency & Abbreviation Rule",
        text: "The address listed on the secondary verification document must match the primary identity document. Known municipality abbreviations (e.g., MG Road / Mahatma Gandhi Road, BLR / Bengaluru) are permissible; building designation variations ('Sunshine Apts' vs 'Sunshine Heights') require customer self-declaration or confirmation.",
        category: "Address Verification",
        regulatorySource: "PMLA Rule 9(1) - Prevention of Money Laundering Regulations",
      },
    ],
    checks: [
      {
        ruleId: "AML-KYC-01",
        title: "Primary Legal Name Concordance",
        quote: "Holder Name: Priya Sharma",
        pass: true,
        plain: "Applicant name aligns with UIDAI primary database and banking account master record.",
        severity: "low",
      },
      {
        ruleId: "AML-KYC-04",
        title: "Building & Premise Designation Discrepancy",
        quote: "Flat 402, Sunshine Apts, Mahatma Gandhi Road",
        pass: false,
        plain: "Utility bill cites 'Sunshine Apts' whereas UIDAI record registers 'Sunshine Heights'. While street and PIN 560001 match, building name requires 1-click confirmation note.",
        severity: "medium",
      },
    ],
  },
  {
    id: "inv-204-po-118",
    sector: "Financial services",
    workflow: "Accounts Payable 3-Way Match & Reconciliation",
    party: "Apex Precision Components Ltd",
    reference: "INV-204 / PO-118",
    summary: "Commercial invoice billed 550 units at 10% tax vs approved PO for 500 units at 8.5% tax. Goods Receipt Note confirms 50 units returned upon inspection.",
    recommendation: "Escalate",
    similarCaseCount: 19,
    benchmarkRate: "88% credited via vendor revised debit note",
    documents: [
      {
        id: "doc-po",
        title: "Approved Purchase Order PO-118",
        kind: "Purchase Order",
        date: "2026-09-15",
        referenceNumber: "PO-2026-00118",
        body: `CORP PROCURE INTERNATIONAL INC.
OFFICIAL PURCHASE ORDER - AUTHORIZED

Vendor: Apex Precision Components Ltd (Vendor ID: V-8891)
Delivery Destination: Warehouse Bay 4, Industrial Corridor, Pune

Line Items:
Item 01: CNC Machined Precision Flanges (SKU: FLG-902-ST)
Quantity Ordered: 500 units
Agreed Unit Price: $142.00 / unit
Net Purchase Value: $71,000.00
Tax Rate: 8.50% Sales & Goods Tax ($6,035.00)
Total Authorized Liability: $77,035.00
Payment Terms: Net 45 Days post acceptance.`,
      },
      {
        id: "doc-grn",
        title: "Goods Receipt & Quality Inspection Note GRN-991",
        kind: "Goods Receipt",
        date: "2026-09-29",
        referenceNumber: "GRN-2026-991",
        body: `CORP LOGISTICS & QA INBOUND REPORT
Shipment Received From: Apex Precision Components Ltd
Consignment Note: CN-440192

Physical Receiving Tally:
550 units arrived at loading bay.
Quality Inspection Findings:
- 500 units met ISO-9001 dimensional tolerances.
- 50 units failed metallurgical hardness scan (Batch rejection).
Accepted Quantity Cleared: 500 units
Rejected Quantity Returned to Vendor: 50 units
Inspector Signature: Mark Dawson, Chief QA`,
      },
      {
        id: "doc-inv",
        title: "Vendor Commercial Tax Invoice INV-204",
        kind: "Invoice",
        date: "2026-10-02",
        referenceNumber: "INV-2026-0204",
        body: `APEX PRECISION COMPONENTS LTD
COMMERCIAL TAX INVOICE

Billed To: Corp Procure International Inc.
Reference PO: PO-118

Description:
CNC Machined Precision Flanges (SKU: FLG-902-ST)
Billed Quantity: 550 units
Unit Price: $142.00
Subtotal: $78,100.00
Applicable Tax Rate: 10.00% ($7,810.00)
Expedited Delivery Surcharge: $500.00
Grand Total Due: $86,410.00
Payment Bank: JPMorgan Chase Wire Swift: CHASUS33`,
      },
    ],
    rules: [
      {
        id: "AP-MATCH-01",
        name: "3-Way Quantity Variance Prohibition",
        text: "Invoiced quantity may never exceed accepted quantity documented on Goods Receipt Note. Any excess units billed must be halted and disputed.",
        category: "Trade Payable Governance",
        regulatorySource: "Corporate Internal Audit Standard AP-03",
      },
      {
        id: "AP-MATCH-02",
        name: "Contractual Price & Tax Schedule Integrity",
        text: "Unit prices, surcharges, and tax rates billed by vendor must exactly mirror approved Purchase Order terms. Unauthorized surcharges are automatically rejected.",
        category: "Commercial Contract Compliance",
        regulatorySource: "Sarbanes-Oxley (SOX) Section 404 Control Framework",
      },
    ],
    checks: [
      {
        ruleId: "AP-MATCH-01",
        title: "Invoiced Quantity Over-Billing",
        quote: "Billed Quantity: 550 units",
        pass: false,
        plain: "Vendor billed for 550 units ($78,100) instead of the 500 units accepted under GRN-991. 50 rejected units were billed.",
        severity: "high",
      },
      {
        ruleId: "AP-MATCH-02",
        title: "Tax Rate & Freight Surcharge Variance",
        quote: "Applicable Tax Rate: 10.00% ($7,810.00)",
        pass: false,
        plain: "Billed at 10.0% tax ($7,810) vs authorized 8.5% ($6,035) in PO-118, plus unapproved $500 surcharge. Over-billing variance of $9,375.",
        severity: "high",
      },
    ],
  },
  {
    id: "clm-rohan-mehta",
    sector: "Insurance",
    workflow: "Health Inpatient Reimbursement Claim Adjudication",
    party: "Rohan Mehta",
    reference: "CLM-H-90421",
    summary: "Reimbursement claim of $11,950 for acute cholecystectomy. Policy in continuous effect for 32 months, exceeding mandatory 24-month specified surgery waiting period.",
    recommendation: "Approve",
    similarCaseCount: 68,
    benchmarkRate: "97.1% straight-through claims settlement",
    documents: [
      {
        id: "doc-policy",
        title: "CareShield Comprehensive Health Policy POL-4491",
        kind: "Policy Schedule",
        date: "2024-01-15",
        referenceNumber: "POL-CS-449102",
        body: `CARESHIELD GENERAL INSURANCE CO.
POLICY SCHEDULE & BENEFIT TABLE

Primary Insured: Rohan Mehta (Age at Inception: 32)
Policy Inception Date: 15/01/2024
Current Coverage Period: 15/01/2026 to 14/01/2027 (Year 3 Renewal)
Sum Insured: $25,000.00 (No Claim Bonus Accumulated: $5,000.00)
Room Rent Category: Single Private Room up to $800/day
Waiting Periods:
- Initial 30-Day Illness Waiting Period: COMPLETED (Jan 2024)
- Specified Surgeries (including Cholecystectomy / Gallbladder, Hernia, Cataract): 24 Months Continuous Coverage.`,
      },
      {
        id: "doc-discharge",
        title: "CarePulse Multispecialty Hospital Discharge Summary",
        kind: "Hospital Discharge",
        date: "2026-10-06",
        referenceNumber: "CPH-DIS-88192",
        body: `CAREPULSE MULTISPECIALTY MEDICAL CENTER
DEPARTMENT OF GENERAL & LAPAROSCOPIC SURGERY

Patient Name: Rohan Mehta
Age/Gender: 34 Y / Male
Admission Date & Time: 02/10/2026, 08:30 AM
Discharge Date & Time: 06/10/2026, 11:00 AM (Length of Stay: 4 Days)
Diagnosis: Acute Calculous Cholecystitis with Biliary Colic
Procedure: Laparoscopic Cholecystectomy performed under GA on 03/10/2026 by Dr. A. Kulkarni (MS, FRCS)
Clinical Notes: Acute onset of right upper quadrant pain 48 hours prior to admission. Ultrasound confirmed multiple gallstones. Histopathology benign. Uneventful recovery.`,
      },
      {
        id: "doc-hospital-bill",
        title: "Consolidated Final Hospitalization Bill",
        kind: "Upload",
        date: "2026-10-06",
        referenceNumber: "CPH-INV-2026-5510",
        body: `CAREPULSE MULTISPECIALTY MEDICAL CENTER - INVOICE
Patient: Rohan Mehta | IPD No: 99420

Itemized Billing Breakdown:
1. Room Rent (Single Deluxe @ $700 x 4 days): $2,800.00
2. Operation Theatre & Anesthesia Charges: $4,500.00
3. Surgeon & Consultation Professional Fees: $3,200.00
4. Pharmacy, Surgical Consumables & Pathology: $1,450.00
Gross Bill Amount: $11,950.00
Advance Deposit Paid: $1,000.00
Net Amount Claimed for Reimbursement: $10,950.00`,
      },
    ],
    rules: [
      {
        id: "INS-HEALTH-01",
        name: "Policy Active & Coverage Period Validity",
        text: "The medical admission date must fall strictly within the active inception and expiration dates of the insured policy.",
        category: "Policy Eligibility",
        regulatorySource: "IRDAI Health Insurance Regulations - Chapter IV",
      },
      {
        id: "INS-HEALTH-08",
        name: "Specified Surgery 24-Month Waiting Period Rule",
        text: "Claims for specified surgical interventions (specifically including Cholecystectomy) require a minimum continuous active coverage period of 24 months from original inception date.",
        category: "Exclusion & Waiting Period Audit",
        regulatorySource: "CareShield Master Policy Term Condition 4.2",
      },
      {
        id: "INS-HEALTH-12",
        name: "Room Rent & Professional Fee Capping",
        text: "Daily room nursing charges must not breach the contractual daily room entitlement ($800/day for Single Private Room).",
        category: "Billing Admissibility",
        regulatorySource: "Standard Claims Sub-limit Protocol",
      },
    ],
    checks: [
      {
        ruleId: "INS-HEALTH-01",
        title: "Active Coverage on Admission Date",
        quote: "Admission Date & Time: 02/10/2026, 08:30 AM",
        pass: true,
        plain: "Admission on 02/10/2026 is fully covered under Year 3 active renewal period (15/01/2026 to 14/01/2027).",
        severity: "low",
      },
      {
        ruleId: "INS-HEALTH-08",
        title: "Cholecystectomy Waiting Period Compliance",
        quote: "Procedure: Laparoscopic Cholecystectomy performed under GA on 03/10/2026",
        pass: true,
        plain: "From original inception on 15/01/2024 to surgery on 03/10/2026 is 32.5 continuous months, comfortably exceeding the 24-month waiting requirement.",
        severity: "low",
      },
      {
        ruleId: "INS-HEALTH-12",
        title: "Daily Room Rent Cap Adherence",
        quote: "Room Rent (Single Deluxe @ $700 x 4 days): $2,800.00",
        pass: true,
        plain: "Billed room rent of $700/day is below the policy cap of $800/day. No proportionate deduction applicable.",
        severity: "low",
      },
    ],
  },
  {
    id: "lc-aura-logistics",
    sector: "Cross-cutting",
    workflow: "Letter of Credit (LC) Documentary Examination (UCP 600)",
    party: "Aura Global Logistics & SilkRoute Commodities",
    reference: "LC-EXP-7721",
    summary: "Ocean Bill of Lading shows on-board loading date of 02 October 2026, breaching latest shipment date of 30 September 2026 specified in Irrevocable LC.",
    recommendation: "Escalate",
    similarCaseCount: 15,
    benchmarkRate: "Discrepancy notice issued within 5 banking days",
    documents: [
      {
        id: "doc-lc",
        title: "Irrevocable Documentary Credit LC-7721 (MT700)",
        kind: "Packet",
        date: "2026-08-20",
        referenceNumber: "LC-MT700-007721",
        body: `SWIFT MESSAGE MT700 - ISSUE OF A DOCUMENTARY CREDIT
Issuing Bank: Standard Chartered Bank, Singapore
Applicant: SilkRoute Commodities Pte Ltd
Beneficiary: Aura Global Logistics FZE, Dubai

Field 31D: Date of Expiry: 15 October 2026 at bank counters
Field 44C: Latest Date of Shipment: 30 September 2026
Field 44E: Port of Loading: Nhava Sheva (JNPT), India
Field 44F: Port of Discharge: Rotterdam, Netherlands
Field 43P: Partial Shipments: Prohibited
Field 46A: Documents Required: Full set 3/3 clean on board ocean bills of lading.`,
      },
      {
        id: "doc-bl",
        title: "Ocean Bill of Lading BL-JNPT-9011",
        kind: "Bill of Lading",
        date: "2026-10-02",
        referenceNumber: "BL-MAERSK-901128",
        body: `MAERSK LINE - OCEAN BILL OF LADING (NEGOTIABLE)
Vessel: MV Horizon Pioneer / Voyage: 2610-W
Shipper: Aura Global Logistics FZE
Consignee: To Order of Standard Chartered Bank Singapore

Port of Loading: Nhava Sheva, India
Port of Discharge: Rotterdam, Netherlands
Cargo Description: 40 x 40ft High Cube Containers - Grade A Roasted Arabica Coffee Beans
Gross Weight: 840,000 KGS
SHIPPED ON BOARD STAMP:
"Cargo loaded clean on board vessel MV Horizon Pioneer on 02 October 2026"
Signed: Master / Carrier Authorized Agent`,
      },
    ],
    rules: [
      {
        id: "UCP-600-ART-14",
        name: "Standard for Examination of Documents",
        text: "Documents presented must not be conflicting with one another or the credit terms. The date of shipment must not exceed the latest date for shipment stipulated in the credit.",
        category: "International Trade Finance",
        regulatorySource: "ICC Uniform Customs and Practice for Documentary Credits (UCP 600) Art 14",
      },
      {
        id: "UCP-600-ART-16",
        name: "Discrepant Documents & Refusal Notice",
        text: "If the nominated or issuing bank determines documents are discrepant, it may refuse to honour or negotiate, notifying the presenter without delay.",
        category: "Documentary Dispute & Remediation",
        regulatorySource: "ICC UCP 600 Art 16",
      },
    ],
    checks: [
      {
        ruleId: "UCP-600-ART-14",
        title: "Late Shipment Date Discrepancy",
        quote: "Cargo loaded clean on board vessel MV Horizon Pioneer on 02 October 2026",
        pass: false,
        plain: "Bill of Lading indicates shipment on 02/10/2026, which is 2 days after the LC latest shipment date of 30/09/2026. Material documentary discrepancy under UCP 600.",
        severity: "high",
      },
    ],
  },
  {
    id: "loan-zenith-agro",
    sector: "Banking",
    workflow: "Commercial SME Term Loan Underwriting",
    party: "Zenith Agro Tech Pvt Ltd",
    reference: "LOAN-SME-3301",
    summary: "Term loan request of $450,000 for cold storage expansion. DSCR stands at 1.48x (exceeding 1.30x threshold), but GST return revenue shows 18% variance against audited P&L.",
    recommendation: "Query",
    similarCaseCount: 31,
    benchmarkRate: "82% cleared upon auditor reconciliation memo",
    documents: [
      {
        id: "doc-fin-stmt",
        title: "Audited Financial Statements FY 2025-26",
        kind: "Financial Statement",
        date: "2026-08-30",
        referenceNumber: "AUD-FY26-ZENITH",
        body: `ZENITH AGRO TECH PVT LTD - AUDITED PROFIT & LOSS ACCOUNT
Statutory Auditor: K.R. Associates Chartered Accountants

Gross Operating Revenue: $3,200,000.00
EBITDA: $540,000.00
Annual Existing Debt Service: $180,000.00
Projected Debt Service (including new loan): $365,000.00
Calculated Debt Service Coverage Ratio (DSCR): 1.48x (Benchmark minimum: 1.30x)
Current Ratio: 1.62x`,
      },
      {
        id: "doc-gst",
        title: "GST-3B Annual Tax Portal Summary (GSTN)",
        kind: "Upload",
        date: "2026-09-15",
        referenceNumber: "GSTN-29AABCG0192Q1Z9",
        body: `GOODS AND SERVICES TAX NETWORK (GSTN)
ANNUAL TURNOVER RECONCILIATION SUMMARY

Taxpayer Legal Name: Zenith Agro Tech Pvt Ltd
State: Karnataka | Registration: 29AABCG0192Q1Z9
Cumulative Taxable Outward Supplies Billed: $2,624,000.00
Integrated & Central GST Paid: $472,320.00
Filing Compliance Track Record: 100% on-time filings.`,
      },
    ],
    rules: [
      {
        id: "CREDIT-SME-02",
        name: "Debt Service Coverage Ratio (DSCR) Benchmark",
        text: "The borrower's audited historical DSCR must not fall below 1.30x to ensure adequate cash flow cushion against interest rate volatility.",
        category: "Commercial Credit Policy",
        regulatorySource: "Bank Master SME Credit Policy - Section 8",
      },
      {
        id: "CREDIT-SME-07",
        name: "Tax Return vs Financial Statement Turnover Variance",
        text: "Variance between GSTN outward supplies and Audited P&L revenue must not exceed 10%. Higher variances require a formal CA Reconciliation Statement (Form GSTR-9C).",
        category: "Revenue Verification",
        regulatorySource: "Prudential Risk Guidelines on Off-Balance-Sheet & Unreconciled Turnover",
      },
    ],
    checks: [
      {
        ruleId: "CREDIT-SME-02",
        title: "DSCR Capacity Clearance",
        quote: "Calculated Debt Service Coverage Ratio (DSCR): 1.48x",
        pass: true,
        plain: "Audited DSCR of 1.48x comfortably exceeds the mandatory minimum threshold of 1.30x.",
        severity: "low",
      },
      {
        ruleId: "CREDIT-SME-07",
        title: "GSTN Outward Supply Turnover Divergence",
        quote: "Cumulative Taxable Outward Supplies Billed: $2,624,000.00",
        pass: false,
        plain: "GST outward supplies of $2.624M diverge by 18.0% from audited revenue of $3.200M (exceeds 10% tolerance threshold). CA reconciliation explanation required.",
        severity: "medium",
      },
    ],
  },
  {
    id: "mot-vikram-claim",
    sector: "Insurance",
    workflow: "Motor Vehicle Own Damage Collision Assessment",
    party: "Vikram Singhania",
    reference: "MOT-OD-1029",
    summary: "Front bumper and headlight collision claim for $1,850. Independent surveyor inspection confirms damage geometry matches detailed police First Information Report.",
    recommendation: "Approve",
    similarCaseCount: 114,
    benchmarkRate: "99.2% straight-through repair cashless voucher issue",
    documents: [
      {
        id: "doc-surveyor",
        title: "Independent Motor Surveyor Inspection Report",
        kind: "Upload",
        date: "2026-10-10",
        referenceNumber: "SRV-2026-0912",
        body: `LICENSED INSURANCE SURVEYOR & LOSS ASSESSOR REPORT
Surveyor: Rajesh Verma (IRDAI SLA License: 44019)
Vehicle: Hyundai Ioniq 5 Electric (Reg: KA-01-MJ-8822)
Policy: Starlight Comprehensive Motor OD-9921
Loss Date: 08/10/2026

Physical Damage Assessment:
- Front bumper deformation and RHS Matrix LED Headlamp assembly fractured.
- Radiator support frame intact; no chassis intrusion.
- Paint transfer consistent with stationary pillar impact in basement parking lot.
Assessed Repair & Replacement Value: $1,850.00 (Less Compulsory Deductible $100.00 = $1,750.00 Net).`,
      },
    ],
    rules: [
      {
        id: "INS-MOTOR-03",
        name: "Damage Concordance with Incident Narrative",
        text: "The physical damage profile documented by the licensed surveyor must strictly correspond with the insured accident circumstances without pre-existing rust or mismatched impact heights.",
        category: "Fraud Prevention & Loss Assessment",
        regulatorySource: "IRDAI Motor Insurance Claims Manual",
      },
    ],
    checks: [
      {
        ruleId: "INS-MOTOR-03",
        title: "Impact Geometry & Loss Concordance",
        quote: "Paint transfer consistent with stationary pillar impact in basement parking lot",
        pass: true,
        plain: "Surveyor confirmed damage geometry is consistent with parking incident narrative. No signs of staged loss.",
        severity: "low",
      },
    ],
  },
];
