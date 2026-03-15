import { useState, useEffect, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   HALO Research Lab — Dashboard v7
   Five views · Persistent storage · Interconnected entities
   Manuscript sections · Work sessions · Cross-referenced variables & coauthors
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── MANUSCRIPT SECTION DEFINITIONS ──────────────────────────────────────────
const MS = [
  { key:"draft", label:"📝 Paper Draft", placeholder:"Paste or write your current working draft here…" },
  { key:"studyDesign", label:"🧪 Study Design", placeholder:"Describe your study design, conditions, sample, procedures…" },
  { key:"contributions", label:"💡 Contributions", placeholder:"List the key theoretical and practical contributions of this paper…" },
  { key:"introHook", label:"🪝 Introduction Hook", placeholder:"Write your opening hook — the first paragraph that grabs the reader…" },
  { key:"litReview", label:"📚 Literature Review", placeholder:"Draft your literature review sections, organized by theme…" },
  { key:"coreTheories", label:"🧬 Core Theories", placeholder:"List and describe the foundational theories this paper builds on…" },
  { key:"seminalRefs", label:"📖 Seminal References", placeholder:"Key citations: Author (Year) — why it matters to this paper…" },
  { key:"journalTargetRefs", label:"🎯 Journal Target References", placeholder:"Recent papers from the target journal that your work speaks to…" },
];

// ─── PROJECT DATA ────────────────────────────────────────────────────────────
const P = [
  {
    id:"aa", name:"Accessorized Anthropomorphism", emoji:"🧸", pillar:"P1",
    journal:"J. of Marketing Mgmt (SI)", deadline:"Apr 20, 2026", deadlineDate:"2026-04-20",
    type:"Consumer culture / empirical (survey experiment)", coauthors:["Jay Black","Joe Hair"],
    grant:"Construct feeder → NSF HCC", tenure:"Satellite + Pilot Data Engine", status:"In Development",
    statusColor:"amber", cluster:"A", funded:"$6K",
    nextActions:[
      "✅ Product images finalized (Birkin + Labubu warm, angular cool, nonhumanlike, control)",
      "Pretest stimuli with n=20–30 for manipulation checks",
      "✅ Qualtrics survey programmed with randomized conditions",
      "✅ IRB approved",
      "Set up Prolific panel recruitment (luxury consumer screener)",
      "Run main study (n=800, 4 conditions) Mar 24–Apr 4",
      "PROCESS Model 7/14 moderated mediation analysis",
      "Draft results + discussion Apr 7–15",
      "Joe Hair review + revisions (3rd coauthor)",
      "Jay Black review + final copyedit Apr 15–18",
    ],
    rqs:[
      "How does consumer-added anthropomorphic accessories on luxury products influence product attachment and WTP?",
      "Does accessory type (warm/cute vs. cool/dominant) moderate attachment pathway strength?",
      "Does product attachment mediate AA → WTP, conditional on accessory type?",
    ],
    hypotheses:[
      "H1a: Anthropomorphic accessories increase product attachment (vs. no accessory)",
      "H1b: Product attachment is positively associated with WTP",
      "H1c: Product attachment mediates AA presence → WTP",
      "H2a: Warm/cute accessories produce stronger attachment than cool/dominant",
      "H2b: Indirect effect of AA on WTP via attachment is stronger for warm/cute types",
    ],
    variables:[
      { name:"AA presence", type:"IV", desc:"No accessory vs. nonhumanlike vs. anthropomorphic (warm/cool)", shared:"humanlike_cues" },
      { name:"Accessory type", type:"IV", desc:"Warm/cute (Labubu-style) vs. cool/dominant (angular)", shared:"cue_calibration" },
      { name:"Product attachment", type:"Mediator", desc:"Hart et al. (2013) & Mugge (2007) adapted", shared:"trust_adjacent" },
      { name:"Willingness to pay", type:"DV", desc:"Yuan & Dennis (2019) WTP scale", shared:"market_outcomes" },
      { name:"Perceived anthropomorphism", type:"Check", desc:"Aggarwal & McGill (2007) 9-pt scale", shared:"anthropomorphism_measure" },
      { name:"Processing fluency", type:"Exploratory", desc:"Ease of processing humanlike schema (Reber et al., 2004)" },
      { name:"Luxury involvement", type:"Control", desc:"Consumer luxury identity and involvement" },
      { name:"Cultural orientation", type:"Exploratory", desc:"Power distance (Souiden et al., 2011)" },
    ],
    timeline:{ start:3, end:4, submit:4 },
    pilotBridge:"Generates pilot data for NSF HCC — establishes humanlike cues causally influence trust-adjacent outcomes. Study 0 in multi-study program where Papers 6 and 9 become funded studies.",
  },
  {
    id:"jm", name:"Humanlike Systems Theory (JM)", emoji:"🔬", pillar:"P1",
    journal:"Journal of Marketing (AMA SI)", deadline:"Aug 1, 2026", deadlineDate:"2026-08-01",
    type:"Conceptual theory with propositions", coauthors:["Solo"],
    grant:"NSF Human-Centered Computing", tenure:"Top-6 Anchor", status:"Drafting",
    statusColor:"amber", cluster:"A",
    nextActions:[
      "Map theoretical landscape: Epley et al. (2007), Mayer et al. (1995), Zucker (1986), Venkatesh et al. (2003), Vargo & Lusch (2004)",
      "Draft dimensional taxonomy: Appearance, Communication, Behavior, Relationality, Agency",
      "Develop 8–12 formal propositions mapped to portfolio studies",
      "Integrate AA pilot data as supporting evidence",
      "Integrate GSOC + healthcare qualitative data as illustrative cases",
      "Align with AMA special issue call",
      "Solicit mentor/collaborator feedback July",
    ],
    rqs:[
      "What constitutes a 'humanlike system' in markets, and what taxonomy best organizes humanlike cues?",
      "Through what mechanisms do different humanlikeness dimensions shape trust formation?",
      "At what calibration thresholds does humanlikeness shift from trust-building to trust-eroding?",
      "What are the downstream market consequences of humanlike system encounters?",
    ],
    variables:[
      { name:"Humanlike system dimensions", type:"Focal", desc:"Appearance, Communication, Behavior, Relationality, Agency — each independently calibratable", shared:"humanlike_cues" },
      { name:"Humanlike cue calibration", type:"Theoretical IV", desc:"Degree, type, and configuration across five dimensions", shared:"cue_calibration" },
      { name:"Trust formation (multi-facet)", type:"DV", desc:"Competence trust (behavioral), benevolence trust (relational), integrity trust (communicative)", shared:"trust" },
      { name:"Calibration threshold", type:"Boundary", desc:"Point where humanlikeness shifts from trust-building to trust-eroding", shared:"cue_calibration" },
      { name:"Meaning-making process", type:"Mediator", desc:"Interpretive process assigning meaning, agency, social category", shared:"meaning_making" },
      { name:"Market outcomes", type:"Distal DV", desc:"Adoption, co-creation, loyalty, delegation, resistance/rejection", shared:"market_outcomes" },
      { name:"Domain context", type:"Moderator", desc:"Consumer, organizational, healthcare, research, carceral" },
    ],
    timeline:{ start:3, end:8, submit:8 },
  },
  {
    id:"jams", name:"JAMS: Agentic Systems Trust", emoji:"🤖", pillar:"P1",
    journal:"JAMS (SI AI-Driven Mktg)", deadline:"Jun–Jul 2026", deadlineDate:"2026-07-01",
    type:"Empirical or conceptual + pilot", coauthors:["TBD"],
    grant:"NSF HCC", tenure:"Top-6 Candidate", status:"Planning",
    statusColor:"purple", cluster:"A", isNew:true,
    nextActions:["Define scope and empirical angle","Identify data source or experimental design","Position relative to JM theory paper"],
    rqs:["How do consumers calibrate trust in AI systems that present as autonomous agents?"],
    variables:[
      { name:"Agentic system cues", type:"IV", desc:"Cues signaling autonomous intention", shared:"humanlike_cues" },
      { name:"Trust calibration", type:"DV", desc:"Consumer trust adjustment process", shared:"trust" },
    ],
    timeline:{ start:4, end:7, submit:7 },
  },
  {
    id:"cue", name:"Cue Calibration Trust Experiments", emoji:"🎛️", pillar:"P1",
    journal:"JMR / JCR", deadline:"Rolling",
    type:"Behavioral experiments (multi-study)", coauthors:["Dr. Howard","Dr. Brouer"],
    grant:"NSF Human-Centered Computing", tenure:"Top-6 Anchor", status:"Design Phase",
    statusColor:"orange", cluster:"A",
    nextActions:[
      "Finalize experimental conditions (name, tone, confidence framing)",
      "Develop measurement battery from HSF dimensions",
      "Design Study 1: cue level main effects",
      "Design Study 2: dimension interactions",
      "Design Study 3: lay theory moderation",
      "Pretest stimuli",
      "GSOC platform build for stimulus delivery",
    ],
    rqs:[
      "How does calibration of humanlike cues in AI tools influence consumer trust, and when does backlash occur?",
      "Do different humanlike cue dimensions contribute independently or interactively to trust?",
      "What role do consumer lay theories about AI play in moderating humanlike cue effects?",
    ],
    variables:[
      { name:"Humanlike cue calibration level", type:"IV", desc:"Low, moderate, high humanlikeness on HSF dimensions", shared:"cue_calibration" },
      { name:"Humanlike cue dimension", type:"IV", desc:"Visual (avatar), linguistic (conversational), behavioral (proactive), emotional (empathic)", shared:"humanlike_cues" },
      { name:"Trust in AI tool", type:"DV", desc:"McKnight et al. (2011) — competence, benevolence, integrity", shared:"trust" },
      { name:"Willingness to delegate", type:"DV", desc:"Behavioral delegation of consequential decisions", shared:"market_outcomes" },
      { name:"Perceived uncanniness", type:"Mediator", desc:"Ho & MacDorman (2017): eeriness, warmth, humanness", shared:"cue_calibration" },
      { name:"AI lay theories", type:"Moderator", desc:"Beliefs about AI agency/consciousness (Waytz et al., 2014)", shared:"ai_attribution" },
      { name:"Task domain", type:"Control", desc:"Financial, health, product recs, creative tasks" },
    ],
    timeline:{ start:7, end:13, submit:13 },
  },
  {
    id:"gsoc", name:"GSOC Humanlike Software Platform", emoji:"🖥️", pillar:"P1",
    journal:"JMR / Organization Science", deadline:"Rolling",
    type:"Experimental platform study", coauthors:["Kelsey","Xinyue Ye"],
    grant:"NSF SoS:DCI", tenure:"Top-6 Anchor Candidate", status:"Platform Build",
    statusColor:"orange", cluster:"A→C",
    nextActions:[
      "GSOC student development and match",
      "Define experimental protocol for platform versions",
      "Behavioral logging specification",
      "Build platform versions varying humanlike design",
      "Preregistration",
    ],
    rqs:[
      "How does humanlike interface design influence researcher trust, delegation, and adoption?",
      "Does perceived platform agency mediate humanlike design → trust?",
      "How do AI experience and disciplinary norms moderate humanlike design effects?",
    ],
    variables:[
      { name:"Humanlike interface design", type:"IV", desc:"Communication style, autonomy cues, social presence indicators", shared:"humanlike_cues" },
      { name:"Researcher trust", type:"DV", desc:"Trust-in-technology adapted; behavioral trust (data sharing, delegation)", shared:"trust" },
      { name:"Delegation behavior", type:"DV", desc:"Task delegation extent (data mgmt, co-author matching, timeline)", shared:"market_outcomes" },
      { name:"Platform adoption", type:"DV", desc:"Usage frequency, feature depth, continued use likelihood", shared:"market_outcomes" },
      { name:"Perceived platform agency", type:"Mediator", desc:"Intentionality, goal-directedness, autonomous action attribution", shared:"ai_attribution" },
      { name:"Prior AI experience", type:"Moderator", desc:"Frequency/depth of AI tool use in research" },
      { name:"Disciplinary norms", type:"Moderator", desc:"Disciplinary openness to computational tools" },
    ],
    timeline:{ start:6, end:13, submit:13 },
  },
  {
    id:"diss", name:"Dissertation: Firm-led vs. User-led Trust", emoji:"🎓", pillar:"P1↔P2",
    journal:"Dissertation / JMR", deadline:"Rolling",
    type:"SEM · Psych ownership → agency → trust", coauthors:["Committee (Howard, Brouer, Jay Black)"],
    grant:"—", tenure:"Top-6 Candidate", status:"Protocol Design",
    statusColor:"orange", cluster:"A↔B",
    nextActions:["Finalize SEM model + experimental conditions","Define psych ownership → agency → trust pathway","Connect to firm-led vs. user-led framework"],
    rqs:["How do firm-led vs. user-led humanlike cue deployments differ in trust effects?"],
    variables:[
      { name:"Cue deployment source", type:"IV", desc:"Firm-led (brand deploys) vs. user-led (consumer adds)", shared:"humanlike_cues" },
      { name:"Psychological ownership", type:"Mediator", desc:"Sense of 'mine' toward the humanlike element", shared:"trust_adjacent" },
      { name:"Agency attribution", type:"Mediator", desc:"Perceived autonomy/intentionality of the entity", shared:"ai_attribution" },
      { name:"Trust", type:"DV", desc:"Competence, benevolence, integrity", shared:"trust" },
    ],
    timeline:{ start:4, end:13, submit:13 },
  },
  {
    id:"qual", name:"Qualitative: AI Agency Attribution", emoji:"🗣️", pillar:"P2",
    journal:"Organization Science / JCR", deadline:"Rolling",
    type:"Qualitative (50 interviews, grounded theory)", coauthors:["Dr. Howard"],
    grant:"NSF Social Behavior", tenure:"Dissertation Component", status:"Protocol Design",
    statusColor:"orange", cluster:"B",
    nextActions:["Finalize interview guide","Recruit pilot participants (5–8)","Define coding framework (open + axial)","IRB submission"],
    rqs:["How do professionals attribute agency, authority, and responsibility in AI-supported decisions?"],
    variables:[
      { name:"AI agency attribution", type:"Emergent", desc:"How workers assign agency/authority to AI tools", shared:"ai_attribution" },
      { name:"Responsibility allocation", type:"Emergent", desc:"Who is accountable when AI assists decisions" },
      { name:"Narrative profiles", type:"Emergent", desc:"Typology of AI role perception narratives" },
    ],
    timeline:{ start:4, end:13, submit:13 },
  },
  {
    id:"asq", name:"Knowledge Infrastructure & Trust (THRIVE)", emoji:"🏛️", pillar:"P2",
    journal:"Administrative Science Quarterly", deadline:"Rolling",
    type:"Organizational theory + field study", coauthors:["ISSR team"],
    grant:"NSF Science of Science", tenure:"Top-6 Anchor", status:"Data Collection",
    statusColor:"amber", cluster:"B",
    nextActions:[
      "Document THRIVE 2.0 AI tool pilots",
      "Collect governance and coordination data",
      "Conduct semi-structured interviews with researchers",
      "Platform governance data extraction",
      "Begin Gioia method coding",
    ],
    rqs:[
      "How does knowledge infrastructure design shape institutional trust among researchers?",
      "What practices enable/constrain collective knowledge production as complexity increases?",
      "How do researchers sense institutional trustworthiness navigating competing logics?",
    ],
    variables:[
      { name:"Knowledge infrastructure design", type:"IV/Context", desc:"THRIVE governance docs, coordination protocols, digital tools", shared:"institutional_design" },
      { name:"Institutional trust", type:"DV", desc:"Interview-derived + survey (Bachmann & Inkpen, 2011)", shared:"trust" },
      { name:"Collective knowledge production", type:"DV", desc:"Publications, datasets, coordination frequency" },
      { name:"Organizational practices", type:"Mediator", desc:"Boundary spanning, sense-giving, gatekeeping (Gioia)", shared:"meaning_making" },
      { name:"Network complexity", type:"Moderator", desc:"Disciplines, institutions, funding streams; network analysis" },
      { name:"Competing institutional logics", type:"Context", desc:"Disciplinary vs. funder vs. platform governance norms" },
    ],
    timeline:{ start:5, end:13, submit:13 },
  },
  {
    id:"prison", name:"Prison Narrative → Marketplace Identity", emoji:"📖", pillar:"P2",
    journal:"JM / JCR", deadline:"Rolling",
    type:"Mixed-methods: intervention + consumer identity", coauthors:["Susan Dewey"],
    grant:"NIJ / NSF Social Behavior", tenure:"Top-6 Candidate", status:"Defining Scope",
    statusColor:"purple", cluster:"B", isReframed:true,
    nextActions:[
      "Schedule working session with Susan Dewey",
      "Define marketplace identity rupture construct",
      "Identify JCR/JM dialogue (Crockett 2017, Bone et al. 2014)",
      "Pick target journal: JCR (marketplace exclusion) or JM (policy link)",
      "Design Study 1 (qualitative) and Study 2 (intervention)",
      "Begin correctional facility approvals",
    ],
    rqs:[
      "How does incarceration disrupt marketplace identity (self-concept, trust, consumption capability)?",
      "Does narrative intervention improve marketplace identity coherence and institutional trust?",
      "Through what mechanisms does narrative repair marketplace identity?",
    ],
    variables:[
      { name:"Narrative intervention", type:"IV", desc:"Structured narrative identity program vs. standard programming", shared:"institutional_design" },
      { name:"Marketplace identity coherence", type:"DV", desc:"Consumer self-concept continuity, marketplace belonging, capability", shared:"meaning_making" },
      { name:"Marketplace trust", type:"DV", desc:"Trust in market institutions — banks, employers, retailers (Tyler, 2006)", shared:"trust" },
      { name:"Consumption reintegration", type:"DV", desc:"Financial access, employment, housing, retail participation", shared:"market_outcomes" },
      { name:"Narrative mechanisms", type:"Mediator", desc:"Redemption sequences, consumer agency themes (McAdams)", shared:"meaning_making" },
      { name:"Stigma / marketplace exclusion", type:"Moderator", desc:"Perceived stigma; criminal record restrictions; credit access" },
    ],
    timeline:{ start:4, end:7, submit:13 },
  },
  {
    id:"retail", name:"Retail Recovery & Community Trust", emoji:"🏪", pillar:"P3",
    journal:"JM / Marketing Science", deadline:"Rolling",
    type:"Experiment + secondary data (2 studies)",
    coauthors:["Richey","Rao","LeMay","Saewert","Alquraishi","Shao","Richardson"],
    grant:"NSF Smart & Connected Communities", tenure:"Top-6 Reserve", status:"Active Development",
    statusColor:"amber", cluster:"B",
    nextActions:[
      "Complete Study 1 vignette design",
      "Secure Dewey platform data access",
      "Finalize Gulf Coast county selection",
      "Merge ISSR resilience data with Dewey retail data",
      "Develop perceived market reliability scale items",
    ],
    rqs:[
      "How does visible retail recovery shape consumer judgments about marketplace dependability?",
      "Does community resilience predict retail recovery pace, moderated by urban/rural context?",
      "Do consumers use retail recovery signals as heuristic cues for broader community resilience?",
    ],
    variables:[
      { name:"Visible retail recovery", type:"IV", desc:"Dewey platform visitation; Dollar General reopening timelines", shared:"institutional_design" },
      { name:"Community resilience capacity", type:"IV", desc:"ISSR resilience index (social capital, governance, infrastructure)" },
      { name:"Perceived market reliability", type:"Med/Mod", desc:"Consumer perception local marketplace will function through disruptions — NEW SCALE", shared:"trust" },
      { name:"Willingness to resume shopping", type:"DV", desc:"Consumer stated intention to return post-disaster", shared:"market_outcomes" },
      { name:"Retail recovery (footfall/spending)", type:"DV", desc:"County-level Dewey platform data" },
      { name:"Urban/rural context", type:"Moderator", desc:"USDA rural-urban continuum codes; retail density" },
      { name:"Disaster severity", type:"Control", desc:"FEMA declarations; property damage; displacement" },
    ],
    timeline:{ start:3, end:13, submit:13 },
  },
  {
    id:"ejm", name:"Human–AI Branding Interaction", emoji:"✨", pillar:"P1↔P2",
    journal:"European J. of Marketing (SI)", deadline:"Sep 8, 2026", deadlineDate:"2026-09-08",
    type:"Conceptual or empirical branding", coauthors:["TBD"],
    grant:"Industry / AI marketing", tenure:"Satellite", status:"Planning",
    statusColor:"purple", cluster:"A",
    nextActions:[
      "Define scope within EJM Human and AI Driven Branding call",
      "Position relative to HSF (Paper 2) and HALO Lab",
      "Develop experimental stimuli: brand chatbot interactions",
      "Connect to firm-led vs. user-led dissertation framework",
    ],
    rqs:[
      "How does brand AI agent humanlikeness influence brand authenticity, warmth, and competence?",
      "Does AI awareness moderate humanlike cues → brand trust, varying by brand type?",
      "Do consumers form parasocial brand relationships following HSF trust pathways?",
    ],
    variables:[
      { name:"Brand AI humanlikeness", type:"IV", desc:"Communication style, social cues, behavioral responsiveness", shared:"humanlike_cues" },
      { name:"AI disclosure", type:"Mod", desc:"Disclosed vs. undisclosed AI involvement" },
      { name:"Brand authenticity", type:"DV", desc:"Morhart et al. (2015): continuity, credibility, integrity, symbolism" },
      { name:"Brand relational warmth", type:"DV", desc:"Perceived warmth/social presence (Hess & Story, 2005)" },
      { name:"Brand trust", type:"DV/Med", desc:"Delgado-Ballester (2004); mapped to HSF facets", shared:"trust" },
      { name:"Parasocial brand relationship", type:"Exploratory", desc:"One-sided relational bonds with brand AI agent" },
      { name:"Brand type", type:"Moderator", desc:"Luxury vs. mass; service vs. goods" },
    ],
    timeline:{ start:6, end:9, submit:9 },
  },
  {
    id:"health", name:"AI Healthcare Decision Support", emoji:"🩺", pillar:"Infra",
    journal:"JM / Mgmt Science / Health Policy", deadline:"Rolling",
    type:"Conceptual + pilot empirical", coauthors:["Compass team"],
    grant:"NIH / NSF human–AI", tenure:"Grant Builder", status:"Active",
    statusColor:"amber", cluster:"C",
    nextActions:[
      "Connect to Compass TBI platform",
      "Design clinician interview protocol",
      "Identify clinical domain for pilot",
      "Position pilot data for NIH/NSF proposals",
    ],
    rqs:[
      "How do clinicians form trust in AI decision-support tools?",
      "When does AI decision support enhance vs. degrade clinical decision quality?",
      "What institutional factors enable/constrain clinician AI adoption?",
    ],
    variables:[
      { name:"AI design features", type:"IV", desc:"Transparency (black-box vs. explainable), style (directive vs. advisory), confidence display", shared:"humanlike_cues" },
      { name:"Clinician trust in AI", type:"DV", desc:"Lee & See (2004) adapted; clinician-specific items", shared:"trust" },
      { name:"Clinical decision quality", type:"DV", desc:"Agreement with expert-panel gold standard" },
      { name:"AI recommendation adherence", type:"Med", desc:"Extent clinicians follow AI recs in simulation" },
      { name:"Clinician expertise", type:"Moderator", desc:"Years practice; specialty; AI familiarity" },
      { name:"Organizational context", type:"Moderator", desc:"Hospital type; AI maturity; liability" },
    ],
    timeline:{ start:5, end:13, submit:13 },
  },
  {
    id:"drive", name:"Agentic Cues in Driving Simulation", emoji:"🚗", pillar:"P1",
    journal:"TBD", deadline:"TBD",
    type:"Pilot data — grant prerequisite", coauthors:["Stavrinos","McManus"],
    grant:"DOT / CDC", tenure:"Grant Builder", status:"Concept Stage",
    statusColor:"purple", isNew:true, cluster:"A",
    nextActions:["Schedule meeting with Stavrinos at TRIP Lab","Define pilot protocol for teen driver trust study"],
    rqs:["How do humanlike cues in vehicle AI interfaces shape teen driver trust and reliance?"],
    variables:[
      { name:"Vehicle AI humanlike cues", type:"IV", desc:"Voice, persona, transparency in driving assistant", shared:"humanlike_cues" },
      { name:"Teen driver trust", type:"DV", desc:"Trust in and reliance on AI driving assistance", shared:"trust" },
    ],
    timeline:{ start:6, end:10 },
  },
  {
    id:"diff", name:"Personalization & Privacy (Diff Eyewear)", emoji:"👓", pillar:"P1",
    journal:"JM target", deadline:"TBD",
    type:"Empirical — before/after consumer data", coauthors:["Jay Black"],
    grant:"—", tenure:"Satellite", status:"Planning",
    statusColor:"purple", isNew:true, cluster:"A",
    nextActions:["Define Diff Eyewear data access scope","Scope agentic personalization angle","Connect to cue calibration framework"],
    rqs:["How does agentic personalization affect consumer privacy perceptions and trust?"],
    variables:[
      { name:"Agentic personalization", type:"IV", desc:"AI-driven personalization of product/experience", shared:"humanlike_cues" },
      { name:"Privacy perceptions", type:"DV", desc:"Consumer privacy concern and comfort" },
      { name:"Trust", type:"DV", desc:"Consumer trust in personalization system", shared:"trust" },
    ],
    timeline:{ start:6, end:12 },
  },
];

// ─── SHARED VARIABLE GROUPS (cross-project links) ────────────────────────────
const VAR_GROUPS = {
  humanlike_cues: { label:"Humanlike Cues / Design", emoji:"🔮", color:"#5B4399", desc:"Cues that activate social cognition: visual, linguistic, behavioral, relational, agentic" },
  cue_calibration: { label:"Cue Calibration", emoji:"🎛️", color:"#5B4399", desc:"Degree, type, threshold of humanlike features; uncanny valley boundary" },
  trust: { label:"Trust", emoji:"🤝", color:"#1A6858", desc:"Multi-facet trust: competence, benevolence, integrity; institutional, interpersonal, system" },
  trust_adjacent: { label:"Trust-Adjacent Outcomes", emoji:"💛", color:"#C4A03C", desc:"Attachment, psychological ownership, reliance — precursors/correlates of trust" },
  meaning_making: { label:"Meaning-Making", emoji:"🧠", color:"#8A3458", desc:"Interpretive processes: sense-making, narrative construction, identity coherence" },
  market_outcomes: { label:"Market Outcomes", emoji:"📊", color:"#1A6858", desc:"Downstream consequences: WTP, adoption, delegation, loyalty, reintegration" },
  ai_attribution: { label:"AI Agency Attribution", emoji:"🤖", color:"#2A5A80", desc:"Perceived autonomy, intentionality, consciousness of AI entities" },
  anthropomorphism_measure: { label:"Anthropomorphism Measurement", emoji:"📏", color:"#8A3458", desc:"Scales measuring perceived humanlikeness (Aggarwal & McGill, Epley et al.)" },
  institutional_design: { label:"Institutional/System Design", emoji:"🏗️", color:"#3A3A80", desc:"Governance, infrastructure, intervention design shaping institutional outcomes" },
};

// ─── COLLABORATOR DATA ───────────────────────────────────────────────────────
const COLLABS = [
  { id:"howard", name:"Dr. Howard", area:"HCI · Committee", inst:"U of South Alabama", projects:["cue","qual","diss"] },
  { id:"brouer", name:"Dr. Brouer", area:"Brand trust · Committee", inst:"U of South Alabama", projects:["cue","diss"] },
  { id:"hair", name:"Joe Hair", area:"Methods & measurement", inst:"", projects:["aa"] },
  { id:"jayblack", name:"Jay Black", area:"Committee · Dissertation", inst:"Dissertation committee", projects:["aa","diff","diss"] },
  { id:"dewey", name:"Susan Dewey", area:"Prison intervention lead", inst:"University of Alabama", projects:["prison"] },
  { id:"stavrinos", name:"Stavrinos", area:"ISSR Dir · TRIP Lab", inst:"University of Alabama", projects:["drive","asq"] },
  { id:"mcmanus", name:"McManus", area:"TRIP Lab co-lead", inst:"University of Alabama", projects:["drive"] },
  { id:"voorhees", name:"Voorhees", area:"JM EIC · Service, CX", inst:"Culverhouse, UA", projects:[], invite:true },
  { id:"jones", name:"Jones", area:"Retail, privacy", inst:"Culverhouse, UA", projects:[], invite:true },
  { id:"richey", name:"Richey", area:"SCM, disaster resilience", inst:"Auburn University", projects:["retail"] },
  { id:"lemay", name:"LeMay", area:"SCM, logistics", inst:"U of West Florida", projects:["retail"] },
  { id:"rao", name:"Rao", area:"Faculty", inst:"University of Alabama", projects:["retail"] },
  { id:"shao", name:"Shao", area:"Community resilience data", inst:"ISSR", projects:["retail"] },
  { id:"roberts", name:"Roberts", area:"PI · NSF SoS:DCI", inst:"", projects:["gsoc","asq"] },
  { id:"xinyue", name:"Xinyue Ye", area:"Graph methods · SoS:DCI", inst:"", projects:["gsoc"] },
  { id:"kelsey", name:"Kelsey", area:"GSOC platform dev", inst:"", projects:["gsoc"] },
];

const INFRA = [
  { name:"Research Dev Engine", emoji:"⚙️", desc:"ISSR pods · Operational" },
  { name:"Funding Intel Engine", emoji:"🔍", desc:"FOA matching · Beta Live" },
  { name:"HALO Prospectus", emoji:"📋", desc:"Delivered Feb 2026" },
  { name:"Brand Archetypes and Brand Trust", emoji:"📄", desc:"Published" },
  { name:"$6K Pilot Study", emoji:"💰", desc:"JMM · Cue manipulation · Funded" },
  { name:"Scholarly Journal", emoji:"📓", desc:"Daily practice" },
];

const DEADLINES = [
  { label:"JMM", date:"Apr 20", id:"aa" },
  { label:"JAMS", date:"Jun–Jul", id:"jams" },
  { label:"JM", date:"Aug 1", id:"jm" },
  { label:"EJM", date:"Sep 8", id:"ejm" },
];

const PILLAR_META = {
  P1:{ label:"Trust Calibration", color:"#5B4399", fill:"#C8B0F0", bg:"#F4F0FC", emoji:"🔮" },
  P2:{ label:"Responsibility & Governance", color:"#1A6858", fill:"#A0D8D0", bg:"#EAF7F4", emoji:"🏛️" },
  P3:{ label:"Readiness Under Pressure", color:"#8A3458", fill:"#E0A0B8", bg:"#FCF0F4", emoji:"🌊" },
  "P1↔P2":{ label:"P1↔P2 Bridge", color:"#9aa5b8", bg:"#f0f2f6", emoji:"🔗" },
  Infra:{ label:"Infrastructure", color:"#a8a0b8", bg:"#f5f3f8", emoji:"⚙️" },
};

const STATUS_COLORS = {
  green:{ bg:"#e8f5e9", text:"#1B5E30", dot:"#66bb6a" },
  amber:{ bg:"#fef9ef", text:"#7A5A10", dot:"#f5c542" },
  orange:{ bg:"#fef3ec", text:"#8A3458", dot:"#f5a623" },
  purple:{ bg:"#f4eefb", text:"#4A3080", dot:"#b388e8" },
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const sGet = async (k) => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } };
const sSet = async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch(e) { console.error("storage error",e); } };
const STORE_KEY = "halo-v8-data";

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("ecosystem");
  const [selProject, setSelProject] = useState(null);
  const [panel, setPanel] = useState(null); // {type:'collab'|'vargroup', id:string}
  const [wsModal, setWsModal] = useState(null); // {projectId, actionText}
  const [data, setData] = useState({ notes:{}, status:{}, manuscripts:{}, sessions:[] });
  const [loaded, setLoaded] = useState(false);
  const [projTab, setProjTab] = useState("overview");

  useEffect(() => { (async () => { const d = await sGet(STORE_KEY); if (d) setData(d); setLoaded(true); })(); }, []);

  const save = useCallback(async (next) => { setData(next); await sSet(STORE_KEY, next); }, []);

  const nav = useCallback((pid) => { setSelProject(pid); setView("projects"); setProjTab("overview"); }, []);

  const getStatus = (p) => data.status[p.id] || p.status;

  const updateField = useCallback((field, id, val) => {
    const next = { ...data, [field]: { ...data[field], [id]: val } };
    save(next);
  }, [data, save]);

  const updateManuscript = useCallback((pid, section, val) => {
    const ms = { ...(data.manuscripts[pid] || {}), [section]: val };
    const next = { ...data, manuscripts: { ...data.manuscripts, [pid]: ms } };
    save(next);
  }, [data, save]);

  const addSession = useCallback((session) => {
    const next = { ...data, sessions: [...data.sessions, session] };
    save(next);
  }, [data, save]);

  const updateSession = useCallback((idx, updates) => {
    const ss = [...data.sessions];
    ss[idx] = { ...ss[idx], ...updates };
    save({ ...data, sessions: ss });
  }, [data, save]);

  const views = [
    { id:"ecosystem", label:"🌸 Ecosystem" },
    { id:"timeline", label:"📅 Timeline" },
    { id:"projects", label:"📂 Projects" },
    { id:"onepager", label:"📄 One-Pager" },
    { id:"positioning", label:"🧭 Positioning" },
  ];

  if (!loaded) return <div style={S.loadWrap}><svg width="48" height="48" viewBox="0 0 120 120" style={{flexShrink:0}}>
            <circle cx="60" cy="60" r="40" fill="none" stroke="#C8B0F0" strokeWidth="5" strokeLinecap="round" strokeDasharray="105 146.3" transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="40" fill="none" stroke="#A0D8D0" strokeWidth="5" strokeLinecap="round" strokeDasharray="77 174.3" transform="rotate(68 60 60)"/>
            <circle cx="60" cy="60" r="40" fill="none" stroke="#E0A0B8" strokeWidth="5" strokeLinecap="round" strokeDasharray="56 195.3" transform="rotate(198 60 60)"/>
            <circle cx="60" cy="20" r="3.5" fill="#C8B0F0"/>
            <circle cx="95" cy="77" r="3.5" fill="#A0D8D0"/>
            <circle cx="25" cy="77" r="3.5" fill="#E0A0B8"/>
          </svg><div style={{fontSize:13,letterSpacing:1.5,color:"#5B4399",fontWeight:500,marginTop:12}}>Loading HALO…</div></div>;

  const ctx = { nav, data, getStatus, updateField, updateManuscript, addSession, updateSession, setPanel, setWsModal, projTab, setProjTab };

  return (
    <div style={S.root}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&display=swap" rel="stylesheet"/>

      {/* HEADER */}
      <div style={S.header}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
<svg width="36" height="36" viewBox="0 0 120 120" style={{flexShrink:0}}>
            <circle cx="60" cy="60" r="40" fill="none" stroke="#C8B0F0" strokeWidth="5" strokeLinecap="round" strokeDasharray="105 146.3" transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="40" fill="none" stroke="#A0D8D0" strokeWidth="5" strokeLinecap="round" strokeDasharray="77 174.3" transform="rotate(68 60 60)"/>
            <circle cx="60" cy="60" r="40" fill="none" stroke="#E0A0B8" strokeWidth="5" strokeLinecap="round" strokeDasharray="56 195.3" transform="rotate(198 60 60)"/>
            <circle cx="60" cy="20" r="3.5" fill="#C8B0F0"/>
            <circle cx="95" cy="77" r="3.5" fill="#A0D8D0"/>
            <circle cx="25" cy="77" r="3.5" fill="#E0A0B8"/>
          </svg>
          <div>
            <div style={S.hTitle}>HALO Research Lab</div>
            <div style={S.hSub}>Humanlike Agents, Logics & Lived Operations · Andrya Allen · ISSR, University of Alabama</div>
          </div>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {DEADLINES.map(d=><span key={d.label} onClick={()=>nav(d.id)} style={{...S.dlPill,cursor:"pointer"}}>🔔 {d.date} — {d.label}</span>)}
        </div>
      </div>

      {/* NAV */}
      <div style={S.navBar}>
        {views.map(v=>(
          <button key={v.id} onClick={()=>{setView(v.id);if(v.id!=="projects")setSelProject(null);}} style={{...S.navBtn,...(view===v.id?S.navActive:{})}}>{v.label}</button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={S.content}>
        {view==="ecosystem" && <EcoView ctx={ctx}/>}
        {view==="timeline" && <TimeView ctx={ctx}/>}
        {view==="projects" && <ProjView ctx={ctx} sel={selProject} setSel={setSelProject}/>}
        {view==="onepager" && <OneView ctx={ctx}/>}
        {view==="positioning" && <PosView ctx={ctx}/>}
      </div>

      <div style={S.footer}>HALO Research Lab · ISSR, University of Alabama · March 2026 · v8.1</div>

      {/* PANELS & MODALS */}
      {panel && <SidePanel panel={panel} onClose={()=>setPanel(null)} nav={nav}/>}
      {wsModal && <WorkSessionModal info={wsModal} onClose={()=>setWsModal(null)} addSession={addSession}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════
function PLink({ id, children, nav, style:s }) {
  return <span onClick={(e)=>{e.stopPropagation();nav(id);}} style={{cursor:"pointer",textDecoration:"none",borderBottom:"1px dotted #C8B0F044",fontWeight:600,color:"#2A1E40",...s}}>{children}</span>;
}

function CLink({ name, setPanel, style:s }) {
  const c = COLLABS.find(x=> name.includes(x.name));
  if (!c) return <span style={s}>{name}</span>;
  return <span onClick={(e)=>{e.stopPropagation();setPanel({type:"collab",id:c.id});}} style={{cursor:"pointer",borderBottom:"1px dotted #A0D8D044",fontWeight:600,color:"#3d6b3d",...s}}>{name}</span>;
}

function VLink({ groupKey, children, setPanel, style:s }) {
  if (!groupKey || !VAR_GROUPS[groupKey]) return <span style={s}>{children}</span>;
  return <span onClick={(e)=>{e.stopPropagation();setPanel({type:"vargroup",id:groupKey});}} style={{cursor:"pointer",borderBottom:"1px dotted #C8B0F044",color:VAR_GROUPS[groupKey].color,fontWeight:600,...s}}>{children}</span>;
}

function StatusPill({ status, color }) {
  const c = STATUS_COLORS[color]||STATUS_COLORS.amber;
  return <span style={{fontSize:10,padding:"2px 8px",borderRadius:12,background:c.bg,color:c.text,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:3,background:c.dot,flexShrink:0}}/>{status}</span>;
}

function TBadge({ tenure }) {
  if(!tenure)return null;
  const t=tenure.includes("Top-6");
  return <span style={{fontSize:9,padding:"2px 7px",borderRadius:10,fontWeight:600,background:t?"linear-gradient(135deg,#F8E8EC,#F0D0D8)":"#f0edf5",color:t?"#9E1B32":"#8a8098",border:t?"1px solid #DDA0B0":"1px solid #e0dbe8"}}>{t?"⭐ ":""}{tenure}</span>;
}

function PTag({ pillar }) {
  const k=pillar.includes("↔")?"P1↔P2":pillar;
  const m=PILLAR_META[k]||PILLAR_META.P1;
  return <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:600,background:m.bg,color:m.color,border:`1px solid ${m.color}33`}}>{m.emoji} {k}</span>;
}

function Sec({ children, style:s }) {
  return <div style={{fontFamily:"'Newsreader',Georgia,serif",fontSize:17,fontWeight:600,color:"#2A1E40",marginBottom:14,letterSpacing:-0.3,...s}}>{children}</div>;
}

function Card({ children, style:s, onClick }) {
  return <div onClick={onClick} style={{background:"rgba(255,255,255,0.88)",borderRadius:14,padding:16,border:"1px solid #E8E0F4",boxShadow:"0 1px 6px rgba(120,100,160,0.04)",cursor:onClick?"pointer":"default",transition:"all 0.15s",...s}}>{children}</div>;
}

function ActionItem({ text, projectId, setWsModal }) {
  return (
    <div onClick={()=>setWsModal({projectId, actionText:text})} style={{padding:"6px 10px",margin:"3px 0",borderRadius:8,background:"#F9F6FE",border:"1px solid #E8E0F4",fontSize:11,color:"#2A1E40",cursor:"pointer",display:"flex",alignItems:"center",gap:6,lineHeight:1.4,transition:"background 0.15s"}}>
      <span style={{fontSize:14,flexShrink:0}}>▸</span>
      <span style={{flex:1}}>{text}</span>
      <span style={{fontSize:9,padding:"2px 6px",borderRadius:8,background:"#F4F0FC",color:"#4A3080",fontWeight:600,whiteSpace:"nowrap",flexShrink:0}}>+ session</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SIDE PANEL (Coauthor / Variable Group cross-references)
// ═══════════════════════════════════════════════════════════════════════════
function SidePanel({ panel, onClose, nav }) {
  const isCollab = panel.type==="collab";
  const isVar = panel.type==="vargroup";

  let title="", content=null;

  if (isCollab) {
    const c = COLLABS.find(x=>x.id===panel.id);
    if (!c) { onClose(); return null; }
    title = `🤝 ${c.name}`;
    const projs = P.filter(p=>c.projects.includes(p.id));
    content = (
      <div>
        <div style={{fontSize:12,color:"#666",marginBottom:4}}>{c.area}</div>
        {c.inst && <div style={{fontSize:11,color:"#6A5E90",marginBottom:8}}>{c.inst}</div>}
        {c.invite && <div style={{fontSize:10,padding:"3px 8px",borderRadius:8,background:"#EAF7F4",color:"#1A6858",fontWeight:600,display:"inline-block",marginBottom:8}}>📩 Invite pending</div>}
        <div style={{fontSize:12,fontWeight:600,color:"#2A1E40",marginTop:8,marginBottom:6}}>Projects ({projs.length})</div>
        {projs.map(p=>(
          <div key={p.id} onClick={()=>{nav(p.id);onClose();}} style={{padding:"8px 10px",margin:"4px 0",borderRadius:10,background:"#F9F6FE",border:"1px solid #E8E0F4",cursor:"pointer"}}>
            <div style={{fontSize:12,fontWeight:600,color:"#2A1E40"}}>{p.emoji} {p.name}</div>
            <div style={{fontSize:10,color:"#6A5E90"}}>{p.journal} · {p.tenure}</div>
            <StatusPill status={p.status} color={p.statusColor}/>
          </div>
        ))}
        {projs.length===0 && <div style={{fontSize:11,color:"#888",fontStyle:"italic"}}>No active project connections yet</div>}
      </div>
    );
  }

  if (isVar) {
    const g = VAR_GROUPS[panel.id];
    if (!g) { onClose(); return null; }
    title = `${g.emoji} ${g.label}`;
    const matches = [];
    P.forEach(p => {
      p.variables.forEach(v => {
        if (v.shared === panel.id) matches.push({ project:p, variable:v });
      });
    });
    content = (
      <div>
        <div style={{fontSize:12,color:"#666",marginBottom:10,lineHeight:1.5}}>{g.desc}</div>
        <div style={{fontSize:12,fontWeight:600,color:"#2A1E40",marginBottom:6}}>Appears in {matches.length} variables across {new Set(matches.map(m=>m.project.id)).size} projects</div>
        {matches.map((m,i)=>(
          <div key={i} onClick={()=>{nav(m.project.id);onClose();}} style={{padding:"8px 10px",margin:"4px 0",borderRadius:10,background:"#F9F6FE",border:"1px solid #E8E0F4",cursor:"pointer"}}>
            <div style={{fontSize:11,fontWeight:600,color:"#2A1E40"}}>{m.project.emoji} {m.project.name}</div>
            <div style={{fontSize:10,color:"#666",marginTop:2}}>
              <span style={{fontSize:9,padding:"1px 5px",borderRadius:6,background:"#F4F0FC",color:"#4A3080",fontWeight:600,marginRight:4}}>{m.variable.type}</span>
              {m.variable.name}: <span style={{color:"#777"}}>{m.variable.desc}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{position:"fixed",top:0,right:0,bottom:0,width:380,maxWidth:"90vw",background:"#F9F6FE",borderLeft:"1px solid #E8E0F4",boxShadow:"-4px 0 24px rgba(100,80,160,0.08)",zIndex:1000,overflow:"auto",padding:20,fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontFamily:"'Newsreader',Georgia,serif",fontSize:16,fontWeight:600,color:"#2A1E40"}}>{title}</div>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#6A5E90",fontFamily:"inherit"}}>✕</button>
      </div>
      {content}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WORK SESSION MODAL
// ═══════════════════════════════════════════════════════════════════════════
function WorkSessionModal({ info, onClose, addSession }) {
  const [notes, setNotes] = useState("");
  const [goal, setGoal] = useState("");
  const p = P.find(x=>x.id===info.projectId);

  const create = () => {
    addSession({ id:Date.now(), projectId:info.projectId, action:info.actionText, goal, notes, created:new Date().toISOString(), status:"active" });
    onClose();
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(40,30,60,0.35)",zIndex:1001,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#F9F6FE",borderRadius:18,padding:24,maxWidth:520,width:"100%",maxHeight:"80vh",overflow:"auto",boxShadow:"0 8px 40px rgba(100,80,160,0.12)"}}>
        <div style={{fontFamily:"'Newsreader',Georgia,serif",fontSize:18,fontWeight:600,color:"#2A1E40",marginBottom:4}}>⚡ New Work Session</div>
        <div style={{fontSize:11,color:"#6A5E90",marginBottom:14}}>{p?.emoji} {p?.name}</div>

        <div style={{padding:12,borderRadius:10,background:"linear-gradient(135deg,#F4F0FC,#FCF0F4)",marginBottom:14,fontSize:12,color:"#2A1E40",lineHeight:1.5}}>
          <strong>Action:</strong> {info.actionText}
        </div>

        <label style={{fontSize:11,fontWeight:600,color:"#2A1E40",display:"block",marginBottom:4}}>Session Goal</label>
        <input value={goal} onChange={e=>setGoal(e.target.value)} placeholder="What do you want to accomplish in this session?" style={{width:"100%",padding:10,borderRadius:10,border:"1px solid #E8E0F4",fontSize:12,fontFamily:"inherit",marginBottom:12,background:"#fff",boxSizing:"border-box",outline:"none"}}/>

        <label style={{fontSize:11,fontWeight:600,color:"#2A1E40",display:"block",marginBottom:4}}>Working Notes</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Start working here… thoughts, drafts, to-dos, ideas…" style={{width:"100%",minHeight:140,padding:10,borderRadius:10,border:"1px solid #E8E0F4",fontSize:12,fontFamily:"inherit",resize:"vertical",background:"#fff",boxSizing:"border-box",outline:"none",lineHeight:1.6}}/>

        <div style={{display:"flex",gap:8,marginTop:14}}>
          <button onClick={create} style={{flex:1,padding:"10px 16px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#5B4399,#7B63B9)",color:"#fff",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Create Session</button>
          <button onClick={onClose} style={{padding:"10px 16px",borderRadius:12,border:"1px solid #E8E0F4",background:"#fff",color:"#666",fontWeight:500,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MANUSCRIPT EDITOR
// ═══════════════════════════════════════════════════════════════════════════
function ManuscriptEditor({ projectId, data, updateManuscript }) {
  const ms = data.manuscripts[projectId] || {};
  const counts = MS.reduce((a,s)=>{ const t=ms[s.key]||""; a[s.key]=t.length; return a; },{});

  return (
    <div>
      <div style={{fontSize:13,fontWeight:600,color:"#2A1E40",marginBottom:12,fontFamily:"'Newsreader',Georgia,serif"}}>✍️ Manuscript Sections</div>
      <div style={{fontSize:10,color:"#6A5E90",marginBottom:14}}>Each section saves automatically and persists across sessions.</div>
      {MS.map(s=>(
        <div key={s.key} style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <label style={{fontSize:12,fontWeight:600,color:"#2A1E40"}}>{s.label}</label>
            <span style={{fontSize:9,color:counts[s.key]>0?"#A0D8D0":"#ccc"}}>{counts[s.key]>0?`${counts[s.key]} chars`:"empty"}</span>
          </div>
          <textarea
            value={ms[s.key]||""}
            onChange={e=>updateManuscript(projectId, s.key, e.target.value)}
            placeholder={s.placeholder}
            style={{width:"100%",minHeight:s.key==="draft"?200:100,padding:12,borderRadius:10,border:"1px solid #E8E0F4",fontSize:12,fontFamily:"'DM Sans',sans-serif",resize:"vertical",background:"#fff",boxSizing:"border-box",outline:"none",lineHeight:1.7,color:"#333"}}
          />
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WORK SESSIONS LIST
// ═══════════════════════════════════════════════════════════════════════════
function SessionsList({ projectId, data, updateSession, nav }) {
  const sessions = data.sessions.filter(s=>s.projectId===projectId);
  const all = projectId === "__all";
  const list = all ? data.sessions : sessions;

  if (list.length===0) return <div style={{fontSize:12,color:"#888",fontStyle:"italic",padding:8}}>No work sessions yet. Click any ▸ action above to start one.</div>;

  return (
    <div>
      {list.map((s,i)=>{
        const idx = data.sessions.indexOf(s);
        const p = P.find(x=>x.id===s.projectId);
        return (
          <Card key={s.id} style={{marginBottom:8}}>
            {all && p && <div onClick={()=>nav(p.id)} style={{fontSize:11,fontWeight:600,color:"#5B4399",cursor:"pointer",marginBottom:4}}>{p.emoji} {p.name}</div>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:600,color:"#2A1E40"}}>{s.goal||s.action}</div>
                <div style={{fontSize:10,color:"#6A5E90",marginTop:2}}>{new Date(s.created).toLocaleDateString()}</div>
                {s.goal && <div style={{fontSize:10,color:"#666",marginTop:2}}>Action: {s.action}</div>}
              </div>
              <div style={{display:"flex",gap:3}}>
                {["active","done"].map(st=>(
                  <button key={st} onClick={()=>updateSession(idx,{status:st})} style={{fontSize:9,padding:"3px 8px",borderRadius:10,border:"1px solid #E8E0F4",background:s.status===st?(st==="done"?"#EAF7F4":"#F4F0FC"):"#fff",color:s.status===st?(st==="done"?"#1A6858":"#4A3080"):"#ccc",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>{st}</button>
                ))}
              </div>
            </div>
            {s.notes && <div style={{fontSize:11,color:"#555",marginTop:6,padding:8,borderRadius:8,background:"#F9F6FE",lineHeight:1.5,whiteSpace:"pre-wrap"}}>{s.notes}</div>}
            <textarea
              defaultValue={s.notes}
              onBlur={e=>updateSession(idx,{notes:e.target.value})}
              placeholder="Session notes…"
              style={{width:"100%",minHeight:60,marginTop:6,padding:8,borderRadius:8,border:"1px solid #E8E0F4",fontSize:11,fontFamily:"inherit",resize:"vertical",background:"#fff",boxSizing:"border-box",outline:"none",lineHeight:1.5}}
            />
          </Card>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ECOSYSTEM VIEW
// ═══════════════════════════════════════════════════════════════════════════
function EcoView({ ctx }) {
  const { nav, getStatus, setPanel } = ctx;
  const pillars = ["P1","P2","P3"];

  return (
    <div>
      {/* Stats */}
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
        {[{l:"Complete/Submitted",n:6,c:"#1A6858",b:"#EAF7F4"},{l:"Active",n:8,c:"#7A5A10",b:"#fef9ef"},{l:"Design Phase",n:5,c:"#8A3458",b:"#FCF0F4"},{l:"Planning",n:4,c:"#4A3080",b:"#F4F0FC"}].map(s=>
          <div key={s.l} style={{padding:"10px 16px",borderRadius:12,background:s.b,display:"flex",alignItems:"center",gap:10,flex:"1 1 130px",cursor:"pointer",border:"1px solid transparent"}}>
            <span style={{fontSize:22,fontWeight:700,color:s.c,fontFamily:"'Newsreader',Georgia,serif"}}>{s.n}</span>
            <span style={{fontSize:11,color:s.c,fontWeight:600}}>{s.l}</span>
          </div>
        )}
      </div>

      <Sec>🌸 Research Ecosystem</Sec>

      {/* Core */}
      <Card style={{marginBottom:18,textAlign:"center",borderTop:"3px solid transparent",borderImage:"linear-gradient(90deg,#C8B0F0,#A0D8D0,#E0A0B8) 1"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
<svg width="48" height="48" viewBox="0 0 120 120" style={{flexShrink:0}}>
            <circle cx="60" cy="60" r="40" fill="none" stroke="#C8B0F0" strokeWidth="5" strokeLinecap="round" strokeDasharray="105 146.3" transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="40" fill="none" stroke="#A0D8D0" strokeWidth="5" strokeLinecap="round" strokeDasharray="77 174.3" transform="rotate(68 60 60)"/>
            <circle cx="60" cy="60" r="40" fill="none" stroke="#E0A0B8" strokeWidth="5" strokeLinecap="round" strokeDasharray="56 195.3" transform="rotate(198 60 60)"/>
            <circle cx="60" cy="20" r="3.5" fill="#C8B0F0"/>
            <circle cx="95" cy="77" r="3.5" fill="#A0D8D0"/>
            <circle cx="25" cy="77" r="3.5" fill="#E0A0B8"/>
          </svg>
        </div>
        <div style={{fontFamily:"'Newsreader',Georgia,serif",fontSize:16,fontWeight:600,color:"#2A1E40"}}>HALO Research Lab</div>
        <div style={{fontSize:11,color:"#6A5E90",marginTop:3,maxWidth:520,margin:"4px auto 0",lineHeight:1.5}}>An agentic system is any system that presents with the appearance of autonomous intention to its users. HALO studies how humanlike cues function as trust calibration signals in these systems.</div>
      </Card>

      {/* Pillars */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:12,marginBottom:18}}>
        {pillars.map(pid=>{
          const m=PILLAR_META[pid]; const pp=P.filter(p=>p.pillar===pid);
          return (
            <div key={pid} style={{background:"rgba(255,255,255,0.88)",borderRadius:14,padding:16,borderLeft:`3.5px solid ${m.fill||m.color}`,border:`1px solid ${(m.fill||m.color)}20`}}>
              <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:0.6,color:m.color,marginBottom:2}}>{m.emoji} {pid}</div>
              <div style={{fontSize:13,fontWeight:600,color:"#2A1E40",marginBottom:10}}>{m.label}</div>
              {pp.map(p=>(
                <div key={p.id} onClick={()=>nav(p.id)} style={{padding:"7px 0",borderBottom:"1px solid #EDE6F4",cursor:"pointer"}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#2A1E40"}}>{p.emoji} {p.name}</div>
                  <div style={{fontSize:10,color:"#6A5E90",marginTop:1}}>{p.journal}{p.deadline!=="Rolling"&&p.deadline!=="TBD"?` · ${p.deadline}`:""}</div>
                  <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>
                    <StatusPill status={getStatus(p)} color={p.statusColor}/>
                    <TBadge tenure={p.tenure}/>
                    {p.isNew&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:8,background:"#EAF7F4",color:"#1A6858",fontWeight:600}}>✨ new</span>}
                    {p.funded&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:8,background:"#F8E8EC",color:"#9E1B32",fontWeight:600}}>{p.funded}</span>}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Bridges */}
      <Sec>🔗 Cross-Pillar Bridges</Sec>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10,marginBottom:18}}>
        {P.filter(p=>p.pillar.includes("↔")||p.pillar==="Infra").map(p=>
          <Card key={p.id} onClick={()=>nav(p.id)}>
            <div style={{fontSize:11,fontWeight:600,color:"#2A1E40"}}>{p.emoji} {p.name}</div>
            <div style={{fontSize:10,color:"#6A5E90",marginTop:2}}>{p.journal}</div>
            <div style={{marginTop:4}}><StatusPill status={getStatus(p)} color={p.statusColor}/></div>
          </Card>
        )}
        <Card style={{background:"#fdf8f2"}}><div style={{fontSize:10,fontWeight:700,color:"#8A3458",textTransform:"uppercase",marginBottom:4}}>📕 Low Sky Country</div><div style={{fontSize:10,color:"#555"}}>Memoir · University press target</div><div style={{marginTop:4}}><StatusPill status="Manuscript Done" color="green"/></div></Card>
        <Card style={{background:"#f9f7ff"}}><div style={{fontSize:10,fontWeight:700,color:"#5B4399",textTransform:"uppercase",marginBottom:4}}>NSF SoS:DCI</div><div style={{fontSize:10,color:"#555"}}>Roberts (PI), Stavrinos, Chao, Xinyue, White</div><div style={{marginTop:4}}><StatusPill status="Active Submission" color="amber"/></div></Card>
        <Card style={{background:"#f7faf7"}}><div style={{fontSize:10,fontWeight:700,color:"#1A6858",textTransform:"uppercase",marginBottom:4}}>THRIVE $25K</div><div style={{fontSize:10,color:"#555"}}>Funds NSF proposal development</div><div style={{marginTop:4}}><StatusPill status="Applied" color="amber"/></div></Card>
      </div>

      {/* Infrastructure */}
      <Sec>⚙️ Infrastructure</Sec>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:18}}>
        {INFRA.map(i=><div key={i.name} style={{background:"rgba(255,255,255,0.8)",borderRadius:12,padding:12,textAlign:"center",border:"1px solid #E8E0F4"}}><div style={{fontSize:20,marginBottom:4}}>{i.emoji}</div><div style={{fontSize:11,fontWeight:600,color:"#2A1E40"}}>{i.name}</div><div style={{fontSize:10,color:"#6A5E90"}}>{i.desc}</div></div>)}
      </div>

      {/* Collaborators — all clickable */}
      <Sec>🤝 Collaborator Network</Sec>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:6}}>
        {COLLABS.map(c=>(
          <div key={c.id} onClick={()=>setPanel({type:"collab",id:c.id})} style={{fontSize:11,padding:10,background:"rgba(255,255,255,0.8)",borderRadius:10,border:"1px solid #E8E0F4",cursor:"pointer",transition:"background 0.15s"}}>
            <span style={{fontWeight:600,color:"#2A1E40"}}>{c.name}</span>
            {c.invite&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:6,background:"#EAF7F4",color:"#1A6858",fontWeight:600,marginLeft:4}}>invite</span>}
            <span style={{color:"#6A5E90"}}> · {c.area}</span>
            {c.inst&&<div style={{fontSize:10,color:"#6A5E90",marginTop:1}}>{c.inst}</div>}
            <div style={{fontSize:10,color:"#6A5E90"}}>{c.projects.length} project{c.projects.length!==1?"s":""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TIMELINE VIEW
// ═══════════════════════════════════════════════════════════════════════════
function TimeView({ ctx }) {
  const { nav } = ctx;
  const tp = P.filter(p=>p.timeline?.start);
  return (
    <div>
      <Sec>📅 2026 Research Timeline</Sec>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {DEADLINES.map(d=><span key={d.label} onClick={()=>nav(d.id)} style={{...S.dlPill,cursor:"pointer"}}>🔔 {d.date} — {d.label}</span>)}
      </div>
      <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        <div style={{minWidth:740}}>
          <div style={{display:"grid",gridTemplateColumns:"190px repeat(13,1fr)",marginBottom:6}}>
            <div style={{fontSize:10,fontWeight:600,color:"#6A5E90"}}>Project</div>
            {MONTHS.map((m,i)=><div key={m} style={{fontSize:10,fontWeight:i===2?700:400,textAlign:"center",color:i===2?"#C8B0F0":"#6A5E90",borderBottom:i===2?"2px solid #C8B0F0":"none",paddingBottom:3}}>{m}</div>)}
            <div style={{fontSize:10,textAlign:"center",color:"#6A5E90"}}>2027</div>
          </div>
          {tp.map(p=>{
            const m=PILLAR_META[p.pillar.split("↔")[0]]||PILLAR_META.P1;
            return (
              <div key={p.id} onClick={()=>nav(p.id)} style={{display:"grid",gridTemplateColumns:"190px repeat(13,1fr)",padding:"5px 0",borderBottom:"1px solid #F0EAF6",cursor:"pointer",alignItems:"center"}}>
                <div style={{fontSize:11,fontWeight:500,color:"#2A1E40",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:4}}>
                  {p.emoji} {p.name.length>26?p.name.slice(0,26)+"…":p.name}
                </div>
                {Array.from({length:13},(_,i)=>{
                  const mo=i+1; const inR=mo>=p.timeline.start&&mo<=Math.min(p.timeline.end,13); const isSub=p.timeline.submit===mo;
                  return <div key={i} style={{display:"flex",justifyContent:"center",alignItems:"center",height:22}}>
                    {inR&&<div style={{width:isSub?20:"85%",height:isSub?20:8,borderRadius:isSub?10:4,background:isSub?`linear-gradient(135deg,${m.fill||m.color},${(m.fill||m.color)}bb)`:`${(m.fill||m.color)}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700}}>{isSub&&"▶"}</div>}
                  </div>;
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{display:"flex",gap:14,marginTop:14,fontSize:10,color:"#6A5E90"}}>
        <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:22,height:8,borderRadius:4,background:"#C8B0F035"}}/>Active</span>
        <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:16,height:16,borderRadius:8,background:"#C8B0F0",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:8,fontWeight:700}}>▶</span>Submit</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECTS VIEW — card list + full detail + manuscript + sessions
// ═══════════════════════════════════════════════════════════════════════════
function ProjView({ ctx, sel, setSel }) {
  const { nav, data, getStatus, updateField, updateManuscript, addSession, updateSession, setPanel, setWsModal, projTab, setProjTab } = ctx;
  const [filter, setFilter] = useState("all");
  const p = sel ? P.find(x=>x.id===sel) : null;

  const filters=["all","P1","P2","P3","bridge"];
  const filtered = filter==="all"?P:filter==="bridge"?P.filter(pp=>pp.pillar.includes("↔")||pp.pillar==="Infra"):P.filter(pp=>pp.pillar===filter);

  // ── PROJECT LIST ──
  if (!p) return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:14}}>
        <Sec style={{marginBottom:0}}>📂 Project Library</Sec>
        <div style={{display:"flex",gap:3}}>
          {filters.map(f=><button key={f} onClick={()=>setFilter(f)} style={{fontSize:10,padding:"4px 10px",borderRadius:14,border:"1px solid #E8E0F4",background:filter===f?"#5B4399":"#fff",color:filter===f?"#fff":"#888",cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>{f==="all"?"All":f==="bridge"?"🔗":PILLAR_META[f]?.emoji+" "+f}</button>)}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:10}}>
        {filtered.map(proj=>(
          <Card key={proj.id} onClick={()=>setSel(proj.id)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:"#2A1E40"}}>{proj.emoji} {proj.name}</div>
                <div style={{fontSize:10,color:"#6A5E90",marginTop:2}}>{proj.journal}</div>
              </div>
              <PTag pillar={proj.pillar}/>
            </div>
            <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
              <StatusPill status={getStatus(proj)} color={proj.statusColor}/>
              <TBadge tenure={proj.tenure}/>
            </div>
            {proj.deadline!=="Rolling"&&proj.deadline!=="TBD"&&<div style={{fontSize:10,color:"#9E1B32",fontWeight:600,marginTop:6}}>🔔 {proj.deadline}</div>}
            {(data.manuscripts[proj.id]&&Object.values(data.manuscripts[proj.id]).some(v=>v)) && <div style={{fontSize:10,color:"#1A6858",marginTop:3}}>✍️ Has manuscript content</div>}
            {data.sessions.filter(s=>s.projectId===proj.id).length>0 && <div style={{fontSize:10,color:"#5B4399",marginTop:2}}>⚡ {data.sessions.filter(s=>s.projectId===proj.id).length} session{data.sessions.filter(s=>s.projectId===proj.id).length!==1?"s":""}</div>}
          </Card>
        ))}
      </div>
    </div>
  );

  // ── PROJECT DETAIL ──
  const tabs = [
    { id:"overview", label:"📋 Overview" },
    { id:"manuscript", label:"✍️ Manuscript" },
    { id:"sessions", label:`⚡ Sessions (${data.sessions.filter(s=>s.projectId===p.id).length})` },
  ];

  return (
    <div>
      <button onClick={()=>setSel(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#5B4399",fontWeight:500,marginBottom:14,fontFamily:"inherit",padding:0}}>← Back to all projects</button>

      {/* Header */}
      <Card style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
          <div><div style={{fontSize:20,fontWeight:600,color:"#2A1E40",fontFamily:"'Newsreader',Georgia,serif"}}>{p.emoji} {p.name}</div><div style={{fontSize:12,color:"#6A5E90",marginTop:3}}>{p.journal} · {p.type}</div></div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}><PTag pillar={p.pillar}/><TBadge tenure={p.tenure}/></div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap",alignItems:"center"}}>
          <StatusPill status={getStatus(p)} color={p.statusColor}/>
          {p.deadline!=="Rolling"&&p.deadline!=="TBD"&&<span style={{fontSize:10,color:"#9E1B32",fontWeight:600}}>🔔 {p.deadline}</span>}
          {p.funded&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:8,background:"#F8E8EC",color:"#9E1B32",fontWeight:600}}>{p.funded}</span>}
          {p.isNew&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:8,background:"#EAF7F4",color:"#1A6858",fontWeight:600}}>✨ new</span>}
          {p.isReframed&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:8,background:"#fef3ec",color:"#C75B7A",fontWeight:600}}>🔄 reframed</span>}
        </div>
        <div style={{marginTop:10,fontSize:11,color:"#666",display:"flex",gap:16,flexWrap:"wrap"}}>
          <span><strong style={{color:"#2A1E40"}}>Grant:</strong> {p.grant}</span>
          <span><strong style={{color:"#2A1E40"}}>Cluster:</strong> {p.cluster}</span>
        </div>
        {/* Clickable coauthors */}
        <div style={{marginTop:6,fontSize:11,color:"#666"}}>
          <strong style={{color:"#2A1E40"}}>Coauthors: </strong>
          {p.coauthors.map((c,i)=><span key={i}>{i>0&&", "}<CLink name={c} setPanel={setPanel} style={{fontSize:11}}/></span>)}
        </div>
        {p.pilotBridge&&<div style={{marginTop:10,padding:10,borderRadius:10,background:"#EAF7F4",fontSize:10,color:"#3d6b3d",lineHeight:1.5}}>🔗 <strong>Pilot bridge:</strong> {p.pilotBridge}</div>}
      </Card>

      {/* Tabs */}
      <div style={{display:"flex",gap:3,marginBottom:14,flexWrap:"wrap"}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setProjTab(t.id)} style={{fontSize:11,padding:"6px 14px",borderRadius:14,border:"1px solid #E8E0F4",background:projTab===t.id?"#5B4399":"#fff",color:projTab===t.id?"#fff":"#888",cursor:"pointer",fontFamily:"inherit",fontWeight:projTab===t.id?600:400}}>{t.label}</button>)}
      </div>

      {projTab==="overview" && <>
        {/* Next Actions — all clickable for work sessions */}
        {p.nextActions?.length>0 && <Card style={{marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:600,color:"#2A1E40",marginBottom:8,fontFamily:"'Newsreader',Georgia,serif"}}>🎯 Next Actions <span style={{fontSize:10,fontWeight:400,color:"#6A5E90"}}>(click to start a work session)</span></div>
          {p.nextActions.map((a,i)=><ActionItem key={i} text={a} projectId={p.id} setWsModal={setWsModal}/>)}
        </Card>}

        {/* Hypotheses */}
        {p.hypotheses?.length>0 && <Card style={{marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:600,color:"#2A1E40",marginBottom:8,fontFamily:"'Newsreader',Georgia,serif"}}>🧪 Hypotheses</div>
          {p.hypotheses.map((h,i)=><div key={i} style={{padding:"5px 0",borderBottom:i<p.hypotheses.length-1?"1px solid #F0EAF6":"none",fontSize:11,color:"#555",lineHeight:1.5}}>{h}</div>)}
        </Card>}

        {/* RQs */}
        {p.rqs?.length>0 && <Card style={{marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:600,color:"#2A1E40",marginBottom:8,fontFamily:"'Newsreader',Georgia,serif"}}>🔬 Research Questions</div>
          {p.rqs.map((rq,i)=><div key={i} style={{padding:"7px 0",borderBottom:i<p.rqs.length-1?"1px solid #F0EAF6":"none",fontSize:11,color:"#555",lineHeight:1.5}}><span style={{fontWeight:700,color:"#5B4399"}}>RQ{i+1}:</span> {rq}</div>)}
        </Card>}

        {/* Variables — clickable shared groups */}
        {p.variables?.length>0 && <Card style={{marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:600,color:"#2A1E40",marginBottom:8,fontFamily:"'Newsreader',Georgia,serif"}}>📊 Variables <span style={{fontSize:10,fontWeight:400,color:"#6A5E90"}}>(colored labels link to cross-project matches)</span></div>
          {p.variables.map((v,i)=>(
            <div key={i} style={{display:"flex",gap:8,fontSize:11,alignItems:"baseline",padding:"5px 0",borderBottom:i<p.variables.length-1?"1px solid #F0EAF6":"none"}}>
              <span style={{fontSize:9,padding:"2px 7px",borderRadius:8,background:"#F4F0FC",color:"#4A3080",fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>{v.type}</span>
              <span>
                {v.shared ? <VLink groupKey={v.shared} setPanel={setPanel}>{v.name}</VLink> : <strong style={{color:"#2A1E40"}}>{v.name}</strong>}
                {" "}<span style={{color:"#666"}}>{v.desc}</span>
              </span>
            </div>
          ))}
        </Card>}

        {/* Status Update */}
        <Card style={{marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:600,color:"#2A1E40",marginBottom:8,fontFamily:"'Newsreader',Georgia,serif"}}>🔄 Update Status</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {["Planning","In Development","Drafting","Design Phase","Protocol Design","Data Collection","Active","Platform Build","Concept Stage","Defining Scope","Complete","Submitted"].map(s=>(
              <button key={s} onClick={()=>updateField("status",p.id,s)} style={{fontSize:10,padding:"5px 12px",borderRadius:18,border:"1px solid #E8E0F4",background:getStatus(p)===s?"linear-gradient(135deg,#5B4399,#7B63B9)":"rgba(255,255,255,0.8)",color:getStatus(p)===s?"#fff":"#777",cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>{s}</button>
            ))}
          </div>
        </Card>

        {/* Working Notes */}
        <Card>
          <div style={{fontSize:13,fontWeight:600,color:"#2A1E40",marginBottom:8,fontFamily:"'Newsreader',Georgia,serif"}}>📝 Working Notes</div>
          <textarea value={data.notes[p.id]||""} onChange={e=>updateField("notes",p.id,e.target.value)} placeholder="General working notes for this project…" style={{width:"100%",minHeight:100,padding:12,borderRadius:10,border:"1px solid #E8E0F4",fontSize:12,fontFamily:"'DM Sans',sans-serif",resize:"vertical",background:"#fff",boxSizing:"border-box",outline:"none",lineHeight:1.6,color:"#333"}}/>
        </Card>
      </>}

      {projTab==="manuscript" && <Card><ManuscriptEditor projectId={p.id} data={data} updateManuscript={updateManuscript}/></Card>}

      {projTab==="sessions" && <SessionsList projectId={p.id} data={data} updateSession={updateSession} nav={nav}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ONE-PAGER VIEW
// ═══════════════════════════════════════════════════════════════════════════
function OneView({ ctx }) {
  const { nav } = ctx;
  const secs = [
    { pid:"P1", title:"Pillar 1 — Trust Calibration in Humanlike Design", text:"This pillar asks how voice, persona, transparency, and identity cues shape appropriate trust in AI-mediated interactions. The anchor is a conceptual theory paper for the Journal of Marketing proposing a typology of humanlike market forms, grounded in a completed bibliometric analysis of 326 publications. An open-source experimentation engine (GSOC) manipulates agent cues while capturing behavioral reliance data. The cue calibration experiments target JMR/JCR, and the dissertation examines firm-led vs. user-led trust.", pids:["jm","cue","gsoc","aa","jams","diss","diff","drive"] },
    { pid:"P2", title:"Pillar 2 — Responsibility & Governance", text:"This pillar examines how humanlike systems shift accountability within organizations and institutions. A qualitative study of 50 professionals develops a typology of AI role perception. THRIVE provides a field site for studying AI-augmented research infrastructure, targeting ASQ. The prison narrative collaboration extends trust and identity repair into justice contexts.", pids:["asq","qual","prison"] },
    { pid:"P3", title:"Pillar 3 — Readiness Under Pressure", text:"This pillar investigates how communities develop resilience when market systems face disruption. The anchor examines how county-level community resilience shapes retail recovery after disaster, using ISSR resilience data, Dewey retail activity, and SafeGraph footfall. Dollar General stores serve as signals of essential retail functioning.", pids:["retail"] },
  ];

  return (
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:24,padding:24,background:"linear-gradient(145deg,#F4F0FC,#fdf8f2)",borderRadius:18}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
<svg width="56" height="56" viewBox="0 0 120 120" style={{flexShrink:0}}>
            <circle cx="60" cy="60" r="40" fill="none" stroke="#C8B0F0" strokeWidth="5" strokeLinecap="round" strokeDasharray="105 146.3" transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="40" fill="none" stroke="#A0D8D0" strokeWidth="5" strokeLinecap="round" strokeDasharray="77 174.3" transform="rotate(68 60 60)"/>
            <circle cx="60" cy="60" r="40" fill="none" stroke="#E0A0B8" strokeWidth="5" strokeLinecap="round" strokeDasharray="56 195.3" transform="rotate(198 60 60)"/>
            <circle cx="60" cy="20" r="3.5" fill="#C8B0F0"/>
            <circle cx="95" cy="77" r="3.5" fill="#A0D8D0"/>
            <circle cx="25" cy="77" r="3.5" fill="#E0A0B8"/>
          </svg>
        </div>
        <div style={{fontFamily:"'Newsreader',Georgia,serif",fontSize:24,fontWeight:600,color:"#2A1E40",letterSpacing:-0.5}}>HALO Research Lab</div>
        <div style={{fontSize:12,color:"#6A5E90",marginTop:4}}>Humanlike Agents, Logics & Lived Operations</div>
        <div style={{fontSize:11,color:"#6A5E90",marginTop:6}}>Andrya Allen · ISSR, University of Alabama · PhD candidate, Mitchell College of Business</div>
      </div>
      <div style={{fontFamily:"'Newsreader',Georgia,serif",fontSize:13,lineHeight:1.7,color:"#5a4d7a",marginBottom:18,textAlign:"center",fontStyle:"italic",padding:"0 16px"}}>"Trust in the system is what I study."</div>
      {secs.map(sec=>{
        const m=PILLAR_META[sec.pid];
        return (
          <Card key={sec.pid} style={{marginBottom:14,borderLeft:`3.5px solid ${m.fill||m.color}`}}>
            <div style={{fontSize:13,fontWeight:600,color:m.color,marginBottom:6}}>{m.emoji} {sec.title}</div>
            <div style={{fontSize:11,color:"#555",lineHeight:1.7,marginBottom:8}}>{sec.text}</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {sec.pids.map(pid=>{const pp=P.find(x=>x.id===pid);return pp?<span key={pid} onClick={()=>nav(pid)} style={{fontSize:10,padding:"3px 8px",borderRadius:10,background:`${(m.fill||m.color)}12`,color:m.color,fontWeight:500,cursor:"pointer"}}>{pp.emoji} {pp.name.split("(")[0].trim().split(" ").slice(0,3).join(" ")}</span>:null;})}
            </div>
          </Card>
        );
      })}
      <Card style={{background:"linear-gradient(145deg,#F4F0FC,#EAF7F4)",marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:600,color:"#2A1E40",marginBottom:6,fontFamily:"'Newsreader',Georgia,serif"}}>📊 Portfolio Summary</div>
        <div style={{fontSize:11,color:"#555",lineHeight:1.7}}>22+ scholarly artifacts across 3 pillars + infrastructure. 6 complete/submitted. 8 active. 5 design phase. 4 planning. Top-6 anchors: JM (theory), JMR/JCR (experiments), ASQ (field study), JAMS (agentic systems). Reserve: JM/Marketing Science. Grants: NSF HCC, NSF SoS:DCI, NSF Smart Communities, NIJ, NIH, DOT/CDC.</div>
      </Card>
      <div style={{textAlign:"center",marginTop:18}}>
        <div style={{fontSize:10,fontWeight:600,color:"#6A5E90",textTransform:"uppercase",marginBottom:8,letterSpacing:0.5}}>Top-6 Journal Targets</div>
        <div style={{display:"flex",gap:5,justifyContent:"center",flexWrap:"wrap"}}>
          {["JM","JAMS","JMR/JCR","ASQ","JMR/OrgSci","JM/MktgSci"].map(j=><span key={j} style={{fontSize:10,padding:"4px 12px",borderRadius:18,background:"linear-gradient(135deg,#F8E8EC,#F0D0D8)",color:"#9E1B32",fontWeight:600,border:"1px solid #DDA0B0"}}>⭐ {j}</span>)}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// POSITIONING VIEW
// ═══════════════════════════════════════════════════════════════════════════
function PosView({ ctx }) {
  const { nav, setPanel } = ctx;
  const clusters = [
    { id:"A", name:"Humanlike Systems Science", emoji:"🔮", color:"#5B4399", fill:"#C8B0F0", spine:"humanlike cues → trust → meaning-making", papers:["aa","jm","jams","ejm","cue","gsoc"], desc:"Paper 1 (AA) generates pilot data feeding Papers 2 and 6. Paper 2 provides overarching theory. Paper 3 extends to branding. Paper 6 is the core experimental engine. GSOC tests cues in research infrastructure. All share anthropomorphism → trust." },
    { id:"B", name:"Community & Institutional Trust", emoji:"🏛️", color:"#1A6858", fill:"#A0D8D0", spine:"institutional trust → meaning-making under disruption → recovery", papers:["asq","retail","prison"], desc:"THRIVE studies trust in research institutions. Retail Recovery studies consumer trust in marketplace recovery. Prison Narrative studies trust repair via narrative. All examine sense-making of institutional dependability under pressure." },
    { id:"C", name:"Methods & Interdisciplinary Infrastructure", emoji:"⚙️", color:"#8A3458", fill:"#E0A0B8", spine:"AI as infrastructure for knowledge work", papers:["health","gsoc"], desc:"Healthcare AI examines clinician trust in decision tools. LegendMatch provides operational tooling. Graph-to-Graph maps collaboration structures. All support HALO Lab identity and grant infrastructure." },
  ];

  return (
    <div>
      <Sec>🧭 Strategic Positioning</Sec>

      {/* Shared Variable Network */}
      <Card style={{marginBottom:18,background:"linear-gradient(145deg,#F9F6FE,#f5f0fa)"}}>
        <div style={{fontSize:13,fontWeight:600,color:"#2A1E40",marginBottom:10,fontFamily:"'Newsreader',Georgia,serif"}}>🔗 Shared Construct Network <span style={{fontSize:10,fontWeight:400,color:"#6A5E90"}}>(click to see cross-project connections)</span></div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {Object.entries(VAR_GROUPS).map(([k,g])=>{
            const count = P.reduce((a,p)=>a+p.variables.filter(v=>v.shared===k).length,0);
            return <span key={k} onClick={()=>setPanel({type:"vargroup",id:k})} style={{fontSize:10,padding:"4px 10px",borderRadius:12,background:`${g.color}15`,color:g.color,fontWeight:600,cursor:"pointer",border:`1px solid ${g.color}30`}}>{g.emoji} {g.label} ({count})</span>;
          })}
        </div>
      </Card>

      {/* Clusters */}
      {clusters.map(cl=>(
        <Card key={cl.id} style={{marginBottom:12,borderLeft:`3.5px solid ${cl.fill||cl.color}`}}>
          <div style={{fontSize:14,fontWeight:600,color:cl.color,fontFamily:"'Newsreader',Georgia,serif"}}>{cl.emoji} Cluster {cl.id}: {cl.name}</div>
          <div style={{fontSize:10,marginTop:5,padding:"4px 10px",borderRadius:10,background:`${(cl.fill||cl.color)}12`,color:cl.color,fontWeight:600,display:"inline-block"}}>Shared spine: {cl.spine}</div>
          <div style={{fontSize:11,color:"#555",marginTop:8,lineHeight:1.6}}>{cl.desc}</div>
          <div style={{display:"flex",gap:4,marginTop:10,flexWrap:"wrap"}}>
            {cl.papers.map(pid=>{const pp=P.find(x=>x.id===pid);return pp?<span key={pid} onClick={()=>nav(pid)} style={{fontSize:10,padding:"3px 9px",borderRadius:12,background:`${(cl.fill||cl.color)}12`,color:cl.color,fontWeight:500,cursor:"pointer"}}>{pp.emoji} {pp.name.split("(")[0].trim().split(" ").slice(0,3).join(" ")}</span>:null;})}
          </div>
        </Card>
      ))}

      {/* Bridges */}
      <Card style={{marginBottom:18,background:"linear-gradient(145deg,#F4F0FC,#FCF0F4)"}}>
        <div style={{fontSize:14,fontWeight:600,color:"#2A1E40",marginBottom:10,fontFamily:"'Newsreader',Georgia,serif"}}>🔗 Cross-Cluster Bridges</div>
        {[
          {from:"aa",label:"AA (Paper 1)",arrow:"→",to:"Clusters A & C",desc:"Pilot data for NSF HCC and experimental program (Papers 2, 6)"},
          {from:"prison",label:"Prison Narrative",arrow:"→",to:"Clusters A & B",desc:"Trust-and-meaning-making in institutional context; marketplace identity"},
          {from:"gsoc",label:"GSOC",arrow:"→",to:"Clusters A & C",desc:"Tests humanlike design in research infrastructure, linking to science-of-science"},
          {from:"diss",label:"Dissertation",arrow:"→",to:"Clusters A & B",desc:"Firm-led vs. user-led trust bridges calibration and governance"},
        ].map((b,i)=>(
          <div key={i} style={{fontSize:11,color:"#555",lineHeight:1.6,padding:"6px 0",borderBottom:i<3?"1px solid #E8E0F4":"none"}}>
            <PLink id={b.from} nav={nav} style={{fontSize:11}}>{b.label}</PLink> {b.arrow} {b.to}: {b.desc}
          </div>
        ))}
      </Card>

      {/* NSF Grants */}
      <Sec>💰 NSF Grant Alignment</Sec>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:12,marginBottom:18}}>
        {[
          {name:"NSF Human-Centered Computing",emoji:"🧠",color:"#5B4399", fill:"#C8B0F0",pids:["aa","jm","ejm","cue","health"],hf:"Perceptual thresholds; stimulus calibration; simulation of trust dynamics; high-stakes scenario testing"},
          {name:"NSF Science of Science: DCI",emoji:"🔬",color:"#1A6858", fill:"#A0D8D0",pids:["asq","gsoc"],hf:"Agent-based modeling of research team dynamics; simulation of platform–researcher interaction; humanlike design → collaboration"},
        ].map(g=>(
          <Card key={g.name} style={{borderLeft:`3.5px solid ${g.fill||g.color}`}}>
            <div style={{fontSize:13,fontWeight:600,color:"#2A1E40",fontFamily:"'Newsreader',Georgia,serif"}}>{g.emoji} {g.name}</div>
            <div style={{marginTop:8}}>{g.pids.map(pid=>{const pp=P.find(x=>x.id===pid);return pp?<div key={pid} onClick={()=>nav(pid)} style={{fontSize:10,color:"#666",padding:"2px 0",cursor:"pointer"}}>• <span style={{color:"#2A1E40",fontWeight:600}}>{pp.emoji} {pp.name}</span></div>:null;})}</div>
            <div style={{marginTop:10,padding:10,borderRadius:10,background:`${(g.fill||g.color)}10`,fontSize:10,color:g.color,lineHeight:1.5}}><strong>Human Factors Co-PI:</strong> {g.hf}</div>
          </Card>
        ))}
      </div>

      {/* Tenure Map */}
      <Sec>🎓 Tenure Publication Map</Sec>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:10}}>
        {[
          {tier:"Top-6 Anchors",emoji:"⭐",items:P.filter(pp=>pp.tenure==="Top-6 Anchor"),color:"#9a6e2e",bg:"#fdf8f0"},
          {tier:"Top-6 Candidates",emoji:"🌟",items:P.filter(pp=>pp.tenure.includes("Candidate")||pp.tenure.includes("Reserve")),color:"#8A3458",fill:"#E0A0B8",bg:"#FCF0F4"},
          {tier:"Satellites & Builders",emoji:"🛸",items:P.filter(pp=>!pp.tenure.includes("Top-6")&&!pp.tenure.includes("Candidate")&&!pp.tenure.includes("Reserve")),color:"#5B4399",fill:"#C8B0F0",bg:"#F4F0FC"},
        ].map(tier=>(
          <Card key={tier.tier} style={{background:tier.bg}}>
            <div style={{fontSize:12,fontWeight:600,color:tier.color,marginBottom:8,fontFamily:"'Newsreader',Georgia,serif"}}>{tier.emoji} {tier.tier}</div>
            {tier.items.map(pp=>(
              <div key={pp.id} onClick={()=>nav(pp.id)} style={{fontSize:11,color:"#555",padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,0.04)",cursor:"pointer"}}>
                {pp.emoji} {pp.name}
                <div style={{fontSize:10,color:"#888"}}>{pp.journal}</div>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════
const S = {
  root:{fontFamily:"'DM Sans','Avenir',-apple-system,sans-serif",background:"linear-gradient(160deg,#F9F6FE 0%,#F8F4FA 35%,#FDF4F8 100%)",minHeight:"100vh",color:"#2A1E40",fontSize:13},
  loadWrap:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh"},
  header:{padding:"22px 24px 0",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12},
  hTitle:{fontFamily:"'Newsreader',Georgia,serif",fontSize:22,fontWeight:600,letterSpacing:-0.5,color:"#2A1E40"},
  hSub:{fontSize:11,color:"#6A5E90",marginTop:2,letterSpacing:0.3},
  dlPill:{fontSize:10,padding:"3px 10px",borderRadius:20,background:"linear-gradient(135deg,#F8E8EC,#F0D0D8)",color:"#9E1B32",fontWeight:600,border:"1px solid #DDA0B0"},
  navBar:{display:"flex",gap:3,padding:"14px 24px",borderBottom:"1px solid #E8E0F4",flexWrap:"wrap"},
  navBtn:{padding:"8px 16px",borderRadius:22,border:"none",cursor:"pointer",fontSize:12,fontWeight:400,letterSpacing:0.2,background:"transparent",color:"#6A5E90",transition:"all 0.2s",fontFamily:"inherit"},
  navActive:{fontWeight:600,background:"linear-gradient(135deg,#5B4399,#7B63B9)",color:"#fff",boxShadow:"0 2px 8px rgba(188,168,240,0.25)"},
  content:{padding:"18px 24px 36px"},
  footer:{textAlign:"center",padding:"14px 24px 22px",fontSize:10,color:"#8A80A8",letterSpacing:0.3},
};


export default HALO;
