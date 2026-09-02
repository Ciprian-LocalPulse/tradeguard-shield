# **The TradeGuard Shield Manifesto**

## **Epistemological, Technical, and Ethical Foundations of Explainable Online Financial Risk Intelligence**

**Author:** Ciprian Ștefan Pleșca

**Year:** 2026

**Domain:** Applied cybersecurity, digital consumer protection, responsible software engineering

## **Abstract**

This paper formulates the conceptual foundations of the TradeGuard Shield project — a risk intelligence system for trading websites built as a public API, browser extension, and analysis dashboard. The text is not merely a technical project document, but an attempt to place software architecture decisions within a broader framework: digital trust theory, the ethics of proof in automated scoring systems, and engineering responsibility in an online ecosystem where the speed of creating a fraudulent financial website has long outpaced the speed at which an ordinary user can verify it. The work combines normative argumentation, architectural descriptions, and fifteen design principles illustrated through system diagrams to show how a technical solution can be simultaneously mathematically rigorous and ethically defensible.

## **Table of Contents**

1. Introduction — The Problem of Instant Trust  
2. Context: Why the Internet Favors Fraud, Not Truth  
3. Epistemology of Risk Scoring: From Suspicion to Evidence  
4. System Architecture — A Technical Reading  
5. The Fifteen Principles of the Manifesto, Annotated  
6. The Ethics of Proof: Accusation versus Evidence  
7. Project Governance and Limits of Maintainer Authority  
8. Security as a Structural Property, Not an Afterthought  
9. Privacy by Design: The Necessary Minimum  
10. Reproducibility, Auditability, and Institutional Trust  
11. The Economic Model and the Tension Between Free Access and Sustainability  
12. System Boundaries: What It Cannot and Must Not Claim  
13. Conclusions — What Success Means for This Project

## **1\. Introduction — The Problem of Instant Trust**

A financial trading website can be built, published, and indexed by search engines in less time than it takes an ordinary user to read the terms and conditions of a single legitimate platform. This asymmetry — between the speed of producing the appearance of legitimacy and the speed of verifying actual legitimacy — is the starting point of the entire TradeGuard Shield project.

This is not a new observation. Cybersecurity research has documented the phenomenon of "financial phishing" and fake brokerage platforms exploiting this exact temporal gap for over two decades. What has changed in recent years is not the nature of fraud, but its scale: rapid website generation tools, drag-and-drop templates, automated free TLS certificates, and paid social media ad campaigns have reduced the marginal cost of a financial scam close to zero. In this context, the question posed by this manifesto is not "how do we stop online financial fraud" — a question neither regulation nor technology can answer alone — but a more modest and achievable one: **how do we make risk visible before the user deposits money, verifies their identity, or connects a digital wallet**.

TradeGuard Shield is a response to this narrower question. It is essentially a layer of protective intelligence — not a court, not a regulator, not an investment advisor — that translates public, verifiable signals into explainable risk scores.

### **1.1. Why a Manifesto, and Not Just Technical Documentation**

Most software projects justify architectural decisions through arguments of efficiency, performance, or cost. This manifesto starts from the premise that for a system generating assertions about third-party financial risk — assertions that can influence real economic decisions made by real people — efficiency arguments are insufficient. A normative justification is needed: why is it legitimate for an automated system to issue a verdict, even a partial one, about a website it did not build, does not control, and cannot legally investigate?

The proposed answer here is not definitive, but functional: legitimacy comes not from authority, but from **the transparency of the method**. A system that reveals its sources, documents its weights, and provides an appeal channel makes no claim to infallibility — it merely claims to be better than the actual alternative available to the user, which is, most often, nothing.

### **1.2. Argumentative Structure of the Work**

This paper follows a deliberate progression: from problem description (Section 2), to the epistemological foundations of a possible solution (Section 3), to the concrete technical implementation of these foundations (Section 4), to the normative principles bridging technology and ethics (Sections 5–9), to the institutional mechanisms guaranteeing the long-term coherence of these principles (Sections 10–11), and finally to an honest evaluation of the project's limits (Section 12\) and success criteria (Section 13). This structure reflects a methodological conviction: that a responsible software architecture cannot be evaluated in isolation from its stated purpose, and the stated purpose cannot be evaluated in isolation from the technical means used to pursue it.

