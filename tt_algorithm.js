/**
 * ============================================================
 * SIT TUMAKURU — TIMETABLE GENERATION ALGORITHM
 * Department of Computer Science and Engineering
 * Even Semester 2025-26
 * 
 * HOW TO INTEGRATE INTO YOUR EXISTING HTML:
 * 1. Save this file as tt_algorithm.js
 * 2. Add to your HTML: <script src="tt_algorithm.js"></script>
 * 3. Use the TTGen API (see examples at bottom)
 * ============================================================
 */

const TTGen = (function () {

  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  const TIME_SLOTS = [
    { id:'S1', label:'8:00–9:00 AM',   period:1, isBreak:false },
    { id:'S2', label:'9:00–10:00 AM',  period:2, isBreak:false },
    { id:'BK', label:'10:00–10:30',    period:0, isBreak:true  },
    { id:'S3', label:'10:30–11:30 AM', period:3, isBreak:false },
    { id:'S4', label:'11:30–12:30 PM', period:4, isBreak:false },
    { id:'LN', label:'12:30–2:00 PM',  period:0, isBreak:true  },
    { id:'S5', label:'2:00–3:00 PM',   period:5, isBreak:false },
    { id:'S6', label:'3:00–4:00 PM',   period:6, isBreak:false },
    { id:'S7', label:'4:00–5:00 PM',   period:7, isBreak:false },
    { id:'S8', label:'5:00–6:00 PM',   period:8, isBreak:false },
  ];

  const THEORY_SLOT_IDS = ['S1','S2','S3','S4','S5','S6','S7','S8'];
  const SAT_SLOT_IDS    = ['S1','S2','S3','S4'];

  const CONSTRAINTS = {
    maxConsecutiveTheory: 2,
    mandatoryBreaks:      ['BK','LN'],
    saturdayHalfDay:      true,
    saturdaySlots:        ['S1','S2','S3','S4'],
    ncmcSections:         ['VI-A','VI-B','VI-C','VI-AIDS','VI-AIML'],
    ncmcDays:             ['Thursday','Friday'],
    ncmcSlot:             'S8',
    labDuration:          2,
  };

  /* ── REFERENCE TIMETABLE (from MASTER_TIME_TABLE_CSE.pdf all 11 pages) ── */
  const REF_TIMETABLE = {
    'VI-A': {
      Monday:    { S1:'OE', S2:'SoftSkills', S3:'SoftSkills', S4:'SoftSkills', S5:'CN-Lab/IoT-Lab', S6:'CN-Lab/IoT-Lab', S8:'BCT' },
      Tuesday:   { S2:'SDE', S3:'SDE', S4:'SDE', S5:'IoT', S6:'IKS', S8:'BCT' },
      Wednesday: { S1:'OE', S2:'CN', S3:'CN-Lab/FSD-Lab', S4:'CN-Lab/FSD-Lab', S5:'HPC' },
      Thursday:  { S2:'HPC', S3:'CN', S4:'CN', S8:'NCMC' },
      Friday:    { S1:'OE', S2:'CN', S3:'IoT', S5:'HPC', S6:'IoT-Lab/FSD-Lab', S7:'IoT-Lab/FSD-Lab', S8:'NCMC' },
      Saturday:  { S1:'BCT', S2:'HPC', S3:'IoT', S4:'IoT' },
    },
    'VI-B': {
      Monday:    { S1:'OE', S3:'CN-Lab/IoT-Lab', S4:'CN-Lab/IoT-Lab', S5:'SoftSkills', S6:'SoftSkills', S7:'SoftSkills', S8:'BCT' },
      Tuesday:   { S1:'IoT-Lab/FSD-Lab', S2:'IoT-Lab/FSD-Lab', S3:'CN', S4:'IoT', S5:'SDE', S6:'SDE', S7:'SDE', S8:'BCT' },
      Wednesday: { S1:'OE', S2:'IoT', S3:'CN', S5:'HPC' },
      Thursday:  { S2:'HPC', S3:'IoT', S4:'CN', S5:'CN-Lab/FSD-Lab', S6:'CN-Lab/FSD-Lab', S7:'IKS', S8:'NCMC' },
      Friday:    { S1:'OE', S3:'CN', S4:'IoT', S5:'HPC', S8:'NCMC' },
      Saturday:  { S1:'BCT', S2:'HPC' },
    },
    'VI-C': {
      Monday:    { S1:'OE', S2:'CN', S3:'IoT', S8:'BCT' },
      Tuesday:   { S2:'IoT', S3:'CN', S5:'CN-Lab/IoT-Lab', S6:'CN-Lab/IoT-Lab', S8:'BCT' },
      Wednesday: { S1:'OE', S2:'SDE', S3:'SDE', S4:'SDE', S5:'HPC', S6:'IoT' },
      Thursday:  { S2:'HPC', S3:'CN-Lab/FSD-Lab', S4:'CN-Lab/FSD-Lab', S5:'IoT', S6:'CN', S7:'IKS', S8:'NCMC' },
      Friday:    { S1:'OE', S2:'SoftSkills', S3:'SoftSkills', S4:'SoftSkills', S5:'HPC', S6:'CN', S8:'NCMC' },
      Saturday:  { S1:'BCT', S2:'HPC', S3:'IoT-Lab/FSD-Lab', S4:'IoT-Lab/FSD-Lab' },
    },
    'VI-AIDS': {
      Monday:    { S1:'OE', S2:'RTBDA', S3:'CN', S5:'SoftSkills', S6:'SoftSkills', S7:'SoftSkills' },
      Tuesday:   { S3:'CN', S4:'RTBDA', S5:'CN', S6:'DDSM', S7:'CC' },
      Wednesday: { S1:'OE', S2:'DDSM', S3:'RTBDA', S4:'CN', S5:'SDE', S6:'SDE', S7:'SDE' },
      Thursday:  { S1:'CN-Lab/IoT-Lab', S2:'CN-Lab/IoT-Lab', S5:'IoT-Lab/RTBDA-Lab', S6:'IoT-Lab/RTBDA-Lab', S8:'NCMC' },
      Friday:    { S1:'OE', S2:'DDSM', S3:'CN-Lab/RTBDA-Lab', S4:'CN-Lab/RTBDA-Lab', S8:'NCMC' },
      Saturday:  { S2:'DDSM', S3:'RTBDA', S4:'IKS' },
    },
    'VI-AIML': {
      Monday:    { S1:'OE', S2:'SoftSkills', S3:'SoftSkills', S4:'SoftSkills', S5:'CN', S6:'NLP', S7:'NLP', S8:'AI-CS' },
      Tuesday:   { S2:'AI-CS', S3:'CN-Lab/IoT-Lab', S4:'CN-Lab/IoT-Lab', S5:'CN', S6:'CC' },
      Wednesday: { S1:'OE', S2:'AI-CS', S3:'CN' },
      Thursday:  { S2:'SDE', S3:'SDE', S4:'SDE', S8:'NCMC' },
      Friday:    { S1:'OE', S2:'AI-CS', S3:'NLP-Lab/IoT-Lab', S4:'NLP-Lab/IoT-Lab', S5:'IKS', S6:'CN', S7:'NLP', S8:'NCMC' },
      Saturday:  { S2:'NLP', S3:'CN-Lab/NLP-Lab', S4:'CN-Lab/NLP-Lab' },
    },
    'IV-A': {
      Monday:    { S2:'ITP-Lab', S3:'ITP-Lab', S4:'ITP-Lab', S5:'TOC', S6:'DMS', S7:'MC' },
      Tuesday:   { S1:'POP', S2:'TOC', S3:'MC-Lab/DAA-Lab', S4:'MC-Lab/DAA-Lab', S5:'MC', S6:'DMS', S7:'BE' },
      Wednesday: { S1:'TOC', S2:'MC', S3:'DAA', S4:'BE', S5:'TOC-Lab/DAA-Lab', S6:'TOC-Lab/DAA-Lab', S7:'POP-Lab', S8:'POP-Lab' },
      Thursday:  { S1:'BE', S2:'DMS', S3:'MC', S4:'DAA', S5:'DAA', S6:'TOC-Lab/MC-Lab', S7:'TOC-Lab/MC-Lab', S8:'NCMC' },
      Friday:    { S1:'JS-Lab', S2:'JS-Lab', S3:'TOC', S4:'DMS', S5:'BE', S6:'DAA', S7:'POP', S8:'NCMC' },
      Saturday:  { S2:'UHV', S3:'DAA' },
    },
    'IV-B': {
      Monday:    { S2:'MC', S3:'DAA-Lab/TOC-Lab', S4:'DAA-Lab/TOC-Lab', S5:'ITP-Lab', S6:'ITP-Lab', S7:'ITP-Lab' },
      Tuesday:   { S1:'POP', S2:'DAA', S3:'JS-Lab', S4:'JS-Lab', S5:'BE', S6:'TOC' },
      Wednesday: { S1:'BE', S2:'DMS', S3:'DAA-Lab/MC-Lab', S4:'DAA-Lab/MC-Lab', S5:'MC', S6:'DAA', S7:'POP-Lab', S8:'POP-Lab' },
      Thursday:  { S1:'MC-Lab/TOC-Lab', S2:'MC-Lab/TOC-Lab', S3:'MC', S4:'DAA', S5:'BE', S6:'UHV', S7:'DMS', S8:'NCMC' },
      Friday:    { S1:'BE', S2:'TOC', S3:'DMS', S4:'DMS', S5:'DAA', S6:'TOC', S7:'POP', S8:'NCMC' },
      Saturday:  { S2:'TOC', S3:'MC' },
    },
    'IV-C': {
      Monday:    { S2:'MC', S3:'DMS', S4:'BE', S5:'DAA-Lab/MC-Lab', S6:'DAA-Lab/MC-Lab', S7:'TOC' },
      Tuesday:   { S1:'POP', S2:'MC', S3:'DAA', S4:'DMS', S5:'ITP-Lab', S6:'ITP-Lab', S7:'ITP-Lab' },
      Wednesday: { S1:'JS-Lab', S2:'JS-Lab', S3:'TOC', S4:'MC', S5:'DMS', S6:'UHV', S7:'POP-Lab', S8:'POP-Lab' },
      Thursday:  { S2:'TOC', S3:'DAA-Lab/TOC-Lab', S4:'DAA-Lab/TOC-Lab', S5:'BE', S6:'DAA', S7:'BE', S8:'NCMC' },
      Friday:    { S1:'TOC-Lab/MC-Lab', S2:'TOC-Lab/MC-Lab', S3:'DAA', S4:'TOC', S5:'MC', S7:'POP', S8:'NCMC' },
      Saturday:  { S2:'DMS', S3:'BE', S4:'DAA' },
    },
    'IV-AIDS': {
      Monday:    { S2:'DAA', S3:'DSP', S4:'AI', S5:'BE', S6:'DAXR-Lab', S7:'DAXR-Lab' },
      Tuesday:   { S1:'POP', S2:'AI', S3:'DMS', S4:'DAA', S5:'DSP', S6:'BE' },
      Wednesday: { S2:'AI', S3:'DAA', S4:'DMS', S5:'ITP-Lab', S6:'ITP-Lab', S7:'ITP-Lab', S8:'POP-Lab' },
      Thursday:  { S2:'DSP', S3:'AI-Lab/DSP-Lab', S4:'AI-Lab/DSP-Lab', S5:'DMS', S6:'BE', S7:'DAA', S8:'NCMC' },
      Friday:    { S1:'AI-Lab/DAA-Lab', S2:'AI-Lab/DAA-Lab', S3:'DMS', S4:'UHV', S5:'DSP', S6:'BE', S7:'POP', S8:'NCMC' },
      Saturday:  { S2:'AI', S3:'DSP-Lab/DAA-Lab', S4:'DSP-Lab/DAA-Lab' },
    },
    'IV-AIML': {
      Monday:    { S2:'DSP', S3:'DAXR-Lab', S4:'DAXR-Lab', S5:'DMS', S6:'DAA', S7:'BE' },
      Tuesday:   { S1:'POP', S2:'ITP-Lab', S3:'ITP-Lab', S4:'ITP-Lab', S5:'DAA', S6:'DAA-Lab', S7:'DAA-Lab' },
      Wednesday: { S1:'BE', S2:'DMS', S3:'AI-Lab/DSP-Lab', S4:'AI-Lab/DSP-Lab', S5:'DSP', S6:'AI', S7:'POP-Lab', S8:'POP-Lab' },
      Thursday:  { S1:'AI-Lab/DSP-Lab', S2:'AI-Lab/DSP-Lab', S3:'DSP', S4:'AI', S5:'BE', S6:'DAA-Lab', S7:'DAA-Lab', S8:'NCMC' },
      Friday:    { S1:'DAA', S2:'DSP', S3:'DMS', S4:'AI', S5:'UHV', S6:'BE', S7:'POP', S8:'NCMC' },
      Saturday:  { S2:'DMS', S3:'AI', S4:'DAA' },
    },
    'MT2': {
      Monday:    { S2:'AWN', S3:'Gen-AI', S4:'AIoT', S5:'PC-Lab', S6:'PC-Lab' },
      Tuesday:   { S2:'AIoT', S3:'AWN', S4:'PC', S5:'AIoT-Lab', S6:'AIoT-Lab' },
      Wednesday: { S3:'PC', S4:'QC', S5:'FSD-Dev', S6:'FSD-Dev' },
      Thursday:  { S3:'PC', S4:'Gen-AI', S5:'AWN', S6:'Gen-AI-Lab', S7:'Gen-AI-Lab' },
      Friday:    { S2:'QC', S3:'PC-Lab', S4:'PC-Lab' },
      Saturday:  { S2:'QC', S3:'Gen-AI' },
    },
  };

  /* ── FACULTY ASSIGNMENTS from PDF (all 11 pages) ── */
  const FACULTY_ASSIGNMENTS = {
    'VI-A': {
      'CN':        { faculty:'Dr. M B Nirmala',        short:'MBN', room:'CSL-103' },
      'IoT':       { faculty:'Dr. Sumalatha Aradhya',   short:'SA',  room:'CSL-103' },
      'FSD-Lab':   { faculty:'Dr. Bharathi P T',        short:'BPT', room:'Project Lab' },
      'CN-Lab':    { faculty:'Dr. M B Nirmala',         short:'MBN', room:'Linux Lab' },
      'IoT-Lab':   { faculty:'Dr. Sumalatha Aradhya',   short:'SA',  room:'Project Lab' },
      'HPC':       { faculty:'Dr. N R Sunitha',         short:'NRS', room:'CSL-103' },
      'ACA':       { faculty:'Dr. K R Prasannakumara',  short:'KRP', room:'CSL-103' },
      'BCT':       { faculty:'Dr. Mahesh Kumar',        short:'MHK', room:'CSL-103' },
      'CC':        { faculty:'Dr. Praveen Kumar',        short:'PK',  room:'CSL-103' },
      'SoftSkills':{ faculty:'Mrs. Tejaswini D A',      short:'TDA', room:'CSL-103' },
      'IKS':       { faculty:'Dr. Bhargavi K',          short:'BKR', room:'CSL-103' },
      'OE':        { faculty:'Dr. Pramod T C',          short:'TCP', room:'CSL-103' },
      'NCMC':      { faculty:'',                         short:'',    room:'Ground' },
      'SDE':       { faculty:'',                         short:'',    room:'Media Centre' },
    },
    'VI-B': {
      'CN':        { faculty:'Mrs. Shwetha A N',        short:'SAN', room:'CSL-104' },
      'IoT':       { faculty:'Dr. Bharathi P T',        short:'BPT', room:'CSL-104' },
      'FSD-Lab':   { faculty:'Mr. Gururaj S P',         short:'GSP', room:'Project Lab' },
      'CN-Lab':    { faculty:'Mrs. Shwetha A N',        short:'SAN', room:'Linux Lab' },
      'IoT-Lab':   { faculty:'Dr. Bharathi P T',        short:'BPT', room:'Project Lab' },
      'HPC':       { faculty:'Dr. N R Sunitha',         short:'NRS', room:'CSL-104' },
      'ACA':       { faculty:'Dr. K R Prasannakumara',  short:'KRP', room:'CSL-104' },
      'BCT':       { faculty:'Dr. Mahesh Kumar',        short:'MHK', room:'CSL-104' },
      'CC':        { faculty:'Dr. Praveen Kumar',        short:'PK',  room:'CSL-104' },
      'SoftSkills':{ faculty:'Mrs. Anupama B S',        short:'ABS', room:'CSL-104' },
      'IKS':       { faculty:'Dr. M N Sowmya',          short:'MNS', room:'CSL-104' },
      'OE':        { faculty:'',                         short:'',    room:'CSL-104' },
      'NCMC':      { faculty:'',                         short:'',    room:'Ground' },
    },
    'VI-C': {
      'CN':        { faculty:'Ms. Rajeshwari K R',      short:'RKR', room:'CSL-101' },
      'IoT':       { faculty:'Mrs. Manjushree K',       short:'MJK', room:'CSL-101' },
      'FSD-Lab':   { faculty:'Dr. Pramod T C',          short:'TCP', room:'Project Lab' },
      'CN-Lab':    { faculty:'Ms. Rajeshwari K R',      short:'RKR', room:'Linux Lab' },
      'IoT-Lab':   { faculty:'Mrs. Manjushree K',       short:'MJK', room:'Project Lab' },
      'HPC':       { faculty:'Dr. N R Sunitha',         short:'NRS', room:'CSL-101' },
      'ACA':       { faculty:'Dr. K R Prasannakumara',  short:'KRP', room:'CSL-101' },
      'BCT':       { faculty:'Dr. Mahesh Kumar',        short:'MHK', room:'CSL-101' },
      'CC':        { faculty:'Dr. Praveen Kumar',        short:'PK',  room:'CSL-101' },
      'SoftSkills':{ faculty:'Mrs. Shilpa S P',         short:'SSP', room:'CSL-101' },
      'IKS':       { faculty:'Mrs. Shilpa S P',         short:'SSP', room:'CSL-101' },
      'OE':        { faculty:'',                         short:'',    room:'CSL-101' },
      'NCMC':      { faculty:'',                         short:'',    room:'Ground' },
      'SDE':       { faculty:'',                         short:'',    room:'Media Centre' },
    },
    'VI-AIDS': {
      'RTBDA':     { faculty:'Dr. A H Shanthakumara',   short:'AHS', room:'CSL-105' },
      'CN':        { faculty:'Mr. Gururaj S P',          short:'GSP', room:'CSL-105' },
      'DDSM':      { faculty:'Dr. Anupama T A',          short:'ANT', room:'CSL-105' },
      'CC':        { faculty:'Dr. R Sumathi',             short:'RS2', room:'CSL-105' },
      'IoT-Lab':   { faculty:'Dr. Sheela S',              short:'SHE', room:'Project Lab' },
      'CN-Lab':    { faculty:'Mr. Gururaj S P',           short:'GSP', room:'Linux Lab' },
      'RTBDA-Lab': { faculty:'Dr. A H Shanthakumara',    short:'AHS', room:'Kalpana Chawla Lab' },
      'SoftSkills':{ faculty:'Mrs. Aruna U',              short:'AUU', room:'CSL-105' },
      'IKS':       { faculty:'Mrs. Nikitha C',            short:'NCC', room:'CSL-105' },
      'OE':        { faculty:'',                           short:'',    room:'CSL-105' },
      'NCMC':      { faculty:'',                           short:'',    room:'Ground' },
      'SDE':       { faculty:'',                           short:'',    room:'Media Centre' },
    },
    'VI-AIML': {
      'NLP':       { faculty:'Dr. Srinivasa K',           short:'SK',      room:'CSL-102' },
      'CN':        { faculty:'Dr. R M Savithramma',       short:'RMS',     room:'CSL-102' },
      'AI-CS':     { faculty:'Dr. Mahesh Pandit/Dr. Akshatha Y', short:'MPT/AKY', room:'CSL-102' },
      'CC':        { faculty:'Dr. R Sumathi',              short:'RS2',     room:'CSL-102' },
      'IoT-Lab':   { faculty:'Dr. Pramod T C',             short:'TCP',     room:'Project Lab' },
      'CN-Lab':    { faculty:'Dr. R M Savithramma',        short:'RMS',     room:'Linux Lab' },
      'NLP-Lab':   { faculty:'Dr. Srinivasa K',            short:'SK',      room:'Project Lab' },
      'SoftSkills':{ faculty:'Ms. Yamuna H',               short:'YMH',     room:'CSL-102' },
      'IKS':       { faculty:'Mrs. Tejaswini D A',         short:'TDA',     room:'CSL-102' },
      'OE':        { faculty:'',                            short:'',        room:'CSL-102' },
      'NCMC':      { faculty:'',                            short:'',        room:'Ground' },
      'SDE':       { faculty:'',                            short:'',        room:'Media Centre' },
    },
    'IV-A': {
      'DAA':       { faculty:'Dr. Shruthi K',              short:'SHK', room:'CSL-001' },
      'MC':        { faculty:'Mrs. Manjushree K',           short:'MJK', room:'CSL-001' },
      'TOC':       { faculty:'Dr. Ashwini B P',             short:'ABP', room:'CSL-001' },
      'DAA-Lab':   { faculty:'Dr. Shruthi K',               short:'SHK', room:'Abdul Kalam Lab' },
      'MC-Lab':    { faculty:'Mrs. Manjushree K',            short:'MJK', room:'RCC Lab' },
      'TOC-Lab':   { faculty:'Dr. Ashwini B P',              short:'ABP', room:'Airavata Lab' },
      'DMS':       { faculty:'Mrs. Chethana R',              short:'CHR', room:'CSL-001' },
      'BE':        { faculty:'Dr. Anupama C',                short:'ANC', room:'CSL-001' },
      'POP':       { faculty:'Dr. M N Sowmya',               short:'MNS', room:'CSL-001' },
      'POP-Lab':   { faculty:'Dr. M N Sowmya',               short:'MNS', room:'Kalpana Chawla Lab' },
      'JS-Lab':    { faculty:'Ms. Rajeshwari K R',           short:'RKR', room:'ACC Lab' },
      'UHV':       { faculty:'Mrs. Nikitha C',               short:'NCC', room:'CSL-001' },
      'ITP-Lab':   { faculty:'Dr. Kiran Kumar T M',          short:'KTM', room:'Kalpana Chawla Lab' },
    },
    'IV-B': {
      'DAA':       { faculty:'Dr. Srinivasa K',              short:'SK',  room:'ARCH-01' },
      'MC':        { faculty:'Dr. Y S Nijagunarya',          short:'YSN', room:'ARCH-01' },
      'TOC':       { faculty:'Mr. A V Krishnamohan',         short:'AVK', room:'ARCH-01' },
      'DAA-Lab':   { faculty:'Dr. Srinivasa K',               short:'SK',  room:'Abdul Kalam Lab' },
      'MC-Lab':    { faculty:'Dr. Y S Nijagunarya',           short:'YSN', room:'RCC Lab' },
      'TOC-Lab':   { faculty:'Mr. A V Krishnamohan',          short:'AVK', room:'Airavata Lab' },
      'DMS':       { faculty:'Dr. Vanitha G P',               short:'VGP', room:'ARCH-01' },
      'BE':        { faculty:'Dr. Akhela Umapathi',           short:'AKU', room:'ARCH-01' },
      'POP':       { faculty:'Dr. M N Sowmya',                short:'MNS', room:'ARCH-01' },
      'POP-Lab':   { faculty:'Dr. M N Sowmya',                short:'MNS', room:'Kalpana Chawla Lab' },
      'JS-Lab':    { faculty:'Dr. K G Manjunatha',            short:'KGM', room:'ACC Lab' },
      'UHV':       { faculty:'Dr. Anupama T A',               short:'ANT', room:'ARCH-01' },
      'ITP-Lab':   { faculty:'Dr. Kiran Kumar T M',           short:'KTM', room:'Kalpana Chawla Lab' },
    },
    'IV-C': {
      'DAA':       { faculty:'Dr. H D Kallinatha',            short:'HDK', room:'CSL-002' },
      'MC':        { faculty:'Dr. K G Manjunatha',            short:'KGM', room:'CSL-002' },
      'TOC':       { faculty:'Dr. K N Shreenath',             short:'KNS', room:'CSL-002' },
      'DAA-Lab':   { faculty:'Dr. H D Kallinatha',             short:'HDK', room:'Abdul Kalam Lab' },
      'MC-Lab':    { faculty:'Dr. K G Manjunatha',             short:'KGM', room:'RCC Lab' },
      'TOC-Lab':   { faculty:'Dr. K N Shreenath',              short:'KNS', room:'Airavata Lab' },
      'DMS':       { faculty:'Dr. Hemavathi N',                short:'HMN', room:'CSL-002' },
      'BE':        { faculty:'Dr. Nagaraj G',                  short:'NGG', room:'CSL-002' },
      'POP':       { faculty:'Dr. M N Sowmya',                 short:'MNS', room:'CSL-002' },
      'POP-Lab':   { faculty:'Dr. M N Sowmya',                 short:'MNS', room:'Kalpana Chawla Lab' },
      'JS-Lab':    { faculty:'Mrs. Aruna U',                   short:'AUU', room:'ACC Lab' },
      'UHV':       { faculty:'Mrs. Tejaswini D A',             short:'TDA', room:'CSL-002' },
      'ITP-Lab':   { faculty:'Mrs. Shwetha A N',               short:'SAN', room:'Kalpana Chawla Lab' },
    },
    'IV-AIDS': {
      'DAA':       { faculty:'Dr. Sheela S',                   short:'SHE', room:'ARCH-02' },
      'AI':        { faculty:'Dr. A H Shanthakumara',          short:'AHS', room:'ARCH-02' },
      'DSP':       { faculty:'Dr. A S Poornima',               short:'ASP', room:'ARCH-02' },
      'DAA-Lab':   { faculty:'Dr. Sheela S',                    short:'SHE', room:'Abdul Kalam Lab' },
      'AI-Lab':    { faculty:'Dr. A H Shanthakumara',           short:'AHS', room:'Kalpana Chawla Lab' },
      'DSP-Lab':   { faculty:'Dr. Ashwini B P',                 short:'ABP', room:'Brahma Gupta Lab' },
      'DAXR-Lab':  { faculty:'Mrs. Anupama B S',                short:'ABS', room:'ACC Lab' },
      'DMS':       { faculty:'Dr. Usha P',                      short:'UPP', room:'ARCH-02' },
      'BE':        { faculty:'Dr. Manjunath',                   short:'MJT', room:'ARCH-02' },
      'POP':       { faculty:'Dr. M N Sowmya',                  short:'MNS', room:'ARCH-02' },
      'POP-Lab':   { faculty:'Dr. M N Sowmya',                  short:'MNS', room:'Kalpana Chawla Lab' },
      'UHV':       { faculty:'Dr. Shruthi K',                   short:'SHK', room:'ARCH-02' },
      'ITP-Lab':   { faculty:'Mrs. Shwetha A N',                short:'SAN', room:'Kalpana Chawla Lab' },
    },
    'IV-AIML': {
      'DAA':       { faculty:'Dr. K R Prasannakumara',          short:'KRP', room:'CSL-003' },
      'AI':        { faculty:'Dr. Bhargavi K',                  short:'BKR', room:'CSL-003' },
      'DSP':       { faculty:'Dr. A S Poornima',                short:'ASP', room:'CSL-003' },
      'DAA-Lab':   { faculty:'Dr. K R Prasannakumara',           short:'KRP', room:'Abdul Kalam Lab' },
      'AI-Lab':    { faculty:'Dr. Bhargavi K',                   short:'BKR', room:'Kalpana Chawla Lab' },
      'DSP-Lab':   { faculty:'Dr. Ashwini B P',                  short:'ABP', room:'Brahma Gupta Lab' },
      'DAXR-Lab':  { faculty:'Dr. Sumalatha Aradhya',            short:'SA',  room:'ACC Lab' },
      'DMS':       { faculty:'Dr. Sureshkumar S',                short:'SKS', room:'CSL-003' },
      'BE':        { faculty:'Dr. Keshavamurthy G N',            short:'KGN', room:'CSL-003' },
      'POP':       { faculty:'Dr. M N Sowmya',                   short:'MNS', room:'CSL-003' },
      'POP-Lab':   { faculty:'Dr. M N Sowmya',                   short:'MNS', room:'Kalpana Chawla Lab' },
      'UHV':       { faculty:'Mrs. Shilpa S P',                  short:'SSP', room:'CSL-003' },
      'ITP-Lab':   { faculty:'Dr. Kiran Kumar T M',              short:'KTM', room:'Kalpana Chawla Lab' },
    },
    'MT2': {
      'Gen-AI':    { faculty:'Dr. R Sumathi',                    short:'RS2', room:'PG-CSE' },
      'AWN':       { faculty:'Dr. K N Shreenath',                short:'KNS', room:'PG-CSE' },
      'PC':        { faculty:'Mr. A V Krishnamohan',             short:'AVK', room:'PG-CSE' },
      'AIoT':      { faculty:'Dr. M B Nirmala',                  short:'MBN', room:'PG-CSE' },
      'PC-Lab':    { faculty:'Mr. A V Krishnamohan',             short:'AVK', room:'Kalpana Chawla Lab' },
      'AIoT-Lab':  { faculty:'Dr. M B Nirmala',                  short:'MBN', room:'Project Lab' },
      'QC':        { faculty:'Dr. H D Kallinatha',               short:'HDK', room:'PG-CSE' },
      'FSD-Dev':   { faculty:'Mr. Gururaj S P',                  short:'GSP', room:'Project Lab' },
      'Gen-AI-Lab':{ faculty:'Dr. R Sumathi',                    short:'RS2', room:'Project Lab' },
    },
  };

  const SUBJECT_TYPES = {
    'CN':'theory','IoT':'theory','NLP':'theory','RTBDA':'theory','DDSM':'theory','AI-CS':'theory',
    'HPC':'pe','ACA':'pe','BCT':'pe','CC':'pe',
    'CN-Lab':'lab','IoT-Lab':'lab','FSD-Lab':'lab','NLP-Lab':'lab','RTBDA-Lab':'lab',
    'SoftSkills':'activity','IKS':'theory','OE':'oe','NCMC':'ncmc','SDE':'activity',
    'DAA':'theory','MC':'theory','TOC':'theory','DMS':'theory','BE':'theory','POP':'theory','UHV':'theory',
    'AI':'theory','DSP':'theory',
    'DAA-Lab':'lab','MC-Lab':'lab','TOC-Lab':'lab','AI-Lab':'lab','DSP-Lab':'lab',
    'DAXR-Lab':'lab','ITP-Lab':'lab','JS-Lab':'lab','POP-Lab':'lab',
    'Gen-AI':'theory','AWN':'theory','PC':'theory','AIoT':'theory','QC':'pe',
    'PC-Lab':'lab','AIoT-Lab':'lab','Gen-AI-Lab':'lab','FSD-Dev':'lab',
  };

  let _custom = {};
  let _tt     = {};
  let _clashes= [];

  /* ── GENERATE ONE SECTION ── */
  function _gen(secId) {
    const ref  = REF_TIMETABLE[secId];
    if (!ref) return {};
    const asgn = Object.assign({}, FACULTY_ASSIGNMENTS[secId] || {}, _custom[secId] || {});
    const tt   = {};

    DAYS.forEach(day => {
      tt[day] = {};
      const isSat  = day === 'Saturday';
      const refDay = ref[day] || {};
      const slots  = isSat ? SAT_SLOT_IDS : THEORY_SLOT_IDS;

      slots.forEach(slotId => {
        const str = refDay[slotId];
        if (!str) return;
        const par  = str.includes('/');
        const main = par ? str.split('/')[0] : str;
        const sec  = par ? str.split('/')[1] : null;
        const mA   = asgn[main] || {};
        const sA   = sec ? (asgn[sec] || {}) : null;

        tt[day][slotId] = {
          subject:  main,
          faculty:  mA.faculty || '',
          short:    mA.short   || '',
          room:     mA.room    || '',
          type:     SUBJECT_TYPES[main] || 'theory',
          batch:    par ? 'B1' : null,
          parallel: sec ? {
            subject: sec,
            faculty: sA ? sA.faculty || '' : '',
            short:   sA ? sA.short   || '' : '',
            room:    sA ? sA.room    || '' : '',
            type:    SUBJECT_TYPES[sec] || 'lab',
            batch:   'B2',
          } : null,
        };
      });
    });

    // Enforce NCMC for VI sem
    if (CONSTRAINTS.ncmcSections.includes(secId)) {
      CONSTRAINTS.ncmcDays.forEach(day => {
        if (!tt[day]) tt[day] = {};
        tt[day][CONSTRAINTS.ncmcSlot] = {
          subject:'NCMC', faculty:'', short:'', room:'Ground',
          type:'ncmc', batch:null, parallel:null,
        };
      });
    }
    return tt;
  }

  /* ── CLASH DETECTOR ── */
  function _detect() {
    const out = [];
    const map = {};   // "day||slot" → { fac:{}, room:{} }

    Object.entries(_tt).forEach(([secId, days]) => {
      DAYS.forEach(day => {
        const isSat = day === 'Saturday';
        const slots = isSat ? SAT_SLOT_IDS : THEORY_SLOT_IDS;
        let theoryRun = 0, lastFac = null;

        slots.forEach(slotId => {
          const e = (days[day] || {})[slotId];
          if (!e) { theoryRun = 0; lastFac = null; return; }

          const k = `${day}||${slotId}`;
          if (!map[k]) map[k] = { fac:{}, room:{} };

          // Faculty clash
          if (e.faculty) {
            const fk = e.faculty.trim();
            if (map[k].fac[fk]) {
              out.push({ severity:'error', type:'faculty-clash',
                message:`"${e.faculty}" double-booked at ${day} ${slotId}`,
                detail:`${secId} (${e.subject}) vs ${map[k].fac[fk]}`,
                secId, day, slotId });
            } else { map[k].fac[fk] = secId; }
          }

          // Room clash (theory classrooms only)
          if (e.room && e.type !== 'lab' && !e.parallel) {
            const rk = e.room.trim();
            if (map[k].room[rk]) {
              out.push({ severity:'error', type:'room-clash',
                message:`Room "${e.room}" double-booked at ${day} ${slotId}`,
                detail:`${secId} vs ${map[k].room[rk]}`,
                secId, day, slotId });
            } else { map[k].room[rk] = secId; }
          }

          // Consecutive theory
          if (e.type === 'theory' && e.faculty) {
            if (e.faculty === lastFac) theoryRun++;
            else { theoryRun = 1; lastFac = e.faculty; }
            if (theoryRun > CONSTRAINTS.maxConsecutiveTheory) {
              out.push({ severity:'warning', type:'consecutive',
                message:`"${e.faculty}" has ${theoryRun} consecutive theory slots in ${secId}`,
                detail:`${day} ending at ${slotId}`,
                secId, day, slotId });
            }
          } else { theoryRun = 0; lastFac = null; }

          // Break slot used
          if (CONSTRAINTS.mandatoryBreaks.includes(slotId)) {
            out.push({ severity:'error', type:'break-violation',
              message:`Break slot ${slotId} has a class in ${secId}`,
              detail:`${day} · ${e.subject}`, secId, day, slotId });
          }
        });
      });
    });

    _clashes = out;
    return out;
  }

  /* ── CSS (injected once) ── */
  function _injectCSS() {
    if (document.getElementById('_ttgen_css')) return;
    const s = document.createElement('style');
    s.id = '_ttgen_css';
    s.textContent = `
.ttg-wrap{overflow-x:auto;border-radius:8px;border:1px solid #2a3348;background:#111318;margin-bottom:16px}
.ttg-tbl{width:100%;border-collapse:collapse;min-width:900px}
.ttg-tbl th{background:#181c24;color:#4a5570;padding:7px 4px;font-size:9px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;border-bottom:1px solid #2a3348;border-right:1px solid #2a3348;text-align:center;white-space:nowrap}
.ttg-tbl th:first-child{text-align:left;padding-left:12px;width:68px;color:#8a97b8}
.ttg-tbl th.ttg-bh{background:#0a0c10!important;color:#2a3348!important;font-size:8px!important}
.ttg-tbl td{border:1px solid rgba(42,51,72,.45);padding:2px;vertical-align:top;height:64px}
.ttg-tbl td.ttg-dc{background:#181c24;padding:0 10px;font-size:9px;font-weight:700;color:#4a5570;vertical-align:middle;white-space:nowrap;border-right:2px solid #2a3348;font-family:monospace;letter-spacing:.08em}
.ttg-tbl td.ttg-bc{background:#0a0c10;opacity:.5;height:auto!important;padding:2px 0;font-size:8px;color:#2a3348;text-align:center;vertical-align:middle}
.ttg-tbl td.ttg-so{background:rgba(10,12,16,.7);opacity:.3}
.ttg-s{height:100%;min-height:58px;border-radius:4px;padding:4px 5px;display:flex;flex-direction:column;gap:1px;position:relative;overflow:hidden;border-left:3px solid transparent}
.ttg-s .n{font-size:10px;font-weight:700;line-height:1.2}
.ttg-s .f{font-size:8.5px;opacity:.75;line-height:1.3}
.ttg-s .r{font-size:7.5px;font-family:monospace;margin-top:auto;opacity:.55}
.ttg-s .b{position:absolute;top:2px;right:2px;font-size:6.5px;font-weight:800;padding:1px 4px;border-radius:3px;text-transform:uppercase}
.ttg-em{background:transparent;border-left-color:transparent}
.ttg-th{background:rgba(77,140,255,.13);border-left-color:#4d8cff;color:#c0d8ff}
.ttg-lb{background:rgba(46,204,142,.1); border-left-color:#2ecc8e;color:#9fffd8}
.ttg-oe{background:rgba(168,124,255,.1);border-left-color:#a87cff;color:#d4bfff}
.ttg-pe{background:rgba(255,140,66,.12);border-left-color:#ff8c42;color:#ffd0a8}
.ttg-on{background:rgba(48,214,192,.1); border-left-color:#30d6c0;color:#99f0e8}
.ttg-ac{background:rgba(240,160,48,.1); border-left-color:#f0a030;color:#fde898}
.ttg-nc{background:rgba(255,79,110,.08);border-left-color:#ff4f6e;color:#ff9aaa}
.ttg-cx{background:rgba(255,0,30,.22);  border-left-color:#ff0030;color:#ffaaaa;animation:ttg-p 1.5s infinite}
@keyframes ttg-p{0%,100%{opacity:1}50%{opacity:.6}}
.ttg-leg{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:10px;padding:7px 12px;background:#111318;border:1px solid #2a3348;border-radius:6px;font-size:9px}
.ttg-leg span{display:flex;align-items:center;gap:4px;color:#4a5570}
.ttg-leg .ld{width:8px;height:8px;border-radius:2px;flex-shrink:0}
.ttg-clst{margin-top:12px;padding:10px 14px;background:rgba(255,0,30,.08);border:1px solid rgba(255,79,110,.3);border-radius:8px}
.ttg-clst h4{font-size:11px;color:#ff4f6e;margin-bottom:8px}
.ttg-ci{font-size:10px;padding:5px 8px;border-radius:4px;margin-bottom:4px;border-left:3px solid}
.ttg-ci.e{background:rgba(255,79,110,.1);border-color:#ff4f6e;color:#ff9aaa}
.ttg-ci.w{background:rgba(240,160,48,.1);border-color:#f0a030;color:#fde898}
.ttg-sfm{width:100%;border-collapse:collapse;margin-top:12px;font-size:11px}
.ttg-sfm th{background:#181c24;padding:7px 10px;font-size:9px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:#4a5570;text-align:left;border-bottom:1px solid #2a3348}
.ttg-sfm td{padding:8px 10px;border-bottom:1px solid rgba(42,51,72,.4);color:#8a97b8}
.ttg-sfm tr:hover td{background:rgba(255,255,255,.02)}
    `;
    document.head.appendChild(s);
  }

  /* ── RENDER INTO DIV ── */
  function _render(secId, divId, opts = {}) {
    const el = document.getElementById(divId);
    if (!el) { console.error('[TTGen] div not found:', divId); return; }
    const tt = _tt[secId];
    if (!tt) { el.innerHTML = `<p style="color:#ff4f6e">No timetable for ${secId} — call TTGen.generate('${secId}') first.</p>`; return; }

    _injectCSS();

    const TC = { theory:'ttg-th', lab:'ttg-lb', oe:'ttg-oe', pe:'ttg-pe',
                 online:'ttg-on', activity:'ttg-ac', ncmc:'ttg-nc',
                 study_hour:'ttg-on', bct_online:'ttg-on' };

    const secClashes = _clashes.filter(c => c.secId === secId);

    let h = `<div class="ttg-leg">
      <span><div class="ld" style="background:#4d8cff"></div>Theory</span>
      <span><div class="ld" style="background:#2ecc8e"></div>Lab</span>
      <span><div class="ld" style="background:#f0a030"></div>Activity</span>
      <span><div class="ld" style="background:#a87cff"></div>OE</span>
      <span><div class="ld" style="background:#ff8c42"></div>PE</span>
      <span><div class="ld" style="background:#30d6c0"></div>Online</span>
      <span><div class="ld" style="background:#ff4f6e"></div>NCMC</span>
      ${secClashes.length ? `<span style="color:#ff4f6e">⚠ ${secClashes.length} conflict(s)</span>` : '<span style="color:#2ecc8e">✓ No conflicts</span>'}
    </div>
    <div class="ttg-wrap"><table class="ttg-tbl"><thead><tr><th>Day</th>`;

    TIME_SLOTS.forEach(t => {
      if (t.isBreak) h += `<th class="ttg-bh" style="width:42px">${t.id}</th>`;
      else h += `<th>${t.label.split('–')[0]}</th>`;
    });
    h += `</tr></thead><tbody>`;

    DAYS.forEach((day, di) => {
      const dayTT = tt[day] || {};
      const isSat = day === 'Saturday';
      const ds    = ['MON','TUE','WED','THU','FRI','SAT'][di];

      h += `<tr><td class="ttg-dc">${ds}</td>`;

      TIME_SLOTS.forEach(t => {
        if (t.isBreak) { h += `<td class="ttg-bc">${t.id==='BK'?'☕':'🍽'}</td>`; return; }
        if (isSat && !SAT_SLOT_IDS.includes(t.id)) { h += `<td class="ttg-so"></td>`; return; }

        const e   = dayTT[t.id];
        const cx  = secClashes.some(c => c.day === day && c.slotId === t.id);

        if (!e) { h += `<td><div class="ttg-s ttg-em"></div></td>`; return; }

        const cls = cx ? 'ttg-cx' : (TC[e.type] || 'ttg-th');
        const bat = e.batch    ? `<span class="b" style="background:rgba(77,140,255,.6);color:#fff">${e.batch}</span>` : '';
        const pb  = e.parallel ? `<span class="b" style="background:rgba(168,124,255,.6);color:#fff;top:auto;bottom:2px">‖${e.parallel.batch}</span>` : '';

        h += `<td title="${e.subject}&#10;${e.faculty||''}&#10;${e.room||''}">
          <div class="ttg-s ${cls}">
            ${bat}${pb}
            <div class="n">${e.subject}</div>
            ${e.short ? `<div class="f">${e.short}</div>` : ''}
            ${e.parallel ? `<div class="f" style="color:#a87cff;font-size:8px">‖${e.parallel.short||''} ${e.parallel.subject}</div>` : ''}
            <div class="r">${(e.room||'').replace(/ Lab$/,'').replace(/Lab$/,'').trim()}</div>
            ${cx ? `<div class="b" style="background:#ff0030;color:#fff;top:auto;bottom:2px">CLASH</div>` : ''}
          </div></td>`;
      });
      h += `</tr>`;
    });

    h += `</tbody></table></div>`;

    // Subject-faculty map
    if (opts.showMap !== false) {
      const asgn = Object.assign({}, FACULTY_ASSIGNMENTS[secId]||{}, _custom[secId]||{});
      h += `<table class="ttg-sfm">
        <thead><tr><th>#</th><th>Code</th><th>Faculty</th><th>Room</th><th>Type</th></tr></thead><tbody>
        ${Object.entries(asgn).map(([code, a], i) => `<tr>
          <td style="color:#364060;font-family:monospace">${i+1}</td>
          <td><code style="background:#181c24;padding:2px 6px;border-radius:3px;font-size:10px;color:#4d8cff">${code}</code></td>
          <td>${a.faculty||'—'}</td>
          <td style="font-family:monospace;font-size:10px;color:#4a5570">${a.room||'—'}</td>
          <td><span style="background:${SUBJECT_TYPES[code]==='lab'?'rgba(46,204,142,.15)':'rgba(77,140,255,.15)'};color:${SUBJECT_TYPES[code]==='lab'?'#2ecc8e':'#4d8cff'};padding:2px 7px;border-radius:10px;font-size:9px;font-weight:700">${SUBJECT_TYPES[code]||'theory'}</span></td>
        </tr>`).join('')}
        </tbody></table>`;
    }

    // Conflicts
    if (opts.showConflicts !== false && secClashes.length) {
      h += `<div class="ttg-clst"><h4>⚠ ${secClashes.length} conflict(s) in ${secId}</h4>
        ${secClashes.map(c => `<div class="ttg-ci ${c.severity==='error'?'e':'w'}">
          <strong>${c.severity==='error'?'⛔':'⚠'} ${c.type}:</strong> ${c.message}<br>
          <span style="opacity:.7">${c.detail||''}</span>
        </div>`).join('')}
      </div>`;
    }

    el.innerHTML = h;
  }

  /* ── PUBLIC API ── */
  return {
    /**
     * init([customAssignments])
     * Call before anything else.
     * customAssignments: { secId: { subCode: { faculty, short, room } } }
     */
    init(custom = {}) {
      _custom  = custom;
      _tt      = {};
      _clashes = [];
    },

    /** generate(sectionId) → timetable object */
    generate(secId) {
      _tt[secId] = _gen(secId);
      return _tt[secId];
    },

    /** generateAll([sectionIds]) → all timetables */
    generateAll(ids) {
      (ids || Object.keys(REF_TIMETABLE)).forEach(id => { _tt[id] = _gen(id); });
      _clashes = _detect();
      return _tt;
    },

    /** getResult(sectionId) → timetable object or null */
    getResult(secId) { return _tt[secId] || null; },

    /** getAllResults() → { secId: timetable } */
    getAllResults() { return _tt; },

    /** detectClashes() → array of conflict objects */
    detectClashes() { _clashes = _detect(); return _clashes; },

    /** getConflicts() → current conflict array */
    getConflicts() { return _clashes; },

    /**
     * renderHTML(sectionId, containerId, options)
     * Renders timetable grid + subject map + conflicts into a <div>.
     * options: { showMap: true, showConflicts: true }
     */
    renderHTML(secId, divId, opts = {}) { _render(secId, divId, opts); },

    /** renderAll(containerId, options) — renders every section */
    renderAll(divId, opts = {}) {
      const el = document.getElementById(divId);
      if (!el) return;
      el.innerHTML = '';
      Object.keys(_tt).forEach(secId => {
        const w = document.createElement('div');
        w.id = '_ttg_' + secId;
        w.style.marginBottom = '32px';
        w.innerHTML = `<h3 style="font-size:13px;font-weight:700;margin-bottom:10px;color:#e8edf8;font-family:monospace">${secId}</h3>`;
        el.appendChild(w);
        _render(secId, '_ttg_' + secId, opts);
      });
    },

    /**
     * setAssignment(sectionId, subjectCode, { faculty, short, room })
     * Override a faculty/room assignment at runtime (HOD change).
     */
    setAssignment(secId, code, asgn) {
      if (!_custom[secId]) _custom[secId] = {};
      _custom[secId][code] = asgn;
    },

    /** getAssignments(sectionId) → merged assignments object */
    getAssignments(secId) {
      return Object.assign({}, FACULTY_ASSIGNMENTS[secId]||{}, _custom[secId]||{});
    },

    /** getSections() → array of all section IDs */
    getSections() { return Object.keys(REF_TIMETABLE); },

    /** getTimeSlots() → TIME_SLOTS array */
    getTimeSlots() { return TIME_SLOTS; },

    /** getReference(sectionId) → raw reference timetable */
    getReference(secId) { return REF_TIMETABLE[secId] || null; },

    /** setConstraint(key, value) — update a constraint at runtime */
    setConstraint(key, val) { CONSTRAINTS[key] = val; },

    /** exportJSON([filename]) — downloads complete timetable JSON */
    exportJSON(filename = 'SIT_CSE_TT_EvenSem2025-26.json') {
      const out = {
        meta: { institution:'SIT Tumakuru', dept:'CSE', semester:'Even 2025-26', generated: new Date().toISOString() },
        constraints: CONSTRAINTS,
        timetable: _tt,
        conflicts: _clashes,
      };
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(out,null,2)],{type:'application/json'}));
      a.download = filename; a.click();
    },
  };

})();

