/* Sessions 2–7 extension · V15
   Deliberately isolated from the Session 1 S1-R10 engine.
   Session 1 HTML, scoring logic and app.js are not modified by this file. */
(() => {
  'use strict';

  const q = (s, root=document) => root.querySelector(s);
  const qa = (s, root=document) => [...root.querySelectorAll(s)];
  const clamp = n => Math.max(0, Math.min(100, n));
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const keyFor = n => `pheng_group_session_${n}_v1`;

  const SESSIONS = {
    2: {
      title: 'The Health Gap Challenge',
      subtitle: 'Social Determinants & Health Inequalities',
      description: 'Redesign a local prevention plan so that distance, income, transport and digital exclusion do not widen health inequalities.',
      icons: ['🏘️','🚌','📶','⚖️'],
      team: 'Teams of 3–4', duration: '20–25 min', output: 'Team pitch · 2 min max',
      roles: [
        ['Community Voice','Keep the plan realistic for residents facing everyday barriers.'],
        ['Equity Lead','Check who benefits, who is missed and whether gaps narrow.'],
        ['Evidence Lead','Connect each choice to plausible health consequences.'],
        ['Implementation Lead','Watch cost, access, staffing and practical delivery.']
      ],
      scores: { equity:'Equity', reach:'Reach', feasibility:'Feasibility' },
      language: [
        ['Cause → effect','“If transport is limited, people miss appointments.”'],
        ['Explain a barrier','“This makes it more difficult to…”'],
        ['Qualify','“This may affect some groups more than others.”'],
        ['Recommend','“We would prioritise… because…”']
      ],
      steps: [
        { icon:'🗺️', label:'Map the barrier', question:'Which problem should the team address first?', note:'A rural district has poor health outcomes despite having a regional hospital.', checkpoint:'“Our first priority is … because when …, people …”', options:[
          ['A','Long travel times','Prioritise transport and mobile outreach for villages more than 45 minutes from care.',{equity:14,reach:12,feasibility:-4},'Access improves for isolated communities, but transport partnerships require coordination and recurring funding.'],
          ['B','Low digital access','Prioritise devices, digital support and assisted telehealth access.',{equity:10,reach:8,feasibility:2},'Digital exclusion falls, but telehealth still cannot solve every problem that requires physical examination or treatment.'],
          ['C','Low health literacy','Prioritise multilingual community health workers and plain-language information.',{equity:8,reach:10,feasibility:5},'Understanding and trust improve, although geographical and financial barriers remain.'],
          ['D','Hospital capacity','Invest first in adding specialist appointments at the regional hospital.',{equity:-5,reach:4,feasibility:6},'Capacity increases for people who can reach the hospital, but the most isolated residents may still be excluded.']
        ]},
        { icon:'🚐', label:'Choose the intervention', question:'What should the core intervention look like?', note:'You have funding for one main programme plus one small supporting action.', checkpoint:'“We chose … because if people can …, they are more likely to …”', options:[
          ['A','Mobile health days','Send a rotating mobile team to villages twice a month.',{equity:14,reach:13,feasibility:-8},'The service reaches people directly, but staffing and travel costs are substantial.'],
          ['B','Telehealth hubs','Create supported telehealth rooms in libraries and town halls.',{equity:9,reach:11,feasibility:5},'Travel decreases and digital support is available, but some consultations still need face-to-face follow-up.'],
          ['C','Transport vouchers','Fund free transport for priority appointments.',{equity:11,reach:9,feasibility:1},'Financial and transport barriers fall, but residents still depend on central services and appointment availability.'],
          ['D','Information campaign','Run a low-cost awareness campaign about existing services.',{equity:2,reach:5,feasibility:14},'Awareness rises cheaply, but information alone does not remove structural barriers.']
        ]},
        { icon:'🎯', label:'Target fairly', question:'Who should receive extra support first?', note:'Universal access remains the goal, but resources for intensive support are limited.', checkpoint:'“We would target … first. This is more equitable because …”', options:[
          ['A','Everyone equally','Give exactly the same support to every resident.',{equity:-3,reach:8,feasibility:7},'The rule feels simple, but equal inputs may preserve unequal outcomes when needs differ.'],
          ['B','Older adults living alone','Prioritise people over 70 who live alone and have transport difficulties.',{equity:10,reach:4,feasibility:4},'A clearly vulnerable group receives focused support, though other disadvantaged groups may still need attention.'],
          ['C','Highest-barrier households','Use transport, income, disability and digital-access indicators to identify households facing several barriers.',{equity:16,reach:8,feasibility:-5},'Support is closely matched to need, but identifying households fairly requires careful data governance and outreach.'],
          ['D','People who request help','Offer extra support only to residents who contact the service.',{equity:-9,reach:-4,feasibility:12},'Administration is easy, but people with the greatest barriers may be the least likely to ask for help.']
        ]},
        { icon:'📊', label:'Measure impact', question:'Which indicator best shows whether inequality is actually falling?', note:'The council wants one headline indicator after six months.', checkpoint:'“We would monitor … because a successful programme should reduce the gap between …”', options:[
          ['A','Total appointments','Count all appointments delivered in the district.',{equity:1,reach:7,feasibility:10},'Activity is easy to count, but a higher total does not prove that underserved groups benefited.'],
          ['B','Satisfaction score','Measure average patient satisfaction.',{equity:2,reach:2,feasibility:8},'Experience matters, but an average score can hide who never reached the service.'],
          ['C','Access gap','Compare timely appointment rates in high-barrier versus low-barrier areas.',{equity:16,reach:9,feasibility:0},'The measure directly tests whether the inequality gap narrows, although good subgroup data are required.'],
          ['D','Programme cost','Report spending per resident.',{equity:0,reach:0,feasibility:12},'Cost control is visible, but it says little about health access or fairness.']
        ]}
      ],
      pitch: ['Problem & determinant','Intervention','Equity trade-off','Impact measure'],
      finalPrompt: 'Explain which social determinant you prioritised, what intervention you chose, who receives extra support and how you will know the health gap is narrowing.'
    },

    3: {
      title: 'Outbreak Detective Room',
      subtitle: 'Epidemiology & Disease Surveillance',
      description: 'Investigate a fictional outbreak, choose the next epidemiological move and communicate the evidence without confusing association with causation.',
      icons: ['🕵️','🦠','📈','🔬'],
      team: 'Teams of 3–4', duration: '20–25 min', output: 'Evidence briefing · 2 min max',
      roles: [
        ['Surveillance Lead','Track who is affected, where and when.'],
        ['Study Design Lead','Choose comparisons that can answer the question.'],
        ['Risk Interpreter','Compare groups without overclaiming causality.'],
        ['Communication Lead','Turn the evidence into careful public-health English.']
      ],
      scores: { evidence:'Evidence', speed:'Speed', caution:'Scientific caution' },
      language: [
        ['Compare risk','“The exposed group had a higher rate than…”'],
        ['Associate','“Exposure was associated with…”'],
        ['Limit a claim','“This does not prove that…”'],
        ['Recommend','“The next step should be…”']
      ],
      steps: [
        { icon:'📍', label:'Define the signal', question:'What should happen first after the surveillance alert?', note:'Forty-six gastroenteritis cases have been reported across three school canteens in five days; the usual weekly number is below ten.', checkpoint:'“The first epidemiological step is … so that we can …”', options:[
          ['A','Close every school immediately','Treat all schools in the region as affected before confirming the pattern.',{evidence:-8,speed:15,caution:-12},'Action is extremely fast, but the response may be disproportionate because cases and exposures are not yet verified.'],
          ['B','Verify cases and build a case definition','Confirm symptoms, dates, schools and a consistent case definition.',{evidence:15,speed:7,caution:10},'The team creates a reliable basis for comparison while still moving quickly enough to guide the investigation.'],
          ['C','Wait for a full laboratory report','Take no field action until every suspected case is laboratory-confirmed.',{evidence:8,speed:-12,caution:8},'Specificity improves, but the investigation may lose valuable time during an active outbreak.'],
          ['D','Survey public opinion','Ask parents what they think caused the outbreak.',{evidence:-10,speed:-3,caution:-2},'Community views may reveal concerns, but they cannot replace epidemiological case verification.']
        ]},
        { icon:'🥗', label:'Compare exposures', question:'Which comparison would best test the suspected canteen exposure?', note:'Most cases ate lunch at school; investigators suspect one chilled salad supplied to several canteens.', checkpoint:'“We would compare … with … because this helps estimate …”', options:[
          ['A','Cases only','Ask only sick pupils what they ate.',{evidence:0,speed:10,caution:-6},'The team learns what cases ate but cannot tell whether that exposure was also common among pupils who stayed healthy.'],
          ['B','Cases versus unaffected pupils','Compare food exposures in cases with similar pupils who did not become ill.',{evidence:15,speed:6,caution:9},'A case-control style comparison can identify exposures that are more common among cases.'],
          ['C','Different cities','Compare the affected town with a distant city.',{evidence:-5,speed:-2,caution:2},'The populations differ in many ways, making the comparison difficult to interpret.'],
          ['D','Teachers versus pupils','Compare teachers with pupils regardless of what they ate.',{evidence:-3,speed:4,caution:0},'Age and eating patterns differ, so the comparison may introduce unnecessary confounding.']
        ]},
        { icon:'📊', label:'Interpret the numbers', question:'How should the team describe the main finding?', note:'Among pupils who ate the salad, 18% became ill; among pupils who did not, 7% became ill.', checkpoint:'“Illness was … in the exposed group, but the data …”', options:[
          ['A','The salad caused the outbreak','State that the percentages prove causation.',{evidence:-6,speed:4,caution:-16},'The difference is important, but an observational comparison alone does not prove causation.'],
          ['B','Illness was more common among exposed pupils','Describe the higher rate and say the exposure was associated with illness.',{evidence:15,speed:7,caution:15},'The wording captures the risk difference while respecting the limits of observational evidence.'],
          ['C','There was no meaningful difference','Treat 18% and 7% as essentially the same.',{evidence:-15,speed:2,caution:2},'The data show a clear difference that warrants further investigation.'],
          ['D','Only the 18% matters','Report the exposed-group figure without a comparison group.',{evidence:-8,speed:8,caution:-4},'Without the unexposed rate, the audience cannot judge how unusual the exposed-group risk is.']
        ]},
        { icon:'📣', label:'Brief the public', question:'Which message is scientifically responsible and useful?', note:'Laboratory testing is still under way, but the suspected salad has been removed from canteens.', checkpoint:'“Our public message would say … while making clear that …”', options:[
          ['A','“The supplier poisoned children.”','Name the supplier as responsible before the evidence is complete.',{evidence:-12,speed:12,caution:-18},'The message is dramatic but unjustified and potentially harmful.'],
          ['B','“There is nothing to worry about.”','Minimise the event until laboratory results are final.',{evidence:-7,speed:-2,caution:-5},'False reassurance may reduce trust and delay appropriate precautions.'],
          ['C','“Cases are being investigated; a food exposure is suspected.”','State what is known, what is uncertain and what action has already been taken.',{evidence:13,speed:9,caution:14},'The message is transparent, actionable and appropriately cautious.'],
          ['D','“All school food is unsafe.”','Generalise the signal to every product and school.',{evidence:-15,speed:10,caution:-15},'The claim goes far beyond the evidence and may create unnecessary fear.']
        ]}
      ],
      pitch: ['Signal & first action','Comparison design','Risk interpretation','Public message'],
      finalPrompt: 'Brief a public-health director: define the outbreak signal, explain your comparison, interpret the 18% versus 7% finding, and give one careful public message.'
    },

    4: {
      title: 'Vaccine Confidence Crisis',
      subtitle: 'Infectious Diseases, Pandemics & Vaccination',
      description: 'Respond to a measles cluster while protecting vulnerable people, maintaining public trust and giving clear prevention advice.',
      icons: ['💉','🦠','🛡️','📣'],
      team: 'Teams of 3–4', duration: '20–25 min', output: 'Crisis briefing · 2 min max',
      roles: [
        ['Protection Lead','Focus on outbreak control and vulnerable populations.'],
        ['Trust Lead','Protect respectful communication and public confidence.'],
        ['Clinical Advice Lead','Make prevention advice clear and practical.'],
        ['Policy Lead','Balance feasibility, proportionality and collective responsibility.']
      ],
      scores: { protection:'Protection', trust:'Trust', feasibility:'Feasibility' },
      language: [
        ['Advise','“You should…” / “Make sure you…”'],
        ['Warn','“Avoid + -ing…” / “Do not…”'],
        ['Explain','“This matters because…”'],
        ['Balance','“We need to protect…, while also…”']
      ],
      steps: [
        { icon:'🚨', label:'Immediate response', question:'What should the health authority do in the first 48 hours?', note:'A city reports 22 linked measles cases; several cases involve an unvaccinated school community.', checkpoint:'“Our immediate priority is … because this reduces …”', options:[
          ['A','Targeted contact tracing and vaccination clinics','Trace contacts, verify vaccination status and open rapid-access vaccination clinics.',{protection:15,trust:8,feasibility:5},'The response targets likely transmission chains and gives people a practical route to protection.'],
          ['B','City-wide school closures','Close every school before assessing transmission links.',{protection:8,trust:-12,feasibility:-14},'Transmission may fall, but the measure is highly disruptive and may appear disproportionate.'],
          ['C','Wait and observe','Do not intervene until case numbers rise further.',{protection:-16,trust:-5,feasibility:12},'The response is easy to administer but gives the outbreak more time to spread.'],
          ['D','Publicly blame hesitant families','Use strong criticism to pressure vaccination.',{protection:1,trust:-18,feasibility:5},'Blame may harden resistance and damage the trust needed for outbreak control.']
        ]},
        { icon:'🗣️', label:'Handle hesitancy', question:'How should clinicians speak with hesitant parents?', note:'Parents mention safety, side effects and loss of choice.', checkpoint:'“We would acknowledge …, explain …, and recommend …”', options:[
          ['A','Dismiss concerns quickly','Tell parents the worries are irrational and move on.',{protection:2,trust:-18,feasibility:8},'The message is fast but likely to damage trust and reduce willingness to engage.'],
          ['B','Listen, answer with evidence and give a clear recommendation','Acknowledge concerns, explain benefits and risks, then recommend vaccination.',{protection:13,trust:15,feasibility:6},'Respectful evidence-based communication supports both informed choice and vaccine confidence.'],
          ['C','Avoid giving any recommendation','Present information but refuse to state what clinicians recommend.',{protection:-4,trust:4,feasibility:7},'Neutrality may feel respectful, but it removes useful clinical guidance during an outbreak.'],
          ['D','Use fear-based images only','Focus the conversation on frightening outcomes.',{protection:4,trust:-10,feasibility:9},'Fear can attract attention, but it may undermine trust or cause people to disengage.']
        ]},
        { icon:'🏫', label:'School policy', question:'Which temporary school policy is most defensible during active transmission?', note:'Several pupils cannot be vaccinated for medical reasons.', checkpoint:'“We recommend … during the outbreak because …, but the policy should …”', options:[
          ['A','No policy change','Keep attendance rules unchanged for everyone.',{protection:-10,trust:4,feasibility:13},'The policy is simple but offers little extra protection to medically vulnerable pupils.'],
          ['B','Temporary exclusion after confirmed exposure for susceptible pupils','Use time-limited rules based on exposure and susceptibility, with support for affected families.',{protection:14,trust:8,feasibility:3},'The measure is targeted and protective, though communication and educational support are needed.'],
          ['C','Permanent exclusion of all unvaccinated pupils','Apply an indefinite blanket exclusion.',{protection:9,trust:-15,feasibility:-8},'Protection increases, but proportionality, access to education and trust become major concerns.'],
          ['D','Voluntary suggestions only','Ask families to decide individually after exposure.',{protection:-7,trust:7,feasibility:10},'Autonomy is preserved, but outbreak control becomes inconsistent.']
        ]},
        { icon:'📢', label:'Public warning', question:'Which message should appear on the city health page?', note:'The aim is practical prevention without panic.', checkpoint:'“Our warning would tell people to …, avoid …, and seek help if …”', options:[
          ['A','“Measles is everywhere — stay home.”','Use an alarmist general warning.',{protection:2,trust:-12,feasibility:-4},'The message creates fear but gives little precise guidance.'],
          ['B','“Check vaccination status, avoid exposing vulnerable people if symptomatic, and contact health services before attending in person.”','Give specific actions and explain why they matter.',{protection:15,trust:12,feasibility:8},'The advice is clear, actionable and helps reduce transmission while protecting healthcare settings.'],
          ['C','“Vaccination is a personal matter.”','Avoid mentioning outbreak-related precautions.',{protection:-12,trust:1,feasibility:12},'The message omits the collective risk during active transmission.'],
          ['D','Publish only case numbers','Give statistics with no prevention advice.',{protection:-4,trust:3,feasibility:11},'People receive information but not the actions needed to reduce risk.']
        ]}
      ],
      pitch: ['Immediate response','Trust strategy','School policy','Public advice'],
      finalPrompt: 'Give a two-minute outbreak briefing: immediate action, how you will address hesitancy, your temporary school policy and three clear prevention instructions.'
    },

    5: {
      title: 'The Obesogenic City Lab',
      subtitle: 'Nutrition, Obesity & Environmental Health',
      description: 'Build a prevention package that treats obesity as a population-health issue rather than reducing it to individual willpower.',
      icons: ['🥗','🏙️','🌫️','🚲'],
      team: 'Teams of 3–4', duration: '20–25 min', output: 'Policy pitch · 2 min max',
      roles: [
        ['Environment Lead','Look at food, air quality, transport and neighbourhood conditions.'],
        ['Prevention Lead','Focus on practical population-level actions.'],
        ['Evidence Lead','Separate established findings from emerging hypotheses.'],
        ['Equity Lead','Check affordability and who can realistically benefit.']
      ],
      scores: { prevention:'Prevention', equity:'Equity', evidence:'Evidence quality' },
      language: [
        ['Present perfect','“Research has linked…” / “Studies have shown…”'],
        ['Current evidence','“Researchers have identified…”'],
        ['Limitations','“A causal relationship has not yet been established.”'],
        ['Recommend','“The city should combine…”']
      ],
      steps: [
        { icon:'🔎', label:'Frame the problem', question:'How should the team describe obesity in the city strategy?', note:'Rates are highest in low-income neighbourhoods with heavy traffic, few green spaces and limited affordable fresh food.', checkpoint:'“We see obesity as … because the evidence has shown that …”', options:[
          ['A','Mostly a personal-choice problem','Focus the strategy on individual discipline and motivation.',{prevention:-8,equity:-14,evidence:-8},'The approach is simple but overlooks environmental and social conditions associated with health behaviour and exposure.'],
          ['B','A multifactorial public-health problem','Include food environment, income, activity opportunities and environmental exposures.',{prevention:14,equity:13,evidence:12},'The framing supports a broader prevention package and avoids blaming individuals.'],
          ['C','Only an air-pollution problem','Treat PM2.5 as the single explanation for obesity.',{prevention:0,equity:3,evidence:-14},'Emerging evidence is relevant, but current research does not justify reducing obesity to one causal pathway.'],
          ['D','Only a healthcare problem','Concentrate on treatment after obesity develops.',{prevention:-12,equity:0,evidence:2},'Clinical care is necessary, but prevention opportunities in the wider environment are missed.']
        ]},
        { icon:'🧺', label:'Food environment', question:'Which food-policy action should receive the largest share of funding?', note:'Healthy options exist but are more expensive and less available in deprived areas.', checkpoint:'“The city has already …; our next step should … because …”', options:[
          ['A','Healthy-food subsidies in priority neighbourhoods','Lower the price of fruit, vegetables and minimally processed staples through local retailers.',{prevention:12,equity:15,evidence:8},'Affordability improves where need is greatest, though retailer participation and monitoring are required.'],
          ['B','A poster campaign about calories','Invest mainly in awareness posters.',{prevention:2,equity:-3,evidence:3},'Information may help some residents but does not change price or availability.'],
          ['C','Ban all fast food immediately','Close all fast-food outlets city-wide.',{prevention:7,equity:-5,evidence:-2},'The intervention is dramatic but difficult to implement and may have unintended social and economic effects.'],
          ['D','Do nothing to food access','Leave food availability entirely to market demand.',{prevention:-10,equity:-12,evidence:-3},'Existing affordability and access gaps are likely to persist.']
        ]},
        { icon:'🌫️', label:'Environmental exposure', question:'How should the strategy use the emerging PM2.5–obesity evidence?', note:'Research has linked PM2.5 exposure to several health outcomes; a possible impulse-control pathway has been identified, but causality is not settled.', checkpoint:'“Research has …, but … has not yet been established; therefore we would …”', options:[
          ['A','Ignore the evidence completely','Exclude air quality until a causal pathway is certain.',{prevention:-4,equity:-2,evidence:-8},'The strategy misses a plausible co-benefit even though air-pollution reduction is already justified for other health reasons.'],
          ['B','State that PM2.5 causes obesity','Present the emerging pathway as proven fact.',{prevention:2,equity:1,evidence:-16},'The claim overstates the research and weakens scientific credibility.'],
          ['C','Use cautious language and pursue air-quality co-benefits','Reduce traffic-related pollution while saying the obesity pathway remains under investigation.',{prevention:12,equity:9,evidence:16},'The strategy gains established air-quality benefits without overstating the obesity evidence.'],
          ['D','Fund only more research','Delay all environmental action until new studies are complete.',{prevention:-7,equity:-4,evidence:8},'Knowledge may improve, but immediate preventable exposures remain unaddressed.']
        ]},
        { icon:'📏', label:'Evaluate fairly', question:'Which outcome should headline the first-year evaluation?', note:'The programme combines food access, active travel and cleaner-air measures.', checkpoint:'“We would not rely only on BMI; we would also monitor … because …”', options:[
          ['A','Average BMI only','Use one city-wide BMI average.',{prevention:3,equity:-7,evidence:1},'A single average may hide changes in behaviours, exposures and inequalities between neighbourhoods.'],
          ['B','Programme participation only','Count how many people see the campaign.',{prevention:1,equity:1,evidence:2},'Reach is useful but does not show whether health environments changed.'],
          ['C','A dashboard of access, exposure and equity indicators','Track healthy-food affordability, active travel, PM2.5 and gaps between neighbourhoods.',{prevention:13,equity:15,evidence:13},'The dashboard matches the multifactorial strategy and can show whether benefits are fairly distributed.'],
          ['D','Social-media likes','Use online engagement as the main success measure.',{prevention:-4,equity:-5,evidence:-8},'Engagement is easy to count but is a weak proxy for population-health impact.']
        ]}
      ],
      pitch: ['Problem framing','Food action','Evidence & environment','Evaluation'],
      finalPrompt: 'Pitch your city strategy: explain why obesity is multifactorial, name your food-environment action, use present-perfect evidence carefully, and state how you will evaluate impact and equity.'
    },

    6: {
      title: 'Youth Wellbeing Response',
      subtitle: 'Mental Health, Stigma & Social Media',
      description: 'Build a balanced response to youth mental-health concerns while separating allegations, company claims and research evidence.',
      icons: ['🧠','📱','💬','🤝'],
      team: 'Teams of 3–4', duration: '20–25 min', output: 'Balanced briefing · 2 min max',
      roles: [
        ['Prevention Lead','Focus on early support, screening and practical prevention.'],
        ['Youth Voice','Check tone, stigma and whether young people would trust the plan.'],
        ['Evidence Editor','Keep claims attributed and scientifically cautious.'],
        ['Service Lead','Connect communication to real routes for help.']
      ],
      scores: { support:'Support', trust:'Trust', balance:'Evidence balance' },
      language: [
        ['Attribute','“Lawyers allege that…” / “Meta argues that…”'],
        ['Report evidence','“Researchers suggest that…”'],
        ['Push back','“The company disputes…”'],
        ['Conclude cautiously','“The evidence remains complex, so…”']
      ],
      steps: [
        { icon:'📰', label:'Frame the evidence', question:'How should the team summarise the social-media controversy?', note:'Legal complaints allege that platforms knew of risks; companies dispute those allegations; researchers describe a complex evidence base.', checkpoint:'“Lawyers allege …; the company disputes …; researchers suggest …”', options:[
          ['A','Present the allegations as proven facts','State that the company knowingly harmed young users.',{support:1,trust:-7,balance:-18},'The wording removes attribution and treats disputed legal claims as established fact.'],
          ['B','Present only the company position','Say safeguards mean there is no meaningful risk.',{support:-5,trust:-5,balance:-15},'The message ignores competing evidence and concerns.'],
          ['C','Attribute each viewpoint clearly','Distinguish allegations, company responses and research findings.',{support:8,trust:11,balance:17},'The briefing remains readable while respecting uncertainty and disagreement.'],
          ['D','Avoid the topic entirely','Say the evidence is too complicated to discuss.',{support:-9,trust:-4,balance:4},'Caution is preserved, but students and families receive no useful guidance.']
        ]},
        { icon:'🧑‍🤝‍🧑', label:'Reduce stigma', question:'Which campaign message is most likely to encourage help-seeking?', note:'Many students say they worry about being judged if they ask for mental-health support.', checkpoint:'“Our message would normalise … and make it clear that …”', options:[
          ['A','“Strong people solve it alone.”','Frame help-seeking as weakness.',{support:-17,trust:-14,balance:-2},'The message reinforces stigma and may delay care.'],
          ['B','“Talk early. Support is part of staying healthy.”','Normalise help-seeking and connect mental and physical health.',{support:15,trust:14,balance:5},'The message is supportive, non-stigmatising and gives a clear direction.'],
          ['C','“Everyone needs therapy.”','Use an absolute message for all students.',{support:5,trust:-5,balance:-8},'The intention is supportive, but the claim is too broad and may alienate the audience.'],
          ['D','Use humour about mental illness','Rely on edgy jokes to gain attention.',{support:-6,trust:-11,balance:-3},'Humour may attract attention but risks trivialising distress and reinforcing stigma.']
        ]},
        { icon:'🩺', label:'Build the support route', question:'What should happen after the awareness message?', note:'The campaign will fail if students are encouraged to seek help but cannot find an accessible service.', checkpoint:'“Awareness should lead to … so that students can … before …”', options:[
          ['A','A clear stepped-care pathway','Publish urgent-help contacts, primary-care routes, counselling access and peer-support options.',{support:16,trust:11,balance:5},'The message is connected to real action and different levels of need.'],
          ['B','A self-help PDF only','Offer one document as the main response.',{support:-4,trust:0,balance:4},'Self-help can be useful, but it is not an adequate route for students with significant distress.'],
          ['C','A social-media hashtag only','Keep the intervention entirely online.',{support:-7,trust:2,balance:-2},'Visibility may rise, but service access does not improve.'],
          ['D','Screen every student automatically','Use compulsory mental-health screening without explaining consent or follow-up.',{support:6,trust:-14,balance:-5},'Early identification may improve, but trust, consent, capacity and follow-up become major concerns.']
        ]},
        { icon:'📉', label:'Measure responsibly', question:'Which result would best show whether the campaign is useful?', note:'The university wants evidence after one semester.', checkpoint:'“We would monitor …, but we would not assume that … proves …”', options:[
          ['A','Number of likes','Use social-media engagement as the main indicator.',{support:-2,trust:1,balance:-8},'Likes show visibility, not whether students received appropriate support.'],
          ['B','Help-seeking plus access and waiting-time indicators','Track appropriate service contacts, successful referrals and time to support, alongside anonymous student feedback.',{support:14,trust:10,balance:14},'The measures connect communication to real service access without claiming that one campaign explains every mental-health trend.'],
          ['C','A fall in all mental-health symptoms','Expect the campaign alone to reduce every symptom at population level.',{support:1,trust:-3,balance:-12},'The expectation overclaims what one communication intervention can achieve.'],
          ['D','No evaluation','Assume a positive message is enough.',{support:-10,trust:-4,balance:-7},'Without evaluation, the team cannot know whether the intervention reached or helped its intended audience.']
        ]}
      ],
      pitch: ['Evidence framing','Anti-stigma message','Support pathway','Evaluation'],
      finalPrompt: 'Give a balanced wellbeing briefing using precise reporting verbs: attribute the controversy, present your anti-stigma message, explain the support route and state how you would evaluate it without overclaiming.'
    },

    7: {
      title: 'Campaign Rehearsal Lab',
      subtitle: 'Final Campaign Workshop · before Session 8',
      description: 'Stress-test your real public-health campaign before the final presentation: audience, message, evidence, strategy, prevention advice, visual and impact indicator.',
      icons: ['🎯','📣','🎨','🎤'],
      team: 'Campaign groups · 1–3', duration: '25–30 min', output: 'Checkpoint pitch · 2 min max',
      teamSizes: [1,2,3],
      roles: [
        ['Audience & Need Lead','Make the target population precise and justify why it matters.'],
        ['Message & Visual Lead','Protect clarity, slogan, tone and visual impact.'],
        ['Evidence & Evaluation Lead','Check evidence, prevention advice and the success indicator.']
      ],
      scores: { clarity:'Clarity', audience:'Audience fit', evidence:'Evidence & impact' },
      language: [
        ['Problem','“Our campaign addresses … in …”'],
        ['Evidence','“Research shows/suggests that…”'],
        ['Advice','“You should…” / “Avoid + -ing…”'],
        ['Impact','“We will know it worked if…”']
      ],
      steps: [
        { icon:'🎯', label:'Sharpen the audience', question:'How precise is your target audience?', note:'The final campaign brief requires a specific population, not a vague “general public”.', checkpoint:'“Our exact target audience is … because they are a priority because …”', options:[
          ['A','Very broad','Use a target such as “young people” or “parents”.',{clarity:-8,audience:-14,evidence:0},'The campaign will struggle to choose the right tone, channel and practical action.'],
          ['B','Demographic only','Specify age but not context or need.',{clarity:3,audience:2,evidence:1},'The target is clearer, but the team still needs to explain why this group is a priority.'],
          ['C','Precise audience plus context','Define age/life situation/location and the health barrier or risk.',{clarity:14,audience:16,evidence:8},'The campaign can now tailor message, channel and prevention advice to a real audience.'],
          ['D','Institution only','Target “students at our university” without identifying which students or why.',{clarity:2,audience:-2,evidence:1},'The setting is clear but the priority population remains vague.']
        ]},
        { icon:'💬', label:'Make the message memorable', question:'Which message strategy should guide your campaign?', note:'You need one key message and a short slogan that the audience can remember.', checkpoint:'“Our one-sentence message is …; our slogan is …; the tone is … because …”', options:[
          ['A','Several competing messages','Try to communicate every fact from the course.',{clarity:-14,audience:-5,evidence:6},'The campaign contains useful information but lacks one memorable action or takeaway.'],
          ['B','One clear action-focused message','Choose one main behaviour or awareness goal and a short slogan.',{clarity:16,audience:12,evidence:4},'The campaign becomes easier to understand, repeat and adapt visually.'],
          ['C','A shocking slogan with little explanation','Prioritise attention above accuracy.',{clarity:7,audience:-4,evidence:-11},'The slogan may be memorable but can mislead or undermine trust.'],
          ['D','A technical academic message','Use specialist language to sound scientific.',{clarity:-9,audience:-12,evidence:8},'The evidence may be accurate but the target audience may not understand or remember it.']
        ]},
        { icon:'📚', label:'Prove and advise', question:'What must your evidence-and-advice section contain?', note:'The final brief asks for at least one fact/reporting verb and at least two concrete prevention recommendations.', checkpoint:'“Research … that …; therefore our audience should … and avoid …”', options:[
          ['A','One attributed fact + two concrete recommendations','Use a careful reporting verb and practical advice linked to the campaign goal.',{clarity:12,audience:9,evidence:16},'The campaign connects evidence to action and directly meets the final-task brief.'],
          ['B','Statistics without a source or reporting verb','Use a striking number with no attribution.',{clarity:5,audience:4,evidence:-12},'The number may attract attention but weakens credibility and course-language reinvestment.'],
          ['C','Advice only','Give recommendations without explaining why they matter.',{clarity:8,audience:5,evidence:-7},'The campaign is practical but the audience lacks an evidence-based reason to act.'],
          ['D','Evidence only','Explain the problem but give no behavioural or prevention advice.',{clarity:2,audience:-5,evidence:8},'The campaign informs the audience but does not clearly tell them what to do.']
        ]},
        { icon:'📈', label:'Design the proof of impact', question:'How will you show that the campaign worked?', note:'The final presentation needs one simple indicator and at least one visual support.', checkpoint:'“Our visual will show …; we will measure …; success would mean …”', options:[
          ['A','A concrete visual + one measurable indicator','Show a poster/post/mock-up and track one behaviour, reach or service indicator that matches the goal.',{clarity:14,audience:12,evidence:14},'The campaign is presentation-ready and has a plausible way to judge impact.'],
          ['B','A beautiful visual only','Focus entirely on aesthetics.',{clarity:9,audience:8,evidence:-8},'The presentation may look strong but lacks an evaluation plan.'],
          ['C','A complex evaluation framework','Use many indicators and technical methods in the presentation.',{clarity:-8,audience:-5,evidence:12},'The plan may be rigorous but is too complicated for a concise campaign presentation.'],
          ['D','No visual and no indicator','Rely on spoken explanation only.',{clarity:-12,audience:-10,evidence:-10},'The plan does not meet key elements of the final-task brief.']
        ]}
      ],
      pitch: ['Audience & problem','Message & slogan','Evidence & advice','Visual & impact'],
      finalPrompt: 'Deliver a two-minute checkpoint version of your real Session 8 campaign. Every member should contribute where possible. This is a rehearsal: your final Session 8 presentation remains longer and follows the official brief.'
    }
  };

  let activeSession = null;
  let timerHandle = null;
  let timerSeconds = 120;

  function loadState(n){
    const fallback = {choices:[],step:0,outcome:null,completed:false,teamSize:(SESSIONS[n].teamSizes?.[0] || 4)};
    try {
      const raw = JSON.parse(localStorage.getItem(keyFor(n)) || 'null');
      if(!raw || typeof raw !== 'object') return fallback;
      const validChoices = Array.isArray(raw.choices) ? raw.choices.slice(0, SESSIONS[n].steps.length) : [];
      const state = {...fallback,...raw,choices:validChoices};
      state.step = Math.max(0, Math.min(SESSIONS[n].steps.length, Number(state.step)||0));
      state.completed = Boolean(state.completed && state.choices.length === SESSIONS[n].steps.length);
      return state;
    } catch { return fallback; }
  }
  function saveStateExtra(n,state){
    try { localStorage.setItem(keyFor(n), JSON.stringify(state)); } catch {}
  }
  function clearCompletionSignal(n){
    try {
      if(typeof activity!=='undefined' && Array.isArray(activity.group)){
        activity.group=activity.group.filter(x=>x!==`session${n}`);
        if(typeof saveState==='function') saveState();
      }
    } catch {}
  }
  function resetState(n){
    stopTimer();
    const s = {choices:[],step:0,outcome:null,completed:false,teamSize:(SESSIONS[n].teamSizes?.[0] || 4)};
    saveStateExtra(n,s);
    clearCompletionSignal(n);
    refreshCard(n);
    return s;
  }
  function optionFor(n, stepIndex, id){
    return SESSIONS[n].steps[stepIndex]?.options.find(o=>o[0]===id) || null;
  }
  function scoresFor(n, choices){
    const labels = Object.keys(SESSIONS[n].scores);
    const scores = Object.fromEntries(labels.map(k=>[k,50]));
    choices.forEach((id,i)=>{
      const opt = optionFor(n,i,id); if(!opt) return;
      for(const [k,v] of Object.entries(opt[3]||{})) scores[k]=clamp(scores[k]+Number(v||0));
    });
    return scores;
  }
  function decisionCode(n,state){
    return `S${n}-${state.choices.map(x=>x||'?').join('')}${'?'.repeat(Math.max(0,SESSIONS[n].steps.length-state.choices.length))}`;
  }
  function impacts(n, stepIndex, option, beforeScores){
    const after = {...beforeScores};
    for(const [k,v] of Object.entries(option[3]||{})) after[k]=clamp(after[k]+Number(v||0));
    return Object.keys(SESSIONS[n].scores).map(k=>[k,after[k]-beforeScores[k]]);
  }
  function scoreBoard(n,scores){
    return `<div class="extra-score-grid">${Object.entries(SESSIONS[n].scores).map(([k,label])=>`<div class="extra-score"><div class="extra-score-head"><span>${escapeHtml(label)}</span><strong>${scores[k]}</strong></div><div class="extra-score-track"><div style="width:${scores[k]}%"></div></div></div>`).join('')}</div>`;
  }
  function pitchBuilder(n,state){
    const cfg=SESSIONS[n];
    return `<section class="extra-pitch-builder"><span class="eyebrow">Pitch Builder</span><h4>Your 2-minute briefing is built as you go.</h4><div class="extra-pitch-parts">${cfg.pitch.map((label,i)=>{const opt=optionFor(n,i,state.choices[i]);return `<div class="extra-pitch-part ${opt?'done':''}"><strong>${i+1} · ${escapeHtml(label)}</strong><span>${opt?`✓ ${escapeHtml(opt[1])}`:'Waiting for this decision'}</span></div>`}).join('')}</div></section>`;
  }
  function languageStrip(n){
    return `<div class="extra-language-strip">${SESSIONS[n].language.map(x=>`<div><strong>${escapeHtml(x[0])}</strong><small>${escapeHtml(x[1])}</small></div>`).join('')}</div>`;
  }
  function rolePlan(n,size){
    const roles=SESSIONS[n].roles;
    if(size<=1) return [`Student 1: ${roles.map(r=>r[0]).join(' + ')}`];
    if(size===2) return [`Student 1: ${roles.filter((_,i)=>i%2===0).map(r=>r[0]).join(' + ')}`,`Student 2: ${roles.filter((_,i)=>i%2===1).map(r=>r[0]).join(' + ')}`];
    if(size===3 && roles.length===4) return [`Student 1: ${roles[0][0]}`,`Student 2: ${roles[1][0]}`,`Student 3: ${roles[2][0]} + ${roles[3][0]}`];
    return roles.slice(0,size).map((r,i)=>`Student ${i+1}: ${r[0]}`);
  }
  function speakerPlan(n,size){
    if(size<=1) return '<ol class="extra-speaker-plan"><li><strong>Student 1:</strong> deliver all four parts. Target 1:40–1:55.</li></ol>';
    if(size===2) return '<ol class="extra-speaker-plan"><li><strong>Student 1 · 0:00–0:55:</strong> Parts 1–2.</li><li><strong>Student 2 · 0:55–1:50:</strong> Parts 3–4 + conclusion.</li></ol>';
    if(size===3) return '<ol class="extra-speaker-plan"><li><strong>Student 1 · 0:00–0:35:</strong> Part 1.</li><li><strong>Student 2 · 0:35–1:10:</strong> Part 2.</li><li><strong>Student 3 · 1:10–1:55:</strong> Parts 3–4 + conclusion.</li></ol>';
    return '<ol class="extra-speaker-plan"><li><strong>Student 1 · 0:00–0:28:</strong> Part 1.</li><li><strong>Student 2 · 0:28–0:56:</strong> Part 2.</li><li><strong>Student 3 · 0:56–1:24:</strong> Part 3.</li><li><strong>Student 4 · 1:24–1:55:</strong> Part 4 + conclusion.</li></ol>';
  }
  function stopTimer(){ if(timerHandle){clearInterval(timerHandle);timerHandle=null;} }
  function paintTimer(n){
    const d=q(`#s${n}TimerDisplay`), status=q(`#s${n}TimerStatus`), start=q(`#s${n}TimerStart`); if(!d)return;
    d.textContent=`${Math.floor(timerSeconds/60)}:${String(timerSeconds%60).padStart(2,'0')}`;
    d.classList.toggle('warning',timerSeconds<=20);
    if(start) start.textContent=timerHandle?'Pause':'Start';
    if(status) status.textContent=timerSeconds===0?'STOP · 2:00 reached.':timerSeconds<=20?'Final 20 seconds. Conclude now.':'Aim to finish between 1:45 and 1:55.';
  }
  function setupTimer(n){
    stopTimer();timerSeconds=120;paintTimer(n);
    const start=q(`#s${n}TimerStart`), reset=q(`#s${n}TimerReset`);
    if(start)start.onclick=()=>{if(timerHandle){stopTimer();paintTimer(n);return;}if(timerSeconds===0)timerSeconds=120;timerHandle=setInterval(()=>{timerSeconds=Math.max(0,timerSeconds-1);if(timerSeconds===0)stopTimer();paintTimer(n);},1000);paintTimer(n)};
    if(reset)reset.onclick=()=>{stopTimer();timerSeconds=120;paintTimer(n)};
  }

  function markComplete(n){
    try {
      if(typeof activity!=='undefined' && Array.isArray(activity.group) && !activity.group.includes(`session${n}`)){
        activity.group.push(`session${n}`);
        if(typeof saveState==='function') saveState();
      }
    } catch {}
  }
  function restoreCompletionSignals(){
    try {
      if(typeof activity==='undefined' || !Array.isArray(activity.group))return;
      for(let n=2;n<=7;n++) if(loadState(n).completed && !activity.group.includes(`session${n}`)) activity.group.push(`session${n}`);
      if(typeof saveState==='function') saveState();
    } catch {}
  }

  function cardHtml(n){
    const c=SESSIONS[n],state=loadState(n);
    const status=state.completed?'Completed on this device':state.choices.length?`In progress · ${state.choices.length}/${c.steps.length} decisions`:'Not started';
    const cta=state.completed?`View Session ${n} result →`:state.choices.length?`Resume Session ${n} →`:`Open Session ${n} →`;
    return `<button type="button" class="session-launch-card extra-session-card" id="session${n}CardButton" data-extra-session="${n}" aria-labelledby="session${n}CardTitle" aria-describedby="session${n}CardDesc session${n}CardStatus"><span class="session-launch-visual" aria-hidden="true">${c.icons.map(i=>`<span>${i}</span>`).join('')}</span><span class="session-launch-content"><span class="session-number">SESSION ${n}</span><span class="session-card-title" id="session${n}CardTitle">${escapeHtml(c.title)}</span><span class="session-card-description" id="session${n}CardDesc">${escapeHtml(c.subtitle)} · ${escapeHtml(c.description)}</span><span class="session-card-meta"><span>👥 ${escapeHtml(c.team)}</span><span>⏱ ${escapeHtml(c.duration)}</span><span>🎙 ${escapeHtml(c.output)}</span><span>🧭 Fixed choices</span></span><span class="session-card-status" id="session${n}CardStatus" aria-live="polite">${escapeHtml(status)}</span><span class="session-open-cta" id="session${n}CardCta">${escapeHtml(cta)}</span></span></button>`;
  }
  function refreshCard(n){
    const state=loadState(n),cfg=SESSIONS[n],s=q(`#session${n}CardStatus`),c=q(`#session${n}CardCta`);if(!s||!c)return;
    if(state.completed){s.textContent='Completed on this device';c.textContent=`View Session ${n} result →`;}
    else if(state.choices.length){s.textContent=`In progress · ${state.choices.length}/${cfg.steps.length} decisions`;c.textContent=`Resume Session ${n} →`;}
    else{s.textContent='Not started';c.textContent=`Open Session ${n} →`;}
  }

  function detailShell(n){
    const c=SESSIONS[n];
    return `<section id="session${n}Detail" class="session-detail extra-session-detail" hidden aria-labelledby="session${n}DetailTitle"><div class="session-detail-toolbar"><button type="button" data-extra-back>← Back to sessions</button><span class="badge">Session ${n}</span></div><section class="extra-session-hero"><div><span class="eyebrow">Session ${n} · ${escapeHtml(c.subtitle)}</span><h3 id="session${n}DetailTitle" tabindex="-1">${escapeHtml(c.title)}</h3><p>${escapeHtml(c.description)}</p><div class="extra-session-meta"><span>👥 ${escapeHtml(c.team)}</span><span>⏱ ${escapeHtml(c.duration)}</span><span>🎙 ${escapeHtml(c.output)}</span><span>🧭 deterministic choices</span></div><div class="extra-session-actions"><button class="primary-action" id="s${n}StartHero">▶ Start / resume mission</button><button id="s${n}ResetHero">↻ Reset this session</button></div></div><div class="extra-session-hero-visual" aria-hidden="true">${c.icons.map(i=>`<div>${i}</div>`).join('')}</div></section><section id="s${n}Workspace" class="extra-session-workspace" aria-live="polite"></section>${languageStrip(n)}</section>`;
  }

  function hideAllDetails(){
    stopTimer();
    qa('.extra-session-detail').forEach(x=>x.hidden=true);
  }
  function showLibrary(focus=false){
    activeSession=null;hideAllDetails();
    const lib=q('#groupSessionLibrary');if(lib)lib.hidden=false;
    const s1=q('#session1Detail');if(s1)s1.hidden=true;
    for(let n=2;n<=7;n++)refreshCard(n);
    if(focus)q('#session1CardButton')?.focus();
  }
  function openSession(n){
    stopTimer();activeSession=n;
    const lib=q('#groupSessionLibrary');if(lib)lib.hidden=true;
    const s1=q('#session1Detail');if(s1)s1.hidden=true;
    qa('.extra-session-detail').forEach(x=>x.hidden=x.id!==`session${n}Detail`);
    renderOverview(n,false);
    requestAnimationFrame(()=>q(`#session${n}DetailTitle`)?.focus());
  }

  function missionMap(n){
    return `<div class="extra-mission-map">${SESSIONS[n].steps.map((s,i)=>`<article><span>${s.icon}</span><strong>${i+1} · ${escapeHtml(s.label)}</strong></article>`).join('')}</div>`;
  }
  function renderOverview(n,scroll=true){
    const cfg=SESSIONS[n],state=loadState(n),ws=q(`#s${n}Workspace`);if(!ws)return;
    const allowed=cfg.teamSizes||[3,4]; if(!allowed.includes(Number(state.teamSize)))state.teamSize=allowed[0]; saveStateExtra(n,state);
    ws.innerHTML=`<article><div class="extra-session-overview-grid"><section class="extra-session-panel"><span class="eyebrow">Mission map</span><h4>Four decisions → one structured briefing</h4><p>Discuss every option before confirming one shared answer. After each consequence, complete the speaking checkpoint aloud.</p>${missionMap(n)}</section><section class="extra-session-panel"><span class="eyebrow">Team roles</span><h4>Give everyone a job.</h4><div class="extra-role-grid">${cfg.roles.map(r=>`<div class="extra-role-card"><strong>${escapeHtml(r[0])}</strong><small>${escapeHtml(r[1])}</small></div>`).join('')}</div><label>Team size <select id="s${n}TeamSize">${allowed.map(x=>`<option value="${x}" ${Number(state.teamSize)===x?'selected':''}>${x} student${x>1?'s':''}</option>`).join('')}</select></label><button id="s${n}AssignRoles">Assign roles</button><div id="s${n}RoleBox" class="extra-role-assignment" hidden></div></section></div><section class="extra-session-panel"><span class="eyebrow">Your final output</span><h4>${escapeHtml(cfg.output)}</h4><p>${escapeHtml(cfg.finalPrompt)}</p><p><strong>Same choices = same scores and same decision code.</strong> There is no random scoring.</p><div class="extra-session-actions"><button class="primary-action" id="s${n}Start">${state.completed?'🏁 View final briefing':state.choices.length?'▶ Resume mission':'▶ Start mission'}</button>${state.choices.length?`<button id="s${n}Reset">↻ Reset choices</button>`:''}<button data-extra-back>← Back to sessions</button></div></section>${pitchBuilder(n,state)}</article>`;
    const team=q(`#s${n}TeamSize`); if(team)team.onchange=()=>{state.teamSize=Number(team.value);saveStateExtra(n,state);const rb=q(`#s${n}RoleBox`);if(rb&&!rb.hidden)paintRoles(n,state)};
    q(`#s${n}AssignRoles`)?.addEventListener('click',()=>paintRoles(n,state));
    q(`#s${n}Start`)?.addEventListener('click',()=>{if(state.completed)renderFinal(n);else renderStep(n)});
    q(`#s${n}Reset`)?.addEventListener('click',()=>{if(confirm('Reset this session and remove its saved choices on this device?')){resetState(n);renderOverview(n)}});
    qa('[data-extra-back]',ws).forEach(b=>b.addEventListener('click',()=>showLibrary(true)));
    if(scroll)ws.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function paintRoles(n,state){
    state.teamSize=Number(q(`#s${n}TeamSize`)?.value||state.teamSize||4);saveStateExtra(n,state);
    const box=q(`#s${n}RoleBox`);if(!box)return;box.hidden=false;box.innerHTML=`<strong>Suggested role split</strong><p>${rolePlan(n,state.teamSize).map(escapeHtml).join('<br>')}</p><small>You may swap roles. The roles organise discussion; they do not change the scores.</small>`;
  }

  function renderStep(n){
    stopTimer();const cfg=SESSIONS[n],state=loadState(n);if(state.completed||state.step>=cfg.steps.length){renderFinal(n);return;}if(state.outcome){renderOutcome(n);return;}
    const step=cfg.steps[state.step],scores=scoresFor(n,state.choices),progress=Math.round(((state.step+1)/cfg.steps.length)*100),ws=q(`#s${n}Workspace`);
    ws.innerHTML=`<article><div class="extra-progress"><div><strong>Decision ${state.step+1} of ${cfg.steps.length}</strong><small>${escapeHtml(step.label)}</small></div><div class="extra-progress-count">${state.step+1}/${cfg.steps.length}</div><div class="extra-progress-track" role="progressbar" aria-valuemin="1" aria-valuemax="${cfg.steps.length}" aria-valuenow="${state.step+1}"><div style="width:${progress}%"></div></div></div><aside class="extra-decision-visual"><span class="icon" aria-hidden="true">${step.icon}</span><div><strong>${escapeHtml(step.label)}</strong><small>${escapeHtml(step.note)}</small></div><span class="extra-code">${escapeHtml(decisionCode(n,state))}</span></aside><h3 id="s${n}StepHeading" tabindex="-1">${escapeHtml(step.question)}</h3>${scoreBoard(n,scores)}${pitchBuilder(n,state)}<div class="extra-choice-grid">${step.options.map(o=>`<button type="button" class="extra-choice-card" data-extra-choice="${o[0]}" aria-pressed="false"><span class="extra-choice-letter">${o[0]}</span><strong>${escapeHtml(o[1])}</strong><span>${escapeHtml(o[2])}</span></button>`).join('')}</div><div class="extra-step-actions"><button class="primary-action" id="s${n}Confirm" disabled>Confirm this group choice</button><button id="s${n}Overview">Session overview</button><button data-extra-back>← Back to sessions</button></div><p id="s${n}ChoiceHint" class="fiction-note" role="status" aria-live="polite">Discuss all four options, then select one shared answer.</p></article>`;
    let selected=null;qa('[data-extra-choice]',ws).forEach(btn=>btn.onclick=()=>{selected=btn.dataset.extraChoice;qa('[data-extra-choice]',ws).forEach(x=>{const on=x===btn;x.classList.toggle('selected',on);x.setAttribute('aria-pressed',String(on))});q(`#s${n}Confirm`).disabled=false;q(`#s${n}ChoiceHint`).textContent=`Selected option ${selected}. Confirm only when the whole team agrees.`});
    q(`#s${n}Confirm`).onclick=()=>{if(!selected)return;state.choices=state.choices.slice(0,state.step);state.choices[state.step]=selected;state.outcome={stepIndex:state.step,choiceId:selected};saveStateExtra(n,state);renderOutcome(n)};
    q(`#s${n}Overview`).onclick=()=>renderOverview(n);
    qa('[data-extra-back]',ws).forEach(b=>b.onclick=()=>showLibrary(true));
    requestAnimationFrame(()=>q(`#s${n}StepHeading`)?.focus());ws.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderOutcome(n){
    const cfg=SESSIONS[n],state=loadState(n),r=state.outcome;if(!r){renderStep(n);return;}const step=cfg.steps[r.stepIndex],opt=optionFor(n,r.stepIndex,r.choiceId);if(!step||!opt){state.outcome=null;saveStateExtra(n,state);renderStep(n);return;}
    const before=scoresFor(n,state.choices.slice(0,r.stepIndex)),after=scoresFor(n,state.choices),impact=impacts(n,r.stepIndex,opt,before),ws=q(`#s${n}Workspace`);
    ws.innerHTML=`<article><div class="extra-progress"><div><strong>Decision ${r.stepIndex+1} complete</strong><small>Read the consequence, then do the Pitch Checkpoint aloud.</small></div><div class="extra-progress-count">${r.stepIndex+1}/${cfg.steps.length}</div><div class="extra-progress-track"><div style="width:${Math.round(((r.stepIndex+1)/cfg.steps.length)*100)}%"></div></div></div><aside class="extra-decision-visual"><span class="icon" aria-hidden="true">${step.icon}</span><div><strong>${escapeHtml(step.label)} · consequence</strong><small>You chose ${escapeHtml(opt[0]+'. '+opt[1])}</small></div><span class="extra-code">${escapeHtml(decisionCode(n,state))}</span></aside>${scoreBoard(n,after)}<div class="extra-consequence"><strong>What happens next?</strong><p>${escapeHtml(opt[4])}</p><div class="extra-impact-pills">${impact.map(([k,v])=>`<span>${escapeHtml(cfg.scores[k])} ${v>=0?'+':''}${v}</span>`).join('')}</div></div><aside class="extra-checkpoint"><span class="icon" aria-hidden="true">🎙️</span><div><strong>Pitch Checkpoint · say one sentence now</strong><p>${escapeHtml(step.checkpoint)}</p><small>Agree on the idea before continuing. This sentence prepares one part of your final briefing.</small></div></aside>${pitchBuilder(n,state)}<div class="extra-step-actions"><button class="primary-action" id="s${n}Continue">${r.stepIndex===cfg.steps.length-1?'Build final briefing →':'Checkpoint done · next decision →'}</button><button id="s${n}OutcomeOverview">Session overview</button><button data-extra-back>← Back to sessions</button></div></article>`;
    q(`#s${n}Continue`).onclick=()=>{state.step=r.stepIndex+1;state.outcome=null;if(state.step>=cfg.steps.length){state.completed=true;markComplete(n)}saveStateExtra(n,state);state.completed?renderFinal(n):renderStep(n)};
    q(`#s${n}OutcomeOverview`).onclick=()=>renderOverview(n);
    qa('[data-extra-back]',ws).forEach(b=>b.onclick=()=>showLibrary(true));
    ws.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function finalProfile(n,scores){
    const vals=Object.values(scores),min=Math.min(...vals),max=Math.max(...vals),avg=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
    if(min>=72)return ['🏆','Balanced public-health response','Your choices perform strongly across all three priorities.'];
    if(max-min<=12 && avg>=62)return ['⚖️','Pragmatic balanced response','Your team avoided a major weak point and built a defensible compromise.'];
    const [best]=Object.entries(scores).sort((a,b)=>b[1]-a[1])[0];return ['🧭',`${SESSIONS[n].scores[best]}-first strategy`,'Your plan has a clear strength. In the briefing, acknowledge the trade-off created by the lower-scoring priority.'];
  }
  function finalScript(n,state){
    const cfg=SESSIONS[n];return cfg.pitch.map((label,i)=>{const opt=optionFor(n,i,state.choices[i]);return `<p><strong>${i+1} · ${escapeHtml(label)}:</strong> “We chose <mark>${escapeHtml(opt?opt[1]:'—')}</mark>. Our reason is … The key consequence/trade-off is …”</p>`}).join('');
  }
  function renderFinal(n){
    stopTimer();const cfg=SESSIONS[n],state=loadState(n);if(state.choices.length!==cfg.steps.length){state.completed=false;state.step=Math.min(state.choices.length,cfg.steps.length-1);saveStateExtra(n,state);renderStep(n);return;}state.completed=true;markComplete(n);saveStateExtra(n,state);refreshCard(n);
    const scores=scoresFor(n,state.choices),profile=finalProfile(n,scores),ws=q(`#s${n}Workspace`),size=Number(state.teamSize)||4;
    ws.innerHTML=`<article><div class="group-profile-banner"><div class="group-profile-icon" aria-hidden="true">${profile[0]}</div><div><span class="eyebrow">Session ${n} complete</span><h3 id="s${n}ResultHeading" tabindex="-1">${escapeHtml(profile[1])}</h3><p>${escapeHtml(profile[2])}</p></div></div><div class="extra-session-panel"><div class="extra-progress"><div><strong>Final decision code</strong><small>Fixed choices · same code = same scores</small></div><span class="extra-code">${escapeHtml(decisionCode(n,state))}</span></div>${scoreBoard(n,scores)}</div>${pitchBuilder(n,state)}<div class="extra-final-grid"><section class="extra-session-panel"><span class="eyebrow">Final speaking task</span><h4>${escapeHtml(cfg.output)}</h4><p>${escapeHtml(cfg.finalPrompt)}</p><p><strong>Every student speaks whenever the group has more than one member.</strong> Explain reasoning and one trade-off; do not just list choices.</p>${speakerPlan(n,size)}</section><section class="extra-session-panel"><span class="eyebrow">Ready-to-rehearse scaffold</span><h4>Use the choices — add your reasoning yourselves.</h4><div class="extra-script">${finalScript(n,state)}</div></section></div><section class="extra-timer"><div><span class="eyebrow">Rehearsal</span><h4>Two-minute hard-stop timer</h4><p id="s${n}TimerStatus" role="status" aria-live="polite">Aim to finish between 1:45 and 1:55.</p></div><div class="extra-timer-controls"><strong class="extra-timer-display" id="s${n}TimerDisplay">2:00</strong><button class="primary-action" id="s${n}TimerStart">Start</button><button id="s${n}TimerReset">Reset</button></div></section><div class="extra-step-actions"><button class="primary-action" id="s${n}Replay">↻ Play again</button><button id="s${n}FinalOverview">Session overview</button><button data-extra-back>← Back to sessions</button></div></article>`;
    q(`#s${n}Replay`).onclick=()=>{if(confirm('Start this session again from Decision 1?')){resetState(n);renderStep(n)}};
    q(`#s${n}FinalOverview`).onclick=()=>renderOverview(n);
    qa('[data-extra-back]',ws).forEach(b=>b.onclick=()=>showLibrary(true));setupTimer(n);requestAnimationFrame(()=>q(`#s${n}ResultHeading`)?.focus());ws.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function inject(){
    const library=q('#groupSessionLibrary'),s1=q('#session1CardButton'),group=q('#groupactivity');if(!library||!s1||!group)return;
    let grid=q('.session-launch-grid',library);
    if(!grid){
      grid=document.createElement('div');grid.className='session-launch-grid';s1.parentNode.insertBefore(grid,s1);grid.appendChild(s1);
    }
    for(let n=2;n<=7;n++){if(!q(`#session${n}CardButton`)){grid.insertAdjacentHTML('beforeend',cardHtml(n));}}
    const s1Detail=q('#session1Detail');
    let insertAfter=s1Detail;
    for(let n=2;n<=7;n++){
      if(!q(`#session${n}Detail`)){
        insertAfter.insertAdjacentHTML('afterend',detailShell(n));
        insertAfter=q(`#session${n}Detail`);
      } else insertAfter=q(`#session${n}Detail`);
    }
    for(let n=2;n<=7;n++){
      q(`#session${n}CardButton`)?.addEventListener('click',()=>openSession(n));
      q(`#s${n}StartHero`)?.addEventListener('click',()=>{const st=loadState(n);st.completed?renderFinal(n):renderStep(n)});
      q(`#s${n}ResetHero`)?.addEventListener('click',()=>{if(confirm('Reset this session and remove its saved choices on this device?')){resetState(n);renderOverview(n)}});
      qa('[data-extra-back]',q(`#session${n}Detail`)).forEach(b=>b.addEventListener('click',()=>showLibrary(true)));
    }
    restoreCompletionSignals();
    const groupNav=q('[data-page="groupactivity"]'); if(groupNav)groupNav.addEventListener('click',()=>setTimeout(()=>showLibrary(false),0));
    window.addEventListener('hashchange',()=>{if(location.hash==='#groupactivity')setTimeout(()=>showLibrary(false),0);else stopTimer();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stopTimer();});
    window.addEventListener('beforeunload',stopTimer);
    for(let n=2;n<=7;n++)refreshCard(n);
  }

  window.openPublicHealthGroupSession = openSession;
  inject();
})();