## **2\. Context: Why the Internet Favors Fraud, Not Truth**

A structural observation underlies this project: modern internet infrastructure was optimized for publication speed, not for content verification. A domain can be registered, a TLS certificate issued automatically, and a landing page indexed by search engines — all within hours, without any verification of the operator's real identity or the legitimacy of the offer.

This information asymmetry does not affect all actors equally. A legitimate broker regulated by a financial authority such as the FCA, SEC, CySEC, or ASIC must undergo an authorization process taking months or years. A phishing clone of that same broker can go live in days. The result is a market where malicious actors systematically move faster than institutional protection mechanisms.

The average user is left relying on personal judgment during this gap — a judgment shaped by often misleading signals: convincing visual design, fake testimonials, promises of "guaranteed returns," or the simple presence of a functional website. Expecting every user to temporarily become an OSINT analyst, cybersecurity researcher, and financial regulatory legal expert just to decide if a site deserves trust is unrealistic. TradeGuard Shield asserts that this requirement is itself a systemic failure — and that the solution is not "more user education," but **the automated redistribution of verification work** to a system capable of aggregating real-time signals that a human cannot collect manually at scale.

Code snippet  
flowchart LR  
    A\[Fraudulent Site Operator\] \--\>|hours, not months| B\[Registered Domain\]  
    B \--\> C\[Automated TLS Certificate\]  
    C \--\> D\[Indexed Page\]  
    D \--\> E\[Ad/Social Media Traffic\]  
    E \--\> F\[Exposed User\]

    G\[Legitimate Broker\] \--\>|months or years| H\[Regulator Licensing\]  
    H \--\> I\[Official Launch\]

    F \-.-\>|exploited time lag| I

### **2.1. A Typology of User Exposure**

Within this general context, distinguishing several recurring exposure patterns is useful, as each requires a different set of signals for detection. The first pattern is the **brand clone**: a website copying the visual identity and name of a real, existing, authorized broker to borrow credibility without holding authorization. The second is the **newly created platform with disproportionate promises**: a young domain with no history compensating for lack of reputation through promises of guaranteed profit, often coupled with artificial time pressure ("offer valid today only"). The third pattern is the **partially operating platform**, where small deposits are honored to build trust while large withdrawals are blocked through seemingly legitimate administrative mechanisms.

Each pattern leaves distinct traces in public signals: brand clones can be detected via discrepancies between the authorized domain and the checked domain; new platforms via domain age correlated with marketing language; partially operating platforms via patterns in community reports accumulated over time. This observation justifies the architectural decision not to rely on a single dominant signal, but on a weighted aggregation of heterogeneous signals — a decision detailed in the next section.

### **2.2. Resource Asymmetry Between Attacker and User**

An often underappreciated aspect is resource asymmetry: the operator of a fraudulent site can afford to test dozens of design variants, marketing texts, and traffic acquisition strategies, continually optimizing for conversion. The user encounters a single instance of this optimized process once, often during a moment of emotional vulnerability (desire for quick gain, fear of missing out, or pressure from a human handler behind the platform, as seen in "pig butchering" scams). A risk intelligence system cannot counter the emotional component of this asymmetry, but it can reduce the informational component — offering in seconds a portion of the verification the attacker counts on the victim skipping.

## **3\. Epistemology of Risk Scoring: From Suspicion to Evidence**

Any system producing a label such as "low / medium / high risk" faces a fundamental epistemological challenge: how to justify an assertion about a website without access to the operator's actual intent? TradeGuard Shield resolves this through a distinction explicitly formulated in its design principles: **the system evaluates observable signals, not intent**.

The difference is significant. Saying "this site is fraudulent" claims knowledge of the operator's mental state — an assertion no automated system can epistemically justify without judicial process or deep investigation. Saying "this domain age is below the configured trust threshold, does not appear in any recognized financial regulator registry, and uses marketing phrasing historically associated with guaranteed return schemes" is a statement about verifiable facts, each with a source, timestamp, and collection methodology.