/*
=================================================================
  QUICK-START — paste any of these into your existing HTML script
=================================================================

// ── Option 1: Generate ALL sections and render all at once
TTGen.init();
TTGen.generateAll();
TTGen.detectClashes();
TTGen.renderAll('your-container-div-id');

// ── Option 2: Generate just one section
TTGen.init();
TTGen.generate('VI-A');
TTGen.detectClashes();
TTGen.renderHTML('VI-A', 'your-div-id');

// ── Option 3: HOD override before generating
TTGen.init();
TTGen.setAssignment('VI-A', 'CN', { faculty:'Dr. New Person', short:'NP', room:'CSL-103' });
TTGen.generateAll();
TTGen.renderAll('output');

// ── Option 4: Get raw timetable data object for your own renderer
TTGen.init();
TTGen.generate('IV-A');
const data = TTGen.getResult('IV-A');
// data = { Monday: { S1: { subject, faculty, short, room, type, batch, parallel }, ... }, ... }

// ── Option 5: Run clash detection and log results
const issues = TTGen.detectClashes();
issues.forEach(i => console.log(i.severity, i.type, i.message));

// ── Option 6: Change constraint
TTGen.setConstraint('maxConsecutiveTheory', 3);

// ── Option 7: Export to JSON file
TTGen.exportJSON('my_timetable.json');

// ── Available section IDs:
// 'VI-A', 'VI-B', 'VI-C', 'VI-AIDS', 'VI-AIML',
// 'IV-A', 'IV-B', 'IV-C', 'IV-AIDS', 'IV-AIML',
// 'MT2'
=================================================================
*/