/**
* Template behavior adapted for Ibbo Abdoli portfolio.
*/
(function() {
  "use strict";

  const select = (selector, all = false) => {
    selector = selector.trim();
    return all ? Array.from(document.querySelectorAll(selector)) : document.querySelector(selector);
  };

  const header = select('#header');
  const navbar = select('#navbar');
  const navToggle = select('.mobile-nav-toggle');
  const sections = select('section', true);
  const navlinks = select('#navbar .nav-link', true);
  const languageButtons = select('.language-switch button', true);

  const pageMeta = {
    sv: {
      title: 'Ibbo Abdoli | Serviceingenjör & Automationstekniker i Sverige',
      description: 'Ibbo Abdoli är serviceingenjör och automationstekniker i Södertälje med fokus på industriell automation, PLC, ABB-robotar, visionssystem, el-felsökning och minskade produktionsstopp.',
      locale: 'sv_SE'
    },
    en: {
      title: 'Ibbo Abdoli | Service Engineer & Automation Technician in Sweden',
      description: 'Ibbo Abdoli is a Service Engineer and Automation Technician in Södertälje, Sweden, focused on industrial automation, PLC, ABB robots, machine vision, EAVS, Cognex, electrical troubleshooting and reducing production downtime.',
      locale: 'en_US'
    }
  };

  const cases = {
    sv: [
      {
        label: 'Produktionssupport',
        title: 'Felsökning av produktions- och förpackningsmaskiner',
        summary: 'Produktions- och förpackningsmaskiner',
        body: [
          '<strong>Läge:</strong> Produktionsmaskiner och förpackningsutrustning behövde snabb och strukturerad felsökning vid störningar.',
          '<strong>Metod:</strong> Kontrollerade givare, motorer, maskinstatus, elskåp och felhistorik för att hitta grundorsaken.',
          '<strong>Resultat:</strong> Tydliga åtgärder, praktiskt reparationsstöd och dokumenterade fynd för underhållsuppföljning.'
        ],
        tools: ['El-felsökning', 'Produktionsutrustning', 'Underhållsstöd']
      },
      {
        label: 'Elkontroll',
        title: 'Elskåpskontroll och termografi',
        summary: 'Electrical cabinet inspection and thermography',
        body: [
          '<strong>Läge:</strong> Elinstallationer behövde kontroll, riskobservationer och förebyggande genomgång i industriell miljö.',
          '<strong>Metod:</strong> Granskade skåpskick, värmemönster vid belastning, synliga riskpunkter och dokumentation enligt svensk elpraxis.',
          '<strong>Resultat:</strong> Bättre överblick över elrisker och tydlig dokumentation för prioriterade underhållsåtgärder.'
        ],
        tools: ['Termografi', 'SS 436 40 00', 'Riskbedömning']
      },
      {
        label: 'Automationsdiagnostik',
        title: 'Verifiering av PLC, I/O-signaler och maskinstatus',
        summary: 'PLC, I/O signal and machine status verification',
        body: [
          '<strong>Läge:</strong> Automationsstopp krävde verifiering av fältsignaler, PLC-status och maskinsekvenser.',
          '<strong>Metod:</strong> Följde signalkedjan från givare och aktuatorer till I/O-diagnostik, maskinlogik och operatörsindikeringar.',
          '<strong>Resultat:</strong> Snabbare uppdelning mellan elektriska, mekaniska och automationsrelaterade orsaker.'
        ],
        tools: ['PLC-diagnostik', 'I/O-verifiering', 'TIA Portal grunder']
      },
      {
        label: 'Robot och vision',
        title: 'Kontroll av ABB-robot och visionssekvenser',
        summary: 'ABB robot and vision sequence checks',
        body: [
          '<strong>Läge:</strong> Robotceller och visionsfunktioner behövde kontroller kring triggar, kommunikation och larmtillstånd.',
          '<strong>Metod:</strong> Granskade robotsignaler, kamerainsamling, trigg-timing, säkerhetsstatus och relaterade automationsvillkor.',
          '<strong>Resultat:</strong> Mer tillförlitlig felsökningsväg mellan robot, vision och maskinstyrning.'
        ],
        tools: ['ABB RobotStudio', 'EAVS', 'Cognex VisionPro']
      },
      {
        label: 'Servicekvalitet',
        title: 'Servicedokumentation och kundkommunikation',
        summary: 'Service documentation and customer communication',
        body: [
          '<strong>Läge:</strong> Underhållsteam behövde tydlig information efter serviceåtgärder, felsökning och förbättringsobservationer.',
          '<strong>Metod:</strong> Sammanfattade symptom, utförda kontroller, troliga orsaker, åtgärder och rekommenderade nästa steg.',
          '<strong>Resultat:</strong> Enklare överlämning, bättre spårbarhet och mer fokuserad uppföljning för produktion och underhåll.'
        ],
        tools: ['Servicerapporter', 'Felhistorik', 'Teknisk kommunikation']
      },
      {
        label: 'Ständig förbättring',
        title: 'Förbättringsidéer för el- och maskintillförlitlighet',
        summary: 'Improvement ideas for electrical and machine reliability',
        body: [
          '<strong>Läge:</strong> Återkommande störningar och praktiska observationer skapade möjligheter att förbättra maskintillförlitlighet.',
          '<strong>Metod:</strong> Kombinerade praktiskt reparationsarbete med riskobservationer, servicehistorik och dialog med lokala team.',
          '<strong>Resultat:</strong> Praktiska förbättringsförslag som stödjer säkrare, stabilare och mer lättunderhållen utrustning.'
        ],
        tools: ['Grundorsakstänkande', 'Tillförlitlighet', 'Fältobservationer']
      }
    ],
    en: [
      {
        label: 'Production support',
        title: 'Manufacturing & Packaging Machine Troubleshooting',
        summary: 'Felsökning av produktions- och förpackningsmaskiner',
        body: [
          '<strong>Situation:</strong> Production machines and packaging equipment required fast, structured fault finding during disturbances.',
          '<strong>Method:</strong> Checked sensors, motors, machine status, cabinet conditions and fault history to isolate the root cause.',
          '<strong>Result:</strong> Clear corrective actions, practical repair support and documented findings for maintenance follow-up.'
        ],
        tools: ['Electrical troubleshooting', 'Production equipment', 'Maintenance support']
      },
      {
        label: 'Electrical inspection',
        title: 'Electrical Cabinet Inspection & Thermography',
        summary: 'Elskåpskontroll och termografi',
        body: [
          '<strong>Situation:</strong> Electrical installations needed inspection, risk observations and preventive checks in an industrial environment.',
          '<strong>Method:</strong> Reviewed cabinet condition, load-related heat patterns, visible risk points and inspection notes aligned with Swedish electrical practice.',
          '<strong>Result:</strong> Better overview of electrical risks and clear documentation for prioritized maintenance actions.'
        ],
        tools: ['Thermography', 'SS 436 40 00 awareness', 'Risk assessment']
      },
      {
        label: 'Automation diagnostics',
        title: 'PLC, I/O Signal & Machine Status Verification',
        summary: 'Verifiering av PLC, I/O-signaler och maskinstatus',
        body: [
          '<strong>Situation:</strong> Automation stops required verification of field signals, PLC status and machine sequence conditions.',
          '<strong>Method:</strong> Followed the signal chain from sensors and actuators to I/O diagnostics, machine logic and operator indications.',
          '<strong>Result:</strong> Faster separation between electrical, mechanical and automation-related causes.'
        ],
        tools: ['PLC diagnostics', 'I/O verification', 'TIA Portal basics']
      },
      {
        label: 'Robot and vision',
        title: 'ABB Robot & Vision Sequence Checks',
        summary: 'Kontroll av ABB-robot och visionssekvenser',
        body: [
          '<strong>Situation:</strong> Robot cells and vision-related functions needed checks around triggers, communication and alarm states.',
          '<strong>Method:</strong> Reviewed robot signals, camera acquisition, trigger timing, safety states and related automation conditions.',
          '<strong>Result:</strong> More reliable troubleshooting path between robot, vision and machine control signals.'
        ],
        tools: ['ABB RobotStudio', 'EAVS', 'Cognex VisionPro']
      },
      {
        label: 'Service quality',
        title: 'Service Documentation & Customer Communication',
        summary: 'Servicedokumentation och kundkommunikation',
        body: [
          '<strong>Situation:</strong> Maintenance teams needed clear information after service actions, fault finding and improvement observations.',
          '<strong>Method:</strong> Summarized symptoms, checks performed, likely causes, corrective actions and recommended next steps.',
          '<strong>Result:</strong> Easier handover, better traceability and more focused follow-up work for production and maintenance teams.'
        ],
        tools: ['Service reports', 'Fault history', 'Technical communication']
      },
      {
        label: 'Continuous improvement',
        title: 'Improvement Ideas for Electrical & Machine Reliability',
        summary: 'Förbättringsidéer för el- och maskintillförlitlighet',
        body: [
          '<strong>Situation:</strong> Repeated disturbances and practical observations created opportunities to improve machine reliability.',
          '<strong>Method:</strong> Combined hands-on repair work with risk observations, service history and communication with local teams.',
          '<strong>Result:</strong> Practical improvement suggestions that support safer, more stable and more maintainable equipment.'
        ],
        tools: ['Root-cause thinking', 'Reliability focus', 'Field observations']
      }
    ]
  };

  const projectCases = {
    sv: [
      {
        label: 'Vision och robotcell',
        title: 'Machine Vision och ABB-robotcell felsökning',
        summary: 'Full kedja mellan vision, robot, PLC-signaler och operatörsinformation.',
        body: [
          '<strong>Område:</strong> EA Vision Studio, Cognex VisionPro, ABB-robotcell, kamerainställningar, recept, backup och projektfiler.',
          '<strong>Teknik:</strong> Triggerfunktioner, RAPID, multitasking, EIO-konfiguration, robotstatus och röd lampa-logik.',
          '<strong>Fokus:</strong> Förstå och verifiera hela kedjan från vision och robot till PLC-signaler och operatörsinformation.'
        ],
        tools: ['EA Vision Studio', 'Cognex VisionPro', 'ABB Robot', 'RAPID', 'EIO']
      },
      {
        label: 'RobotStudio',
        title: 'ABB-robot felsökning och RobotStudio-simulering',
        summary: 'Rörelseanalys och programkontroll före test i verklig produktion.',
        body: [
          '<strong>Område:</strong> Analys av robotrörelser, griparbeteende, robotpositioner och kollisionsrisk.',
          '<strong>Metod:</strong> Simulering i RobotStudio och granskning av RAPID-program före produktionstest.',
          '<strong>Resultat:</strong> Programjusteringar kunde förberedas mer kontrollerat innan test i verklig cell.'
        ],
        tools: ['RobotStudio', 'RAPID', 'Movement analysis', 'Gripper behavior']
      },
      {
        label: 'Status och säkerhet',
        title: 'ABB-robot status, larm och säkerhetssignaler',
        summary: 'Verifiering av robotstatus, motorer, stopporsaker och I/O-signaler.',
        body: [
          '<strong>Område:</strong> Robotstatus, motorsignaler, stopporsaker, larmlogik, I/O-signaler och säkerhetsstatus.',
          '<strong>Metod:</strong> Kontroll av signaler och tillstånd för att stödja operatörens felsökning.',
          '<strong>Resultat:</strong> Tydligare bild av varför roboten stoppade och vilka signaler som behövde följas.'
        ],
        tools: ['Robot status', 'Safety state', 'I/O signals', 'Alarm logic']
      },
      {
        label: 'Printer och applicator',
        title: 'Weber applicator och Zebra printer kommunikationsfelsökning',
        summary: 'Signal timing och kommunikation mellan printer, applicator och styrsystem.',
        body: [
          '<strong>Område:</strong> Weber applicator, Zebra printer, konfiguration, signal timing och styrsystem.',
          '<strong>Metod:</strong> Granskning av kommunikation och tidssekvens mellan printer, applicator och kontrollsystem.',
          '<strong>Fokus:</strong> Stabilare produktion genom bättre förståelse av signalflöde och inställningar.'
        ],
        tools: ['Weber applicator', 'Zebra printer', 'Signal timing', 'Configuration']
      },
      {
        label: 'Programstädning',
        title: 'Robotprogram cleanup och signalgranskning',
        summary: 'Rensning av gamla signaler och oanvända programdelar för bättre underhållbarhet.',
        body: [
          '<strong>Område:</strong> Gamla robotsignaler, oanvända programdelar och programstruktur.',
          '<strong>Metod:</strong> Granskning av signaler och logik med fokus på tydligare framtida felsökning.',
          '<strong>Resultat:</strong> Mer underhållbart robotprogram och enklare överblick vid kommande störningar.'
        ],
        tools: ['Robot signals', 'Program review', 'Maintainability']
      },
      {
        label: 'PLC-simulering',
        title: 'Sortering efter höjd med Factory I/O och Siemens TIA Portal S7-1200',
        summary: 'Lärandeprojekt med sensorbaserad sortering och grundläggande PLC-logik.',
        body: [
          '<strong>Område:</strong> Factory I/O, Siemens TIA Portal, S7-1200 och sensorbaserad höjddetektering.',
          '<strong>Metod:</strong> Simulerad sorteringslogik med sensorer och grundläggande PLC-programmering.',
          '<strong>Resultat:</strong> GitHub-practice project för att visa PLC-tänk, simulering och teknisk inlärning.'
        ],
        tools: ['Factory I/O', 'TIA Portal', 'S7-1200', 'PLC sorting']
      },
      {
        label: 'Lantmännen',
        title: 'Lantmännen - industriell elservice och produktionssupport',
        summary: 'Kunduppdrag via Elektroautomatik med akut felsökning och förebyggande underhåll.',
        body: [
          '<strong>Område:</strong> Motorer, fläktar, elevatorer, elskåp, nivågivare, vågsystem, transportörer och produktionsutrustning.',
          '<strong>Metod:</strong> Akut felsökning, termografi, elkontroller, förebyggande underhåll, dokumentation och rapportering.',
          '<strong>Fokus:</strong> Minskade driftstopp och praktisk support till produktion och underhåll.'
        ],
        tools: ['Electrical service', 'Thermography', 'PLC', 'Conveyors', 'Reporting']
      },
      {
        label: 'Cummins',
        title: 'Cummins - industriell automationsservice och operativ support',
        summary: 'Kunduppdrag via Elektroautomatik med el- och automationsfelsökning.',
        body: [
          '<strong>Område:</strong> Maskiner, sensorer, motorer, elektriska komponenter och produktionssupport.',
          '<strong>Metod:</strong> Praktisk felsökning, förebyggande underhåll och teknisk uppföljning.',
          '<strong>Resultat:</strong> Stabilare drift genom strukturerad service och snabbare teknisk återkoppling.'
        ],
        tools: ['Automation service', 'Sensors', 'Motors', 'Preventive maintenance']
      },
      {
        label: 'DeLaval',
        title: 'DeLaval - testning, felsökning och kvalitetsverifiering',
        summary: 'Test och verifiering av tekniska system med dokumenterade avvikelser.',
        body: [
          '<strong>Område:</strong> Tekniska system, elektriska och mekaniska avvikelser, sensorer och systemfunktioner.',
          '<strong>Metod:</strong> Testning, verifiering, felsökning och dokumentation av testresultat.',
          '<strong>Fokus:</strong> Kvalitet, spårbarhet och produktförbättring genom tydliga testdata.'
        ],
        tools: ['Testing', 'Troubleshooting', 'Quality verification', 'Documentation']
      },
      {
        label: 'Veckocase',
        title: 'Weekly service och fault-finding cases',
        summary: 'Återkommande praktiska servicecase med tydlig rapporteringsmentalitet.',
        body: [
          '<strong>Exempel:</strong> ABB-robot sensor cable repair, cooling water pump troubleshooting och fan motor wiring correction.',
          '<strong>Exempel:</strong> HMI-felsökning, ABB Eden safety sensor adjustment och pressure switch checks.',
          '<strong>Fokus:</strong> Praktisk felsökning, service reports och tydlig uppföljning efter varje åtgärd.'
        ],
        tools: ['ABB Eden', 'HMI', 'Pumps', 'Fan motors', 'Service reports']
      }
    ],
    en: [
      {
        label: 'Vision and robot cell',
        title: 'Machine Vision & ABB Robot Cell Troubleshooting',
        summary: 'Understanding the full chain between vision, robot, PLC signals and operator information.',
        body: [
          '<strong>Scope:</strong> EA Vision Studio, Cognex VisionPro, ABB robot cell, camera settings, recipes, backup and project files.',
          '<strong>Technology:</strong> Trigger functions, RAPID, multitasking, EIO configuration, robot status and red lamp logic.',
          '<strong>Focus:</strong> Verifying the complete chain from vision and robot behavior to PLC signals and operator information.'
        ],
        tools: ['EA Vision Studio', 'Cognex VisionPro', 'ABB Robot', 'RAPID', 'EIO']
      },
      {
        label: 'RobotStudio',
        title: 'ABB Robot Troubleshooting & RobotStudio Simulation',
        summary: 'Robot movement analysis and program review before real production testing.',
        body: [
          '<strong>Scope:</strong> ABB robot movement analysis, gripper behavior, robot positions and collision risk.',
          '<strong>Method:</strong> RobotStudio simulation and RAPID program review before real production test.',
          '<strong>Result:</strong> Program adjustments could be prepared in a more controlled way before testing in the live cell.'
        ],
        tools: ['RobotStudio', 'RAPID', 'Movement analysis', 'Gripper behavior']
      },
      {
        label: 'Status and safety',
        title: 'ABB Robot Status, Alarm & Safety Signal Verification',
        summary: 'Robot status, motor signals, stop reasons, alarm logic and safety state verification.',
        body: [
          '<strong>Scope:</strong> Robot status, motor signals, stop reasons, alarm logic, I/O signals and safety state.',
          '<strong>Method:</strong> Signal and state verification to support operator troubleshooting.',
          '<strong>Result:</strong> Clearer understanding of why the robot stopped and which signals needed follow-up.'
        ],
        tools: ['Robot status', 'Safety state', 'I/O signals', 'Alarm logic']
      },
      {
        label: 'Printer and applicator',
        title: 'Weber Applicator & Zebra Printer Communication Troubleshooting',
        summary: 'Signal timing and communication between printer, applicator and control system.',
        body: [
          '<strong>Scope:</strong> Weber applicator, Zebra printer, configuration, signal timing and control system communication.',
          '<strong>Method:</strong> Review of communication and timing sequence between printer, applicator and control system.',
          '<strong>Focus:</strong> Production stability through better understanding of signal flow and configuration.'
        ],
        tools: ['Weber applicator', 'Zebra printer', 'Signal timing', 'Configuration']
      },
      {
        label: 'Program cleanup',
        title: 'Robot Program Cleanup & Signal Review',
        summary: 'Old robot signals and unused program parts reviewed for maintainability.',
        body: [
          '<strong>Scope:</strong> Old robot signals, unused program parts and robot program structure.',
          '<strong>Method:</strong> Signal and logic review with focus on easier future troubleshooting.',
          '<strong>Result:</strong> More maintainable robot program and clearer overview during future disturbances.'
        ],
        tools: ['Robot signals', 'Program review', 'Maintainability']
      },
      {
        label: 'PLC simulation',
        title: 'Sorting by Height - Factory I/O & Siemens TIA Portal S7-1200',
        summary: 'Learning project with sensor-based sorting and basic PLC logic.',
        body: [
          '<strong>Scope:</strong> Factory I/O, Siemens TIA Portal, S7-1200 and sensor-based height detection.',
          '<strong>Method:</strong> Simulated sorting logic with sensors and basic PLC programming.',
          '<strong>Result:</strong> GitHub practice project showing PLC thinking, simulation and technical learning.'
        ],
        tools: ['Factory I/O', 'TIA Portal', 'S7-1200', 'PLC sorting']
      },
      {
        label: 'Lantmännen',
        title: 'Lantmännen - Industrial Electrical Service & Production Support',
        summary: 'Customer assignment via Elektroautomatik with urgent troubleshooting and preventive maintenance.',
        body: [
          '<strong>Scope:</strong> Motors, fans, elevators, electrical cabinets, level sensors, weighing systems, conveyors and production equipment.',
          '<strong>Method:</strong> Urgent troubleshooting, thermography, electrical inspections, preventive maintenance, documentation and reporting.',
          '<strong>Focus:</strong> Reduced downtime and practical support for production and maintenance teams.'
        ],
        tools: ['Electrical service', 'Thermography', 'PLC', 'Conveyors', 'Reporting']
      },
      {
        label: 'Cummins',
        title: 'Cummins - Industrial Automation Service & Operational Support',
        summary: 'Customer assignment via Elektroautomatik with electrical and automation troubleshooting.',
        body: [
          '<strong>Scope:</strong> Machines, sensors, motors, electrical components and production support.',
          '<strong>Method:</strong> Practical troubleshooting, preventive maintenance and technical follow-up.',
          '<strong>Result:</strong> More stable operation through structured service and faster technical feedback.'
        ],
        tools: ['Automation service', 'Sensors', 'Motors', 'Preventive maintenance']
      },
      {
        label: 'DeLaval',
        title: 'DeLaval - Testing, Troubleshooting & Quality Verification',
        summary: 'Testing and verification of technical systems with documented deviations.',
        body: [
          '<strong>Scope:</strong> Technical systems, electrical and mechanical deviations, sensors and system functions.',
          '<strong>Method:</strong> Testing, verification, troubleshooting and documentation of test results.',
          '<strong>Focus:</strong> Quality, traceability and product improvement through clear test data.'
        ],
        tools: ['Testing', 'Troubleshooting', 'Quality verification', 'Documentation']
      },
      {
        label: 'Weekly cases',
        title: 'Weekly Service & Fault-Finding Cases',
        summary: 'Recurring practical service cases with a strong service report mindset.',
        body: [
          '<strong>Examples:</strong> ABB robot sensor cable repair, cooling water pump troubleshooting and fan motor wiring correction.',
          '<strong>Examples:</strong> HMI troubleshooting, ABB Eden safety sensor adjustment and pressure switch checks.',
          '<strong>Focus:</strong> Practical fault finding, service reports and clear follow-up after each action.'
        ],
        tools: ['ABB Eden', 'HMI', 'Pumps', 'Fan motors', 'Service reports']
      }
    ]
  };

  const translations = {
    sv: [
      ['#navbar a[href="#header"]', 'Start'],
      ['#navbar a[href="#technical-cases"]', 'Servicecase'],
      ['#navbar a[href="#how-work"]', 'Arbetssätt'],
      ['#navbar a[href="#services"]', 'Tjänster'],
      ['#navbar a[href="#about"]', 'Om mig'],
      ['#navbar a[href="#resume"]', 'CV'],
      ['#navbar a[href="#contact"]', 'Kontakt'],
      ['.hero-kicker', 'Industriell automation | PLC | ABB-robotar | Visionssystem'],
      ['#header h2', 'Serviceingenjör och automationstekniker baserad i <span>Södertälje, Sverige</span>'],
      ['.hero-subtext', 'Industriell automation, PLC, ABB-robotar, visionssystem och el-felsökning med fokus på att minska produktionsstopp.'],
      ['.hero-actions a:nth-child(1)', 'Visa servicecase'],
      ['.hero-actions a:nth-child(2)', 'Kontakta mig'],
      ['.hero-actions a:nth-child(3)', 'Chatta med min AI'],
      ['.hero-proof span:nth-child(1)', '<i class="bi bi-tools"></i> Grundorsaksfelsökning'],
      ['.hero-proof span:nth-child(2)', '<i class="bi bi-cpu"></i> PLC- och I/O-diagnostik'],
      ['.hero-proof span:nth-child(3)', '<i class="bi bi-camera-video"></i> Robot- och visionssupport'],
      ['#technical-cases .section-title h2', 'Servicecase'],
      ['#technical-cases .section-title p', 'Utvalda projekt och fältservicecase'],
      ['#technical-cases .section-intro', 'Ett urval av projekt och praktiska servicecase inom machine vision, ABB-robotar, PLC-simulering, industriell elservice, produktionssupport, testning och teknisk dokumentation.'],
      ['#how-work .section-title h2', 'Arbetssätt'],
      ['#how-work .section-title p', 'Observera, isolera, verifiera, dokumentera, förebygg'],
      ['#how-work .section-intro', 'Ett praktiskt arbetssätt för service i produktionsmiljöer, med fokus på snabb felisolering, tydlig verifiering och användbar dokumentation för nästa underhållsåtgärd.'],
      ['.work-step:nth-child(1) h4', 'Observera'],
      ['.work-step:nth-child(1) p', 'Förstå symptom, maskinstatus, larm, operatörsinformation och felhistorik innan något ändras.'],
      ['.work-step:nth-child(2) h4', 'Isolera'],
      ['.work-step:nth-child(2) p', 'Dela upp elektriska, mekaniska och automationsrelaterade orsaker med strukturerade kontroller.'],
      ['.work-step:nth-child(3) h4', 'Verifiera'],
      ['.work-step:nth-child(3) p', 'Bekräfta signaler, säkerhetsstatus, PLC/I/O-status, givare, aktuatorer och kommunikationsvägar.'],
      ['.work-step:nth-child(4) h4', 'Dokumentera'],
      ['.work-step:nth-child(4) p', 'Skriv tydliga fynd, utförda åtgärder och rekommenderade nästa steg för underhållsuppföljning.'],
      ['.work-step:nth-child(5) h4', 'Förebygg'],
      ['.work-step:nth-child(5) p', 'Gör återkommande fel och fältobservationer till praktiska förbättringsidéer.'],
      ['#services .section-title h2', 'Tjänster'],
      ['#services .section-title p', 'Tekniska serviceområden'],
      ['#services .row > div:nth-child(1) .icon-box h4', 'Industriell felsökning'],
      ['#services .row > div:nth-child(1) .icon-box p', 'Felsökning i produktionsutrustning, automationsceller och maskinsystem med fokus på grundorsak och minskade stopp.'],
      ['#services .row > div:nth-child(2) .icon-box h4', 'PLC- och automationssupport'],
      ['#services .row > div:nth-child(2) .icon-box p', 'PLC-diagnostik, I/O-verifiering, givarkontroller, maskinstatusanalys och automationssupport vid produktionsstopp.'],
      ['#services .row > div:nth-child(3) .icon-box h4', 'Robot- och visionssupport'],
      ['#services .row > div:nth-child(3) .icon-box p', 'Felsökning av ABB-robotar, signalkontroller, granskning av triggar och support för EAVS och Cognex VisionPro.'],
      ['#services .row > div:nth-child(4) .icon-box h4', 'Elservice och kontroll'],
      ['#services .row > div:nth-child(4) .icon-box p', 'El-felsökning, elskåpskontroll, termografi, riskobservationer och praktisk service i industriella miljöer.'],
      ['#services .row > div:nth-child(5) .icon-box h4', 'Teknisk dokumentation'],
      ['#services .row > div:nth-child(5) .icon-box p', 'Tydlig dokumentation av fynd, serviceåtgärder, signalkontroller, felhistorik och rekommenderade nästa steg.'],
      ['#about .section-title h2', 'Om mig'],
      ['#about .section-title p', 'Serviceingenjör i produktionsmiljöer'],
      ['#about .content h3', 'Serviceingenjör och automationstekniker'],
      ['#about .content > p:nth-of-type(1)', 'Jag heter Ibbo Abdoli och är serviceingenjör och automationstekniker baserad i Södertälje, Sverige.'],
      ['#about .content > p:nth-of-type(2)', 'Jag arbetar med industriell automation, PLC-system, ABB-robotar, maskinvision, el-felsökning och fältservice i produktionsmiljöer.'],
      ['#about .content > p:nth-of-type(3)', 'Mitt fokus är att hitta grundorsaker, minska oplanerade stopp och dokumentera tekniska lösningar tydligt.'],
      ['#about .content h4', 'Kärnområden'],
      ['.core-list', '<li>Felsökning inom industriell automation</li><li>PLC- och I/O-signalverifiering</li><li>Felsökning av ABB-robotar</li><li>Maskinvisionssupport, EAVS och Cognex</li><li>Elservice, kontroll och termografi</li><li>Fältservice och teknisk dokumentation</li>'],
      ['.skills .section-title h2', 'Tekniska kompetenser'],
      ['.skill-card:nth-child(1) h4', 'Felsökning och diagnostik'],
      ['.skill-card:nth-child(1) p', 'Grundorsaksfelsökning i produktionsmiljöer.'],
      ['.skill-card:nth-child(2) h4', 'PLC- och I/O-verifiering'],
      ['.skill-card:nth-child(2) p', 'Signalkontroller, givare, maskinstatus och automationssupport.'],
      ['.skill-card:nth-child(3) h4', 'Felsökning av ABB-robotar'],
      ['.skill-card:nth-child(3) p', 'Robotlarm, säkerhetsstatus, logik och I/O-diagnostik.'],
      ['.skill-card:nth-child(4) h4', 'Visionssystemsupport'],
      ['.skill-card:nth-child(4) p', 'EAVS, Cognex VisionPro, triggar och kommunikationskontroller.'],
      ['.skill-card:nth-child(5) h4', 'Elkontroll och termografi'],
      ['.skill-card:nth-child(5) p', 'Elskåpskontroller, elservice och riskobservationer.'],
      ['.skill-card:nth-child(6) h4', 'Teknisk dokumentation'],
      ['.skill-card:nth-child(6) p', 'Tydliga serviceanteckningar, fynd och rekommenderade nästa steg.'],
      ['#resume .section-title h2', 'CV'],
      ['#resume .section-title p', 'Erfarenhet, utbildning och tekniskt fokus'],
      ['#resume .resume-title:nth-of-type(1)', 'Sammanfattning'],
      ['#resume .resume-title:nth-of-type(2)', 'Yrkeserfarenhet'],
      ['#resume .col-lg-6:nth-child(2) .resume-title:nth-of-type(1)', 'Utbildning'],
      ['#resume .col-lg-6:nth-child(2) .resume-title:nth-of-type(2)', 'Relevanta kurser och certifieringar'],
      ['#resume .resume-item.pb-0 p', '<em>Jag är serviceingenjör och automationstekniker baserad i Södertälje, Sverige. Jag arbetar praktiskt med industriell automation, el-felsökning, PLC- och I/O-verifiering, ABB-robotar, maskinvision och teknisk dokumentation.</em>'],
      ['#resume .resume-item.pb-0 ul', '<li>Fokus på grundorsaksfelsökning och minskade oplanerade produktionsstopp.</li><li>Erfarenhet av fältservice, elkontroll, termografi och produktionssupport.</li><li>Van att dokumentera tekniska fynd tydligt för underhålls- och produktionsteam.</li>'],
      ['#resume .col-lg-6:nth-child(1) .resume-item:nth-of-type(2) h4', 'Serviceingenjör / industriell eltekniker'],
      ['#resume .col-lg-6:nth-child(1) .resume-item:nth-of-type(2) ul', '<li>Supportar produktionsmiljöer med automation, el och maskinfelsökning.</li><li>Verifierar givare, I/O-signaler, maskinstatus, elskåpskick och felhistorik.</li><li>Arbetar med servicedokumentation, korrigerande åtgärder och praktisk felprevention.</li>'],
      ['#resume .col-lg-6:nth-child(1) .resume-item:nth-of-type(3) h4', 'Systemteknik, testning och installation'],
      ['#resume .col-lg-6:nth-child(1) .resume-item:nth-of-type(3) h5', 'Tidigare erfarenhet'],
      ['#resume .col-lg-6:nth-child(1) .resume-item:nth-of-type(3) p', '<em>Tekniska roller inom systemtest, installation och servicearbete</em>'],
      ['#resume .col-lg-6:nth-child(1) .resume-item:nth-of-type(3) ul', '<li>Byggde ett praktiskt felsökningstänk inom elektriska, mjukvarurelaterade och industriella system.</li><li>Arbetade med strukturerad testning, teknisk kommunikation och praktisk problemlösning.</li>'],
      ['#resume .col-lg-6:nth-child(2) .resume-item:nth-of-type(1) h4', 'Kandidatexamen i elektroteknik'],
      ['#resume .col-lg-6:nth-child(2) .resume-item:nth-of-type(1) p', 'Avslutade en kandidatexamen i elektroteknik med teknisk grund för automation, elsystem och industriell felsökning.'],
      ['#resume .col-lg-6:nth-child(2) .resume-item:nth-of-type(2) h4', 'Automation och teknisk utbildning'],
      ['#resume .col-lg-6:nth-child(2) .resume-item:nth-of-type(2) ul', '<li>PLC-programmering, grunder</li><li>Simatic TIA Portal Programming 1 for PLC - Siemens SITRAIN Sweden</li><li>Python för automation</li><li>Linux- och Ubuntu-felsökning</li><li>Docker och DevOps, grunder</li>'],
      ['#resume .col-lg-6:nth-child(2) .resume-item:nth-of-type(3) h4', 'Industrisäkerhet och fältarbete'],
      ['#resume .col-lg-6:nth-child(2) .resume-item:nth-of-type(3) ul', '<li>SSG Entre Basic - industrisäkerhet</li><li>Heta arbeten</li><li>Liftutbildning - sax- och bomlift</li><li>Fallskydd - arbete på höjd</li><li>Elsäkerhet och kontrollmedvetenhet</li>'],
      ['.resume-actions a:nth-child(1)', '<i class="bx bx-file"></i> Ladda ner CV'],
      ['.resume-actions a:nth-child(2)', '<i class="bi bi-linkedin"></i> LinkedIn-profil'],
      ['.resume-actions a:nth-child(3)', '<i class="bx bx-envelope"></i> Mejla mig'],
      ['#linkedin-posts .section-title p', 'Senaste tekniska inlägg'],
      ['#linkedin-posts .section-intro', 'Utvalda LinkedIn-uppdateringar om automation, service engineering och produktionsfelsökning. Fler inlägg och rekommendationer finns på min LinkedIn-profil.'],
      ['.linkedin-fallback', 'Om LinkedIn-inläggen inte visas i din webbläsare kan du öppna profilen direkt.'],
      ['.linkedin-actions a', 'Visa fler inlägg på LinkedIn'],
      ['#contact .section-title h2', 'Kontakt'],
      ['#contact .section-title p', 'Professionell kontakt'],
      ['#contact .row > div:nth-child(1) .info-box h3', 'Plats'],
      ['#contact .row > div:nth-child(2) .info-box h3', 'Primär professionell kontakt'],
      ['#contact .row > div:nth-child(4) .info-box h3', 'Telefon'],
      ['#contact .row > div:nth-child(4) .info-box p', 'Tillgänglig på begäran via LinkedIn eller e-post.'],
      ['#contact .row > div:nth-child(6) .info-box h3', 'AI-assistent'],
      ['#contact .row > div:nth-child(6) .info-box p a', 'Chatta med min AI']
    ],
    en: [
      ['#navbar a[href="#header"]', 'Home'],
      ['#navbar a[href="#technical-cases"]', 'Technical Cases'],
      ['#navbar a[href="#how-work"]', 'How I Work'],
      ['#navbar a[href="#services"]', 'Services'],
      ['#navbar a[href="#about"]', 'About'],
      ['#navbar a[href="#resume"]', 'Resume'],
      ['#navbar a[href="#contact"]', 'Contact'],
      ['.hero-kicker', 'Industrial Automation | PLC | ABB Robots | Vision Systems'],
      ['#header h2', 'Service Engineer &amp; Automation Technician based in <span>Södertälje, Sweden</span>'],
      ['.hero-subtext', 'Industrial automation, PLC, ABB robots, vision systems and electrical troubleshooting with focus on reducing production downtime.'],
      ['.hero-actions a:nth-child(1)', 'View Technical Cases'],
      ['.hero-actions a:nth-child(2)', 'Contact Me'],
      ['.hero-actions a:nth-child(3)', 'Chat with My AI'],
      ['.hero-proof span:nth-child(1)', '<i class="bi bi-tools"></i> Root-cause troubleshooting'],
      ['.hero-proof span:nth-child(2)', '<i class="bi bi-cpu"></i> PLC and I/O diagnostics'],
      ['.hero-proof span:nth-child(3)', '<i class="bi bi-camera-video"></i> Robot and vision support'],
      ['#technical-cases .section-title h2', 'Technical Cases'],
      ['#technical-cases .section-title p', 'Selected Projects and Field Service Cases'],
      ['#technical-cases .section-intro', 'A selection of projects and practical service cases across machine vision, ABB robots, PLC simulation, industrial electrical service, production support, testing and technical documentation.'],
      ['#how-work .section-title h2', 'How I Work'],
      ['#how-work .section-title p', 'Observe, Isolate, Verify, Document, Prevent'],
      ['#how-work .section-intro', 'A practical workflow for service work in production environments, built around fast fault isolation, clear verification and useful documentation for the next maintenance action.'],
      ['.work-step:nth-child(1) h4', 'Observe'],
      ['.work-step:nth-child(1) p', 'Understand the symptom, machine state, alarms, operator input and recent history before changing anything.'],
      ['.work-step:nth-child(2) h4', 'Isolate'],
      ['.work-step:nth-child(2) p', 'Separate electrical, mechanical and automation-related causes with structured checks.'],
      ['.work-step:nth-child(3) h4', 'Verify'],
      ['.work-step:nth-child(3) p', 'Confirm signals, safety states, PLC/I/O status, sensors, actuators and communication paths.'],
      ['.work-step:nth-child(4) h4', 'Document'],
      ['.work-step:nth-child(4) p', 'Write clear findings, actions performed and recommended next steps for maintenance follow-up.'],
      ['.work-step:nth-child(5) h4', 'Prevent'],
      ['.work-step:nth-child(5) p', 'Turn repeated faults and field observations into practical improvement ideas.'],
      ['#services .section-title h2', 'Services'],
      ['#services .section-title p', 'Technical Service Areas'],
      ['#services .row > div:nth-child(1) .icon-box h4', 'Industrial Troubleshooting'],
      ['#services .row > div:nth-child(1) .icon-box p', 'Fault finding in production equipment, automation cells and machine systems with focus on root cause and downtime reduction.'],
      ['#services .row > div:nth-child(2) .icon-box h4', 'PLC &amp; Automation Support'],
      ['#services .row > div:nth-child(2) .icon-box p', 'PLC diagnostics, I/O signal verification, sensor checks, machine status analysis and automation support during production stops.'],
      ['#services .row > div:nth-child(3) .icon-box h4', 'Robot &amp; Vision Support'],
      ['#services .row > div:nth-child(3) .icon-box p', 'ABB robot fault analysis, signal checks, trigger sequence review and support for EAVS and Cognex VisionPro systems.'],
      ['#services .row > div:nth-child(4) .icon-box h4', 'Electrical Service &amp; Inspection'],
      ['#services .row > div:nth-child(4) .icon-box p', 'Electrical troubleshooting, cabinet inspection, thermography, risk observations and practical service in industrial environments.'],
      ['#services .row > div:nth-child(5) .icon-box h4', 'Technical Documentation'],
      ['#services .row > div:nth-child(5) .icon-box p', 'Clear documentation of findings, service actions, signal checks, fault history and recommended next steps for maintenance teams.'],
      ['#about .section-title h2', 'About'],
      ['#about .section-title p', 'Service Engineer in Production Environments'],
      ['#about .content h3', 'Service Engineer &amp; Automation Technician'],
      ['#about .content > p:nth-of-type(1)', 'My name is Ibbo Abdoli. I am a Service Engineer and Automation Technician based in Södertälje, Sweden.'],
      ['#about .content > p:nth-of-type(2)', 'I work with industrial automation, PLC systems, ABB robots, machine vision, electrical troubleshooting and field service in production environments.'],
      ['#about .content > p:nth-of-type(3)', 'My focus is to find root causes, reduce unplanned downtime and document technical solutions clearly.'],
      ['#about .content h4', 'Core areas'],
      ['.core-list', '<li>Industrial automation troubleshooting</li><li>PLC and I/O signal verification</li><li>ABB robot fault analysis</li><li>Machine vision support, EAVS and Cognex</li><li>Electrical service, inspection and thermography</li><li>Field service and technical documentation</li>'],
      ['.skills .section-title h2', 'Technical Skills'],
      ['.skill-card:nth-child(1) h4', 'Troubleshooting &amp; Diagnostics'],
      ['.skill-card:nth-child(1) p', 'Root-cause fault finding in production environments.'],
      ['.skill-card:nth-child(2) h4', 'PLC and I/O Verification'],
      ['.skill-card:nth-child(2) p', 'Signal checks, sensors, machine status and automation support.'],
      ['.skill-card:nth-child(3) h4', 'ABB Robot Troubleshooting'],
      ['.skill-card:nth-child(3) p', 'Robot alarms, safety states, logic and I/O diagnostics.'],
      ['.skill-card:nth-child(4) h4', 'Machine Vision Support'],
      ['.skill-card:nth-child(4) p', 'EAVS, Cognex VisionPro, triggers and communication checks.'],
      ['.skill-card:nth-child(5) h4', 'Electrical Inspection &amp; Thermography'],
      ['.skill-card:nth-child(5) p', 'Cabinet checks, electrical service and risk observations.'],
      ['.skill-card:nth-child(6) h4', 'Technical Documentation'],
      ['.skill-card:nth-child(6) p', 'Clear service notes, findings and recommended next steps.'],
      ['#resume .section-title h2', 'Resume'],
      ['#resume .section-title p', 'Experience, Training and Technical Focus'],
      ['#resume .resume-title:nth-of-type(1)', 'Summary'],
      ['#resume .resume-title:nth-of-type(2)', 'Professional Experience'],
      ['#resume .col-lg-6:nth-child(2) .resume-title:nth-of-type(1)', 'Education'],
      ['#resume .col-lg-6:nth-child(2) .resume-title:nth-of-type(2)', 'Relevant Courses &amp; Certifications'],
      ['#resume .resume-item.pb-0 p', '<em>I am a Service Engineer and Automation Technician based in Södertälje, Sweden. I work hands-on with industrial automation, electrical troubleshooting, PLC and I/O verification, ABB robots, machine vision and technical documentation.</em>'],
      ['#resume .resume-item.pb-0 ul', '<li>Focused on root-cause troubleshooting and reducing unplanned production downtime.</li><li>Experienced in field service, electrical inspection, thermography and production support.</li><li>Used to documenting technical findings clearly for maintenance and production teams.</li>'],
      ['#resume .col-lg-6:nth-child(1) .resume-item:nth-of-type(2) h4', 'Service Engineer / Industrial Electrical Technician'],
      ['#resume .col-lg-6:nth-child(1) .resume-item:nth-of-type(2) ul', '<li>Support production environments with automation, electrical and machine troubleshooting.</li><li>Verify sensors, I/O signals, machine status, cabinet conditions and fault history.</li><li>Work with service documentation, corrective actions and practical fault prevention.</li>'],
      ['#resume .col-lg-6:nth-child(1) .resume-item:nth-of-type(3) h4', 'Systems Engineering, Testing and Installation'],
      ['#resume .col-lg-6:nth-child(1) .resume-item:nth-of-type(3) h5', 'Previous experience'],
      ['#resume .col-lg-6:nth-child(1) .resume-item:nth-of-type(3) p', '<em>Technical roles across system testing, installation and service work</em>'],
      ['#resume .col-lg-6:nth-child(1) .resume-item:nth-of-type(3) ul', '<li>Built a practical troubleshooting mindset across electrical, software and industrial systems.</li><li>Worked with structured testing, technical communication and hands-on problem solving.</li>'],
      ['#resume .col-lg-6:nth-child(2) .resume-item:nth-of-type(1) h4', 'Bachelor of Electrical Engineering'],
      ['#resume .col-lg-6:nth-child(2) .resume-item:nth-of-type(1) p', 'Completed a Bachelor\'s degree in Electrical Engineering with a technical foundation for automation, electrical systems and industrial troubleshooting.'],
      ['#resume .col-lg-6:nth-child(2) .resume-item:nth-of-type(2) h4', 'Automation and Technical Training'],
      ['#resume .col-lg-6:nth-child(2) .resume-item:nth-of-type(2) ul', '<li>PLC Programming Basics</li><li>Simatic TIA Portal Programming 1 for PLC - Siemens SITRAIN Sweden</li><li>Python for Automation</li><li>Linux and Ubuntu troubleshooting</li><li>Docker and DevOps fundamentals</li>'],
      ['#resume .col-lg-6:nth-child(2) .resume-item:nth-of-type(3) h4', 'Industrial Safety and Field Work'],
      ['#resume .col-lg-6:nth-child(2) .resume-item:nth-of-type(3) ul', '<li>SSG Entre Basic - Industrial Safety</li><li>Hot Work Certificate (Heta Arbeten)</li><li>Lift Training - Scissor and Boom Lifts</li><li>Fall Protection - Working at Heights</li><li>Electrical Safety and inspection awareness</li>'],
      ['.resume-actions a:nth-child(1)', '<i class="bx bx-file"></i> Download CV'],
      ['.resume-actions a:nth-child(2)', '<i class="bi bi-linkedin"></i> LinkedIn Profile'],
      ['.resume-actions a:nth-child(3)', '<i class="bx bx-envelope"></i> Email Me'],
      ['#linkedin-posts .section-title p', 'Recent Technical Posts'],
      ['#linkedin-posts .section-intro', 'Selected LinkedIn updates related to automation, service engineering and production troubleshooting. More posts and recommendations are available on my LinkedIn profile.'],
      ['.linkedin-fallback', 'If the LinkedIn posts do not load in your browser, open the profile directly.'],
      ['.linkedin-actions a', 'View more posts on LinkedIn'],
      ['#contact .section-title h2', 'Contact'],
      ['#contact .section-title p', 'Professional Contact'],
      ['#contact .row > div:nth-child(1) .info-box h3', 'Location'],
      ['#contact .row > div:nth-child(2) .info-box h3', 'Primary Professional Contact'],
      ['#contact .row > div:nth-child(4) .info-box h3', 'Phone'],
      ['#contact .row > div:nth-child(4) .info-box p', 'Available on request via LinkedIn or email.'],
      ['#contact .row > div:nth-child(6) .info-box h3', 'AI Assistant'],
      ['#contact .row > div:nth-child(6) .info-box p a', 'Chat with My AI']
    ]
  };

  const renderCases = (lang) => {
    const grid = select('.technical-cases .row');
    const items = projectCases[lang] || projectCases.sv;
    if (!grid) {
      return;
    }

    grid.innerHTML = items.map((item) => `
      <div class="col-lg-4 col-md-6 d-flex">
        <article class="case-card">
          <span class="case-label">${item.label}</span>
          <h4>${item.title}</h4>
          <p class="case-translation">${item.summary}</p>
          <ul class="case-steps">
            ${item.body.map((line) => `<li>${line}</li>`).join('')}
          </ul>
          <div class="tool-list" aria-label="Tools used">
            ${item.tools.map((tool) => `<span>${tool}</span>`).join('')}
          </div>
        </article>
      </div>
    `).join('');
  };

  const setTranslatedHtml = (selector, html) => {
    const element = select(selector);
    if (!element) {
      console.warn(`Missing translation target: ${selector}`);
      return;
    }

    element.innerHTML = html;
  };

  const applyLanguage = (lang) => {
    const activeLang = lang === 'en' ? 'en' : 'sv';
    const meta = pageMeta[activeLang];

    document.documentElement.lang = activeLang;
    document.title = meta.title;
    localStorage.setItem('ibbo-language', activeLang);

    [
      ['meta[name="description"]', 'content', meta.description],
      ['meta[property="og:title"]', 'content', meta.title],
      ['meta[property="og:description"]', 'content', meta.description],
      ['meta[property="og:locale"]', 'content', meta.locale],
      ['meta[name="twitter:title"]', 'content', meta.title],
      ['meta[name="twitter:description"]', 'content', meta.description]
    ].forEach(([selector, attribute, value]) => {
      const element = select(selector);
      if (element) {
        element.setAttribute(attribute, value);
      }
    });

    translations[activeLang].forEach(([selector, html]) => setTranslatedHtml(selector, html));

    renderCases(activeLang);

    languageButtons.forEach((button) => {
      const isActive = button.dataset.lang === activeLang;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
      button.setAttribute('aria-label', button.dataset.lang === 'sv' ? 'Visa sidan på svenska' : 'Show site in English');
    });
  };

  const closeMobileNav = () => {
    if (!navbar || !navToggle || !navbar.classList.contains('navbar-mobile')) {
      return;
    }

    navbar.classList.remove('navbar-mobile');
    navToggle.classList.add('bi-list');
    navToggle.classList.remove('bi-x');
  };

  const setActiveNav = (hash) => {
    navlinks.forEach((link) => {
      const isActive = link.getAttribute('href') === hash;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const showSection = (hash) => {
    if (!header) {
      return;
    }

    if (!hash || hash === '#header') {
      header.classList.remove('header-top');
      sections.forEach((section) => section.classList.remove('section-show'));
      setActiveNav('#header');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = select(hash);
    if (!target) {
      return;
    }

    header.classList.add('header-top');
    sections.forEach((section) => section.classList.remove('section-show'));
    target.classList.add('section-show');
    setActiveNav(hash);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      navbar.classList.toggle('navbar-mobile');
      navToggle.classList.toggle('bi-list');
      navToggle.classList.toggle('bi-x');
    });
  }

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyLanguage(button.dataset.lang);
    });
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('#navbar .nav-link, .section-link');
    if (!link) {
      return;
    }

    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) {
      return;
    }

    const target = select(href);
    if (!target && href !== '#header') {
      return;
    }

    event.preventDefault();
    history.pushState(null, '', href);
    closeMobileNav();
    showSection(href);
  });

  window.addEventListener('popstate', () => {
    showSection(window.location.hash || '#header');
  });

  window.addEventListener('load', () => {
    const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
    applyLanguage(requestedLanguage || localStorage.getItem('ibbo-language') || 'sv');
    showSection(window.location.hash || '#header');

    const progressBars = select('.progress .progress-bar', true);
    progressBars.forEach((bar) => {
      bar.style.width = `${bar.getAttribute('aria-valuenow')}%`;
    });
  });
})();