This distinction — between **accusation** and **evidence** — is the central epistemological principle of the entire system. The resulting score is not a final value judgment, but a weighted aggregation of signals, each contestable, revisable, and potentially a false positive. Consequently, the architecture includes an appeal and correction mechanism for site operators affected by an unfair score — a false positive is treated not as an acceptable cost of doing business, but as a product defect to be rectified.

Code snippet  
flowchart TD  
    S1\[Domain Age\] \--\> AGG\[Scoring Engine\]  
    S2\[Presence in Threat Lists\] \--\> AGG  
    S3\[Financial Regulator Evidence\] \--\> AGG  
    S4\[TLS Certificate Status\] \--\> AGG  
    S5\[Suspicious Marketing Language\] \--\> AGG  
    S6\[Patterns from Community Reviews/Reports\] \--\> AGG  
    AGG \--\> SCORE\[Score 0-100\]  
    SCORE \--\> LOW\[Green: 61-100 Low Risk\]  
    SCORE \--\> MED\[Yellow: 31-60 Medium Risk\]  
    SCORE \--\> HIGH\[Red: 0-30 High Risk\]  
    LOW \--\> EXPL\[Explanation \+ Reason Code \+ Source\]  
    MED \--\> EXPL  
    HIGH \--\> EXPL  
    EXPL \--\> APPEAL\[Operator Appeal Channel\]

### **3.1. The Aggregation Problem: Why Weight Matters More Than Signal Count**

A common flaw in scoring system design is assuming more signals automatically yield a better score. In reality, adding a signal weakly correlated with real risk can dilute contributions from strongly correlated signals, producing a score less informative than one based on fewer, better-chosen inputs. TradeGuard Shield treats signal weighting as an explicit design decision documented and empirically reviewed over time — not as an arbitrary parameter set once and forgotten.

This stance carries a key methodological consequence: the system cannot claim static, universal accuracy independent of context. Domain age, for example, is a strong signal for brand-new platforms but virtually irrelevant for an old domain compromised via takeover. Explicitly recognizing these conditional limits is part of the project's broader commitment to epistemic honesty — a system acknowledging its boundaries is more trustworthy than one claiming universal accuracy.

### **3.2. False Positives as an Ethical, Not Merely Technical, Issue**

In technical discussions, false positives are often treated as simple performance metrics to be minimized. TradeGuard Shield reformulates this: every false positive represents real potential harm to a legitimate platform losing traffic, revenue, and reputation due to an erroneous automated verdict. This reframing directly impacts architecture: providing an appeal channel is an ethical necessity derived from the harmful nature of an incorrect score.

## **4\. System Architecture — A Technical Reading**

Beyond philosophical arguments, TradeGuard Shield is implemented as a TypeScript monorepo organized across three functional tiers: user-facing applications, shared packages, and background services.

The application tier includes a Fastify API exposing URL checks, report ingestion, feedback, and aggregate metrics; a React dashboard for analysts and operators; and a Manifest V3-compliant browser extension rendering a visual indicator — red, yellow, or green — on visited sites.

The shared package tier includes environment configuration validation, a logging module with automated sensitive data redaction, a security package handling URL safety validation and HTTP security headers, and the scoring engine itself — designed so weights and thresholds remain documented, testable, and third-party auditable.

The background services tier includes a signal collector with abstract interfaces for external data sources and explicit timeout handling, alongside a worker processing asynchronous jobs.

This separation is a structural implementation of a core design principle: **every external signal source must be capable of failing without compromising the system**. If a domain age provider goes offline, that signal becomes "unavailable" in the final report — it must not implicitly translate into a score more or less favorable than the absence of data justifies.

Code snippet  
flowchart TB  
    subgraph Client\["User Surface"\]  
        EXT\[Browser Extension\]  
        DASH\[Analyst Dashboard\]  
    end

    subgraph Core\["Service Core"\]  
        API\[Fastify API\]  
        SCORING\[Shared Scoring Package\]  
        SEC\[Security Package\]  
        LOG\[Logger Package with Redaction\]  
    end

    subgraph Background\["Background Services"\]  
        COLLECTOR\[Signal Collector\]  
        WORKER\[Async Worker\]  
    end

    subgraph External\["External Providers"\]  
        RDAP\[RDAP / WHOIS\]  
        CT\[Certificate Transparency\]  
        SAFE\[Threat Lists\]  
        REG\[Financial Regulator Registries\]  
    end

    EXT \--\> API  
    DASH \--\> API  
    API \--\> SCORING  
    API \--\> SEC  
    API \--\> LOG  
    API \--\> COLLECTOR  
    COLLECTOR \--\> WORKER  
    WORKER \--\> RDAP  
    WORKER \--\> CT  
    WORKER \--\> SAFE  
    WORKER \--\> REG  
    WORKER \--\> SCORING

Operationally, the system is designed for containerization with separate API and dashboard services, deterministic in-memory adapters for dependency-free local development, and a production hardening plan: immutable images, non-root execution, out-of-image secret management, Redis-backed rate limiting, PostgreSQL persistence, distributed tracing, and network isolation between public API, worker, and admin dashboard.

Code snippet  
flowchart LR  
    Commit\[Commit to main\] \--\> CI\[Continuous Integration\]  
    CI \--\> TC\[Type Checking\]  
    CI \--\> TESTS\[Test Suites\]  
    CI \--\> BUILD\[Build Images\]  
    BUILD \--\> SCAN\[Container & Dependency Scanning\]  
    SCAN \--\> REG2\[Publish to Registry\]  
    REG2 \--\> DEPLOY\[Deploy to Runtime Environment\]

### **4.1. Why a Monorepo Over Independent Services**

Selecting a TypeScript monorepo with explicit shared packages for config, logger, security, and scoring prioritizes semantic consistency across components over service isolation. The scoring engine must yield identical results whether invoked from the public API or an async worker recalculation job — a guarantee far easier to maintain when code is shared via a versioned package rather than duplicated across services.

This choice carries trade-offs: monorepos can become complex as team size grows. But for the current phase — a single primary maintainer and a compact product surface — consistency benefits outweigh coordination overhead.

### **4.2. Collector/Worker Separation for Resilience**

Decoupling signal collection from asynchronous worker processing ensures external provider failures (e.g., temporary TLS validation service downtime) are isolated at the collector layer without blocking the scoring pipeline. This translates defensive engineering into concrete architecture: failure becomes an explicitly managed state ("signal unavailable") rather than an unhandled exception propagating error cascades.

### **4.3. API Attack Surface Security**

Beyond SSRF safeguards detailed in Section 8, the API integrates request correlation IDs for traceability, strict payload format validation, and default security headers. These are core architectural components defining the baseline minimum for accepting public traffic.

## **5\. The Fifteen Principles of the Manifesto, Annotated**

The project's original manifesto establishes fifteen core design principles. Each is summarized below with brief commentary explaining its operational necessity:

1. **Evidence over accusation.** The system never labels a site "fraudulent" in absolute terms. It scores observable signals — domain age, threat list presence, regulatory evidence, TLS state, marketing language, review patterns, and community reports. This reflects the real epistemic boundaries of automated systems.  
2. **Explainability over opacity.** A score without rationale is insufficient. Every negative signal requires a source, reason code, and human-readable explanation.  
3. **Security by default.** API, extension, and infrastructure assume potential abuse from inception — incorporating validation, rate limiting, data redaction, and secure defaults.  
4. **Privacy by design.** The system collects the minimal data required for risk scoring, excluding sensitive transactional, identity, or wallet data.  
5. **Least privilege.** The browser extension requests only permissions strictly necessary to inspect current web context and render verdicts.  
6. **Transparent scoring.** Thresholds, weights, reason codes, and constraints must remain documented and testable.  
7. **Reproducible builds.** Build pipelines must be deterministic, automated, and documented so stakeholders can verify delivered artifacts.  
8. **Defensive engineering.** External data provider failures translate into unavailable signals, never unsustained assertions.  
9. **Responsible disclosure.** Security reports are handled privately first, with public disclosure coordinated post-remediation.  
10. **No claims of absolute safety.** Low risk does not mean zero risk. The system provides evidence-backed risk intelligence, not guaranteed safety.  
11. **Data provenance.** Every relevant signal retains its source, timestamp, and verification metadata.  
12. **Auditability.** Scoring, data ingestion, and operational changes must leave sufficient audit trails for maintainer review.  
13. **User protection without surveillance.** Risk reduction must occur without building invasive browsing profiles.  
14. **Open engineering standards.** Interfaces, schemas, workflows, and documentation must remain intelligible to external contributors.  
15. **Production reliability.** System degrades gracefully when providers, caches, or databases become unavailable.

Together, these principles form a mutually reinforcing system of constraints: explainability depends on data provenance; auditability depends on reproducibility; and avoiding false claims of absolute safety depends on epistemic honesty.

## **6\. The Ethics of Proof: Accusation versus Evidence**

Automated reputation systems — whether credit scoring, content moderation, or fraud detection engines — carry a problematic history regarding false positives and lack of recourse. TradeGuard Shield addresses this through two structural commitments.

First is the explicit positioning that the product is "not a court, regulator, broker, or investment advisor," but a protective intelligence layer. This self-limitation serves as legal protection and acknowledges what the system can and cannot know about an operator.

Second is integrating a remediation channel directly into product requirements. Affected platforms can challenge and correct inaccurate evidence. Treating false positives as "acceptable collateral damage" invalidates the principle of evidence over accusation: if a system cannot rectify errors, claims of operating on evidence rather than suspicion become meaningless.

### **6.1. Comparison with Other Online Reputation Models**

Comparing TradeGuard Shield with other digital reputation models highlights its design choices:

* **Static blocklists** provide binary verdicts (blocked/allowed) based on centralized lists. They are simple but rigid: brand-new domains have not yet been reported or listed, leaving users unprotected during peak vulnerability windows. TradeGuard Shield treats threat list presence as **one signal among many**, maintaining utility even without prior reports.  
* **User review platforms** capture social signal but remain vulnerable to coordinated manipulation (fake, bought, or mass-generated reviews). TradeGuard Shield incorporates community reporting patterns as an auxiliary weighted signal correlated with other sources, rather than a single source of truth.  
* **Traditional credit scoring models** combine dozens of empirically weighted signals and incorporate institutionalized dispute mechanisms — a model TradeGuard Shield adapts to online trading risk at a smaller scale.

### **6.2. Role of Community and Crowdsourcing Boundaries**

Direct user reports capture experiences that automated signals (domain age, TLS state, registry listings) cannot detect: unfulfilled verbal promises, pushy tactics by fictitious account managers, or unannounced withdrawal blocks.

However, human-generated reports risk coordinated manipulation (competitors filing false reports) or underreporting (new fraudulent platforms that have not yet accumulated vocal victims). TradeGuard Shield manages this dual risk by weighting community input as an auxiliary signal — never sufficient on its own to trigger a high-risk score — while preserving report provenance to detect coordinated manipulation over time.

## **7\. Project Governance and Limits of Maintainer Authority**

TradeGuard Shield governance is currently centralized: authored and maintained by a single engineer controlling roadmap, releases, security response, repository settings, and merge decisions. This structure suits the MVP phase, featuring deterministic in-memory adapters prior to full production deployment.

Stated decision criteria remain explicit: user protection, evidence quality, privacy by design, explainability, security, maintainability, and responsible disclosure. External contributions are welcomed but do not grant ownership rights, governance control, private access, or special security influence.

## **8\. Security as a Structural Property, Not an Afterthought**

Accepting arbitrary user-submitted URLs for evaluation introduces Server-Side Request Forgery (SSRF) risks. TradeGuard Shield treats this as a core design constraint: local hosts, private formatting, direct IP addresses, and non-HTTP protocols are rejected prior to processing.

In the browser extension, least-privilege rules are enforced: no inline scripts, no secret storage in the extension client, explicit offline/error state handling, and a strict prohibition on injecting unparsed HTML into visited pages.

Secret management rules dictate that API keys, passwords, authentication tokens, private keys, seed phrases, and environment files containing credentials must never be committed to source control.

## **9\. Privacy by Design: The Necessary Minimum**

Privacy by design acts as an active constraint on data collection. While a fraud protection system could theoretically attempt to justify gathering extensive browsing history to "improve detection," TradeGuard Shield explicitly rejects this logic, mandating user protection "without invasive surveillance".

Practically, the browser extension inspects only the active page context rather than constructing persistent browsing histories. The data architecture avoids collecting transaction details, personal identities, or wallet addresses.

## **10\. Reproducibility, Auditability, and Institutional Trust**

A risk scoring system that cannot be audited by third parties is epistemically equivalent to an unsupported assertion of authority. Reproducibility and auditability are therefore core prerequisites for internal coherence.

Deterministic automated builds allow stakeholders to verify delivered artifacts against source code. Enforcing audit trails across scoring logic, data ingestion, and operational changes enables future independent methodological reviews — an explicit pre-production goal.

## **11\. The Economic Model and the Tension Between Free Access and Sustainability**

TradeGuard Shield addresses the structural tension where risk intelligence is most valuable to vulnerable users with limited resources via a tiered service model:

* **Free Tier:** Basic URL checks, rate-limited queries, and the browser extension visual indicator for active sites.  
* **Pro Tier:** Detailed reports, watchlists, automated alerts, historical trend views, and faster refresh intervals.  
* **Enterprise/API Tier:** High throughput, bulk scanning, custom risk policies, and compliance audit exports.

The core indicator (red/yellow/green badge) remains freely accessible to protect users from impulsive deposits on high-risk sites.

## **12\. System Boundaries: What It Cannot and Must Not Claim**

TradeGuard Shield is not a court, financial regulator, broker, or investment advisor. A low-risk score does not guarantee safety — it indicates an absence of known negative risk signals at query time.

Planned, uncompleted production items are documented transparently: production PostgreSQL and Redis adapters, authenticated dashboard, external API provider integrations, full regulatory registry ingestion, and independent scoring methodology review.

## **13\. Conclusions — What Success Means for This Project**

Success for TradeGuard Shield is defined by achievable, verifiable criteria:

* Users see risk indicators before depositing funds.  
* Engineers can audit how scores are calculated.  
* Regulators, researchers, and maintainers can integrate evidence sources.  
* Legitimate platforms can challenge inaccurate data.  
* The system provides immediate utility before machine learning models are added to the scoring engine.

TradeGuard Shield remains "a protective intelligence layer for a web where financial deception moves faster than manual verification" — a disciplined, auditable, and epistemically honest effort to narrow the gap between fraud velocity and consumer protection.

### **13.1. Agenda for Subsequent Research and Development**

Acknowledging the current state of implementation establishes a clear roadmap for subsequent phases:

* **Empirical Validation of Scoring Weights:** Testing against a labeled dataset of verified legitimate and fraudulent platforms, followed by an independent methodological review.  
* **Regulatory Coverage Expansion:** Integrating additional national registries beyond major financial authorities to minimize false negatives in under-covered jurisdictions.  
* **Formal Appeal Mechanism:** Publishing response SLAs and documentation for dispute investigations.  
* **Full Production Observability:** Distributed tracing, alerting, and operational dashboards to audit system behavior in real-time.  
* **External Impact Assessment on False Positives:** Conducting joint reviews with previously impacted platforms to validate ethical commitments in practice.

### **13.2. Final Note on Scale and Modesty**

TradeGuard Shield is an independent, self-funded MVP developed by a single author. The structural asymmetry between fraud velocity and verification speed exceeds what any single project can eliminate.

However, the project demonstrates that small technical systems can be built with epistemic and ethical coherence — documenting limits as rigorously as capabilities while treating fairness toward evaluated platforms as a core engineering requirement. Technical rigor and ethical rigor in judgment systems are not competing goals to be balanced, but a single objective viewed from two distinct perspectives.

*Document drafted based on the architecture, governance principles, and security policies of the TradeGuard Shield project, author Ciprian Ștefan Pleșca, 2026\.*

