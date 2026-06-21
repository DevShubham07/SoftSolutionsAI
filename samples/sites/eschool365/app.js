/* ============================================================================
   eschool365 — School ERP (frontend-only, statically deployable).
   Ported from the Claude Design DC-runtime artifact to standard React.
   The entire UI is React.createElement (no JSX) → no build step; plain scripts
   share global scope. `renderVals()` returns the shell "slots"; render()
   arranges them (was the <x-dc> mustache template). `this.state` is the
   in-memory store; localStorage persistence is layered on in store.js (Phase 1).
   ============================================================================ */
class Component extends React.Component {
  constructor(p){
    super(p);
    const I = {
      grid:[['rect',{x:3,y:3,width:7,height:7,rx:1.4}],['rect',{x:14,y:3,width:7,height:7,rx:1.4}],['rect',{x:3,y:14,width:7,height:7,rx:1.4}],['rect',{x:14,y:14,width:7,height:7,rx:1.4}]],
      settings:[['line',{x1:4,y1:6,x2:20,y2:6}],['line',{x1:4,y1:12,x2:20,y2:12}],['line',{x1:4,y1:18,x2:20,y2:18}],['circle',{cx:9,cy:6,r:2}],['circle',{cx:15,cy:12,r:2}],['circle',{cx:8,cy:18,r:2}]],
      book:[['path',{d:'M6 3h11a1 1 0 0 1 1 1v16H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z'}],['path',{d:'M5 17.5A2 2 0 0 1 7 16h11'}]],
      layers:[['path',{d:'M12 3 3 7.5 12 12l9-4.5z'}],['path',{d:'M3 12.5 12 17l9-4.5'}]],
      grad:[['path',{d:'M2 8.5 12 4l10 4.5L12 13z'}],['path',{d:'M6 11v4.5c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5V11'}]],
      briefcase:[['rect',{x:3,y:7.5,width:18,height:12.5,rx:2}],['path',{d:'M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5'}],['line',{x1:3,y1:12.5,x2:21,y2:12.5}]],
      bank:[['path',{d:'M12 3 21 8H3z'}],['line',{x1:4,y1:21,x2:20,y2:21}],['path',{d:'M6 11v6M10 11v6M14 11v6M18 11v6'}]],
      receipt:[['path',{d:'M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1V3l-2 1-2-1-2 1-2-1-2 1z'}],['line',{x1:8,y1:8,x2:14,y2:8}],['line',{x1:8,y1:12,x2:14,y2:12}]],
      wallet:[['rect',{x:3,y:6,width:18,height:13,rx:2.5}],['path',{d:'M3 10h18'}],['circle',{cx:16.5,cy:14.5,r:1.1}]],
      calcheck:[['rect',{x:3,y:5,width:18,height:16,rx:2.5}],['line',{x1:3,y1:9.5,x2:21,y2:9.5}],['line',{x1:8,y1:3,x2:8,y2:6}],['line',{x1:16,y1:3,x2:16,y2:6}],['path',{d:'M9 14.5l2 2 4-4'}]],
      calendar:[['rect',{x:3,y:5,width:18,height:16,rx:2.5}],['line',{x1:3,y1:9.5,x2:21,y2:9.5}],['line',{x1:8,y1:3,x2:8,y2:6}],['line',{x1:16,y1:3,x2:16,y2:6}]],
      pencil:[['path',{d:'M4 20h4L19.5 8.5l-4-4L4 16z'}],['line',{x1:14,y1:6,x2:18,y2:10}]],
      clipboard:[['rect',{x:6,y:4,width:12,height:17,rx:2}],['rect',{x:9,y:2.5,width:6,height:3.5,rx:1}],['line',{x1:9,y1:11,x2:15,y2:11}],['line',{x1:9,y1:15,x2:13,y2:15}]],
      award:[['circle',{cx:12,cy:9,r:5}],['path',{d:'M9 13.5 8 21l4-2.2L16 21l-1-7.5'}]],
      chart:[['line',{x1:4,y1:20,x2:4,y2:10}],['line',{x1:10,y1:20,x2:10,y2:4}],['line',{x1:16,y1:20,x2:16,y2:13}],['line',{x1:3,y1:20.5,x2:21,y2:20.5}]],
      badge:[['path',{d:'M7 3h7l4 4v14H7z'}],['circle',{cx:12.5,cy:12,r:2.6}],['path',{d:'M10.5 14 10 19l2.5-1.4L15 19l-.5-5'}]],
      message:[['path',{d:'M4 5h16v11H8l-4 3.5z'}]],
      user:[['circle',{cx:12,cy:8,r:3.4}],['path',{d:'M5.5 20a6.5 6.5 0 0 1 13 0'}]],
      star:[['path',{d:'M12 3.5l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.5 6.9 19.2l1-5.7-4.1-4 5.7-.8z'}]],
      search:[['circle',{cx:11,cy:11,r:7}],['line',{x1:16.5,y1:16.5,x2:21,y2:21}]],
      lock:[['rect',{x:5,y:11,width:14,height:9,rx:2}],['path',{d:'M8 11V7.5a4 4 0 0 1 8 0V11'}]],
      chevD:[['path',{d:'M6 9l6 6 6-6'}]],
      chevR:[['path',{d:'M9 6l6 6-6 6'}]],
      bell:[['path',{d:'M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6'}],['path',{d:'M10 20a2 2 0 0 0 4 0'}]],
      mail:[['rect',{x:3,y:5,width:18,height:14,rx:2.5}],['path',{d:'M3.5 7l8.5 6 8.5-6'}]],
      cart:[['circle',{cx:9.5,cy:20,r:1.4}],['circle',{cx:17.5,cy:20,r:1.4}],['path',{d:'M3 4h2.2l2.3 11h10l2-8H6'}]],
      max:[['path',{d:'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'}]],
      menu:[['line',{x1:4,y1:7,x2:20,y2:7}],['line',{x1:4,y1:12,x2:20,y2:12}],['line',{x1:4,y1:17,x2:20,y2:17}]],
      plus:[['line',{x1:12,y1:5,x2:12,y2:19}],['line',{x1:5,y1:12,x2:19,y2:12}]],
      download:[['path',{d:'M12 3.5v11'}],['path',{d:'M7.5 10.5l4.5 4.5 4.5-4.5'}],['line',{x1:5,y1:20,x2:19,y2:20}]],
      filter:[['path',{d:'M3 5h18l-7 8v6l-4-2v-4z'}]],
      refresh:[['path',{d:'M20 11a8 8 0 1 0-1.4 5.2'}],['path',{d:'M20 5v6h-6'}]],
      x:[['line',{x1:6,y1:6,x2:18,y2:18}],['line',{x1:18,y1:6,x2:6,y2:18}]],
      check:[['path',{d:'M5 12.5l5 5 9-11'}]],
      video:[['rect',{x:3,y:6,width:12.5,height:12,rx:2.5}],['path',{d:'M15.5 10l5.5-3v10l-5.5-3z'}]],
      phone:[['rect',{x:7,y:3,width:10,height:18,rx:2.5}],['line',{x1:11,y1:18,x2:13,y2:18}]],
      card:[['rect',{x:3,y:6,width:18,height:13,rx:2.5}],['line',{x1:3,y1:10.5,x2:21,y2:10.5}]],
      key:[['circle',{cx:8,cy:15,r:3.6}],['path',{d:'M10.6 12.4 20 3'}],['path',{d:'M16 7l2.6 2.6'}]],
      list:[['line',{x1:8,y1:6,x2:21,y2:6}],['line',{x1:8,y1:12,x2:21,y2:12}],['line',{x1:8,y1:18,x2:21,y2:18}],['circle',{cx:4,cy:6,r:1}],['circle',{cx:4,cy:12,r:1}],['circle',{cx:4,cy:18,r:1}]],
      up:[['line',{x1:12,y1:20,x2:12,y2:5}],['path',{d:'M6 11l6-6 6 6'}]],
      idcard:[['rect',{x:3,y:5,width:18,height:14,rx:2.5}],['circle',{cx:8,cy:11,r:2.2}],['line',{x1:13,y1:9.5,x2:18,y2:9.5}],['line',{x1:13,y1:13.5,x2:18,y2:13.5}],['path',{d:'M5 16a3 3 0 0 1 6 0'}]],
      eye:[['path',{d:'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z'}],['circle',{cx:12,cy:12,r:3}]],
      trash:[['path',{d:'M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13'}]],
      printer:[['path',{d:'M7 9V4h10v5'}],['rect',{x:5,y:9,width:14,height:8,rx:2}],['path',{d:'M7 17h10v4H7z'}]],
      coins:[['ellipse',{cx:9,cy:7,rx:5,ry:2.5}],['path',{d:'M4 7v5c0 1.4 2.2 2.5 5 2.5'}],['ellipse',{cx:15,cy:13,rx:5,ry:2.5}],['path',{d:'M10 13v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-5'}]],
      inbox:[['path',{d:'M3 13l3-8h12l3 8'}],['path',{d:'M3 13h5l1.5 3h5L16 13h5v6H3z'}]],
      dot:[['circle',{cx:12,cy:12,r:3}]]
    };
    this.I = I;
    this.IND = {50:'#EEF0FF',100:'#E2E4FF',500:'#5B47E0',600:'#4E3DD2',700:'#4031B0'};
    this.ROLE = {admin:'#5B47E0', coord:'#0E9488', teach:'#2563EB', student:'#059669'};
    this.RLAB = {admin:'Admin', coord:'Class Coordinator', teach:'Teacher', student:'Student / Parent'};

    // page meta (crumb / title)
    const M = {
      sysmap:['System \u203a Data Map','System Map'], setup:['System \u203a Setup Health','Setup Health'],
      dash_admin:['Dashboard','Dashboard'], dash_coord:['Dashboard','Coordinator Dashboard'], dash_teach:['Dashboard','Teacher Dashboard'], dash_std:['Dashboard','My Dashboard'],
      inst:['Settings \u203a Institute Profile','Institute Profile'], feepart:['Settings \u203a Fee Particulars','Fees Particulars'], bank:['Settings \u203a Fee Challan','Accounts for Fees Invoice'], rules:['Settings \u203a Rules','Rules & Regulations'], grading:['Settings \u203a Exam Grading','Marks Grading'], theme:['Settings \u203a Appearance','Theme & Language'], acct:['Settings \u203a Account','Account Settings'], pwd:['Settings \u203a Password','Change Password'],
      classes:['Classes \u203a All Classes','All Classes'], newclass:['Classes \u203a Add New','Create Class'], subjview:['Subjects \u203a With Subjects','Classes With Subjects'], assignsub:['Subjects \u203a Assign','Assign Subjects'],
      allstd:['Students \u203a All Students','All Students'], stdprofile:['Students \u203a Profile','Student Profile'], archive:['Students \u203a Archive','Archive & Deleted Records'], admission:['Students \u203a Admission','New Admission'], admletter:['Students \u203a Admission Letter','Admission Letter'], idcard:['Students \u203a ID Cards','Student ID Cards'], printlist:['Students \u203a Basic List','Print Basic List'], stdlogin:['Students \u203a Login','Manage Student Login'], promote:['Students \u203a Promote','Promote Students'], myprofile:['Profile \u203a My Profile','My Profile'],
      allemp:['Employees \u203a All','All Employees'], addemp:['Employees \u203a New','Add Employee'], jobletter:['Employees \u203a Job Letter','Job Letter'], stafflogin:['Employees \u203a Login','Manage Staff Login'], staffleave:['Employees \u203a Leave','Staff Leave & Substitution'],
      coa:['Accounts \u203a Chart','Chart of Accounts'], income:['Accounts \u203a Income','Add Income'], expense:['Accounts \u203a Expense','Add Expense'], statement:['Accounts \u203a Statement','Account Statement'],
      geninvoice:['Fees \u203a Generate','Generate Fees Invoice'], collect:['Fees \u203a Collect','Collect Fees'], payonline:['Fees \u203a Pay','Pay Fees'], paidslip:['Fees \u203a Paid Slip','Fees Paid Slip'], defaulters:['Fees \u203a Defaulters','Fees Defaulters'],
      paysalary:['Salary \u203a Pay','Pay Salary'], salaryslip:['Salary \u203a Slip','Salary Paid Slip'], myslip:['Salary \u203a My Slip','My Salary Slip'],
      markatt:['Attendance \u203a Students','Students Attendance'], empatt:['Attendance \u203a Employees','Employees Attendance'], selfcheck:['Attendance \u203a Self','My Check-in'], clsreport:['Attendance \u203a Class-wise','Class-wise Report'], stdattrep:['Attendance \u203a Record','Students Attendance Report'], myatt:['Attendance \u203a My Record','My Attendance'], empattrep:['Attendance \u203a Staff Record','Employees Attendance Report'],
      tt_edit:['Timetable \u203a Builder','Timetable Builder'], tt_view:['Timetable','My Timetable'],
      homework:['Teaching \u203a Homework','Homework'], homework_std:['Homework','Homework'], behaviour:['Teaching \u203a Behaviour','Rate Behaviour & Skills'], behaviour_std:['Behaviour','My Ratings'], qpaper:['Teaching \u203a Question Paper','Question Paper'],
      addexam:['Exams \u203a Create','Create New Exam'], exammarks:['Exams \u203a Marks','Add / Update Exam Marks'], resultcard:['Exams \u203a Result Card','Result Card'], myresult:['Results','My Result Card'],
      testmarks:['Class Tests \u203a Marks','Manage Test Marks'], testresult:['Class Tests \u203a Result','Test Result'], mytest:['Class Tests','My Test Results'],
      finance:['Reports \u203a Finance','Finance & Statistics'],
      rptcard:['Reports \u203a Report Card','Students Report Card'], rptinfo:['Reports \u203a Student Info','Students Info Report'], rptparent:['Reports \u203a Parents Info','Parents Info Report'], myreport:['Reports','My Report Card'],
      cert:['Certificates \u203a Generate','Generate Certificate'], mycert:['Certificates','My Certificates'],
      messaging:['Comms \u203a Chats','Messaging'], liveclass:['Comms \u203a Live Class','Live Class'], liveclass_std:['Comms \u203a Live Class','Live Class'], smsgw:['Comms \u203a SMS','SMS Gateway']
    };
    this.M = M;

    const g=(label,icon,items)=>({label,icon,items});
    const it=(l,k,lock)=>({l,k,lock:!!lock});
    this.NAV = {
      admin:[
        g('','grid',[it('Dashboard','dash_admin')]),
        g('System Map','layers',[it('Data & Relationships','sysmap'),it('Setup Health','setup')]),
        g('General Settings','settings',[it('Institute Profile','inst'),it('Fees Particulars','feepart'),it('Accounts for Invoice','bank'),it('Rules & Regulations','rules'),it('Marks Grading','grading'),it('Theme & Language','theme'),it('Account Settings','acct')]),
        g('Classes','book',[it('All Classes','classes'),it('Create Class','newclass')]),
        g('Subjects','layers',[it('Classes With Subjects','subjview'),it('Assign Subjects','assignsub')]),
        g('Students','grad',[it('All Students','allstd'),it('Admissions','admission'),it('Admission Letter','admletter'),it('ID Cards','idcard'),it('Print Basic List','printlist'),it('Manage Login','stdlogin'),it('Promote','promote'),it('Archive','archive')]),
        g('Employees','briefcase',[it('All Employees','allemp'),it('Add Employee','addemp'),it('Job Letter','jobletter'),it('Manage Login','stafflogin'),it('Staff Leave','staffleave')]),
        g('Accounts','bank',[it('Chart of Accounts','coa'),it('Add Income','income'),it('Add Expense','expense'),it('Account Statement','statement')]),
        g('Fees','receipt',[it('Generate Invoice','geninvoice'),it('Collect Fees','collect'),it('Fees Paid Slip','paidslip'),it('Defaulters','defaulters')]),
        g('Salary','wallet',[it('Pay Salary','paysalary'),it('Salary Paid Slip','salaryslip')]),
        g('Attendance','calcheck',[it('Students','markatt'),it('Employees','empatt'),it('Class-wise Report','clsreport'),it('Student Report','stdattrep'),it('Staff Report','empattrep')]),
        g('Timetable','calendar',[it('Builder','tt_edit')]),
        g('Teaching','pencil',[it('Homework','homework'),it('Behaviour & Skills','behaviour'),it('Question Paper','qpaper')]),
        g('Exams','clipboard',[it('Create Exam','addexam'),it('Add Marks','exammarks'),it('Result Card','resultcard')]),
        g('Class Tests','award',[it('Manage Marks','testmarks'),it('Test Result','testresult')]),
        g('Reports','chart',[it('Finance & Statistics','finance'),it('Report Card','rptcard'),it('Student Info','rptinfo'),it('Parents Info','rptparent')]),
        g('Certificates','badge',[it('Generate','cert')]),
        g('Comms','message',[it('Messaging','messaging'),it('Live Class','liveclass'),it('SMS Gateway','smsgw',true)])
      ],
      coord:[
        g('','grid',[it('Dashboard','dash_coord')]),
        g('System Map','layers',[it('Data & Relationships','sysmap'),it('Setup Health','setup')]),
        g('Classes','book',[it('All Classes','classes'),it('Create Class','newclass')]),
        g('Subjects','layers',[it('Classes With Subjects','subjview'),it('Assign Subjects','assignsub')]),
        g('Students','grad',[it('All (my class)','allstd'),it('Admissions','admission'),it('Admission Letter','admletter'),it('ID Cards','idcard'),it('Print List','printlist'),it('Manage Login','stdlogin'),it('Promote','promote'),it('Archive','archive')]),
        g('Attendance','calcheck',[it('Students','markatt'),it('Class-wise Report','clsreport'),it('Student Report','stdattrep')]),
        g('Timetable \u00b7 edit','calendar',[it('Builder','tt_edit')]),
        g('Teaching','pencil',[it('Homework','homework'),it('Behaviour & Skills','behaviour'),it('Question Paper','qpaper')]),
        g('Exams','clipboard',[it('Create Exam','addexam'),it('Add Marks','exammarks'),it('Result Card','resultcard')]),
        g('Class Tests','award',[it('Manage Marks','testmarks'),it('Test Result','testresult')]),
        g('Reports','chart',[it('Finance & Statistics','finance'),it('Report Card','rptcard'),it('Student Info','rptinfo'),it('Parents Info','rptparent')]),
        g('Fees \u00b7 view','receipt',[it('Generate Invoice','geninvoice'),it('Paid Slip','paidslip'),it('Defaulters','defaulters')]),
        g('Certificates','badge',[it('Generate','cert')]),
        g('Comms','message',[it('Messaging','messaging'),it('Live Class','liveclass')]),
        g('Self','user',[it('My Salary Slip','myslip'),it('Account','acct')])
      ],
      teach:[
        g('','grid',[it('Dashboard','dash_teach')]),
        g('Classes','book',[it('All Classes','classes')]),
        g('Subjects','layers',[it('Classes With Subjects','subjview')]),
        g('Students','grad',[it('All (my class)','allstd'),it('Print List','printlist')]),
        g('Attendance','calcheck',[it('Students (mark)','markatt'),it('Class-wise Report','clsreport'),it('Student Report','stdattrep'),it('My Check-in','selfcheck')]),
        g('Timetable','calendar',[it('My Timetable','tt_view')]),
        g('Teaching','pencil',[it('Homework','homework'),it('Behaviour & Skills','behaviour'),it('Question Paper','qpaper')]),
        g('Exams','clipboard',[it('Add Marks','exammarks'),it('Result Card','resultcard')]),
        g('Class Tests','award',[it('Manage Marks','testmarks'),it('Test Result','testresult')]),
        g('Reports','chart',[it('Report Card','rptcard'),it('Student Info','rptinfo')]),
        g('Comms','message',[it('Messaging','messaging'),it('Live Class','liveclass')]),
        g('Self','user',[it('My Salary Slip','myslip'),it('Account','acct')])
      ],
      student:[
        g('','grid',[it('My Dashboard','dash_std')]),
        g('Profile','user',[it('My Profile','myprofile')]),
        g('Fees','receipt',[it('My Invoice','geninvoice'),it('Pay Fees','payonline'),it('Paid Slip','paidslip')]),
        g('Attendance','calcheck',[it('My Attendance','myatt')]),
        g('Timetable','calendar',[it('My Timetable','tt_view')]),
        g('Homework','pencil',[it('Homework','homework_std')]),
        g('Results','award',[it('Exam Result Card','myresult'),it('Test Results','mytest'),it('My Report Card','myreport')]),
        g('Behaviour','star',[it('My Ratings','behaviour_std')]),
        g('Certificates','badge',[it('My Certificates','mycert')]),
        g('Comms','message',[it('Messaging','messaging'),it('Live Class','liveclass_std')]),
        g('Self','settings',[it('Change Password','pwd'),it('Theme','theme')])
      ]
    };

    this.STUDENTS_SEED = [
      ['2026-0142','Aarav Sharma','Rohit Sharma','VI-A',0,'+91 98201 44521'],
      ['2026-0143','Diya Patel','Nikhil Patel','VI-A',2400,'+91 99301 22118'],
      ['2026-0144','Vivaan Reddy','Surya Reddy','VI-B',0,'+91 90041 88210'],
      ['2026-0145','Ananya Iyer','Ramesh Iyer','VII-A',5200,'+91 98860 71245'],
      ['2026-0146','Aditya Nair','Manoj Nair','VII-B',0,'+91 95001 33421'],
      ['2026-0147','Ishaan Gupta','Alok Gupta','VIII-A',1800,'+91 99100 55620'],
      ['2026-0148','Saanvi Joshi','Prakash Joshi','VIII-A',0,'+91 98330 17742'],
      ['2026-0149','Kabir Singh','Harpreet Singh','VIII-B',7600,'+91 90192 44380'],
      ['2026-0150','Myra Menon','Deepak Menon','IX-A',0,'+91 97411 56003'],
      ['2026-0151','Arjun Desai','Suresh Desai','IX-A',3200,'+91 99875 21190'],
      ['2026-0152','Aadhya Rao','Venkat Rao','IX-B',0,'+91 96320 78451'],
      ['2026-0153','Reyansh Kulkarni','Sachin Kulkarni','X-A',9800,'+91 98220 63017'],
      ['2026-0154','Anika Verma','Anil Verma','X-A',0,'+91 99014 30025'],
      ['2026-0155','Vihaan Bose','Subhash Bose','X-B',4500,'+91 90071 11298']
    ];
    this.CLASS_STD = [
      ['2026-0145','Ananya Iyer'],['2026-0146','Aditya Nair'],['2026-0147','Ishaan Gupta'],
      ['2026-0148','Saanvi Joshi'],['2026-0150','Myra Menon'],['2026-0151','Arjun Desai'],
      ['2026-0153','Reyansh Kulkarni'],['2026-0154','Anika Verma']
    ];
    this.SUBJ = [
      {c:'ENG',n:'English',col:'#4F46E5'},{c:'MAT',n:'Mathematics',col:'#0E9488'},
      {c:'SCI',n:'Science',col:'#2563EB'},{c:'SST',n:'Social Studies',col:'#D97706'},
      {c:'HIN',n:'Hindi',col:'#DB2777'},{c:'CMP',n:'Computer',col:'#059669'},
      {c:'P.E',n:'Phys. Ed.',col:'#DC2626'},{c:'LIB',n:'Library',col:'#7C3AED'}
    ];
    this.DAYS=['Mon','Tue','Wed','Thu','Fri','Sat'];
    this.PERIODS=[{t:'08:00'},{t:'08:50'},{t:'09:40'},{br:'Short Break'},{t:'10:45'},{t:'11:35'},{br:'Lunch'},{t:'13:00'},{t:'13:50'}];

    // ===== DATA DICTIONARY (powers the System Map) =====
    this.MODCOL={Setup:'#5B47E0',Academics:'#0E9488',Students:'#2563EB',HR:'#D97706',Timetable:'#7C3AED',Attendance:'#DB2777',Fees:'#059669',Exams:'#E2495B',Teaching:'#0891B2',Comms:'#64748B'};
    const E=(k,name,mod,groups)=>({k,name,mod,groups});
    this.ERD=[
      E('AcademicYear','Academic Year','Setup',[['Core','id, name ("2026\u201327"), startDate, endDate, isCurrent, status (active/closed)'],['Structure','termStructure [{term, startDate, endDate}]']]),
      E('Class','Class (Grade)','Academics',[['Core','id, name ("Grade 6"), numericLevel, stream (none/Science/Commerce/Humanities)'],['Links','academicYearId, classInchargeId \u2192 Teacher, sections[], subjects[]']]),
      E('Section','Section','Academics',[['Core','id, name ("A"), capacity, currentStrength, roomNo, shift (morning/general)'],['Links','classId, classTeacherId \u2192 Teacher']]),
      E('Subject','Subject','Academics',[['Core','id, name, code, type (core/elective/co-curricular), maxMarks, passMarks'],['Teaching','hasPractical, weeklyPeriods, classId, assignedTeacherIds[]']]),
      E('Student','Student','Students',[
        ['Identity','admissionNo, rollNo, firstName, middleName, lastName, gender, dateOfBirth, age*, photo, bloodGroup, nationality, religion, category (Gen/OBC/SC/ST/EWS), motherTongue, aadhaar (masked)'],
        ['Academic','academicYearId, classId, sectionId, admissionDate, admissionType (new/transfer), previousSchool, house, status (enquiry\u2192provisional\u2192enrolled\u2192withdrawn\u2192graduated), rte'],
        ['Contact','primaryPhone, email, currentAddress {line1,line2,city,state,pincode,country}, permanentAddress {\u2026}, sameAsCurrent'],
        ['Guardians','fatherId, motherId, guardianId \u2192 Parent, emergencyContact {name, relation, phone}'],
        ['Medical','bloodGroup, allergies, medicalConditions, medications, doctorName, doctorPhone, disability'],
        ['Transport','usesTransport, routeId \u2192 Route, stopId \u2192 Stop, pickupDropPoint'],
        ['Fees','feeCategoryId, concession/scholarship {type, %/amount, reason}, feeStructureId'],
        ['Documents','birthCert, transferCert, reportCards[], photos[] (verified flag)'],
        ['Meta','createdAt, updatedAt, createdBy']]),
      E('Parent','Parent / Guardian','Students',[['Core','id, relation (father/mother/guardian), name, photo, phone, altPhone, email'],['Profile','occupation, designation, employer, annualIncome, qualification, aadhaar (masked)'],['Links','officeAddress, residentialAddress, linkedStudentIds[], isPrimaryContact, loginEnabled']]),
      E('Employee','Employee / Teacher','HR',[
        ['Identity','empCode, firstName, lastName, gender, dob, bloodGroup, photo, nationality'],
        ['Job','designation, department, employeeType (teaching/non-teaching), joiningDate, status (active/on-leave/inactive/resigned), reportingTo'],
        ['Academic capacity','qualifications[], specializations[], subjectsCanTeach[], maxWeeklyLoad, classInchargeOf, isClassTeacherOf'],
        ['Contact','phone, email, currentAddress, permanentAddress, emergencyContact'],
        ['HR / Payroll','salaryStructure {basic, allowances[], deductions[]}, bankAccount (masked), pan (masked), pf/esi, leaveBalance {casual, sick, earned}'],
        ['Documents','idProof, qualificationCerts[], contract']]),
      E('TeacherAssignment','Teacher Assignment','Academics',[['Core','id, teacherId, sectionId, subjectId, academicYearId, isClassTeacher, weeklyPeriods']]),
      E('TimetableSlot','Timetable Slot','Timetable',[['Core','id, academicYearId, sectionId, dayOfWeek, periodNo, startTime, endTime'],['Links','subjectId, teacherId, roomNo, type (lecture/lab/break/assembly)']]),
      E('AttendanceRecord','Attendance Record','Attendance',[['Core','id, sectionId, date, period (optional), markedById, markedAt, locked, substituteUsed'],['Entries','entries[{studentId, status: present/absent/late/leave/half-day, remark}]']]),
      E('LeaveRequest','Leave Request','HR',[['Core','id, subjectType (employee/student), subjectId, type (casual/sick/earned)'],['Workflow','fromDate, toDate, days, reason, status (pending/approved/rejected), approverId, appliedAt']]),
      E('SubstituteAssignment','Substitute Assignment','Timetable',[['Core','id, date, slotId, originalTeacherId, substituteTeacherId, reason, status']]),
      E('FeeStructure','Fee Structure / Head','Fees',[['FeeHead','id, name (Tuition/Transport/Lab/Exam/Admission), recurrence (one-time/monthly/term/annual), refundable'],['FeeStructure','id, academicYearId, classId, feeCategoryId, components[{feeHeadId, amount, frequency, dueDay}], totalAnnual*'],['FeeCategory','id, name (Regular/RTE/Staff-ward/Sibling), defaultConcession']]),
      E('Invoice','Invoice','Fees',[['Core','id, invoiceNo, studentId, academicYearId, period ("Jul 2026"/"Term 1")'],['Amounts','lineItems[{feeHeadId, amount}], grossAmount, concession, netAmount, amountPaid, balance'],['Lifecycle','dueDate, status (draft/generated/partial/paid/overdue/cancelled), generatedAt']]),
      E('Payment','Payment','Fees',[['Core','id, receiptNo, invoiceId, studentId, amount, mode (cash/card/UPI/cheque/online)'],['Audit','txnRef, paidAt, collectedById, remarks']]),
      E('Exam','Exam','Exams',[['Core','id, name ("Term 1"), academicYearId, classIds[], examType (unit/term/final/practical), weightagePercent'],['Schedule','schedule[{subjectId, date, startTime, maxMarks, passMarks}], status (draft/scheduled/marks-entry/published)']]),
      E('Mark','Mark','Exams',[['Core','id, examId, studentId, subjectId, marksObtained, maxMarks, isAbsent, grade*, enteredById']]),
      E('ReportCard','Report Card','Exams',[['Core','id, studentId, examId, total, percentage, overallGrade, rank, result (pass/fail/withheld)'],['Detail','subjectResults[{subjectId, marks, max, grade}], attendancePercent, remarks, publishedAt']]),
      E('GradeScale','Grade Scale','Exams',[['Core','id, name, bands[{from, to, grade, gradePoint, descriptor}]']]),
      E('Homework','Homework / Assignment','Teaching',[['Core','id, sectionId, subjectId, teacherId, title, description, attachments[], assignedDate, dueDate, status'],['Submissions','submissions[{studentId, status: assigned/submitted/late/graded, fileRef, marks, feedback}]']]),
      E('Notice','Notice / Circular','Comms',[['Core','id, title, body, audience[roles/classes], attachments[], publishDate, expiry']]),
      E('Transport','Transport (Route/Stop)','Comms',[['Route','id, name, vehicleNo, driver, stops[]'],['Stop','id, name, time, fee']]),
      E('Library','Library (Book/Issue)','Comms',[['Book','id, title, author, isbn, copies'],['Issue','id, bookId, memberId, issueDate, dueDate, returnDate, fine']]),
      E('User','User / Auth','Setup',[['Core','id, role, linkedEntityId, username, passwordHash, lastLogin, permissions[]']])
    ];
    // relationships: [from, to, cardinality]
    this.REL=[['AcademicYear','Class','1\u2014*'],['Class','Section','1\u2014*'],['Class','Subject','1\u2014*'],['Class','FeeStructure','1\u2014*'],['Section','Student','1\u2014*'],['Student','Parent','*\u20141'],['Subject','TeacherAssignment','via'],['Employee','TeacherAssignment','1\u2014*'],['Section','TimetableSlot','1\u2014*'],['TeacherAssignment','TimetableSlot','feeds'],['Section','AttendanceRecord','1\u2014*'],['Student','AttendanceRecord','*'],['FeeStructure','Invoice','feeds'],['Student','Invoice','1\u2014*'],['Invoice','Payment','1\u2014*'],['Class','Exam','*\u2014*'],['Exam','Mark','1\u2014*'],['Student','Mark','1\u2014*'],['Mark','ReportCard','roll-up'],['Employee','LeaveRequest','1\u2014*'],['LeaveRequest','SubstituteAssignment','triggers'],['SubstituteAssignment','TimetableSlot','covers'],['Employee','Homework','1\u2014*'],['Homework','Student','submissions']];
    // dependency build-order: node -> {tier, deps[]}
    this.DEP=[
      {k:'AcademicYear',tier:0,deps:[]},
      {k:'Class',tier:1,deps:['AcademicYear']},
      {k:'Section',tier:2,deps:['Class']},
      {k:'Subject',tier:2,deps:['Class']},
      {k:'FeeStructure',tier:2,deps:['Class']},
      {k:'Employee',tier:2,deps:[]},
      {k:'TeacherAssignment',tier:3,deps:['Employee','Section','Subject']},
      {k:'Student',tier:3,deps:['Section','Parent']},
      {k:'TimetableSlot',tier:4,deps:['TeacherAssignment']},
      {k:'Invoice',tier:4,deps:['Student','FeeStructure']},
      {k:'AttendanceRecord',tier:5,deps:['TimetableSlot','Student']},
      {k:'Exam',tier:5,deps:['Student','Subject']},
      {k:'Mark',tier:6,deps:['Exam']},
      {k:'ReportCard',tier:7,deps:['Mark','Invoice']},
      {k:'Promotion',tier:8,deps:['ReportCard']}
    ];
    // the 7 lifecycle flows
    this.FLOWS=[
      {t:'Onboard the school',c:'Setup',steps:['Academic Year','Class','Section + Subject','Fee Structure'],note:'Fee structure needs only Class + Year \u2014 independent of teachers.'},
      {t:'Staff up & schedule',c:'HR',steps:['Create Employees','Teacher Assignment','Build Timetable'],note:'A subject with no assigned teacher shows \u201cassign teacher\u201d and blocks final save; clash detection on save.'},
      {t:'Enroll a student',c:'Students',steps:['Admission (capacity + parent)','Enquiry \u2192 Provisional','Enrolled','Generate Invoice'],note:'Capacity + duplicate checks; invoices only once enrolled and a fee structure exists.'},
      {t:'Operate the term',c:'Attendance',steps:['Mark Attendance','Homework','Exam','Enter Marks','Report Card'],note:'Attendance needs a timetable + present/substitute teacher; results withheld if dues outstanding.'},
      {t:'Collect money',c:'Fees',steps:['Generate Invoice','Collect Payment','Reconcile','Defaulters'],note:'No overpay; partial \u2192 balance; past due \u2192 overdue \u2192 defaulter; dashboards recompute live.'},
      {t:'Handle disruptions',c:'Timetable',steps:['Teacher Leave','Flag Slots','Assign Substitute','Attendance unlocks'],note:'Substitute picker offers free teachers only (clash-checked); attendance stays locked until covered.'},
      {t:'Close the year',c:'Exams',steps:['Publish Results','Clear / Override Dues','Promotion','Archive Year'],note:'Promotion needs published results + cleared dues (or admin override with reason).'}
    ];

    // ---- teachers (one subject owner each) ----
    this.TEACHERS=[
      {id:'T1',name:'Dimpu Sharma',subj:'MAT'},{id:'T2',name:'Rohit Verma',subj:'SCI'},
      {id:'T3',name:'Sangeeta Nag',subj:'ENG'},{id:'T4',name:'Anjali Rao',subj:'HIN'},
      {id:'T5',name:'Puja Das',subj:'SST'},{id:'T6',name:'Karan Mehta',subj:'CMP'},
      {id:'T7',name:'Vivek Nair',subj:'P.E'},{id:'T8',name:'Leela Iyer',subj:'LIB'}
    ];
    this.TODAY='2026-06-20';            // Saturday (DAYS index 5)
    this.FEE_DUE_DATE='2026-06-10';     // past -> outstanding becomes Overdue
    this.SECTION_CAP=40;
    // classes: which have a timetable configured (IX-B intentionally NOT set)
    this.TT_CLASSES=['VI-A','VI-B','VII-A','VIII-A','VIII-B','IX-A','IX-B','X-A'];
    this.TT_SET={'VIII-A':true,'VII-A':true,'VI-A':true};
    const subjT={}; this.TEACHERS.forEach(t=>subjT[t.subj]=t.id);
    const tt={};
    const seed=[['0_0','ENG'],['0_1','MAT'],['0_2','SCI'],['0_4','HIN'],['0_5','SST'],
      ['1_0','MAT'],['1_1','ENG'],['1_2','CMP'],['1_4','SCI'],['1_7','P.E'],
      ['2_0','SCI'],['2_1','SST'],['2_2','MAT'],['2_4','ENG'],['2_5','LIB'],
      ['3_0','HIN'],['3_1','MAT'],['3_2','ENG'],['3_5','SCI'],
      ['4_0','ENG'],['4_1','SCI'],['4_2','HIN'],['4_4','MAT'],['4_5','CMP'],
      ['5_0','P.E'],['5_1','LIB'],['5_2','MAT'],['5_4','ENG']];
    seed.forEach(s=>{tt[s[0]]={c:s[1],room:'R-204',tId:subjT[s[1]]};});

    this.SECSEED = {'VI-A':40,'VI-B':36,'VII-A':39,'VII-B':34,'VIII-A':38,'VIII-B':33,'IX-A':37,'IX-B':31,'X-A':40,'X-B':35};
    this.state = {
      students: this._buildRoster(),     // expanded realistic roster: base 14 + generated to match section strengths
      role: (p&&p.defaultRole) || 'admin',
      page: ({admin:'dash_admin',coord:'dash_coord',teach:'dash_teach',student:'dash_std'})[(p&&p.defaultRole)||'admin'],
      open:{}, q:'', collapsed:false, narrow:false, avatar:false,
      tab:{}, spage:1, stq:'', scls:'All',
      // ---- live relational store ----
      teachers:this.TEACHERS.map(t=>({...t,leave:false})),
      tt, subs:{},                       // subs: 'd_p' -> teacherId
      ttClass:'VIII-A',
      fees:{},                           // reg -> amount paid (base due from STUDENTS[i][4])
      salary:{},                         // empId_YYYY-MM -> { name, month, net, gross, ts }
      promoted:{},                       // reg -> true
      attDate:this.TODAY,
      attByDate:{},                      // 'YYYY-MM-DD' -> { reg:'P'|'A'|'L', _locked:bool }
      ttSet:{'VIII-A':true},             // which classes have a configured timetable
      mapSel:'Student', mapTab:0, stView:null,
      // ---- admissions pipeline + capacity + delete-guards ----
      secStrength:{...this.SECSEED},
      feeStructSet:{'VI':true,'VII':true,'VIII':true,'IX':true,'X':true},   // 'XI' deliberately absent
      adm:[
        {id:'ADM-1042',name:'Kavya Nair',dob:'2014-03-12',gender:'Female',phone:'+91 98200 11223',cls:'VI',source:'Walk-in',status:'enquiry',created:'18 Jun',hist:[['Enquiry created','18 Jun']]},
        {id:'ADM-1043',name:'Aryan Mehta',dob:'2013-07-21',gender:'Male',phone:'+91 99300 44556',cls:'VII',source:'Website',status:'enquiry',created:'19 Jun',hist:[['Enquiry created','19 Jun']]},
        {id:'ADM-1041',name:'Riya Kapoor',dob:'2012-11-05',gender:'Female',phone:'+91 90040 77889',cls:'VIII',section:'VIII-B',parent:'Vikram Kapoor',source:'Referral',status:'provisional',created:'15 Jun',hist:[['Enquiry created','12 Jun'],['Moved to Provisional','15 Jun']]},
        {id:'ADM-1040',name:'Dev Patel',dob:'2011-02-18',gender:'Male',phone:'+91 95000 33221',cls:'IX',section:'IX-A',parent:'Nilesh Patel',source:'Walk-in',status:'provisional',created:'14 Jun',hist:[['Enquiry created','11 Jun'],['Moved to Provisional','14 Jun']]},
        {id:'ADM-1038',name:'Sara Khan',dob:'2014-09-30',gender:'Female',phone:'+91 99010 22110',cls:'VI',section:'VI-B',parent:'Imran Khan',admNo:'2026-0156',roll:'37',source:'Website',status:'enrolled',created:'10 Jun',hist:[['Enquiry created','06 Jun'],['Moved to Provisional','08 Jun'],['Enrolled \u00b7 VI-B','10 Jun']]},
        {id:'ADM-1031',name:'Mohit Rao',dob:'2010-05-14',gender:'Male',phone:'+91 98800 11009',cls:'X',source:'Transfer',status:'withdrawn',reason:'Relocated to another city',created:'02 May',hist:[['Enrolled','01 Apr'],['Withdrawn \u00b7 Relocated','02 May']]}
      ],
      admWiz:null, guard:null, archive:[],
      drill:null, range:'month', dataTbl:{}, modChart:{},
      toasts:[], confirm:null, subPick:null, _tid:0
    };
    RWStore.boot(this);   // seed-on-first-load + overlay persisted slices onto state
  }

  /* Expanded, deterministic seed roster: the original 14 students (preserved for
     the documented self-test scenarios) + generated students filling each
     section to its seeded strength, so KPIs/tables/charts reconcile honestly. */
  _buildRoster(){
    const sec=this.SECSEED;
    const order=['VI-A','VI-B','VII-A','VII-B','VIII-A','VIII-B','IX-A','IX-B','X-A','X-B'];
    const FN=['Aarav','Vivaan','Aditya','Vihaan','Arjun','Reyansh','Krishna','Ishaan','Shaurya','Atharv','Advik','Rudra','Kabir','Ayaan','Dhruv','Aryan','Kiaan','Veer','Yuvan','Sai','Diya','Saanvi','Aadhya','Ananya','Pari','Anika','Navya','Myra','Sara','Aarohi','Anvi','Riya','Prisha','Ira','Kiara','Siya','Mira','Avni','Kyra','Tara'];
    const LN=['Sharma','Verma','Patel','Reddy','Iyer','Nair','Gupta','Joshi','Singh','Menon','Desai','Rao','Kulkarni','Bose','Khan','Mehta','Kapoor','Bhat','Pillai','Chopra','Saxena','Malhotra','Banerjee','Ghosh','Chauhan','Sinha','Agarwal','Shetty'];
    const FF=['Rohit','Nikhil','Surya','Ramesh','Manoj','Alok','Prakash','Harpreet','Deepak','Suresh','Venkat','Sachin','Subhash','Anil','Imran','Vikram','Nilesh','Sanjay','Rajesh','Amit','Vinod','Mahesh','Girish','Pankaj'];
    const DUE=[0,0,0,1200,0,2400,0,3600,0,0,4800,0,1800,0,6000,0];
    const out=this.STUDENTS_SEED.slice(); let g=0, reg=1001;
    for(let si=0; si<order.length; si++){
      const cls=order[si], target=sec[cls]||0;
      const have=this.STUDENTS_SEED.filter(s=>s[3]===cls).length;
      for(let k=have; k<target; k++){
        const fn=FN[(g*7+si*3+5)%FN.length], ln=LN[(g*5+si)%LN.length], ff=FF[(g*3+si)%FF.length];
        const due=DUE[(g+si)%DUE.length];
        const num=String(800000000+((g*7919+si*131+17)%199999999));
        out.push(['2026-'+reg, fn+' '+ln, ff+' '+ln, cls, due, '+91 9'+num.slice(0,4)+' '+num.slice(4,9)]);
        g++; reg++;
      }
    }
    return out;
  }

  componentDidMount(){
    const onR=()=>{ const n=window.innerWidth<860; this.setState({narrow:n, collapsed:n?true:false}); };
    window.addEventListener('resize',onR); onR();
    this._charts={}; this._waitApex();
    this._onHashBound=()=>this._applyHash();
    window.addEventListener('hashchange',this._onHashBound);
    if(RWRouter.parse().page) this._applyHash();
    else { try{ history.replaceState(null,'',this._desiredHash()); }catch(e){} }
  }
  componentDidUpdate(){ this.syncCharts(); RWStore.persist(this.state); if(this.state.page!=='__404'){ const w=this._desiredHash(); if(location.hash!==w) location.hash=w; } }
  componentWillUnmount(){ if(this._apexTimer) clearTimeout(this._apexTimer); if(this._onHashBound) window.removeEventListener('hashchange',this._onHashBound); }

  /* ---- hash router: #/role/page[/param] — refresh-safe, back/forward, 404 ---- */
  _navParam(){ const S=this.state; return (S.page==='stdprofile'&&S.stView)?S.stView:null; }
  _desiredHash(){ const S=this.state; return RWRouter.build(S.role,S.page,this._navParam()); }
  _applyHash(){
    const S=this.state, r=RWRouter.parse();
    if(!r.page) return;
    const page = this.M[r.page] ? r.page : '__404';
    if(page===S.page && (r.param||null)===(this._navParam()||null)) return;
    const patch={ page:page, confirm:null, subPick:null, guard:null, admWiz:null, avatar:false };
    if(S.narrow) patch.collapsed=true;
    if(page==='stdprofile' && r.param) patch.stView=r.param;
    this.setState(patch);
  }
  _waitApex(){ if(window.ApexCharts&&window.RWCharts){ this.syncCharts(); } else { this._apexTimer=setTimeout(()=>this._waitApex(),120); } }
  /* Imperatively (re)mount ApexCharts into placeholder divs registered by renderVals
     in this._pendingCharts. Reuses an instance via updateOptions; destroys charts
     whose placeholder left the DOM (page change). */
  syncCharts(){
    if(!window.ApexCharts||!window.RWCharts) return;
    const defs=this._pendingCharts||[]; this._charts=this._charts||{}; const seen={};
    defs.forEach(d=>{ seen[d.id]=1; const el=document.getElementById(d.id); if(!el) return;
      const inst=this._charts[d.id];
      if(inst){ try{ inst.updateOptions(Object.assign({series:d.series},d.opts||{}),false,true); }catch(e){} }
      else { el.innerHTML=''; this._charts[d.id]=window.RWCharts.makeChart(el,d.type,d.series,d.opts); }
    });
    Object.keys(this._charts).forEach(id=>{ if(!seen[id]){ try{this._charts[id].destroy();}catch(e){} delete this._charts[id]; } });
    if(this._sanT) clearTimeout(this._sanT); this._sanT=setTimeout(()=>this._sanitizeCharts(),60);
    this._sanT2=setTimeout(()=>this._sanitizeCharts(),650);
  }
  /* ApexCharts writes a non-standard `data:collapsed` attribute on legend nodes,
     which breaks XML/SVG serialization (screenshots, standalone bundling). Strip
     any colon-prefixed `data:` attributes — purely cosmetic, no functional impact. */
  _sanitizeCharts(){
    try{ Object.keys(this._charts||{}).forEach(id=>{ const el=document.getElementById(id); if(!el) return;
      el.querySelectorAll('*').forEach(n=>{ for(const at of Array.from(n.attributes)){ if(at.name.indexOf('data:')===0) n.removeAttribute(at.name); } }); }); }catch(e){}
  }

  renderVals(){
    const h=React.createElement, S=this.state, I=this.I;
    const roleAccents = this.props.roleAccents!==false;
    const accent = roleAccents ? this.ROLE[S.role] : this.IND[500];
    const tint = accent+'14';
    const compact = this.props.density==='compact';
    const C={ink:'#1C2230',ink2:'#10141F',mut:'#737A88',mut2:'#9AA0AC',line:'#E7E9EF',line2:'#EEF0F3',card:'#fff',bg:'#F4F6F8',
      ok:'#16A34A',okBg:'#EAF7EE',warn:'#D97706',warnBg:'#FDF3E5',dng:'#DC2626',dngBg:'#FCEDED',info:'#2563EB',infoBg:'#EAF1FE'};
    const PAD = compact?'12px 14px':'16px 18px';
    const ic=(name,size,col,sw)=>h('svg',{width:size||18,height:size||18,viewBox:'0 0 24 24',fill:'none',stroke:col||'currentColor','strokeWidth':sw||1.7,'strokeLinecap':'round','strokeLinejoin':'round',style:{flex:'none',display:'block'}},(I[name]||I.dot).map((s,i)=>h(s[0],{key:i,...s[1]})));
    const rupee=n=>'\u20b9'+Number(n).toLocaleString('en-IN');
    // ---- chart registry (imperative ApexCharts mount via syncCharts) ----
    this._pendingCharts=[];
    const chartBox=(id,type,series,opts,height)=>{ this._pendingCharts.push({id,type,series,opts:opts||{}}); return h('div',{id,style:{height:(height||280)+'px',width:'100%',minHeight:(height||280)+'px'}}); };
    // inline SVG sparkline for KPI tiles (no chart instance — light + anti-clutter)
    const spark=(pts,col,w,hh)=>{ w=w||120; hh=hh||34; const mn=Math.min(...pts),mx=Math.max(...pts),rg=(mx-mn)||1; const X=i=>i*(w/(pts.length-1)); const Y=v=>hh-2-((v-mn)/rg)*(hh-6); const d=pts.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join(' '); const area=d+' L'+w+' '+hh+' L0 '+hh+' Z'; const gid='sp'+Math.random().toString(36).slice(2,7); return h('svg',{width:w,height:hh,viewBox:'0 0 '+w+' '+hh,style:{display:'block'},preserveAspectRatio:'none'}, h('defs',null,h('linearGradient',{id:gid,x1:0,y1:0,x2:0,y2:1},h('stop',{offset:'0%',stopColor:col,stopOpacity:.35}),h('stop',{offset:'100%',stopColor:col,stopOpacity:0}))), h('path',{d:area,fill:'url(#'+gid+')'}), h('path',{d,fill:'none',stroke:col,strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'})); };


    // ------- handlers -------
    const setRole=r=>{ const dp={admin:'dash_admin',coord:'dash_coord',teach:'dash_teach',student:'dash_std'}[r]; if(this.props.onSwitchRole) this.props.onSwitchRole(r); this.setState({role:r,page:dp,open:{},q:'',avatar:false,confirm:null,subPick:null,collectReg:null,guard:null,admWiz:null}); };
    const setPage=k=>{ this.setState(st=>{const o={...st.open}; this._gOf(r0=>0); return {page:k, collapsed:st.narrow?true:st.collapsed};}); };
    const setPage2=k=>this.setState({page:k,confirm:null,subPick:null,collectReg:null,avatar:false,guard:null,admWiz:null,notifOpen:false});
    const toggleGroup=lab=>this.setState(st=>({open:{...st.open,[lab]:!st.open[lab]}}));
    const onMenuSearch=e=>this.setState({q:e.target.value});
    const toggleSidebar=()=>this.setState(st=>({collapsed:!st.collapsed}));
    const toggleAvatar=()=>this.setState(st=>({avatar:!st.avatar,notifOpen:false}));
    const setTab=(pk,i)=>this.setState(st=>({tab:{...st.tab,[pk]:i}}));
    const tabOf=pk=>S.tab[pk]||0;
    const setSPage=n=>this.setState({spage:n});

    // ===================== STORE ACTIONS + INFRA =====================
    const TODAY=this.TODAY, DUEDATE=this.FEE_DUE_DATE;
    const teachers=S.teachers;
    const tname=id=>(teachers.find(t=>t.id===id)||{}).name||'Unassigned';
    const onLeave=id=>!!(teachers.find(t=>t.id===id)||{}).leave;
    const needsSub=()=>Object.keys(S.tt).filter(k=>{const c=S.tt[k];return c&&onLeave(c.tId)&&!S.subs[k];});
    const freeInPeriod=(period)=>{ const busy=new Set(); Object.keys(S.tt).forEach(k=>{ const pp=+k.split('_')[1]; if(pp===period){ busy.add(S.subs[k]||S.tt[k].tId); } }); return teachers.filter(t=>!t.leave&&!busy.has(t.id)); };

    const toast=(msg,tone)=>this.setState(st=>{ const id=(st._tid||0)+1; setTimeout(()=>this.setState(s2=>({toasts:s2.toasts.filter(x=>x.id!==id)})),3400); return {toasts:[...st.toasts,{id,msg,tone:tone||'ok'}],_tid:id}; });
    const ask=cfg=>this.setState({confirm:cfg});
    const closeAsk=()=>this.setState({confirm:null});

    const setLeave=(id,val)=>this.setState(st=>({teachers:st.teachers.map(t=>t.id===id?{...t,leave:val}:t)}),()=>toast((val?'Marked on leave: ':'Leave cleared: ')+tname(id),val?'warn':'ok'));
    const openSubPick=key=>this.setState({subPick:key});
    const closeSubPick=()=>this.setState({subPick:null});
    const assignSub=(key,id)=>this.setState(st=>({subs:{...st.subs,[key]:id},subPick:null}),()=>toast('Substitute assigned: '+tname(id),'ok'));

    const baseDue=reg=>{ const s=S.students.find(x=>x[0]===reg); return s?s[4]:0; };
    const dueOf=reg=>Math.max(0,baseDue(reg)-(S.fees[reg]||0));
    const feeStatus=reg=>{ const d=dueOf(reg); if(d<=0) return ['Paid','ok']; return [TODAY>DUEDATE?'Overdue':'Due',TODAY>DUEDATE?'dng':'warn']; };
    const collectFee=(reg,amt)=>{ amt=Math.round(+amt||0); const d=dueOf(reg); if(amt<=0){toast('Enter a valid amount','dng');return false;} if(amt>d){toast('Overpayment blocked \u2014 balance is '+rupee(d),'dng');return false;} this.setState(st=>({fees:{...st.fees,[reg]:(st.fees[reg]||0)+amt}}),()=>toast((d-amt<=0)?'Payment received \u2014 invoice marked Paid':'Partial payment recorded \u00b7 balance '+rupee(d-amt),'ok')); return true; };

    const isFuture=d=>d>TODAY;
    const dayRec=()=>S.attByDate[S.attDate]||{};
    const setAtt=(reg,v)=>{ if(isFuture(S.attDate)){toast('Cannot mark attendance for a future date','dng');return;} if(dayRec()._locked){toast('Attendance is locked for this date','dng');return;} this.setState(st=>{ const day={...(st.attByDate[st.attDate]||{})}; day[reg]=v; return {attByDate:{...st.attByDate,[st.attDate]:day}}; }); };
    const setAttDate=d=>this.setState({attDate:d});
    const lockAtt=uncovered=>{ if(isFuture(S.attDate)){toast('Cannot mark attendance for a future date','dng');return;} if(uncovered>0){toast(uncovered+' period(s) need a substitute before locking','dng');return;} const rec=dayRec(); const unmarked=this.CLASS_STD.filter(s=>!rec[s[0]]); if(unmarked.length){ ask({title:'Not all students marked',msg:unmarked.length+' student(s) are still unmarked. Mark the remaining Present and lock the register?',cta:'Mark rest present & lock',onYes:()=>this.setState(st=>{ const day={...(st.attByDate[st.attDate]||{})}; this.CLASS_STD.forEach(s=>{ if(!day[s[0]]) day[s[0]]='P'; }); day._locked=true; return {attByDate:{...st.attByDate,[st.attDate]:day},confirm:null}; },()=>toast('Attendance locked','ok'))}); return; } this.setState(st=>{ const day={...(st.attByDate[st.attDate]||{}),_locked:true}; return {attByDate:{...st.attByDate,[st.attDate]:day}}; },()=>toast('Attendance locked','ok')); };
    const ATT_BASE={'2026-0145':82,'2026-0146':91,'2026-0147':68,'2026-0148':74,'2026-0150':96,'2026-0151':71,'2026-0153':88,'2026-0154':79};
    const attPct=reg=>ATT_BASE[reg]!=null?ATT_BASE[reg]:90;

    const promote=regs=>{ const blocked=regs.filter(r=>dueOf(r)>0); const run=()=>this.setState(st=>{ const pr={...st.promoted}; regs.forEach(r=>pr[r]=true); return {promoted:pr,confirm:null}; },()=>toast('Promoted '+regs.length+' student(s)'+(blocked.length?' \u00b7 override logged':''),blocked.length?'warn':'ok')); if(blocked.length){ ask({title:'Outstanding dues block promotion',msg:blocked.length+' of the selected student(s) have unpaid fees. Promotion is blocked unless an admin overrides with a reason.',cta:'Override & promote',danger:true,reason:true,onYes:run}); return; } run(); };

    // ---- overlay + banner renderers (called from return) ----
    const toastsEl=()=> S.toasts.length? h('div',{style:{position:'fixed',right:18,bottom:18,display:'flex',flexDirection:'column',gap:10,zIndex:300}}, S.toasts.map(t=>{ const m=({ok:[C.ok,'check'],warn:[C.warn,'bell'],dng:[C.dng,'x'],info:[C.info,'bell']})[t.tone]||[C.ok,'check']; return h('div',{key:t.id,style:{display:'flex',alignItems:'center',gap:10,background:'#fff',border:'1px solid '+C.line,borderLeft:'3px solid '+m[0],borderRadius:11,padding:'11px 14px',minWidth:250,maxWidth:380,boxShadow:'0 10px 28px rgba(20,30,55,.16)'}}, h('span',{style:{color:m[0],display:'flex'}},ic(m[1],17)), h('span',{style:{fontSize:13,color:C.ink,fontWeight:500}},t.msg)); })) : null;
    const confirmEl=()=>{ const c=S.confirm; if(!c) return null; return h('div',{style:{position:'fixed',inset:0,background:'rgba(16,20,31,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:310,padding:20},onClick:closeAsk}, h('div',{onClick:e=>e.stopPropagation(),style:{background:'#fff',borderRadius:16,maxWidth:440,width:'100%',boxShadow:'0 24px 60px rgba(16,20,31,.3)',overflow:'hidden'}}, h('div',{style:{padding:'20px 22px'}}, h('div',{style:{display:'flex',gap:13}}, h('span',{style:{width:40,height:40,borderRadius:11,flex:'none',background:c.danger?C.dngBg:C.warnBg,color:c.danger?C.dng:C.warn,display:'flex',alignItems:'center',justifyContent:'center'}},ic('bell',20)), h('div',null, h('div',{style:{fontWeight:700,fontSize:16,color:C.ink2}},c.title), h('div',{style:{fontSize:13.5,color:C.mut,marginTop:5,lineHeight:1.55}},c.msg))), c.reason&&h('input',{id:'__reason',placeholder:'Reason for override (required)',style:{width:'100%',height:40,marginTop:14,padding:'0 12px',border:'1px solid '+C.line,borderRadius:9,fontSize:13.5,outline:'none'}})), h('div',{style:{display:'flex',justifyContent:'flex-end',gap:10,padding:'14px 22px',background:'#F8F9FB',borderTop:'1px solid '+C.line2}}, Btn('Cancel',{variant:'outline',sm:true,onClick:closeAsk}), Btn(c.cta||'Confirm',{variant:c.danger?'danger':'primary',sm:true,onClick:()=>{ let reason=''; if(c.reason){ const el=document.getElementById('__reason'); reason=el?el.value.trim():''; if(!reason){toast('A reason is required to override','dng');return;} } c.onYes&&c.onYes(reason); }})))); };
    const subPickEl=()=>{ const key=S.subPick; if(!key) return null; const d=+key.split('_')[0], p=+key.split('_')[1]; const cell=S.tt[key]; const cands=freeInPeriod(p); return h('div',{style:{position:'fixed',inset:0,background:'rgba(16,20,31,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:310,padding:20},onClick:closeSubPick}, h('div',{onClick:e=>e.stopPropagation(),style:{background:'#fff',borderRadius:16,maxWidth:460,width:'100%',boxShadow:'0 24px 60px rgba(16,20,31,.3)',overflow:'hidden'}}, h('div',{style:{padding:'18px 22px',borderBottom:'1px solid '+C.line2}}, h('div',{style:{fontWeight:700,fontSize:16,color:C.ink2}},'Assign a substitute'), h('div',{style:{fontSize:13,color:C.mut,marginTop:4}}, this.DAYS[d]+' \u00b7 Period '+(p+1)+' \u00b7 '+(cell?cell.c:'')+' \u00b7 '+(cell?cell.room:'')+' \u00b7 normally '+tname(cell&&cell.tId))), h('div',{style:{padding:'10px 12px',maxHeight:320,overflowY:'auto'}}, cands.length? cands.map(t=>h('button',{key:t.id,onClick:()=>assignSub(key,t.id),style:{display:'flex',alignItems:'center',gap:11,width:'100%',padding:'10px 12px',border:0,background:'transparent',borderRadius:10,cursor:'pointer',textAlign:'left'}}, h('span',{style:{width:34,height:34,borderRadius:'50%',background:tint,color:accent,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:12.5,flex:'none'}},t.name.split(' ').map(w=>w[0]).join('')), h('div',{style:{flex:1}}, h('div',{style:{fontSize:13.5,fontWeight:600,color:C.ink2}},t.name), h('div',{style:{fontSize:11.5,color:C.mut}},'Free this period \u00b7 teaches '+t.subj)), ic('chevR',16,C.mut2))) : h('div',{style:{padding:'34px 18px',textAlign:'center',color:C.mut,fontSize:13,lineHeight:1.6}}, 'No free teacher in this slot \u2014 every other teacher is already engaged in this period (clash). Free up a teacher or adjust the timetable.'))) ); };
    const subBanner=()=>{ if(S.role!=='admin'&&S.role!=='coord') return null; const ns=needsSub(); if(!ns.length) return null; return h('div',{style:{display:'flex',alignItems:'center',gap:13,background:C.warnBg,border:'1px solid '+C.warn+'44',borderRadius:12,padding:'12px 16px',marginBottom:16}}, h('span',{style:{width:34,height:34,borderRadius:9,background:'#fff',color:C.warn,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}},ic('bell',18)), h('div',{style:{flex:1}}, h('div',{style:{fontWeight:700,fontSize:13.5,color:C.ink2}},ns.length+' period(s) need a substitute'), h('div',{style:{fontSize:12.5,color:C.mut}},'A teacher on leave has uncovered classes \u2014 assign substitutes to keep attendance unblocked.')), Btn('Resolve in Timetable',{sm:true,onClick:()=>setPage2('tt_edit')})); };

    // ===== shared UI builders =====
    const Card=(opts,...kids)=>{ opts=opts||{}; return h('div',{style:{background:C.card,border:'1px solid '+C.line,borderRadius:14,boxShadow:'0 1px 2px rgba(20,30,55,.04)',...(opts.style||{})}},
      opts.title!=null&&h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,padding:'14px 18px',borderBottom:'1px solid '+C.line2}},
        h('div',{style:{display:'flex',alignItems:'center',gap:9}}, opts.icon&&h('span',{style:{color:accent,display:'flex'}},ic(opts.icon,18)), h('div',{style:{fontWeight:700,fontSize:14.5,color:C.ink2}},opts.title), opts.sub&&h('span',{style:{fontSize:12,color:C.mut,fontWeight:500}},opts.sub)),
        opts.right||null),
      h('div',{style:{padding:opts.flush?0:PAD}},...kids)); };

    const Btn=(label,o)=>{ o=o||{}; const v=o.variant||'primary';
      const base={display:'inline-flex',alignItems:'center',gap:7,fontSize:13,fontWeight:600,padding:o.sm?'7px 12px':'9px 16px',borderRadius:9,cursor:'pointer',border:'1px solid transparent',transition:'all .15s',whiteSpace:'nowrap',lineHeight:1};
      const sty=v==='primary'?{...base,background:accent,color:'#fff',boxShadow:'0 1px 2px '+accent+'55'}
        :v==='outline'?{...base,background:'#fff',color:C.ink,border:'1px solid '+C.line}
        :v==='ghost'?{...base,background:'transparent',color:C.mut}
        :v==='danger'?{...base,background:C.dngBg,color:C.dng}
        :{...base,background:tint,color:accent};
      return h('button',{onClick:o.onClick,style:sty}, o.icon&&ic(o.icon,15), label); };

    const Pill=(txt,tone)=>{ const m={ok:[C.ok,C.okBg],warn:[C.warn,C.warnBg],dng:[C.dng,C.dngBg],info:[C.info,C.infoBg],acc:[accent,tint],neu:[C.mut,'#F1F3F6']}[tone||'neu'];
      return h('span',{style:{display:'inline-flex',alignItems:'center',gap:5,fontSize:11.5,fontWeight:700,color:m[0],background:m[1],padding:'3px 9px',borderRadius:20,letterSpacing:.1}},txt); };

    const fieldMeta=lab=>{ const L=lab.toLowerCase(); const req=lab.includes('*'); const clean=lab.replace(/\*/g,'').replace(/\s*\u25be/g,'').trim();
      let type='text', full=false;
      if(/logo|picture|photo/.test(L)) {type='file';}
      else if(/rich-text|address|instruction|rule|message|note|description|target line|observ/.test(L)) {type='area'; full=true;}
      else if(/password/.test(L)) type='pwd';
      else if(/date/.test(L)) type='date';
      else if(/select|\u25be|dropdown| class|country|type|currency|time zone| role|month|bank account|template|recipient|particular|exam|subject|reason|placement|sidebar|color|language|status|head type/.test(L)) type='select';
      return {req,clean,type,full}; };
    const placeholderFor=clean=>{ const m={'Name of Institute':'Greenfield International School','Target Line':'Where curiosity meets character','Phone':'+91 \u2026','Website':'www.school.edu','Admission Fee':'e.g. 25,000','Description':'e.g. Electricity Bill','Amount':'e.g. 12,500','Head Name':'e.g. Utility Expenses','Meeting Title':'e.g. PTM \u2013 Class VIII','Reason':'e.g. Bonafide for passport'}; return m[clean]||('Enter '+clean.toLowerCase()); };

    const imgKey=(fid,lab)=> fid || ('img_'+String(lab||'').replace(/[^a-z0-9]+/gi,'_').toLowerCase());
    const setImg=(ikey,file,okMsg)=>{ if(!file) return; RWStore.downscaleImage(file,256,durl=>{ if(!durl){ toast('Could not read image','dng'); return; } this.setState(st=>({img:{...(st.img||{}),[ikey]:durl}}),()=>toast(okMsg||'Image uploaded · reload-safe','ok')); }); };
    const fileInput=(ikey,okMsg)=>h('input',{type:'file',accept:'image/*',onChange:e=>setImg(ikey,e.target.files&&e.target.files[0],okMsg),style:{display:'none'}});
    const PhotoSlot=(ikey,size,fallback)=>{ const cur=(S.img||{})[ikey]; return h('label',{title:'Click to upload photo',style:{cursor:'pointer',width:size,height:size,flex:'none',display:'inline-flex',borderRadius:'50%'}}, fileInput(ikey,'Photo updated · reload-safe'), cur? h('img',{src:cur,alt:'photo',style:{width:size,height:size,borderRadius:'50%',objectFit:'cover',display:'block',border:'1px solid '+C.line2}}) : fallback ); };
    const ctrl=(lab,fid,defVal)=>{ const fm=fieldMeta(lab); const idp=fid?{id:fid}:{}; const bs={width:'100%',fontSize:13.5,color:C.ink,border:'1px solid '+C.line,borderRadius:9,background:'#fff',outline:'none'};
      if(fm.type==='file'){ const ikey=imgKey(fid,lab); const cur=(S.img||{})[ikey];
        if(cur) return h('label',{style:{display:'flex',alignItems:'center',gap:11,border:'1px solid '+C.line,borderRadius:10,padding:'9px 12px',cursor:'pointer',background:'#fff'}}, fileInput(ikey), h('img',{src:cur,alt:'preview',style:{width:46,height:46,borderRadius:8,objectFit:'cover',flex:'none',border:'1px solid '+C.line2}}), h('div',{style:{flex:1,minWidth:0}}, h('div',{style:{color:C.ink,fontWeight:600,fontSize:13}},'Image uploaded'), h('div',{style:{fontSize:11.5,color:C.mut}},'Click to replace')), ic('pencil',15,C.mut2));
        return h('label',{style:{display:'flex',alignItems:'center',gap:11,border:'1.5px dashed '+C.line,borderRadius:10,padding:'12px 14px',cursor:'pointer',color:C.mut,fontSize:13}}, fileInput(ikey), h('span',{style:{width:34,height:34,borderRadius:8,background:tint,color:accent,display:'flex',alignItems:'center',justifyContent:'center'}},ic('download',17)), h('div',null,h('div',{style:{color:C.ink,fontWeight:600,fontSize:13}},'Upload file'),h('div',{style:{fontSize:11.5}},'PNG / JPG \u00b7 max 2MB'))); }
      if(fm.type==='area') return h('textarea',{...idp,defaultValue:defVal||'',placeholder:placeholderFor(fm.clean),rows:fm.clean.toLowerCase().includes('rich')?5:3,style:{...bs,padding:'10px 12px',resize:'vertical',fontFamily:'inherit'}});
      if(fm.type==='select') return h('div',{style:{position:'relative'}}, h('select',{...idp,defaultValue:defVal||'',style:{...bs,padding:'0 34px 0 12px',height:40,appearance:'none',cursor:'pointer',color:C.ink}}, h('option',null,'Select '+fm.clean.toLowerCase()+'\u2026')), h('span',{style:{position:'absolute',right:11,top:11,color:C.mut2,pointerEvents:'none'}},ic('chevD',16)));
      return h('input',{...idp,defaultValue:defVal||'',type:fm.type==='pwd'?'password':(fm.type==='date'?'date':'text'),placeholder:fm.type==='date'?'':placeholderFor(fm.clean),style:{...bs,height:40,padding:'0 12px'}}); };

    const formId=(title,lab)=>'f_'+String(title+'_'+lab).replace(/[^a-z0-9]+/gi,'_').toLowerCase();
    const FormCard=(title,fields,primary,o)=>{ o=o||{}; const rows=fields.filter(f=>f!=='');
      const saved=(S.forms&&S.forms[title])||{};
      const submit=()=>{ const vals={}, missing=[];
        rows.forEach(lab=>{ const fm=fieldMeta(lab); if(fm.type==='file') return; const el=document.getElementById(formId(title,lab)); const val=el?(el.value||''):''; vals[lab]=val; if(fm.req&&fm.type!=='select'&&!String(val).trim()) missing.push(fm.clean); });
        if(missing.length){ toast('Please complete: '+missing.slice(0,3).join(', ')+(missing.length>3?'…':''),'dng'); return; }
        if(o.onSubmit){ o.onSubmit(vals); return; }
        this.setState(st=>({forms:{...(st.forms||{}),[title]:vals}}),()=>toast((primary||'Saved')+' · saved · reload-safe','ok')); };
      const reset=()=>{ rows.forEach(lab=>{ const el=document.getElementById(formId(title,lab)); if(el&&'value' in el) el.value=''; }); this.setState(st=>{ const f={...(st.forms||{})}; delete f[title]; return {forms:f}; },()=>toast('Form reset','info')); };
      const sec=()=>{ if(o.onSecondary) return o.onSecondary(); if(/print|download/i.test(o.secondary||'')){ try{window.print();}catch(e){} return; } reset(); };
      return Card({title,icon:o.icon},
        h('div',{style:{display:'grid',gridTemplateColumns:S.narrow?'1fr':'1fr 1fr',gap:'15px 18px'}},
          rows.map((lab,i)=>{ const fm=fieldMeta(lab);
            return h('div',{key:i,style:{gridColumn:fm.full?'1 / -1':'auto'}},
              h('label',{htmlFor:formId(title,lab),style:{display:'block',fontSize:12.5,fontWeight:600,color:C.ink,marginBottom:6}}, fm.clean, fm.req&&h('span',{style:{color:C.dng,marginLeft:3}},'*')),
              ctrl(lab,formId(title,lab),saved[lab])); })),
        h('div',{style:{display:'flex',gap:10,marginTop:18}}, Btn(primary||'Submit',{onClick:submit}), Btn(o.secondary||'Reset',{variant:'outline',onClick:sec}))); };

    const numCol=lab=>/amount|fee|marks|obt|total|salary|income|expense|balance|%|net|discount|remaining/i.test(lab);
    const Table=(cols,rows,o)=>{ o=o||{}; const tools=o.tools||['Reload','Search'];
      const exGet=node=>{ if(node==null||typeof node==='boolean')return ''; if(typeof node==='string'||typeof node==='number')return String(node); if(Array.isArray(node))return node.map(exGet).join(' '); if(node.props&&node.props.children!=null)return exGet(node.props.children); return ''; };
      const toCSV=()=>{ const esc=s=>'"'+String(s).replace(/"/g,'""')+'"'; return [cols.map(esc).join(',')].concat((rows||[]).map(r=>r.map(c=>esc(exGet(c).replace(/\s+/g,' ').trim())).join(','))).join('\r\n'); };
      const dl=(name,text)=>{ try{ const b=new Blob([text],{type:'text/csv;charset=utf-8'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download=name; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(()=>URL.revokeObjectURL(u),1500);}catch(e){toast('Export failed','dng');} };
      const onExport=e=>{ if(e==='Copy'){ try{ navigator.clipboard&&navigator.clipboard.writeText(toCSV()); toast('Copied '+((rows&&rows.length)||0)+' rows','ok'); }catch(x){ toast('Copy unavailable','dng'); } return; } if(e==='Print'||e==='PDF'){ try{ window.print(); }catch(x){} return; } dl('eschool365-export.csv',toCSV()); toast(e+' downloaded','ok'); };
      const onAddTool=lbl=>{ const m={'Add Student':'admission','Add Employee':'addemp','Add Income':'income','Add Expense':'expense','Add Exam':'addexam'}; if(m[lbl]) setPage2(m[lbl]); else toast(lbl+' — use the form on this page','info'); };
      const tkey=o.id||(S.page+'::'+cols.join('::'));
      const fst=(S.tblFilter||{})[tkey]||{};
      const setF=patch=>this.setState(st=>{ const all={...(st.tblFilter||{})}; const cur={...(all[tkey]||{})}; for(const k in patch){ if(patch[k]===undefined) delete cur[k]; else cur[k]=patch[k]; } all[tkey]=cur; return {tblFilter:all}; });
      const filterCol=lbl=>{ const m=String(lbl).replace(/^Filter\s*(by)?\s*/i,'').trim().toLowerCase(); if(m){ for(let ix=0;ix<cols.length;ix++){ const cn=String(cols[ix]||'').toLowerCase(); if(cn&&(cn.indexOf(m)>=0||m.indexOf(cn)>=0)) return ix; } } return -1; };
      const distinctVals=ci=>{ const seen={},out=[]; (rows||[]).forEach(r=>{ if(!r)return; const cells=ci>=0?[r[ci]]:r.slice(0,Math.max(1,r.length-1)); cells.forEach(c=>{ const t=exGet(c).replace(/\s+/g,' ').trim(); if(t&&!seen[t]){ seen[t]=1; out.push(t); } }); }); return out.sort((a,b)=>a.localeCompare(b)).slice(0,24); };
      let drows=rows||[];
      if(fst.val!=null){ const fv=String(fst.val).toLowerCase(); const fc=(typeof fst.col==='number')?fst.col:-1; drows=drows.filter(r=> fc>=0? exGet(r[fc]).toLowerCase().indexOf(fv)>=0 : (r||[]).some(c=>exGet(c).toLowerCase().indexOf(fv)>=0) ); }
      const toolbar=h('div',{style:{display:'flex',gap:9,flexWrap:'wrap',alignItems:'center',marginBottom:13}},
        tools.map((t,i)=>{ if(t[0]==='+') return h('span',{key:i},Btn(t.slice(1).trim(),{icon:'plus',sm:true,onClick:()=>onAddTool(t.slice(1).trim())}));
          if(t==='Reload') return h('button',{key:i,title:'Reload',onClick:()=>toast('List refreshed','info'),style:{width:36,height:36,borderRadius:9,border:'1px solid '+C.line,background:'#fff',color:C.mut,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},ic('refresh',16));
          if(t==='Search') return h('div',{key:i,style:{display:'flex',alignItems:'center',gap:8,border:'1px solid '+C.line,borderRadius:9,padding:'0 12px',height:36,background:'#fff',minWidth:200}},h('span',{style:{color:C.mut2,display:'flex'}},ic('search',15)),h('input',{value:o.searchVal,onChange:o.onSearch,placeholder:o.searchPh||'Search\u2026',style:{border:0,outline:0,fontSize:13,width:'100%',background:'transparent'}}));
          if(/^Filter/i.test(t)){ const fci=filterCol(t); const vals=distinctVals(fci); const fopen=fst.open===t; const active=fst.val!=null;
            return h('span',{key:i,style:{position:'relative',display:'inline-flex',alignItems:'center',gap:8}},
              h('button',{onClick:()=>setF({open:fopen?undefined:t}),style:{display:'inline-flex',alignItems:'center',gap:7,height:36,padding:'0 13px',borderRadius:9,border:'1px solid '+(active?accent:C.line),background:active?accent+'10':'#fff',color:active?accent:C.ink,fontSize:13,fontWeight:600,cursor:'pointer'}},ic('filter',14,active?accent:C.mut2),t,ic('chevD',14,C.mut2)),
              active&&h('span',{style:{display:'inline-flex',alignItems:'center',gap:5,height:30,padding:'0 5px 0 11px',borderRadius:20,background:accent+'14',color:accent,fontSize:12.5,fontWeight:600,border:'1px solid '+accent+'33'}},String(fst.val),h('button',{onClick:()=>setF({val:undefined,col:undefined}),title:'Clear filter',style:{border:0,background:'transparent',color:accent,cursor:'pointer',fontSize:16,lineHeight:1,padding:'0 3px',display:'flex'}},'×')),
              fopen&&h('div',{style:{position:'absolute',top:42,left:0,minWidth:172,maxHeight:264,overflowY:'auto',background:'#fff',border:'1px solid '+C.line,borderRadius:10,boxShadow:'0 8px 24px rgba(20,30,55,.12)',zIndex:40,padding:6}}, vals.length? vals.map((v,vi)=>h('button',{key:vi,onClick:()=>setF({val:v,col:fci,open:undefined}),style:{display:'block',width:'100%',textAlign:'left',padding:'8px 10px',border:0,background:fst.val===v?accent+'14':'transparent',color:C.ink,fontSize:13,borderRadius:7,cursor:'pointer',whiteSpace:'nowrap'}},v)) : h('div',{style:{padding:'10px 12px',fontSize:12.5,color:C.mut}},'No values to filter') )); }
          return h('button',{key:i,onClick:o.onTool?()=>o.onTool(t):()=>toast(t,'info'),style:{display:'inline-flex',alignItems:'center',gap:7,height:36,padding:'0 13px',borderRadius:9,border:'1px solid '+C.line,background:'#fff',color:C.ink,fontSize:13,fontWeight:600,cursor:'pointer'}},t,ic('chevD',14,C.mut2)); }),
        h('div',{style:{flex:1}}),
        h('div',{style:{display:'flex',gap:6}},['Copy','CSV','Excel','PDF','Print'].map((e,i)=>h('button',{key:i,onClick:()=>onExport(e),title:e,style:{fontSize:11.5,fontWeight:600,color:C.mut,background:'#F4F6F8',border:'1px solid '+C.line2,borderRadius:7,padding:'6px 10px',cursor:'pointer'}},e))));
      const head=h('thead',null,h('tr',null,cols.map((c,i)=>h('th',{key:i,style:{textAlign:numCol(c)?'right':'left',fontSize:11,fontWeight:700,letterSpacing:.4,textTransform:'uppercase',color:C.mut,padding:'11px 16px',background:'#F8F9FB',borderBottom:'1px solid '+C.line,whiteSpace:'nowrap',position:'sticky',top:0}},c))));
      const body= drows.length? h('tbody',null,drows.map((r,ri)=>h('tr',{key:ri,style:{borderBottom:'1px solid '+C.line2}},r.map((cell,ci)=>h('td',{key:ci,style:{padding:'12px 16px',fontSize:13.5,color:ci===0?C.ink2:C.ink,fontWeight:ci===0?600:400,textAlign:numCol(cols[ci])?'right':'left',fontVariantNumeric:numCol(cols[ci])?'tabular-nums':'normal',whiteSpace:'nowrap'}},cell)))))
        : h('tbody',null,h('tr',null,h('td',{colSpan:cols.length,style:{padding:0}}, EmptyRow(o.empty)) ));
      const lastLbl=String(cols[cols.length-1]||'').trim();
      const lastIsAction=cols.length>0&&(lastLbl===''||/action/i.test(lastLbl));
      const mobile=h('div',{style:{display:'flex',flexDirection:'column',gap:12,padding:'14px 0 4px'}}, drows.length? drows.map((r,ri)=>h('div',{key:ri,style:{border:'1px solid '+C.line2,borderRadius:12,padding:'10px 14px',background:'#fff',boxShadow:'0 1px 2px rgba(20,30,55,.04)'}}, cols.map((c,ci)=>{ const label=String(c||'').trim(); const cell=r[ci]; if(lastIsAction&&ci===cols.length-1) return h('div',{key:ci,style:{marginTop:8,paddingTop:10,borderTop:'1px solid '+C.line2,display:'flex',flexWrap:'wrap',gap:8,alignItems:'center'}},cell); const sep=ci<cols.length-1&&!(lastIsAction&&ci===cols.length-2); return h('div',{key:ci,style:{display:'flex',justifyContent:'space-between',gap:14,alignItems:'baseline',padding:'6px 0',borderBottom:sep?'1px dashed '+C.line2:'none'}},h('span',{style:{fontSize:11,fontWeight:700,letterSpacing:.3,textTransform:'uppercase',color:C.mut,flex:'none'}},label||'—'),h('span',{style:{fontSize:13.5,color:ci===0?C.ink2:C.ink,fontWeight:ci===0?600:400,textAlign:'right',minWidth:0}},cell)); }))) : EmptyRow(o.empty) );
      return Card({flush:true,style:{overflow:'hidden'}},
        h('div',{style:{padding:'15px 18px 0'}},toolbar),
        S.narrow? h('div',{style:{padding:'0 14px'}},mobile) : h('div',{style:{overflowX:'auto'}}, h('table',{style:{width:'100%',borderCollapse:'collapse',minWidth:cols.length*120}},head,body)),
        h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 18px',borderTop:'1px solid '+C.line2}},
          h('div',{style:{fontSize:12.5,color:C.mut}}, 'Showing '+(drows.length?1:0)+' to '+drows.length+' of '+(fst.val!=null?drows.length:(o.total||drows.length))+' entries'),
          o.pager||h('div',{style:{display:'flex',gap:6}},['\u2039','1','2','3','\u203a'].map((p,i)=>h('button',{key:i,style:{minWidth:32,height:32,borderRadius:8,border:'1px solid '+C.line,background:p==='1'?accent:'#fff',color:p==='1'?'#fff':C.mut,fontSize:12.5,fontWeight:600,cursor:'pointer'}},p))))); };

    const EmptyRow=(e)=>{ e=e||{}; return h('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:12,padding:'48px 20px',textAlign:'center'}},
      h('div',{style:{width:56,height:56,borderRadius:16,background:'#F4F6F8',color:C.mut2,display:'flex',alignItems:'center',justifyContent:'center'}},ic(e.icon||'inbox',26)),
      h('div',{style:{fontWeight:700,fontSize:15,color:C.ink2}},e.title||'No data available'),
      h('div',{style:{fontSize:13,color:C.mut,maxWidth:340}},e.line||'There are no records to display in this table yet.'),
      e.cta&&h('div',{style:{marginTop:4}},Btn(e.cta,{icon:'plus',sm:true}))); };
    const EmptyCard=(e)=>Card({flush:true},EmptyRow(e));

    const Tabs=(pk,labels,bodyFn)=>{ const a=tabOf(pk);
      return h('div',null,
        h('div',{style:{display:'flex',gap:4,borderBottom:'1px solid '+C.line,marginBottom:18,overflowX:'auto'}},
          labels.map((l,i)=>h('button',{key:i,onClick:()=>setTab(pk,i),style:{padding:'10px 16px',fontSize:13.5,fontWeight:600,color:i===a?accent:C.mut,background:'transparent',border:0,borderBottom:'2.5px solid '+(i===a?accent:'transparent'),marginBottom:-1,cursor:'pointer',whiteSpace:'nowrap',transition:'color .15s'}},l))),
        bodyFn(a)); };

    const Split=(left,right,ratio)=>h('div',{style:{display:'grid',gridTemplateColumns:S.narrow?'1fr':(ratio||'1.7fr 1fr'),gap:16,alignItems:'start'}},left,right);
    const Search=(title,btn,icon)=>Card({title,icon},h('div',{style:{display:'flex',gap:10,flexWrap:'wrap'}},h('div',{style:{flex:1,minWidth:220,position:'relative'}},h('span',{style:{position:'absolute',left:12,top:11,color:C.mut2}},ic('search',16)),h('input',{placeholder:'Type to search\u2026',style:{width:'100%',height:40,padding:'0 12px 0 38px',border:'1px solid '+C.line,borderRadius:9,fontSize:13.5,outline:'none'}})),Btn(btn||'Search',{icon:'search'})));

    const StatCard=(label,value,o)=>{ o=o||{}; return h('div',{style:{background:C.card,border:'1px solid '+C.line,borderRadius:14,padding:'17px 18px',boxShadow:'0 1px 2px rgba(20,30,55,.04)'}},
      h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}},
        h('div',{style:{fontSize:12.5,color:C.mut,fontWeight:600}},label),
        h('span',{style:{width:36,height:36,borderRadius:10,background:(o.tone?{ok:C.okBg,warn:C.warnBg,dng:C.dngBg,info:C.infoBg}[o.tone]:tint),color:(o.tone?{ok:C.ok,warn:C.warn,dng:C.dng,info:C.info}[o.tone]:accent),display:'flex',alignItems:'center',justifyContent:'center'}},ic(o.icon||'chart',18))),
      h('div',{style:{fontSize:27,fontWeight:800,letterSpacing:-.6,marginTop:10,color:C.ink2,fontVariantNumeric:'tabular-nums'}},value),
      o.delta&&h('div',{style:{display:'flex',alignItems:'center',gap:6,marginTop:7,fontSize:12.5}}, h('span',{style:{color:o.down?C.dng:C.ok,fontWeight:700}},(o.down?'\u2193 ':'\u2191 ')+o.delta), h('span',{style:{color:C.mut2}},o.deltaLbl||'vs last month'))); };

    const Stats=(arr)=>h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:14,marginBottom:16}},arr.map((s,i)=>h('div',{key:i},s)));

    // line chart
    const LineChart=(inc,exp,labels)=>{ const W=640,H=210,pl=42,pr=14,pt=14,pb=26; const n=inc.length; const max=Math.max(...inc,...exp)*1.18;
      const X=i=>pl+i*(W-pl-pr)/(n-1); const Y=v=>H-pb-(v/max)*(H-pt-pb);
      const path=a=>a.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join(' ');
      const area=path(inc)+' L'+X(n-1)+' '+(H-pb)+' L'+X(0)+' '+(H-pb)+' Z';
      const grid=[0,.25,.5,.75,1].map((f,i)=>{const y=pt+f*(H-pt-pb);return h('g',{key:i},h('line',{x1:pl,y1:y,x2:W-pr,y2:y,stroke:C.line2,strokeWidth:1}),h('text',{x:pl-8,y:y+3,textAnchor:'end',fontSize:9.5,fill:C.mut2},Math.round(max*(1-f)/1000)+'k'));});
      return h('div',null,
        h('div',{style:{display:'flex',gap:18,marginBottom:6}},[['Income',accent],['Expense','#E2495B']].map((l,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:7,fontSize:12,color:C.mut,fontWeight:600}},h('span',{style:{width:11,height:11,borderRadius:3,background:l[1]}}),l[0]))),
        h('svg',{viewBox:'0 0 '+W+' '+H,style:{width:'100%',height:'auto',display:'block'}},
          h('defs',null,h('linearGradient',{id:'gInc',x1:0,y1:0,x2:0,y2:1},h('stop',{offset:'0%',stopColor:accent,stopOpacity:.22}),h('stop',{offset:'100%',stopColor:accent,stopOpacity:0}))),
          grid,
          h('path',{d:area,fill:'url(#gInc)'}),
          h('path',{d:path(inc),fill:'none',stroke:accent,strokeWidth:2.5,strokeLinejoin:'round',strokeLinecap:'round'}),
          h('path',{d:path(exp),fill:'none',stroke:'#E2495B',strokeWidth:2.5,strokeLinejoin:'round',strokeLinecap:'round',strokeDasharray:'1 0'}),
          inc.map((v,i)=>h('circle',{key:i,cx:X(i),cy:Y(v),r:2.6,fill:'#fff',stroke:accent,strokeWidth:2})),
          labels.map((l,i)=>h('text',{key:i,x:X(i),y:H-9,textAnchor:'middle',fontSize:9.5,fill:C.mut2},l))) ); };

    const Calendar=()=>{ const y=2026,mo=5,today=20,ev={5:1,12:1,18:1,26:1}; const first=new Date(y,mo,1).getDay(); const dim=new Date(y,mo+1,0).getDate(); const start=(first+6)%7;
      const cells=[]; for(let i=0;i<start;i++)cells.push(null); for(let d=1;d<=dim;d++)cells.push(d);
      return h('div',null,
        h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}},h('div',{style:{fontWeight:700,fontSize:14,color:C.ink2}},'June 2026'),h('div',{style:{display:'flex',gap:6}},[ic('chevD',16),ic('chevR',16)].map((x,i)=>h('button',{key:i,style:{width:28,height:28,borderRadius:7,border:'1px solid '+C.line,background:'#fff',color:C.mut,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transform:i?'rotate(0)':'rotate(90deg)'}},x)))),
        h('div',{style:{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4}},
          ['M','T','W','T','F','S','S'].map((d,i)=>h('div',{key:'h'+i,style:{textAlign:'center',fontSize:10.5,fontWeight:700,color:C.mut2,padding:'2px 0'}},d)),
          cells.map((d,i)=>h('div',{key:i,style:{aspectRatio:'1',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,fontSize:12.5,fontWeight:d===today?700:500,borderRadius:9,color:d===today?'#fff':(d?C.ink:'transparent'),background:d===today?accent:'transparent',cursor:d?'pointer':'default'}}, d||'', d&&ev[d]&&h('span',{style:{width:4,height:4,borderRadius:4,background:d===today?'#fff':accent}}))))); };

    // ===== Timetable Builder =====
    const ttCol=c=>(this.SUBJ.find(s=>s.c===c)||{}).col||C.mut;
    const subjTmap={}; this.TEACHERS.forEach(t=>subjTmap[t.subj]=t.id);
    const onDrop=(key,e)=>{ e.preventDefault(); const d=e.dataTransfer.getData('text/plain'); this.setState(st=>{ const tt={...st.tt}; if(d.startsWith('subj:')){ const c=d.slice(5); tt[key]={c,room:'R-204',tId:subjTmap[c]}; } else if(d.startsWith('move:')){ const from=d.slice(5); tt[key]=tt[from]; delete tt[from]; } return {tt}; }); };
    const clearCell=key=>this.setState(st=>{ const tt={...st.tt}; delete tt[key]; const subs={...st.subs}; delete subs[key]; return {tt,subs}; });
    const Timetable=(editable)=>{
      const cls=S.ttClass;
      const clsSelect=h('div',{style:{position:'relative'}}, h('select',{value:cls,onChange:e=>this.setState({ttClass:e.target.value}),style:{height:34,padding:'0 30px 0 12px',border:'1px solid '+C.line,borderRadius:8,fontSize:13,fontWeight:600,appearance:'none',background:'#fff',cursor:'pointer',color:C.ink}}, this.TT_CLASSES.map(c=>h('option',{key:c,value:c},'Class '+c))), h('span',{style:{position:'absolute',right:9,top:9,color:C.mut2,pointerEvents:'none'}},ic('chevD',15)));
      if(!S.ttSet[cls]){ return Card({title:'Timetable \u00b7 Class '+cls,icon:'calendar',right:clsSelect}, h('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:13,padding:'44px 20px',textAlign:'center'}}, h('div',{style:{width:56,height:56,borderRadius:16,background:C.warnBg,color:C.warn,display:'flex',alignItems:'center',justifyContent:'center'}},ic('calendar',26)), h('div',{style:{fontWeight:700,fontSize:16,color:C.ink2}},'Timetable not configured for Class '+cls), h('div',{style:{fontSize:13.5,color:C.mut,maxWidth:430,lineHeight:1.55}},'Attendance and exam scheduling for this class are blocked until a weekly timetable is set. Configure periods, subjects and teachers to continue.'), editable?Btn('Set timetable now',{icon:'plus',onClick:()=>this.setState(st=>({ttSet:{...st.ttSet,[cls]:true}}),()=>toast('Blank timetable created for Class '+cls,'ok'))}):h('div',{style:{fontSize:12.5,color:C.mut2}},'Ask an admin or coordinator to configure it.'))); }
      const hasGrid = cls==='VIII-A';
      const cols='90px repeat('+this.DAYS.length+',1fr)';
      const palette=editable&&h('div',{style:{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16,padding:'12px 14px',background:'#F8F9FB',border:'1px solid '+C.line2,borderRadius:11}}, h('span',{style:{fontSize:12,fontWeight:700,color:C.mut,alignSelf:'center',marginRight:4}},'Drag subjects \u2192'), this.SUBJ.map(s=>h('div',{key:s.c,draggable:true,onDragStart:e=>e.dataTransfer.setData('text/plain','subj:'+s.c),style:{display:'flex',alignItems:'center',gap:7,padding:'6px 11px',borderRadius:8,background:'#fff',border:'1px solid '+C.line,cursor:'grab',fontSize:12,fontWeight:600,color:C.ink}}, h('span',{style:{width:9,height:9,borderRadius:3,background:s.col}}), s.n)));
      const headRow=h('div',{style:{display:'grid',gridTemplateColumns:cols,gap:6,marginBottom:6}}, h('div'), this.DAYS.map(d=>h('div',{key:d,style:{textAlign:'center',fontSize:12,fontWeight:700,color:C.ink2,padding:'6px 0'}},d)));
      const rows=this.PERIODS.map((p,pi)=>{ if(p.br) return h('div',{key:pi,style:{display:'grid',gridTemplateColumns:cols,gap:6,marginBottom:6}}, h('div'), h('div',{style:{gridColumn:'2 / -1',textAlign:'center',fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:C.mut2,background:'#F4F6F8',borderRadius:8,padding:'7px 0'}},p.br));
        return h('div',{key:pi,style:{display:'grid',gridTemplateColumns:cols,gap:6,marginBottom:6}},
          h('div',{style:{display:'flex',flexDirection:'column',justifyContent:'center',fontSize:11,fontWeight:600,color:C.mut,paddingRight:4}}, h('span',{style:{color:C.ink2,fontWeight:700,fontSize:12}},p.t), h('span',null,'P'+(pi<3?pi+1:pi<6?pi:pi-1))),
          this.DAYS.map((d,di)=>{ const key=di+'_'+pi; const cell=hasGrid?S.tt[key]:undefined;
            if(cell){ const col=ttCol(cell.c); const leave=onLeave(cell.tId); const sub=S.subs[key]; const needs=leave&&!sub;
              const teacherLine= needs? h('button',{onClick:()=>openSubPick(key),style:{marginTop:4,display:'inline-flex',alignItems:'center',gap:4,border:0,background:'#fff',color:C.dng,borderRadius:6,padding:'2px 7px',fontSize:9.5,fontWeight:700,cursor:'pointer'}}, ic('bell',10), 'Assign sub') : h('div',{style:{fontSize:9.5,color:sub?C.info:C.mut,marginTop:3,fontWeight:sub?700:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}, (sub?'Sub: ':'')+(tname(sub||cell.tId)||'').split(' ')[0]);
              const bdr= needs?C.dng:(sub?C.info:col);
              return h('div',{key:key,draggable:editable&&!needs,onDragStart:e=>editable&&e.dataTransfer.setData('text/plain','move:'+key),onDragOver:e=>editable&&e.preventDefault(),onDrop:e=>editable&&onDrop(key,e),style:{position:'relative',borderRadius:9,padding:'7px 9px',background:(needs?C.dngBg:col+'14'),border:'1px solid '+bdr+'40',borderLeft:'3px solid '+bdr,cursor:editable?'grab':'default',minHeight:56,display:'flex',flexDirection:'column',justifyContent:'center'}}, h('div',{style:{fontWeight:700,fontSize:12,color:needs?C.dng:col}},cell.c), h('div',{style:{fontSize:9.5,color:C.mut2}},cell.room), teacherLine, editable&&h('button',{onClick:()=>clearCell(key),style:{position:'absolute',top:3,right:3,width:15,height:15,borderRadius:5,border:0,background:'transparent',color:needs?C.dng:col,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',opacity:.55}},ic('x',11))); }
            return h('div',{key:key,onDragOver:e=>editable&&e.preventDefault(),onDrop:e=>editable&&onDrop(key,e),style:{borderRadius:9,minHeight:56,border:'1.5px dashed '+C.line,background:editable?'#FCFCFD':'#fff',display:'flex',alignItems:'center',justifyContent:'center',color:'#C7CCD4',fontSize:11}}, editable?'\u2014':''); })); });
      const ns=needsSub().length;
      const right=h('div',{style:{display:'flex',gap:9,alignItems:'center'}}, clsSelect, editable?Btn('Save Timetable',{sm:true,icon:'check',onClick:()=>toast('Timetable saved','ok')}):Pill('Term 2 \u00b7 2025-26','acc'));
      return Card({title:(editable?'Create Timetable':'Weekly Timetable')+' \u00b7 Class '+cls,icon:'calendar',sub:(ns&&hasGrid)?(ns+' uncovered'):null,right}, palette, headRow, rows); };

    // ===== salary / payroll =====
    const SAL_MONTHS=['2026-06','2026-05','2026-04','2026-03','2026-02','2026-01'];
    const MONTH_NAMES=['January','February','March','April','May','June','July','August','September','October','November','December'];
    const monthLabel=m=>{ const p=String(m).split('-'); return (MONTH_NAMES[(+p[1])-1]||'')+' '+p[0]; };
    const salaryOf=emp=>{ const seed=(parseInt(String(emp.id).replace(/\D/g,''),10)||1); const basic=28000+seed*1500; const hra=Math.round(basic*0.4); const da=Math.round(basic*0.18); const allow=2500; const gross=basic+hra+da+allow; const pf=Math.round(basic*0.12); const ptax=200; const tds=Math.round(gross*0.04); const ded=pf+ptax+tds; const net=gross-ded; return {basic,hra,da,allow,gross,pf,ptax,tds,ded,net}; };
    const salKey=(id,m)=>id+'_'+m;
    const salPaid=(id,m)=>!!(S.salary&&S.salary[salKey(id,m)]);
    const paySalary=(emp,m)=>{ if(salPaid(emp.id,m)){ toast(emp.name+' is already paid for '+monthLabel(m),'warn'); return; } const sal=salaryOf(emp); this.setState(st=>({salary:{...(st.salary||{}),[salKey(emp.id,m)]:{name:emp.name,month:m,net:sal.net,gross:sal.gross,ts:Date.now()}}}),()=>toast('Salary paid · '+emp.name+' · '+rupee(sal.net)+' · '+monthLabel(m),'ok')); };
    const salSelect=(val,onChange,opts)=>h('div',{style:{position:'relative'}}, h('select',{value:val,onChange,style:{height:38,padding:'0 32px 0 12px',border:'1px solid '+C.line,borderRadius:9,fontSize:13,appearance:'none',background:'#fff',cursor:'pointer',fontWeight:600,color:C.ink,outline:'none'}}, opts.map((o,i)=>h('option',{key:i,value:o[0]},o[1]))), h('span',{style:{position:'absolute',right:10,top:11,color:C.mut2,pointerEvents:'none'}},ic('chevD',15)));
    const monthSelect=()=>salSelect(S.salMonth||SAL_MONTHS[0],e=>this.setState({salMonth:e.target.value}),SAL_MONTHS.map(m=>[m,monthLabel(m)]));
    const empSelect=()=>{ const emps=S.teachers; return salSelect(S.salEmp||emps[0].id,e=>this.setState({salEmp:e.target.value}),emps.map(t=>[t.id,t.name+' · '+t.subj])); };
    const PaySalary=()=>{ const emps=S.teachers; const m=S.salMonth||SAL_MONTHS[0]; const paidN=emps.filter(t=>salPaid(t.id,m)).length; const payroll=emps.reduce((a,t)=>a+salaryOf(t).net,0);
      const rows=emps.map(t=>{ const sal=salaryOf(t); const paid=salPaid(t.id,m); return [ h('div',{style:{display:'flex',alignItems:'center',gap:9}},AvatarMini(t.name),t.name), t.id, Pill(t.subj,'acc'), rupee(sal.basic), rupee(sal.net), paid?Pill('Paid','ok'):Pill('Pending','warn'), paid?Btn('View slip',{sm:true,variant:'outline',icon:'printer',onClick:()=>this.setState({salEmp:t.id,page:'salaryslip'})}):Btn('Pay',{sm:true,icon:'wallet',onClick:()=>paySalary(t,m)}) ]; });
      return h('div',null, Stats([StatCard('Employees',String(emps.length),{icon:'briefcase',tone:'info'}),StatCard('Paid · '+monthLabel(m),paidN+' / '+emps.length,{icon:'check',tone:'ok'}),StatCard('Monthly Payroll',rupee(payroll),{icon:'coins'})]), Card({title:'Pay / Record Salary',icon:'wallet',right:monthSelect()}, h('div',{style:{fontSize:13,color:C.mut,lineHeight:1.5}},'Recording a payment marks the employee Paid for ',h('b',{style:{color:C.ink}},monthLabel(m)),' and is reload-safe. Paying the same month twice is blocked.')), h('div',{style:{height:16}}), Table(['Employee','ID','Dept','Basic','Net Pay','Status','Action'],rows,{tools:['Reload','Search']})); };
    const SlipView=(emp,m)=>{ const sal=salaryOf(emp); const paid=salPaid(emp.id,m);
      const line=(lab,val,bold)=>h('div',{style:{display:'flex',justifyContent:'space-between',padding:'7px 0',fontSize:13.5}}, h('span',{style:{color:bold?C.ink2:C.mut,fontWeight:bold?700:400}},lab), h('span',{style:{fontWeight:bold?800:600,color:C.ink2,fontVariantNumeric:'tabular-nums'}},rupee(val)));
      const colm=(title,items,tl)=>h('div',{style:{flex:1,minWidth:230}}, h('div',{style:{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:.5,color:C.mut,marginBottom:4}},title), items.map((it,i)=>h('div',{key:i},line(it[0],it[1]))), h('div',{style:{borderTop:'1px solid '+C.line,marginTop:4}},line(tl[0],tl[1],true)));
      return Card({},
        h('div',{style:{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,borderBottom:'1px solid '+C.line2,paddingBottom:15,marginBottom:15}},
          h('div',{style:{display:'flex',gap:13,alignItems:'center'}}, Avatar(emp.name,52), h('div',null, h('div',{style:{fontWeight:800,fontSize:17,color:C.ink2}},emp.name), h('div',{style:{fontSize:12.5,color:C.mut,marginTop:3}}, emp.id+' · '+emp.subj+' Department'))),
          h('div',{style:{textAlign:'right'}}, h('div',{style:{fontSize:13,fontWeight:700,color:accent}},'Greenfield International'), h('div',{style:{fontSize:12.5,color:C.mut,marginTop:3}},'Pay slip · '+monthLabel(m)), h('div',{style:{marginTop:5}},paid?Pill('Paid','ok'):Pill('Not yet paid','warn')))),
        h('div',{style:{display:'flex',gap:30,flexWrap:'wrap'}}, colm('Earnings',[['Basic',sal.basic],['House Rent Allowance',sal.hra],['Dearness Allowance',sal.da],['Special Allowance',sal.allow]],['Gross Earnings',sal.gross]), colm('Deductions',[['Provident Fund (12%)',sal.pf],['Professional Tax',sal.ptax],['TDS',sal.tds]],['Total Deductions',sal.ded])),
        h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',background:C.okBg,border:'1px solid '+C.ok+'44',borderRadius:12,padding:'14px 18px',marginTop:16}}, h('div',null, h('div',{style:{fontSize:12.5,color:C.mut,fontWeight:600}},'Net Pay'), h('div',{style:{fontSize:11.5,color:C.mut2,marginTop:2}}, rupee(sal.gross)+' − '+rupee(sal.ded)+' deductions')), h('div',{style:{fontSize:25,fontWeight:800,color:C.ok,letterSpacing:-.5}},rupee(sal.net))),
        h('div',{style:{display:'flex',gap:10,marginTop:16}}, Btn('Print slip',{icon:'printer',onClick:()=>{try{window.print();}catch(e){}}}), Btn('Download',{variant:'outline',icon:'download',onClick:()=>toast('Slip downloaded','ok')}))); };
    const SalarySlip=(self)=>{ const emps=S.teachers; const emp=self?emps[0]:(emps.find(t=>t.id===S.salEmp)||emps[0]); const m=S.salMonth||SAL_MONTHS[0];
      const right=h('div',{style:{display:'flex',gap:9,flexWrap:'wrap'}}, self?null:empSelect(), monthSelect());
      return h('div',null, Card({title:self?'My Salary Slip':'Generate Salary Slip',icon:'wallet',right}, h('div',{style:{fontSize:13,color:C.mut,lineHeight:1.5}}, self?'View and print your monthly pay slip below.':'Select an employee and month, then print or download the generated slip.')), h('div',{style:{height:16}}), SlipView(emp,m)); };

    // ===== page registry =====
    const PG = {
      stdprofile:()=>StudentProfile(),
      finance:()=>FinanceView(),
      sysmap:()=>SystemMap(),
      setup:()=>SetupHealth(),
      dash_admin:()=>AdminDash(),

      dash_coord:()=>CoordDash(),
      dash_teach:()=>TeacherDash(),
      dash_std:()=>StudentDash(),

      inst:()=>FormCard('Edit Institute',['Logo','Name of Institute*','Target Line*','Phone*','Website','Address*','Country*'],'Update Profile',{icon:'settings'}),
      feepart:()=>FormCard('Fee Particulars \u2014 Class VIII \u25be',['Monthly Tuition*','Admission Fee','Registration','Transport','Books','Uniform','Annual Charges','Fine / Late Fee'],'Save Changes',{icon:'receipt'}),
      bank:()=>h('div',null,FormCard('Add Bank Account',['Bank Logo*','Bank Name*','Branch Address*','Account Number*','IFSC*','Instructions'],'Add Bank',{icon:'bank'}),h('div',{style:{height:16}}),Table(['Bank Name','Account No.','IFSC','Actions'],[['HDFC Bank','5021 0044 8821','HDFC0001234',rowActions()],['State Bank of India','3399 1200 4571','SBIN0009912',rowActions()]],{tools:['Reload','Search']})),
      rules:()=>FormCard('Rules & Regulations',['Student Rules (Admission Letter) \u2014 Rich-text','Employee Rules (Job Letter) \u2014 Rich-text'],'Save Changes',{icon:'list'}),
      grading:()=>Tabs('grading',['Marks Grading','Fail Criteria'],a=> a===0? Table(['Grade','% From','% Upto','Remark','Actions'],[['A+',91,100,'Outstanding',rowActions()],['A',81,90,'Excellent',rowActions()],['B',71,80,'Very Good',rowActions()],['C',61,70,'Good',rowActions()],['D',45,60,'Satisfactory',rowActions()],['F',0,44,'Needs Improvement',rowActions()]],{tools:['+ Add Grade','Reload']}) : FormCard('Fail Criteria',['Passing % per Subject*','Overall Passing %*','Max Subjects Allowed to Fail*'],'Save',{icon:'award'})),
      theme:()=>FormCard('Appearance & Language',['Layout Direction \u25be','Sidebar Theme \u25be','Header Color','Active Item Color','Default Language \u25be'],'Save Settings',{icon:'settings'}),
      acct:()=>Split(FormCard('Login & Locale',['Username / Email*','Password*','Time Zone*','Currency*','Currency Symbol'],'Update Settings',{icon:'key'}),Card({title:'Subscription',icon:'badge'},h('div',{style:{display:'flex',flexDirection:'column',gap:12}},[['Plan','Yearly \u00b7 Pro'],['Renews','01 Apr 2027'],['Seats','120 / 150 used']].map((r,i)=>h('div',{key:i,style:{display:'flex',justifyContent:'space-between',fontSize:13}},h('span',{style:{color:C.mut}},r[0]),h('span',{style:{fontWeight:600,color:C.ink2}},r[1]))),h('div',{style:{marginTop:4}},Btn('Manage plan',{variant:'soft',sm:true}))))),
      pwd:()=>FormCard('Change Password',['Current Password*','New Password*','Confirm New Password*'],'Update Password',{icon:'lock'}),

      classes:()=>h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:14}},[['+ Add New Class'],['VI','2 sections \u00b7 64'],['VII','2 sections \u00b7 58'],['VIII','2 sections \u00b7 61'],['IX','2 sections \u00b7 55'],['X','2 sections \u00b7 49']].concat((S.classesAdded||[]).map(x=>[x.name,x.sub])).map((c,i)=> i===0? h('button',{key:i,onClick:()=>setPage2('newclass'),style:{border:'1.5px dashed '+C.line,borderRadius:14,background:'#FCFCFD',minHeight:118,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,color:accent,cursor:'pointer',fontWeight:600,fontSize:13.5}},h('span',{style:{width:38,height:38,borderRadius:11,background:tint,display:'flex',alignItems:'center',justifyContent:'center'}},ic('plus',20)),'Add New Class') : Card({},h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}},h('div',{style:{fontSize:18,fontWeight:800,color:C.ink2}},'Class '+c[0]),h('span',{style:{color:accent}},ic('book',18))),h('div',{style:{fontSize:12.5,color:C.mut,marginTop:8}},c[1]),h('div',{style:{display:'flex',gap:8,marginTop:14}},Btn('View',{variant:'soft',sm:true}),Btn('Edit',{variant:'outline',sm:true}),Btn('Delete',{variant:'danger',sm:true,onClick:()=>tryDelete('class','Class '+c[0])}))))),
      newclass:()=>FormCard('Create Class',['Class Name*','Monthly Tuition Fees*','Class Teacher \u25be*'],'Create Class',{icon:'book',onSubmit:v=>{ let nm=(v['Class Name*']||'').trim().replace(/^class\s+/i,''); if(!nm) nm='New'; const fee=(v['Monthly Tuition Fees*']||'').trim(); const feeN=Number(String(fee).replace(/[^0-9.]/g,'')); const sub=feeN>0?(rupee(feeN)+' / month'):'1 section · 0'; this.setState(st=>({classesAdded:[...(st.classesAdded||[]),{name:nm,sub:sub}]}),()=>{ toast('Class created · '+nm,'ok'); setPage2('classes'); }); }}),
      subjview:()=>h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}},['VI-A','VII-A','VIII-A','IX-A','X-A'].map((cl,i)=>Card({title:'Class '+cl,icon:'layers',right:Btn('Edit',{variant:'ghost',sm:true})},h('div',{style:{display:'flex',gap:7,flexWrap:'wrap'}},this.SUBJ.slice(0,6).map(s=>h('span',{key:s.c,style:{fontSize:12,fontWeight:600,color:s.col,background:s.col+'14',padding:'4px 10px',borderRadius:7}},s.n)))))),
      assignsub:()=>FormCard('Assign Subjects',['Select Class \u25be*','Subject Name*','Max Marks*','Subject Teacher \u25be'],'Assign Subjects',{icon:'layers'}),

      allstd:()=>{ const filtered=S.students.filter(s=>(S.scls==='All'||s[3].startsWith(S.scls))&&(s[1].toLowerCase().includes(S.stq.toLowerCase())||s[0].includes(S.stq))); const per=8; const pages=Math.max(1,Math.ceil(filtered.length/per)); const pg=Math.min(S.spage,pages); const slice=filtered.slice((pg-1)*per,pg*per);
        const rows=slice.map(s=>[h('div',{style:{display:'flex',alignItems:'center',gap:9}},Avatar(s[1],26),s[1]),s[0],s[2],Pill(s[3],'acc'),dueOf(s[0])<=0?'\u2014':rupee(dueOf(s[0])),(()=>{const fs=feeStatus(s[0]);return Pill(fs[0],fs[1]);})(),h('div',{style:{display:'flex',gap:6,justifyContent:'flex-end'}},h('button',{onClick:()=>openStudent(s[0]),title:'View profile',style:{width:30,height:30,borderRadius:8,border:'1px solid '+C.line,background:'#fff',color:accent,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},ic('eye',15)),h('button',{title:'Delete',onClick:()=>tryDelete('student',s[1],{reg:s[0],section:s[3]}),style:{width:30,height:30,borderRadius:8,border:'1px solid '+C.line,background:'#fff',color:C.dng,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},ic('trash',15)))]);
        const pager=h('div',{style:{display:'flex',gap:6}},Array.from({length:pages}).map((_,i)=>h('button',{key:i,onClick:()=>setSPage(i+1),style:{minWidth:32,height:32,borderRadius:8,border:'1px solid '+C.line,background:pg===i+1?accent:'#fff',color:pg===i+1?'#fff':C.mut,fontSize:12.5,fontWeight:600,cursor:'pointer'}},i+1)));
        return Table(['Student','Reg #','Father','Class','Fee Remaining','Status','Actions'],rows,{tools:['Reload','Search','Filter by Class','+ Add Student'],searchVal:S.stq,onSearch:e=>this.setState({stq:e.target.value,spage:1}),searchPh:'Search name or reg #',total:filtered.length,pager}); },
      admission:()=>AdmissionsBoard(),
      archive:()=>ArchiveView(),
      __oldadmission:()=>h('div',null,FormCard('1 \u00b7 Student Information',['Student Name*','Picture','Registration No*','Admission Date*','Date of Birth*','Gender \u25be*','Select Class \u25be*','Discount (%)','Mobile'],'Save & Continue',{icon:'grad',secondary:'Back'}),h('div',{style:{height:16}}),FormCard('2 \u00b7 Father / Guardian',['Father Name','National ID','Mobile','Occupation','Annual Income','Address'],'Submit Admission',{icon:'user',secondary:'Back'})),
      admletter:()=>Search('Generate Admission Letter','Search Student','grad'),
      idcard:()=>Tabs('idcard',['Default','Style 1','Style 2','Style 3'],a=>h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:16}},S.students.slice(0,3).map((s,i)=>IDCard(s,a)))),
      printlist:()=>Table(['Sr','Reg #','Student','Father','Class','Fee Remaining','Phone'],S.students.slice(0,8).map((s,i)=>[i+1,s[0],s[1],s[2],s[3],s[4]===0?'\u2014':rupee(s[4]),s[5]]),{tools:['Reload','Filter by Class','Print']}),
      stdlogin:()=>Table(['Student','Class','Username','Password','Status','Actions'],S.students.slice(0,6).map(s=>[s[1],s[3],s[0].toLowerCase().replace('-',''),'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022',Pill('Active','ok'),rowActions(['key'])]),{tools:['Reload','Search']}),
      promote:()=>PromoteStudents(),
      myprofile:()=>Split(FormCard('Personal Information',['Full Name','Registration No','Class','Date of Birth','Guardian Name','Mobile','Address'],'Request Edit',{icon:'user',secondary:'Print'}),Card({title:'Photo'},h('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:12}},Avatar('Aarav Sharma',96),h('div',{style:{fontWeight:700,color:C.ink2}},'Aarav Sharma'),Pill('Class VI-A \u00b7 Active','acc')))),

      allemp:()=>{ const empActions=empRow(); return Table(['Name','Designation','Mobile','Joined','Actions'],[['Sangeeta Nag','Senior Coordinator','+91 98201 00011','12 Apr 2019',empActions],['Dimpu Sharma','Maths Teacher','+91 99300 22033','03 Jun 2021',empActions],['Meenakshi Singhal','Primary Lead','+91 90041 55077','21 Jul 2018',empActions],['Rohit Verma','Science Teacher','+91 95001 88044','09 Jan 2022',empActions]].concat((S.staffAdded||[]).map(s=>[s.name,s.desig,s.mobile,s.joined,empActions])),{tools:['Reload','Search','+ Add Employee']}); },
      addemp:()=>FormCard('Employee Information',['Employee Name*','Picture','Mobile*','Email','Date of Joining*','Designation / Role \u25be*','Monthly Salary*','Address'],'Add Employee',{icon:'briefcase',onSubmit:v=>{ const name=(v['Employee Name*']||'').trim(); let desig=(v['Designation / Role ▾*']||'').trim(); if(!desig||/^select/i.test(desig)) desig='Staff'; const mobile=(v['Mobile*']||'').trim()||'—'; const dj=(v['Date of Joining*']||'').trim(); const MM=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; const md=/^(\d{4})-(\d{2})-(\d{2})$/.exec(dj); const joined=md?(+md[3])+' '+MM[(+md[2])-1]+' '+md[1]:(dj||'—'); this.setState(st=>({staffAdded:[...(st.staffAdded||[]),{name:name,desig:desig,mobile:mobile,joined:joined}]}),()=>{ toast('Employee added · '+name,'ok'); setPage2('allemp'); }); }}),
      jobletter:()=>Search('Generate Job Letter','Search Employee','briefcase'),
      stafflogin:()=>Table(['Staff','Role','Username','Password','Actions'],[['Sangeeta Nag','Coordinator','snag','\u2022\u2022\u2022\u2022\u2022\u2022',rowActions(['key'])],['Dimpu Sharma','Teacher','dsharma','\u2022\u2022\u2022\u2022\u2022\u2022',rowActions(['key'])]],{tools:['Reload','Search']}),

      coa:()=>h('div',null,FormCard('Add Account Head',['Head Name*','Head Type \u25be* (Income / Expense)'],'Save Head',{icon:'bank'}),h('div',{style:{height:16}}),Table(['#','Name of Head','Type','Actions'],[[1,'Tuition Fees',Pill('Income','ok'),rowActions()],[2,'Transport Fees',Pill('Income','ok'),rowActions()],[3,'Staff Salaries',Pill('Expense','dng'),rowActions()],[4,'Utilities',Pill('Expense','dng'),rowActions()],[5,'Maintenance',Pill('Expense','dng'),rowActions()]],{tools:['Reload','Search']})),
      income:()=>FormCard('Record Income',['Account Head \u25be*','Date*','Description*','Amount*'],'Add Income',{icon:'coins'}),
      expense:()=>FormCard('Record Expense',['Account Head \u25be*','Date*','Description*','Amount*'],'Add Expense',{icon:'wallet'}),
      statement:()=>h('div',null,Stats([StatCard('Total Income',rupee(2840000),{icon:'coins',tone:'ok'}),StatCard('Total Expense',rupee(2228000),{icon:'wallet',tone:'dng'}),StatCard('Net Balance',rupee(612000),{icon:'chart',tone:'info'})]),Table(['Date','Description','Expense','Income','Net Balance'],[['18 Jun 2026','Tuition collection \u2013 VIII','\u2014',rupee(184000),rupee(612000)],['16 Jun 2026','Electricity bill',rupee(42000),'\u2014',rupee(428000)],['14 Jun 2026','Staff salary \u2013 June',rupee(1180000),'\u2014',rupee(470000)],['12 Jun 2026','Transport fees','\u2014',rupee(96000),rupee(1650000)]],{tools:['Reload','Date Range','Search']})),

      geninvoice:()=>FormCard('Generate Fees Invoice',['Select Class / Student \u25be*','Fees Month \u25be*','Particulars \u25be','Bank Account \u25be*','Due Date*'],'Generate Invoice',{icon:'receipt'}),
      collect:()=>CollectFees(),

      payonline:()=>PayOnline(),

      paidslip:()=>FormCard('Fees Paid Slip',['Fees Month \u25be*','Search Student*'],'View Slip',{icon:'printer'}),
      defaulters:()=>Defaulters(),

      paysalary:()=>PaySalary(),
      salaryslip:()=>SalarySlip(false),
      myslip:()=>SalarySlip(true),

      markatt:()=>Tabs('markatt',['Manual Attendance','Card Scanning'],a=> a===1? EmptyCard({icon:'idcard',title:'Tap cards to mark attendance',line:'Bring a student RFID card near the reader to auto-mark present.'}) : MarkAttendance()),
      empatt:()=>Tabs('empatt',['Manual Attendance','Card Scanning'],a=>a===1?EmptyCard({icon:'idcard',title:'Card scanning',line:'Tap staff cards on the reader.'}):FormCard('Mark Staff Attendance',['Date*'],'Load Staff',{icon:'calcheck'})),
      selfcheck:()=>FormCard('Check-in / Check-out',['Date*','Status \u25be'],'Mark Attendance',{icon:'calcheck'}),
      clsreport:()=>h('div',null,FormCard('Class-wise Report',['Date*','Select Class \u25be*'],'Show Report',{icon:'calcheck'}),h('div',{style:{height:16}}),Table(['Reg #','Name','Status'],this.CLASS_STD.slice(0,5).map((s,i)=>[s[0],s[1],i===3?Pill('Absent','dng'):Pill('Present','ok')]),{tools:['Reload']})),
      stdattrep:()=>h('div',null, collapsible('attViz','Attendance heatmap \u00b7 sections \u00d7 days','calcheck','Attendance % across sections and weekdays \u2014 click a cell for that register',AttHeatmap), Table(['Date','Day','Reg #','Name','Class','Status'],[['18 Jun','Thu','2026-0145','Ananya Iyer','VII-A',Pill('Present','ok')],['18 Jun','Thu','2026-0148','Saanvi Joshi','VIII-A',Pill('Absent','dng')],['17 Jun','Wed','2026-0145','Ananya Iyer','VII-A',Pill('Present','ok')]],{tools:['Reload','Date Range','Filter by Class']})),
      myatt:()=>h('div',null,Stats([StatCard('Present Days','112',{icon:'check',tone:'ok'}),StatCard('Absent Days','5',{icon:'x',tone:'dng'}),StatCard('Attendance %','96%',{icon:'calcheck',tone:'info'})]),Table(['Date','Day','Class','Status'],[['18 Jun','Thu','VI-A',Pill('Present','ok')],['17 Jun','Wed','VI-A',Pill('Present','ok')],['16 Jun','Tue','VI-A',Pill('Absent','dng')],['15 Jun','Mon','VI-A',Pill('Present','ok')]],{tools:['Reload','Date Range']})),
      empattrep:()=>Table(['Date','Day','Name','Type','Status','Time'],[['18 Jun','Thu','Dimpu Sharma','Teaching',Pill('Present','ok'),'08:02'],['18 Jun','Thu','Rohit Verma','Teaching',Pill('Late','warn'),'09:14']],{tools:['Reload','Date Range']}),

      tt_edit:()=>Timetable(true),
      tt_view:()=>Timetable(false),

      homework:()=>Table(['Date','Class','Subject','Teacher','Details'],[['18 Jun','VIII-A','Mathematics','D. Sharma','Ex 7.2 Q1\u201310'],['18 Jun','VIII-A','Science','R. Verma','Read Ch.6 \u00b7 diagram'],['17 Jun','VIII-A','English','S. Nag','Essay \u2013 "My City"']],{tools:['+ Add Homework','Reload','Filter by Class']}),
      homework_std:()=>HomeworkStd(),

      behaviour:()=>Tabs('behaviour',['Rate Behaviour','Rate Skills','Observations'],a=> a===2? FormCard('Observation Note',['Select Student \u25be*','Date*','Observation \u2014 Rich-text'],'Save Note',{icon:'star'}) : FormCard(a===0?'Rate Behaviour':'Rate Skills',['Select Class \u25be*','Select Student \u25be*','Trait \u25be','Rating \u25be (1\u20135)','Note'],'Save Rating',{icon:'star'})),
      behaviour_std:()=>Table(['Date','Domain','Trait','Rating'],[['16 Jun','Behaviour','Punctuality',Stars(5)],['16 Jun','Behaviour','Teamwork',Stars(4)],['10 Jun','Skills','Communication',Stars(5)]],{tools:['Reload']}),
      qpaper:()=>Tabs('qpaper',['Question Bank','Build Paper'],a=> a===0? Table(['#','Subject','Chapter','Type','Marks','Actions'],[[1,'Mathematics','Algebra','MCQ',1,rowActions()],[2,'Science','Light','Short',3,rowActions()],[3,'English','Grammar','Long',5,rowActions()]],{tools:['+ Add Question','Reload','Search']}) : FormCard('Create Question Paper',['Select Class \u25be*','Subject \u25be*','Chapters \u25be','Total Marks*','Duration (min)*'],'Generate Paper',{icon:'clipboard'})),

      addexam:()=>h('div',null,FormCard('Create New Exam',['Examination Name*','Start Date*','End Date*'],'Save Exam',{icon:'clipboard'}),h('div',{style:{height:16}}),Table(['Exam Name','Start','End','Status','Actions'],[['Half-Yearly 2026','01 Sep','12 Sep',Pill('Scheduled','info'),rowActions(['eye'])],['Unit Test 1','08 Jul','10 Jul',Pill('Published','ok'),rowActions(['eye'])]],{tools:['Reload']})),
      exammarks:()=>MarksEntry(),
      resultcard:()=>Tabs('resultcard',['Student Wise','Class Wise'],a=> h('div',null,FormCard('Generate Result Card',a===0?['Select Exam \u25be*','Search Student*']:['Select Exam \u25be*','Select Class \u25be*'],'Generate',{icon:'award'}),h('div',{style:{height:16}}),ResultCard())),
      myresult:()=>h('div',null,FormCard('Select Exam',['Select Exam \u25be*'],'View Result',{icon:'award'}),h('div',{style:{height:16}}),ResultCard()),

      testmarks:()=>h('div',null,FormCard('Add / Update Test Marks',['Select Class \u25be*','Subject \u25be*','Test Date*','Max Marks*'],'Load Sheet',{icon:'award'})),
      testresult:()=>h('div',null, collapsible('examViz','Grade distribution & subject pass %','award','Histogram of grades and subject-wise pass rate for the class',ExamCharts), Tabs('testresult',['Class-wise','By Subject','Performance'],a=> a===2? Card({title:'Class Performance',icon:'chart'},LineChart([62,68,71,74,79,82].map(x=>x*100),[58,60,64,66,70,73].map(x=>x*100),['T1','T2','T3','T4','T5','T6'])) : FormCard('View Test Result',['Select Class \u25be*','Subject \u25be'],'Show',{icon:'award'}))),
      mytest:()=>Table(['Date','Subject','Obtained','Total'],[['14 Jun','Mathematics',18,20],['10 Jun','Science',24,25],['06 Jun','English',17,20]],{tools:['Reload']}),

      rptcard:()=>Search('Generate Students Report Card','Search Student','chart'),
      rptinfo:()=>Table(['Sr','Reg #','Student','Father','Class','Discount','Gender','Status'],S.students.slice(0,7).map((s,i)=>[i+1,s[0],s[1],s[2],s[3],i%3===0?'10%':'\u2014',i%2?'F':'M',Pill('Active','ok')]),{tools:['Select Class','Reload']}),
      rptparent:()=>Table(['Sr','Student','Class','Father','Mobile','Occupation'],S.students.slice(0,7).map((s,i)=>[i+1,s[1],s[3],s[2],s[5],['Engineer','Doctor','Business','Teacher','Lawyer'][i%5]]),{tools:['Select Class','Reload']}),
      myreport:()=>Card({title:'Progress Report Card',icon:'chart',right:Btn('Download PDF',{variant:'soft',sm:true,icon:'download'})},h('div',{style:{padding:'10px 0'}},ResultCardInner())),

      cert:()=>Split(FormCard('Generate Certificate',['Select Template \u25be*','Recipient \u25be*','Reason','Issue Date*'],'Generate Certificate',{icon:'badge'}),CertPreview()),
      mycert:()=>Table(['#','Certificate','Reason','Date','Download'],[[1,'Bonafide Certificate','Passport','12 Jun 2026',h('button',{style:dlBtn()},ic('download',15))],[2,'Character Certificate','Transfer','02 May 2026',h('button',{style:dlBtn()},ic('download',15))]],{tools:['Reload']}),

      messaging:()=>{
        const msgs=(S.messages||[]).slice().reverse();
        const recipients=['Class Teacher','Principal','Admin Office','Accounts Department'].concat((teachers||[]).map(t=>t.name+' \u00b7 '+t.subj));
        const fmtAt=iso=>{ try{ const d=new Date(iso); return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short'})+' \u00b7 '+d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}); }catch(e){ return ''; } };
        const send=()=>{ const toEl=document.getElementById('msg_to'), txtEl=document.getElementById('msg_text');
          const to=toEl?(toEl.value||''):'', text=txtEl?(txtEl.value||'').trim():'';
          if(!to){ toast('Please choose a recipient','dng'); return; }
          if(!text){ toast('Please type a message','dng'); return; }
          this.setState(st=>({messages:[...(st.messages||[]),{to,text,at:new Date().toISOString(),from:'me'}]}),()=>{ const t2=document.getElementById('msg_text'); if(t2){ t2.value=''; t2.focus(); } toast('Message sent','ok'); }); };
        const selSty={width:'100%',fontSize:13.5,color:C.ink,border:'1px solid '+C.line,borderRadius:9,background:'#fff',outline:'none',padding:'0 34px 0 12px',height:40,appearance:'none',cursor:'pointer'};
        const recSel=h('div',{style:{position:'relative'}},
          h('select',{id:'msg_to',defaultValue:'',style:selSty},
            [h('option',{key:'_',value:''},'Select recipient\u2026')].concat(recipients.map((r,i)=>h('option',{key:i,value:r},r)))),
          h('span',{style:{position:'absolute',right:11,top:11,color:C.mut2,pointerEvents:'none'}},ic('chevD',16)));
        const convo=msgs.length
          ? h('div',{style:{display:'flex',flexDirection:'column',maxHeight:560,overflowY:'auto'}},
              msgs.map((m,i)=>h('div',{key:i,style:{padding:'13px 18px',borderBottom:i<msgs.length-1?'1px solid '+C.line2:0}},
                h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,marginBottom:6}},
                  h('div',{style:{display:'flex',alignItems:'center',gap:9,minWidth:0}},
                    h('span',{style:{width:30,height:30,borderRadius:30,background:tint,color:accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flex:'none'}},String(m.to||'?').slice(0,1).toUpperCase()),
                    h('div',{style:{minWidth:0}},
                      h('div',{style:{fontSize:13.5,fontWeight:700,color:C.ink2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}},m.to),
                      h('div',{style:{fontSize:11,color:C.mut}},'Sent by you'))),
                  h('span',{style:{fontSize:11.5,color:C.mut,whiteSpace:'nowrap',flex:'none'}},fmtAt(m.at))),
                h('div',{style:{fontSize:13,color:C.ink,lineHeight:1.55,whiteSpace:'pre-wrap',wordBreak:'break-word'}},m.text))))
          : EmptyRow({icon:'message',title:'Stay connected',line:'Start a conversation with teachers, parents or staff.'});
        return Split(
          Card({title:'Conversations',icon:'message',sub:msgs.length?(msgs.length+' message'+(msgs.length>1?'s':'')):null,flush:true},convo),
          Card({title:'New Message',icon:'plus'},h('div',{style:{display:'flex',flexDirection:'column',gap:12}},recSel,ctrl('Message \u2014 type here','msg_text'),Btn('Send',{icon:'check',onClick:send}),h('div',{style:{fontSize:11.5,color:C.mut}},'\u{1f512} End-to-end encrypted'))));
      },
      liveclass:()=>Split(FormCard('Host a Meeting',['Meeting Title*','Meeting With \u25be*','Schedule Date','Message'],'Create & Join',{icon:'video'}),Card({title:'My Meetings',icon:'video',flush:true},Tabs('lc',['Today','Upcoming'],a=>EmptyRow({icon:'video',title:'No meetings found',line:'Scheduled classes will appear here.'})))),
      liveclass_std:()=>Card({title:'My Live Classes',icon:'video',flush:true},Tabs('lcs',['Today','Upcoming','All'],a=>EmptyRow({icon:'video',title:'No live classes',line:'Your teacher will invite you here.'}))),
      smsgw:()=>Card({title:'SMS Gateway Setup',icon:'phone',right:Pill('Pro','acc')},h('div',{style:{display:'flex',flexDirection:'column',gap:14,maxWidth:520}},h('div',{style:{fontSize:13.5,color:C.mut,lineHeight:1.6}},'Turn an Android phone into a free SMS gateway to send fee reminders, attendance alerts and notices directly to parents.'),Btn('Start Setup',{icon:'phone'}))),
      staffleave:()=>StaffLeave()
    };

    // === dashboard / page helpers (balanced) ===
    // ===================== INTERACTIVE VIZ LAYER (ApexCharts, live-store) =====================
    // Every series below is derived from the live store; formulas noted per block.
    const PAL={navy:'#5B47E0',gold:'#0E9488',coral:'#E2495B',blue:'#2563EB',amber:'#D97706',lilac:'#8A7BB8',slate:'#5B6B7D'};
    const RANGE_MONTHS={month:6,term:4,year:12};
    const moAll=['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
    const nMo=RANGE_MONTHS[S.range]||6; const moLabels=moAll.slice(12-nMo);
    // live fee figures — reconcile exactly with KPI tiles + 'Estimated Fee' block
    const liveCollected=Object.values(S.fees).reduce((a,b)=>a+b,0);                 // ₹ collected this session
    const liveOutstanding=S.students.reduce((a,s)=>a+dueOf(s[0]),0);             // ₹ still due now
    const billPerMo=[24,25,26,25,27,28,26,29,27,30,28,31].map(x=>x*100000);         // seeded gross billed/month (demo baseline)
    // monthly {collected,overdue,pending}; LAST month reconciles to the live store
    const feeMonths=moLabels.map((m,idx,arr)=>{ const gi=12-nMo+idx; const billed=billPerMo[gi];
      if(idx===arr.length-1){ const overdue=TODAY>DUEDATE?liveOutstanding:0; return {m,collected:liveCollected,overdue,pending:Math.max(0,liveOutstanding-overdue)}; }
      const collected=Math.round(billed*0.90), overdue=Math.round(billed*0.045); return {m,collected,overdue,pending:billed-collected-overdue}; });
    // current strength by class from the LIVE secStrength map (changes on enroll/withdraw)
    const VCLASSES=['VI','VII','VIII','IX','X'];
    const strength=VCLASSES.map(c=>({c,A:S.secStrength[c+'-A']||0,B:S.secStrength[c+'-B']||0,cap:this.SECTION_CAP*2}));
    const totalStrength=strength.reduce((a,x)=>a+x.A+x.B,0);
    // school-wide daily attendance %: 92 baseline ± sinusoid, deterministic dip @ day 18
    const attDays=Array.from({length:30},(_,i)=>{ let v=92+Math.round(3*Math.sin(i/2.4))-(i===17?9:0)+(i%7===5?-2:0); return Math.max(70,Math.min(99,v)); });
    const attMean=Math.round(attDays.reduce((a,b)=>a+b,0)/attDays.length);
    // fee-status counts (live, reconciles with feeStatus())
    const fc={Paid:0,Partial:0,Overdue:0,Due:0};
    S.students.forEach(s=>{ const d=dueOf(s[0]); const paid=S.fees[s[0]]||0; if(d<=0)fc.Paid++; else if(paid>0)fc.Partial++; else if(TODAY>DUEDATE)fc.Overdue++; else fc.Due++; });
    // gender mix sampled from the seeded roster (i%2)
    let gMale=0,gFemale=0; S.students.forEach((s,i)=>i%2?gFemale++:gMale++);
    // 12-pt KPI sparklines (deterministic demo trends ending near the live value)
    const spk=(end,amp,n)=>Array.from({length:n||12},(_,i)=>Math.round(end-amp+amp*(i/(n-1||1))+amp*0.25*Math.sin(i)));
    const VIZD={feeMonths,strength,attDays,attMean,fc,gMale,gFemale,liveCollected,liveOutstanding,totalStrength};

    const openDrill=(type,i,s)=>this.setState({drill:{type,i:i==null?0:i,s:s==null?0:s}});
    const closeDrill=()=>this.setState({drill:null});
    const evts=type=>({chart:{events:{dataPointSelection:(e,ctx,cfg)=>openDrill(type,cfg.dataPointIndex,cfg.seriesIndex)}}});
    const toggleTbl=id=>this.setState(st=>({dataTbl:{...st.dataTbl,[id]:!st.dataTbl[id]}}));

    // chart card with a11y 'View data' disclosure (reveals an accessible table of the same numbers)
    const chartCard=(o,chartEl,tableEl)=>{ const id=o.id; const showTbl=S.dataTbl[id];
      return Card({title:o.title,icon:o.icon,sub:o.sub,right:h('button',{onClick:()=>toggleTbl(id),'aria-label':'Toggle data table',style:{display:'inline-flex',alignItems:'center',gap:5,fontSize:11.5,fontWeight:700,color:showTbl?accent:C.mut,background:showTbl?tint:'#F4F6F8',border:'1px solid '+(showTbl?accent+'44':C.line2),borderRadius:7,padding:'5px 10px',cursor:'pointer'}},ic(showTbl?'chart':'list',13),showTbl?'Chart':'View data')},
        h('div',{role:'img','aria-label':o.aria||o.title, style:{display:showTbl?'none':'block'}}, chartEl),
        showTbl&&h('div',{style:{overflowX:'auto'}}, tableEl)); };
    const miniTable=(cols,rows)=>h('table',{style:{width:'100%',borderCollapse:'collapse',fontSize:12.5}}, h('thead',null,h('tr',null,cols.map((c,i)=>h('th',{key:i,style:{textAlign:i?'right':'left',padding:'7px 8px',fontSize:10.5,fontWeight:700,letterSpacing:.3,textTransform:'uppercase',color:C.mut,borderBottom:'1px solid '+C.line}},c)))), h('tbody',null,rows.map((r,ri)=>h('tr',{key:ri,style:{borderBottom:'1px solid '+C.line2}},r.map((cell,ci)=>h('td',{key:ci,style:{padding:'7px 8px',textAlign:ci?'right':'left',fontWeight:ci?600:500,color:ci?C.ink2:C.ink,fontVariantNumeric:'tabular-nums'}},cell))))));

    // KPI gradient tile + sparkline + delta + click-to-drill
    const kpiTile=(g)=>h('button',{onClick:()=>openDrill('kpi',g.key),style:{textAlign:'left',border:0,borderRadius:16,padding:'17px 19px',background:g.grad,color:'#fff',boxShadow:'0 10px 22px '+g.shadow+'40',cursor:'pointer',display:'flex',flexDirection:'column',gap:0}},
      h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between'}}, h('span',{style:{fontSize:13.5,fontWeight:700}},g.label), h('span',{style:{width:34,height:34,borderRadius:10,background:'rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center'}},ic(g.icon,17,'#fff'))),
      h('div',{style:{fontSize:28,fontWeight:800,letterSpacing:-.6,marginTop:8,fontVariantNumeric:'tabular-nums'}},g.value),
      h('div',{style:{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginTop:8,gap:10}},
        h('span',{style:{display:'inline-flex',alignItems:'center',gap:4,fontSize:12,fontWeight:700,background:'rgba(255,255,255,.18)',borderRadius:20,padding:'2px 8px'}}, (g.down?'▾ ':'▴ ')+g.delta+'%'),
        h('span',{style:{opacity:.95}},spark(g.spark,'rgba(255,255,255,.92)',96,30))));
    const RangeCtl=()=>h('div',{style:{display:'flex',gap:5,background:'#fff',border:'1px solid '+C.line,borderRadius:10,padding:4}}, [['month','This Month'],['term','Term'],['year','Year']].map(r=>h('button',{key:r[0],onClick:()=>this.setState({range:r[0]}),style:{padding:'6px 13px',borderRadius:7,border:0,cursor:'pointer',fontSize:12.5,fontWeight:600,background:S.range===r[0]?accent:'transparent',color:S.range===r[0]?'#fff':C.mut,transition:'all .15s'}},r[1])));

    // ---- reusable drill slide-over ----
    const drillRow=(label,val,tone)=>h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid '+C.line2}}, h('span',{style:{fontSize:13,color:C.ink2,fontWeight:600}},label), tone?Pill(val,tone):h('span',{style:{fontSize:13,fontWeight:700,fontVariantNumeric:'tabular-nums'}},val));
    const drillContent=()=>{ const d=S.drill; if(!d) return {title:'',body:null};
      if(d.type==='feeMonth'){ const fm=feeMonths[d.i]||feeMonths[feeMonths.length-1]; const defs=S.students.filter(s=>dueOf(s[0])>0);
        return {title:'Fees · '+fm.m,sub:'Collected '+rupee(fm.collected)+' · outstanding '+rupee(fm.pending+fm.overdue),
          chart:chartBox('drillFeeMonth','donut',[fm.collected,fm.pending,fm.overdue],{labels:['Collected','Pending','Overdue'],colors:[PAL.gold,PAL.amber,PAL.coral],legend:{position:'bottom'}},230),
          body:h('div',null, h('div',{style:{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:.4,color:C.mut,margin:'8px 0 4px'}},'Outstanding this month'), defs.length?defs.map((s,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid '+C.line2}}, AvatarMini(s[1]), h('div',{style:{flex:1,minWidth:0}}, h('div',{style:{fontSize:13,fontWeight:600,color:C.ink2}},s[1]), h('div',{style:{fontSize:11.5,color:C.mut}},'Class '+s[3]+' · '+rupee(dueOf(s[0]))+' due')), h('button',{onClick:()=>{closeDrill();openStudent(s[0]);},style:{...dlBtn(),color:accent}},ic('eye',15)))):h('div',{style:{fontSize:13,color:C.mut2,padding:'14px 0'}},'No outstanding dues — fully collected.'))}; }
      if(d.type==='strengthClass'){ const c=strength[d.i]||strength[0]; const tot=c.A+c.B; const left=c.cap-tot;
        return {title:'Class '+c.c+' · strength',sub:tot+' students · '+left+' seats left of '+c.cap,
          chart:chartBox('drillStr','bar',[{name:'Students',data:[c.A,c.B]}],{xaxis:{categories:[c.c+'-A',c.c+'-B']},colors:[accent],plotOptions:{bar:{horizontal:true,columnWidth:'45%'}}},200),
          body:h('div',null, drillRow('Section '+c.c+'-A',c.A+' / '+this.SECTION_CAP), drillRow('Section '+c.c+'-B',c.B+' / '+this.SECTION_CAP), drillRow('Seats remaining',String(left), left>0?'ok':'dng'), h('div',{style:{marginTop:14}},Btn('Open Admissions',{sm:true,variant:'soft',icon:'up',onClick:()=>{closeDrill();setPage2('admission');}})))}; }
      if(d.type==='attDay'){ const day=d.i+1; const cls=['VI-A','VII-A','VIII-A','IX-A','X-A']; const vals=cls.map((c,i)=>Math.max(72,Math.min(99,attDays[d.i]+(i%2?2:-3)+(i-2))));
        return {title:'Attendance · day '+day,sub:'School-wide '+attDays[d.i]+'% · threshold 75%',
          chart:chartBox('drillAtt','bar',[{name:'Attendance %',data:vals}],{xaxis:{categories:cls},colors:[PAL.blue],yaxis:{max:100}},210),
          body:h('div',null, cls.map((c,i)=>drillRow('Class '+c, vals[i]+'%', vals[i]<75?'dng':'ok')))}; }
      if(d.type==='feeStatus'){ const key=['Paid','Partial','Overdue','Due'][d.i]||'Paid'; const match=S.students.filter(s=>{ const dd=dueOf(s[0]); const paid=S.fees[s[0]]||0; const st=dd<=0?'Paid':(paid>0?'Partial':(TODAY>DUEDATE?'Overdue':'Due')); return st===key; });
        return {title:'Fee status · '+key,sub:match.length+' student(s)',
          body:h('div',null, match.length?match.map((s,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid '+C.line2}}, AvatarMini(s[1]), h('div',{style:{flex:1}}, h('div',{style:{fontSize:13,fontWeight:600,color:C.ink2}},s[1]), h('div',{style:{fontSize:11.5,color:C.mut}},'Class '+s[3]+(dueOf(s[0])>0?' · '+rupee(dueOf(s[0]))+' due':' · cleared'))), dueOf(s[0])>0&&h('button',{onClick:()=>{closeDrill();openCollect(s[0]);},style:{...dlBtn(),color:accent}},ic('coins',15)))):h('div',{style:{fontSize:13,color:C.mut2,padding:'14px 0'}},'No students in this status.'))}; }
      if(d.type==='genderDonut'){ const isM=d.i===0; const list=S.students.filter((s,i)=>isM?i%2===0:i%2===1);
        return {title:(isM?'Male':'Female')+' students',sub:list.length+' of '+S.students.length+' (sampled roster)',
          body:h('div',null, list.map((s,i)=>drillRow(s[1],'Class '+s[3])))}; }
      if(d.type==='subjectMarks'){ const subs=[['English',88],['Maths',76],['Science',92],['Social',81],['Hindi',79],['Computer',95]]; const s=subs[d.i]||subs[0];
        return {title:s[0]+' · my marks',sub:'across recent assessments',chart:chartBox('drillSub','line',[{name:s[0],data:[s[1]-12,s[1]-6,s[1]-3,s[1]]}],{xaxis:{categories:['UT1','Mid','UT2','Term']},colors:[accent],yaxis:{max:100}},210),body:miniTable(['Assessment','Score'],[['Unit Test 1',(s[1]-12)+'%'],['Mid-term',(s[1]-6)+'%'],['Unit Test 2',(s[1]-3)+'%'],['Term',s[1]+'%']])}; }
      if(d.type==='sectionAtt'){ const secs=['VIII-A','VIII-B']; const sec=secs[d.i]||secs[0]; const studs=this.CLASS_STD.map(x=>({reg:x[0],name:x[1],pct:attPct(x[0])}));
        return {title:sec+' · attendance',sub:'student-level, flags < 75%',body:h('div',null, studs.map((st,i)=>drillRow(st.name, st.pct+'%', st.pct<75?'dng':'ok')))}; }
      if(d.type==='hwSection'){ const secs=['VIII-A','VIII-B','IX-A']; const sec=secs[d.i]||secs[0];
        return {title:sec+' · homework',sub:'assigned → submitted → graded',chart:chartBox('drillHw','donut',[12,9,7],{labels:['Assigned','Submitted','Graded'],colors:[PAL.slate,PAL.blue,PAL.gold],legend:{position:'bottom'}},210),body:miniTable(['Stage','Count'],[['Assigned','12'],['Submitted','9'],['Graded','7']])}; }
      if(d.type==='finMonth'){ const inc=feeMonths[d.i].collected; const exp=Math.round(inc*0.78); return {title:'Finance \u00b7 '+feeMonths[d.i].m,sub:'income '+rupee(inc)+' \u00b7 expense '+rupee(exp),chart:chartBox('drillFin','donut',[Math.round(inc*0.62),Math.round(inc*0.14),Math.round(inc*0.10),Math.round(inc*0.14)],{labels:['Tuition','Transport','Lab','Other'],colors:[accent,PAL.gold,PAL.blue,PAL.lilac],legend:{position:'bottom'}},220),body:miniTable(['Line','Amount'],[['Income',rupee(inc)],['Expense',rupee(exp)],['Net',rupee(inc-exp)]])}; }
      // kpi tiles
      const KPI={students:{t:'Total Students',sub:'current enrolled strength by class',chart:chartBox('drillKpi','bar',[{name:'Students',data:strength.map(x=>x.A+x.B)}],{xaxis:{categories:VCLASSES.map(c=>'Grade '+c)},colors:[accent]},220),rows:strength.map(x=>['Grade '+x.c,String(x.A+x.B)])},
        employees:{t:'Total Employees',sub:'teaching staff by subject',chart:chartBox('drillKpi','bar',[{name:'Periods/wk',data:S.teachers.map(t=>Object.keys(S.tt).filter(k=>S.tt[k].tId===t.id).length)}],{xaxis:{categories:S.teachers.map(t=>t.subj)},colors:[PAL.gold]},220),rows:S.teachers.map(t=>[t.name,t.subj])},
        revenue:{t:'Revenue (MTD)',sub:'monthly collection trend',chart:chartBox('drillKpi','area',[{name:'Collected',data:feeMonths.map(f=>f.collected)}],{xaxis:{categories:feeMonths.map(f=>f.m)},colors:[PAL.gold]},220),rows:feeMonths.map(f=>[f.m,rupee(f.collected)])},
        profit:{t:'Total Profit (MTD)',sub:'income vs expense, last 6 months',chart:chartBox('drillKpi','area',[{name:'Income',data:feeMonths.map(f=>f.collected)},{name:'Expense',data:feeMonths.map(f=>Math.round(f.collected*0.78))}],{xaxis:{categories:feeMonths.map(f=>f.m)},colors:[accent,PAL.coral]},220),rows:feeMonths.map(f=>[f.m,rupee(f.collected-Math.round(f.collected*0.78))])}}[d.type==='kpi'?d.s||'students':''];
      const k=KPI||{t:'Detail',sub:'',rows:[]};
      return {title:k.t,sub:k.sub,chart:k.chart,body:k.rows?miniTable(['Item','Value'],k.rows):null}; };
    const drillEl=()=>{ if(!S.drill) return null; const c=drillContent(); return h('div',{style:{position:'fixed',inset:0,zIndex:320,display:'flex',justifyContent:'flex-end'},onClick:closeDrill},
      h('div',{style:{position:'absolute',inset:0,background:'rgba(16,20,31,.4)'}}),
      h('div',{onClick:e=>e.stopPropagation(),style:{position:'relative',width:'min(440px,94vw)',height:'100%',background:'#fff',boxShadow:'-12px 0 40px rgba(16,20,31,.2)',display:'flex',flexDirection:'column',animation:'slideIn .22s cubic-bezier(.2,.7,.3,1)'}},
        h('div',{style:{display:'flex',alignItems:'flex-start',gap:12,padding:'18px 20px',borderBottom:'1px solid '+C.line2}}, h('div',{style:{flex:1}}, h('div',{style:{fontSize:16.5,fontWeight:800,color:C.ink2}},c.title), c.sub&&h('div',{style:{fontSize:12.5,color:C.mut,marginTop:3}},c.sub)), h('button',{onClick:closeDrill,style:{width:32,height:32,borderRadius:9,border:0,background:'#F4F6F8',color:C.mut,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}},ic('x',17))),
        h('div',{style:{flex:1,overflowY:'auto',padding:'16px 20px'}}, c.chart&&h('div',{style:{marginBottom:12}},c.chart), c.body))); };

    const AdminDash=()=>{
      const tiles=h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginBottom:16}}, [
        {label:'Total Students',value:VIZD.totalStrength.toLocaleString('en-IN'),delta:4.2,down:false,icon:'grad',grad:'linear-gradient(135deg,#5B47E0,#6F5BE8)',shadow:'#5B47E0',spark:spk(VIZD.totalStrength,40),key:'students'},
        {label:'Total Employees',value:String(S.teachers.length+(S.staffAdded||[]).length),delta:1.1,down:false,icon:'briefcase',grad:'linear-gradient(135deg,#9A8CE8,#B0A4F0)',shadow:'#9A8CE8',spark:spk(S.teachers.length,3),key:'employees'},
        {label:'Revenue (MTD)',value:liveCollected>0?rupee(liveCollected):'₹28.4L',delta:8.6,down:false,icon:'coins',grad:'linear-gradient(135deg,#F2728C,#F58AA0)',shadow:'#F2728C',spark:spk(28,6),key:'revenue'},
        {label:'Total Profit (MTD)',value:'₹6.1L',delta:3.4,down:false,icon:'chart',grad:'linear-gradient(135deg,#5B8DEF,#74A0F2)',shadow:'#5B8DEF',spark:spk(6,2),key:'profit'}
      ].map((g,i)=>h('div',{key:i},kpiTile(g))));
      const welcome=h('div',{style:{display:'flex',alignItems:'center',gap:18,background:'#FDECEF',borderRadius:16,padding:'16px 22px',marginBottom:16}}, h('div',{style:{flex:1}}, h('div',{style:{fontWeight:800,fontSize:16,color:'#E2495B',marginBottom:5}},'Welcome to Admin Dashboard'), h('div',{style:{fontSize:13,color:C.mut,lineHeight:1.55}},'Your account is not verified yet. ', h('span',{style:{color:accent,fontWeight:700,cursor:'pointer'}},'Verify now!'))), h('div',{style:{width:104,height:74,borderRadius:12,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',color:'#E2495B',flex:'none'}},ic('user',36)));
      const filterRow=h('div',{style:{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',marginBottom:16}}, h('div',{style:{fontSize:13,fontWeight:700,color:C.ink2}},'Overview'), h('div',{style:{flex:1}}), h('span',{style:{fontSize:12,color:C.mut2,fontWeight:600}},'Click any chart element to drill in'), RangeCtl());
      // 1. Fee Collection vs Outstanding — stacked bar (live store; last bar reconciles to fee engine)
      const feeChart=chartCard({id:'admFee',title:'Fee Collection vs Outstanding',icon:'receipt',sub:'₹ by month',aria:'Stacked bar of collected, pending and overdue fees per month'},
        chartBox('admFee','bar',[{name:'Collected',data:feeMonths.map(f=>f.collected)},{name:'Pending',data:feeMonths.map(f=>f.pending)},{name:'Overdue',data:feeMonths.map(f=>f.overdue)}],
          Object.assign({chart:{stacked:true,events:{dataPointSelection:(e,ctx,cfg)=>openDrill('feeMonth',cfg.dataPointIndex)}},xaxis:{categories:feeMonths.map(f=>f.m)},colors:[PAL.gold,PAL.amber,PAL.coral],legend:{position:'top',horizontalAlign:'right'},yaxis:{labels:{formatter:v=>'₹'+Math.round(v/100000)+'L'}}}),250),
        miniTable(['Month','Collected','Pending','Overdue'],feeMonths.map(f=>[f.m,rupee(f.collected),rupee(f.pending),rupee(f.overdue)])));
      // 2. Student Strength by Class — horizontal stacked bar (live secStrength) + capacity note
      const strengthChart=chartCard({id:'admStr',title:'Student Strength by Class',icon:'grad',sub:'sections stacked · '+VIZD.totalStrength+' total',aria:'Horizontal stacked bar of student strength per class by section'},
        chartBox('admStr','bar',[{name:'Section A',data:strength.map(x=>x.A)},{name:'Section B',data:strength.map(x=>x.B)}],
          {chart:{stacked:true,events:{dataPointSelection:(e,ctx,cfg)=>openDrill('strengthClass',cfg.dataPointIndex)}},plotOptions:{bar:{horizontal:true,columnWidth:'58%'}},xaxis:{categories:VCLASSES.map(c=>'Grade '+c)},colors:[accent,PAL.lilac],legend:{position:'top',horizontalAlign:'right'}},250),
        miniTable(['Class','Sec A','Sec B','Capacity'],strength.map(x=>['Grade '+x.c,String(x.A),String(x.B),String(x.cap)])));
      // 3. Attendance Trend — line, 30 days, 75% threshold reference
      const attChart=chartCard({id:'admAtt',title:'Attendance Trend',icon:'calcheck',sub:'school-wide % · last 30 days · avg '+attMean+'%',aria:'Line chart of daily school-wide attendance percentage over 30 days with a 75 percent threshold'},
        chartBox('admAtt','line',[{name:'Attendance %',data:attDays}],
          {chart:{events:{dataPointSelection:(e,ctx,cfg)=>openDrill('attDay',cfg.dataPointIndex)}},xaxis:{categories:attDays.map((_,i)=>i+1),tickAmount:6,labels:{formatter:v=>'D'+v}},yaxis:{min:60,max:100},colors:[PAL.blue],annotations:{yaxis:[{y:75,borderColor:PAL.coral,strokeDashArray:5,label:{text:'75% min',style:{color:'#fff',background:PAL.coral,fontSize:'10px'}}}]}},230),
        miniTable(['Day','%'],attDays.map((v,i)=>['Day '+(i+1),v+'%'])));
      // right-rail donuts (small) + live numbers
      const genderDonut=chartCard({id:'admGen',title:'Gender Mix',icon:'user',aria:'Donut of student gender mix'},
        chartBox('admGen','donut',[VIZD.gMale,VIZD.gFemale],Object.assign({labels:['Male','Female'],colors:[accent,PAL.coral],legend:{position:'bottom'}},evts('genderDonut')),210),
        miniTable(['Gender','Count'],[['Male',String(VIZD.gMale)],['Female',String(VIZD.gFemale)]]));
      const feeDonut=chartCard({id:'admFeeD',title:'Fee Status',icon:'receipt',aria:'Donut of fee status: paid, partial, overdue, due'},
        chartBox('admFeeD','donut',[fc.Paid,fc.Partial,fc.Overdue,fc.Due],Object.assign({labels:['Paid','Partial','Overdue','Due'],colors:[PAL.gold,PAL.amber,PAL.coral,PAL.slate],legend:{position:'bottom'}},evts('feeStatus')),210),
        miniTable(['Status','Count'],[['Paid',String(fc.Paid)],['Partial',String(fc.Partial)],['Overdue',String(fc.Overdue)],['Due',String(fc.Due)]]));
      const estimation=liveCollected+liveOutstanding;
      const estCard=Card({title:'Estimated Fee This Month'}, h('div',{style:{textAlign:'center',padding:'6px 0 16px'}}, h('div',{style:{display:'inline-flex',alignItems:'center',gap:6,color:'#E2495B',fontWeight:700,fontSize:13}},ic('refresh',15),'Estimation'), h('div',{style:{fontSize:30,fontWeight:800,color:'#E2495B',marginTop:6,fontVariantNumeric:'tabular-nums'}},rupee(estimation))), h('div',{style:{display:'flex',borderTop:'1px solid '+C.line2,paddingTop:14}}, h('div',{style:{flex:1,textAlign:'center'}}, h('div',{style:{fontSize:18,fontWeight:800,color:C.ink2,fontVariantNumeric:'tabular-nums'}},rupee(liveCollected)), h('div',{style:{fontSize:11.5,fontWeight:700,color:'#0E9488',marginTop:3}},'Collections')), h('div',{style:{flex:1,textAlign:'center',borderLeft:'1px solid '+C.line2}}, h('div',{style:{fontSize:18,fontWeight:800,color:C.ink2,fontVariantNumeric:'tabular-nums'}},rupee(liveOutstanding)), h('div',{style:{fontSize:11.5,fontWeight:700,color:'#E2495B',marginTop:3}},'Remainings'))));
      const sms=h('div',{style:{display:'flex',alignItems:'center',gap:14,background:'linear-gradient(135deg,#4E3DD2,#6F5BE8)',color:'#fff',borderRadius:16,padding:'16px 18px'}}, h('div',{style:{flex:1}}, h('div',{style:{fontWeight:800,fontSize:14.5}},'Free SMS Gateway'), h('div',{style:{fontSize:12,opacity:.88,marginTop:3}},'Send unlimited free SMS to parents.')), h('span',{style:{width:42,height:42,borderRadius:12,background:'rgba(255,255,255,.18)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}},ic('phone',22,'#fff')));
      const rail=h('div',{style:{display:'flex',flexDirection:'column',gap:16}}, genderDonut, feeDonut, estCard, sms);
      const mainCol=h('div',{style:{display:'flex',flexDirection:'column',gap:16}}, feeChart, strengthChart, attChart);
      return h('div',null, tiles, welcome, filterRow, Split(mainCol, rail, '1.9fr 1fr'));
    };
    const StudentDash=()=>{
      const tiles=h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:16}}, [
        {label:'Attendance %',value:'94%',delta:1.5,down:false,icon:'calcheck',grad:'linear-gradient(135deg,#5B8DEF,#74A0F2)',shadow:'#5B8DEF',spark:spk(94,5),key:'students'},
        {label:'Pending Homework',value:'3',delta:2,down:true,icon:'pencil',grad:'linear-gradient(135deg,#D9913F,#E8A95B)',shadow:'#D9913F',spark:spk(3,2),key:'employees'},
        {label:'Average %',value:'88%',delta:3.1,down:false,icon:'award',grad:'linear-gradient(135deg,#2F8F83,#46A89B)',shadow:'#2F8F83',spark:spk(88,6),key:'revenue'},
        {label:'Fees Due',value:liveOutstanding>0?rupee(0):'₹0',delta:0,down:false,icon:'receipt',grad:'linear-gradient(135deg,#5B47E0,#6F5BE8)',shadow:'#5B47E0',spark:spk(0,1),key:'profit'}
      ].map((g,i)=>h('div',{key:i},kpiTile(g))));
      const filterRow=h('div',{style:{display:'flex',alignItems:'center',gap:12,marginBottom:16}}, h('div',{style:{fontSize:13,fontWeight:700,color:C.ink2}},'My performance'), h('div',{style:{flex:1}}), RangeCtl());
      const attDonut=chartCard({id:'stdAtt',title:'My Attendance',icon:'calcheck',sub:'this term',aria:'Donut of my attendance: present, late, leave, absent'},
        chartBox('stdAtt','donut',[88,4,3,5],{labels:['Present','Late','Leave','Absent'],colors:[PAL.gold,PAL.amber,PAL.slate,PAL.coral],legend:{position:'bottom'}},220),
        miniTable(['State','%'],[['Present','88%'],['Late','4%'],['Leave','3%'],['Absent','5%']]));
      const marks=chartCard({id:'stdMarks',title:'My Marks vs Class Average',icon:'award',sub:'click a subject for history',aria:'Bar chart comparing my marks to class average per subject'},
        chartBox('stdMarks','bar',[{name:'Me',data:[88,76,92,81,79,95]},{name:'Class avg',data:[80,71,84,77,74,86]}],{chart:{events:{dataPointSelection:(e,ctx,cfg)=>openDrill('subjectMarks',cfg.dataPointIndex)}},xaxis:{categories:['Eng','Maths','Sci','Social','Hindi','Comp']},colors:[accent,PAL.slate],legend:{position:'top',horizontalAlign:'right'},yaxis:{max:100}},250),
        miniTable(['Subject','Me','Class'],[['English','88','80'],['Maths','76','71'],['Science','92','84'],['Social','81','77'],['Hindi','79','74'],['Computer','95','86']]));
      const trend=chartCard({id:'stdTrend',title:'Performance Trend',icon:'chart',sub:'overall % across exams · rank 3/32',aria:'Line chart of my overall percentage across exams'},
        chartBox('stdTrend','area',[{name:'Overall %',data:[72,78,81,85,88]}],{xaxis:{categories:['UT1','Mid','UT2','Pre-final','Term']},colors:[accent],yaxis:{max:100}},220),
        miniTable(['Exam','%'],[['Unit Test 1','72%'],['Mid-term','78%'],['Unit Test 2','81%'],['Pre-final','85%'],['Term','88%']]));
      const fees=chartCard({id:'stdFees',title:'My Fees by Term',icon:'receipt',aria:'Stacked bar of paid vs due fees by term'},
        chartBox('stdFees','bar',[{name:'Paid',data:[18000,18000,16000]},{name:'Due',data:[0,0,2000]}],{chart:{stacked:true},xaxis:{categories:['Term 1','Term 2','Term 3']},colors:[PAL.gold,PAL.coral],legend:{position:'top',horizontalAlign:'right'},yaxis:{labels:{formatter:v=>'₹'+Math.round(v/1000)+'k'}}},210),
        miniTable(['Term','Paid','Due'],[['Term 1','₹18,000','₹0'],['Term 2','₹18,000','₹0'],['Term 3','₹16,000','₹2,000']]));
      const ttRows=[['08:00','English','R-204',accent],['08:50','Mathematics','R-204','#0E9488'],['09:40','Science','Lab-2','#2563EB'],['10:45','Hindi','R-204','#DB2777']].map((p,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:13,padding:'9px 0',borderBottom:i<3?'1px solid '+C.line2:'none'}}, h('div',{style:{fontSize:12.5,fontWeight:700,color:C.mut,width:46,fontVariantNumeric:'tabular-nums'}},p[0]), h('span',{style:{width:4,alignSelf:'stretch',borderRadius:4,background:p[3]}}), h('div',{style:{flex:1,fontSize:13.5,fontWeight:600,color:C.ink2}},p[1]), h('span',{style:{fontSize:12,color:C.mut}},p[2])));
      const tt=Card({title:"Today's Timetable",icon:'calendar',sub:'Class VI-A'}, h('div',{style:{display:'flex',flexDirection:'column'}}, ttRows), Btn('Pay Fees',{sm:true,variant:'soft',icon:'card',onClick:()=>setPage2('payonline')}));
      const rail=h('div',{style:{display:'flex',flexDirection:'column',gap:16}}, attDonut, fees, tt);
      const mainCol=h('div',{style:{display:'flex',flexDirection:'column',gap:16}}, marks, trend);
      return h('div',null, tiles, filterRow, Split(mainCol, rail, '1.7fr 1fr'));
    };;
    const PayOnline=()=>{
      const ME='2026-0143';                                  // logged-in student ("me")
      const meStu=S.students.find(x=>x[0]===ME);
      const meName=meStu?meStu[1]:'Diya Patel', meClass=meStu?meStu[3]:'VI-A';
      const billed=baseDue(ME), bal=dueOf(ME), paidDisp=Math.max(0,billed-bal), fs=feeStatus(ME), cleared=bal<=0;
      const fmtToday=()=>{ try{ return new Date(TODAY+'T00:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); }catch(e){ return TODAY; } };
      const methodSel=h('div',{style:{position:'relative'}}, h('select',{id:'__poMethod',defaultValue:'UPI',style:{width:'100%',fontSize:13.5,color:C.ink,border:'1px solid '+C.line,borderRadius:9,background:'#fff',outline:'none',padding:'0 34px 0 12px',height:40,appearance:'none',cursor:'pointer'}}, ['UPI','Card','Net-banking'].map((m,i)=>h('option',{key:i,value:m},m))), h('span',{style:{position:'absolute',right:11,top:11,color:C.mut2,pointerEvents:'none'}},ic('chevD',16)));
      const onPay=()=>{ const el=document.getElementById('__poAmt'); const amt=Math.round(+(el?el.value:0)||0); const mEl=document.getElementById('__poMethod'); const method=mEl?mEl.value:'UPI'; if(collectFee(ME,amt)) this.setState({payRcpt:{amt:amt,method:method,date:fmtToday()}}); };  // same mechanism as Collect Fees
      const drow=(lab,val,o)=>{ o=o||{}; return h('tr',{style:{borderBottom:o.last?'none':'1px solid '+C.line2}}, h('td',{style:{padding:'11px 0',fontSize:13,fontWeight:o.bold?700:600,color:o.bold?C.ink2:C.ink}},lab), h('td',{style:{padding:'11px 0',fontSize:13.5,textAlign:'right',fontWeight:o.bold?800:700,fontVariantNumeric:'tabular-nums',color:o.tone||(o.bold?accent:C.ink2)}},val)); };
      const dues=Card({title:'Outstanding Dues',icon:'receipt'}, h('div',{style:{display:'flex',alignItems:'center',gap:12,marginBottom:14,paddingBottom:14,borderBottom:'1px solid '+C.line2}}, Avatar(meName,42), h('div',{style:{flex:1,minWidth:0}}, h('div',{style:{fontSize:14.5,fontWeight:700,color:C.ink2}},meName), h('div',{style:{fontSize:12,color:C.mut,marginTop:2}},'Reg '+ME+' \u00b7 Class '+meClass)), Pill(fs[0],fs[1])), h('div',{style:{overflowX:'auto'}}, h('table',{style:{width:'100%',borderCollapse:'collapse'}}, h('tbody',null, drow('Term Fee (Tuition + Transport)',rupee(billed)), drow('Paid to date',rupee(paidDisp),{tone:C.ok}), drow('Balance Due',rupee(bal),{bold:true,last:true})))));
      const payInner=cleared?h('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:9,padding:'18px 8px',textAlign:'center'}}, h('span',{style:{width:46,height:46,borderRadius:'50%',background:C.okBg,color:C.ok,display:'flex',alignItems:'center',justifyContent:'center'}},ic('check',22)), h('div',{style:{fontSize:14.5,fontWeight:700,color:C.ink2}},'All dues cleared'), h('div',{style:{fontSize:12.5,color:C.mut}},'You have no outstanding fees. Thank you!')):h('div',{style:{display:'flex',flexDirection:'column',gap:13}}, h('div',{style:{display:'flex',justifyContent:'space-between',padding:'12px 14px',background:tint,borderRadius:10}}, h('span',{style:{fontWeight:600,color:C.ink2}},'Total Payable'), h('span',{style:{fontWeight:800,color:accent,fontVariantNumeric:'tabular-nums'}},rupee(bal))), h('div',null, h('label',{style:{display:'block',fontSize:12.5,fontWeight:600,marginBottom:6}},'Payment Method'), methodSel), h('div',null, h('label',{style:{display:'block',fontSize:12.5,fontWeight:600,marginBottom:6}},'Amount to Pay (\u20b9)'), h('input',{id:'__poAmt',type:'number',min:1,max:bal,defaultValue:bal,style:{width:'100%',height:42,padding:'0 12px',border:'1px solid '+C.line,borderRadius:9,fontSize:15,fontWeight:700,outline:'none'}}), h('div',{style:{fontSize:11.5,color:C.mut,marginTop:7}},'Partial payments allowed \u00b7 overpayment is blocked.')), Btn('Pay '+rupee(bal),{icon:'card',onClick:onPay}), h('div',{style:{fontSize:11.5,color:C.mut,textAlign:'center'}},'Secured by gateway \u00b7 UPI / Card / Net-banking'));
      const pay=Card({title:'Pay Now',icon:'card'}, payInner);
      const rcpt=S.payRcpt; let receiptEl=null;
      if(rcpt){ const nb=dueOf(ME), nfs=feeStatus(ME), close=()=>this.setState({payRcpt:null});
        const rline=(lab,val,o)=>{ o=o||{}; return h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:o.last?'none':'1px solid '+C.line2}}, h('span',{style:{fontSize:13,color:C.mut,fontWeight:600}},lab), h('span',{style:{fontSize:13.5,fontWeight:700,color:o.tone||C.ink2,fontVariantNumeric:'tabular-nums'}},val)); };
        receiptEl=h('div',{style:{position:'fixed',inset:0,background:'rgba(16,20,31,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:310,padding:20},onClick:close}, h('div',{onClick:ev=>ev.stopPropagation(),style:{background:'#fff',borderRadius:16,maxWidth:420,width:'100%',boxShadow:'0 24px 60px rgba(16,20,31,.3)',overflow:'hidden'}}, h('div',{style:{padding:'22px 22px 18px',textAlign:'center',borderBottom:'1px solid '+C.line2}}, h('span',{style:{width:52,height:52,borderRadius:'50%',background:C.okBg,color:C.ok,display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:10}},ic('check',26)), h('div',{style:{fontWeight:800,fontSize:17,color:C.ink2}},'Payment Successful'), h('div',{style:{fontSize:13,color:C.mut,marginTop:3}},'Receipt for '+meName+' \u00b7 Reg '+ME)), h('div',{style:{padding:'8px 22px 4px'}}, rline('Amount Paid',rupee(rcpt.amt),{tone:C.ok}), rline('Payment Method',rcpt.method), rline('Date',rcpt.date), rline('New Balance',rupee(nb),{last:true})), h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,padding:'14px 22px',background:'#F8F9FB',borderTop:'1px solid '+C.line2}}, Pill(nfs[0],nfs[1]), Btn('Done',{sm:true,icon:'check',onClick:close}))));
      }
      return h('div',null, Split(dues,pay), receiptEl);
    };
    const HomeworkStd=()=>{
      const hwRows=[['18 Jun','Mathematics','Ex 7.2 Q1\u201310','due'],['18 Jun','Science','Read Ch.6','done'],['17 Jun','English','Essay "My City"','due']].map((r,i)=>h('tr',{key:i,style:{borderBottom:'1px solid '+C.line2}}, h('td',{style:{padding:'11px 0',fontSize:12.5,color:C.mut,width:54}},r[0]), h('td',{style:{padding:'11px 0',fontSize:13,fontWeight:600}},r[1]), h('td',{style:{padding:'11px 0',fontSize:12.5,color:C.mut}},r[2]), h('td',{style:{padding:'11px 0',textAlign:'right'}}, r[3]==='done'?Pill('Submitted','ok'):Pill('Pending','warn'))));
      const assigned=Card({title:'Assigned Homework',icon:'pencil'}, h('div',{style:{overflowX:'auto'}}, h('table',{style:{width:'100%',borderCollapse:'collapse'}}, h('tbody',null, hwRows))));
      const submit=Card({title:'Submit Work',icon:'download'}, h('div',{style:{display:'flex',flexDirection:'column',gap:12}}, ctrl('Select Homework \u25be*'), ctrl('Upload File'), Btn('Upload & Submit',{icon:'check'})));
      return Split(assigned,submit);
    };

    // helper sub-components used above
    const Avatar=(name,size)=>{ const init=name.split(' ').map(w=>w[0]).slice(0,2).join(''); const hue=(name.charCodeAt(0)*7+name.length*13)%360; return h('div',{style:{width:size,height:size,borderRadius:'50%',flex:'none',background:'hsl('+hue+',55%,92%)',color:'hsl('+hue+',45%,38%)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:size*0.36}},init); };
    const RoleDash=(role)=>{
      const t1=role==='coord'?['My Classes','3']:['My Class','VIII-A'];
      const stats=Stats([StatCard(t1[0],t1[1],{icon:'grad'}),StatCard('Today Absent','2',{icon:'x',tone:'dng'}),StatCard('Homework Due','4',{icon:'pencil',tone:'warn'}),StatCard('Avg Attendance','94%',{icon:'calcheck',tone:'ok'})]);
      const schedRows=[['08:00','VIII-A \u00b7 English','R-204',accent],['09:40','VIII-A \u00b7 English','R-204','#2563EB'],['10:45','VIII-B \u00b7 English','R-208','#0E9488'],['13:00','VIII-A \u00b7 Library','Lib','#7C3AED']].map((p,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:13,padding:'10px 0',borderBottom:i<3?'1px solid '+C.line2:'none'}}, h('div',{style:{fontSize:12.5,fontWeight:700,color:C.mut,width:46}},p[0]), h('span',{style:{width:4,alignSelf:'stretch',borderRadius:4,background:p[3]}}), h('div',{style:{flex:1,fontSize:13.5,fontWeight:600,color:C.ink2}},p[1]), h('span',{style:{fontSize:12,color:C.mut}},p[2])));
      const sched=Card({title:"Today's Schedule",icon:'calendar'}, h('div',{style:{display:'flex',flexDirection:'column'}}, schedRows));
      const qaCards=[['Mark Attendance','calcheck','markatt'],['Add Homework','pencil','homework'],['Enter Marks','clipboard','exammarks'],['Rate Behaviour','star','behaviour']].map((q,i)=>h('button',{key:i,onClick:()=>setPage2(q[2]),style:{display:'flex',flexDirection:'column',gap:9,alignItems:'flex-start',padding:'14px',border:'1px solid '+C.line,borderRadius:11,background:'#fff',cursor:'pointer',textAlign:'left'}}, h('span',{style:{width:34,height:34,borderRadius:9,background:tint,color:accent,display:'flex',alignItems:'center',justifyContent:'center'}}, ic(q[1],17)), h('span',{style:{fontSize:13,fontWeight:600,color:C.ink2}},q[0])));
      const qa=Card({title:'Quick Actions',icon:'grid'}, h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}, qaCards));
      return h('div',null, stats, Split(sched,qa));
    }
    const empRow=()=>h('div',{style:{display:'flex',gap:6,justifyContent:'flex-end'}},h('button',{title:'View',style:{width:30,height:30,borderRadius:8,border:'1px solid '+C.line,background:'#fff',color:C.mut,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},ic('eye',15)),h('button',{title:'Delete',onClick:()=>tryDelete('teacher','Dimpu Sharma'),style:{width:30,height:30,borderRadius:8,border:'1px solid '+C.line,background:'#fff',color:C.dng,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},ic('trash',15)));
    const rowActions=(kinds,o)=>{ kinds=kinds||['eye','trash']; o=o||{};
      const act=k=>{ if(o[k]) return o[k]();
        if(k==='trash') return ask({title:'Remove this record?',msg:'This removes the row from the list. Records referenced elsewhere stay protected by the delete-guards.',cta:'Remove',danger:true,onYes:()=>toast('Record removed','ok')});
        if(k==='key') return toast('Login reset · a temporary password was issued','ok');
        if(k==='pencil') return toast('Edit form opened','info');
        return toast('Opening record…','info'); };
      return h('div',{style:{display:'flex',gap:6,justifyContent:'flex-end'}},kinds.map((k,i)=>h('button',{key:i,title:k,onClick:()=>act(k),style:{width:30,height:30,borderRadius:8,border:'1px solid '+C.line,background:'#fff',color:k==='trash'?C.dng:C.mut,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},ic(k,15)))); };
    const Stars=(n)=>h('div',{style:{display:'flex',gap:2}},Array.from({length:5}).map((_,i)=>h('span',{key:i,style:{color:i<n?'#F5A623':'#E2E5EA',display:'flex'}},ic('star',15,i<n?'#F5A623':'#E2E5EA'))));
    const IDCard=(s,style)=>{ const init=s[1].split(' ').map(w=>w[0]).slice(0,2).join(''); return h('div',{style:{borderRadius:14,overflow:'hidden',border:'1px solid '+C.line,boxShadow:'0 2px 8px rgba(20,30,55,.06)'}},h('div',{style:{background:style%2?accent:'linear-gradient(135deg,'+accent+','+accent+'cc)',color:'#fff',padding:'12px 14px',display:'flex',alignItems:'center',gap:9}},h('div',{style:{width:26,height:26,borderRadius:7,background:'rgba(255,255,255,.25)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13}},'G'),h('div',{style:{fontSize:11.5,fontWeight:700,lineHeight:1.2}},'Greenfield International',h('div',{style:{fontWeight:500,opacity:.85,fontSize:10}},'Student Identity Card'))),h('div',{style:{padding:'16px 14px',display:'flex',gap:13,alignItems:'center'}},h('div',{style:{width:58,height:58,borderRadius:12,background:tint,color:accent,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:20,flex:'none'}},init),h('div',null,h('div',{style:{fontWeight:700,fontSize:14,color:C.ink2}},s[1]),h('div',{style:{fontSize:12,color:C.mut,marginTop:3}},'Reg '+s[0]),h('div',{style:{fontSize:12,color:C.mut}},'Class '+s[3]))),h('div',{style:{padding:'8px 14px',background:'#F8F9FB',fontSize:10.5,color:C.mut2,display:'flex',justifyContent:'space-between'}},h('span',null,'Valid 2025-26'),h('span',null,s[5]))); };
    const MarkAttendance=()=>{
      const date=S.attDate, future=isFuture(date);
      const dayIdx=(new Date(date+'T00:00:00').getDay()+6)%7;
      const rec=S.attByDate[date]||{}, locked=!!rec._locked;
      const uncovered=Object.keys(S.tt).filter(k=>{ return (+k.split('_')[0])===dayIdx && onLeave(S.tt[k].tId) && !S.subs[k]; }).length;
      const list=this.CLASS_STD;
      const present=list.filter(s=>rec[s[0]]==='P').length, absent=list.filter(s=>rec[s[0]]==='A').length, late=list.filter(s=>rec[s[0]]==='L').length, unmarked=list.length-present-absent-late;
      const dateInput=h('input',{type:'date',value:date,max:TODAY,onChange:ev=>setAttDate(ev.target.value),style:{height:38,padding:'0 11px',border:'1px solid '+C.line,borderRadius:9,fontSize:13}});
      const head=h('div',{style:{display:'flex',gap:12,flexWrap:'wrap',marginBottom:14,alignItems:'center'}}, h('div',{style:{display:'flex',gap:10}}, dateInput, ctrlMini('Class VIII-A','select')), h('div',{style:{flex:1}}), locked&&Pill('Locked','neu'), h('div',{style:{display:'flex',gap:8}}, [['Present',present,C.ok],['Absent',absent,C.dng],['Late',late,C.warn]].map((x,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:7,padding:'7px 12px',borderRadius:9,background:'#fff',border:'1px solid '+C.line}}, h('span',{style:{width:9,height:9,borderRadius:9,background:x[2]}}), h('span',{style:{fontSize:12.5,fontWeight:600,color:C.mut}},x[0]), h('span',{style:{fontWeight:800,color:C.ink2}},x[1])))));
      if(future) return h('div',null, head, EmptyCard({icon:'calendar',title:'Future date selected',line:'Attendance can only be marked for today or earlier. Pick a valid date to continue.'}));
      const banner = uncovered>0 ? h('div',{style:{display:'flex',alignItems:'center',gap:11,background:C.dngBg,border:'1px solid '+C.dng+'33',borderRadius:11,padding:'11px 14px',marginBottom:14}}, h('span',{style:{color:C.dng,display:'flex',flex:'none'}},ic('bell',17)), h('div',{style:{flex:1,fontSize:13,color:C.ink2,fontWeight:600}}, uncovered+' period(s) today have no teacher \u2014 the register cannot be locked until a substitute is assigned.'), Btn('Open Timetable',{sm:true,variant:'outline',onClick:()=>setPage2('tt_edit')})) : null;
      const roster = Card({flush:true}, h('div',{style:{display:'flex',flexDirection:'column'}}, list.map((s,i)=>{ const v=rec[s[0]]; const pct=attPct(s[0]); const low=pct<75; return h('div',{key:s[0],style:{display:'flex',alignItems:'center',gap:12,padding:'11px 18px',borderBottom:i<list.length-1?'1px solid '+C.line2:0}}, h('span',{style:{fontSize:12.5,color:C.mut2,width:22}},i+1), AvatarMini(s[1]), h('div',{style:{flex:1,minWidth:0}}, h('div',{style:{fontSize:13.5,fontWeight:600,color:C.ink2,display:'flex',alignItems:'center',gap:8}}, s[1], low&&Pill(pct+'% low','dng')), h('div',{style:{fontSize:11.5,color:C.mut}},'Reg '+s[0]+' \u00b7 term '+pct+'%')), h('div',{style:{display:'flex',gap:6,background:'#F4F6F8',borderRadius:9,padding:3,opacity:locked?.55:1}}, [['P','Present',C.ok],['A','Absent',C.dng],['L','Late',C.warn]].map(o=>h('button',{key:o[0],disabled:locked,onClick:()=>setAtt(s[0],o[0]),style:{padding:'6px 13px',borderRadius:7,border:0,cursor:locked?'not-allowed':'pointer',fontSize:12.5,fontWeight:700,background:v===o[0]?o[2]:'transparent',color:v===o[0]?'#fff':C.mut}},o[1])))); })));
      return h('div',null, banner, head, roster, h('div',{style:{display:'flex',gap:12,alignItems:'center',marginTop:16}}, Btn(locked?'Register locked':'Lock register',{icon:'check',onClick:()=>lockAtt(uncovered)}), (unmarked>0&&!locked)&&h('span',{style:{fontSize:12.5,color:C.mut}},unmarked+' student(s) unmarked'))); }
    const ctrlMini=(label,type)=>type==='date'?h('input',{type:'date',style:{height:38,padding:'0 11px',border:'1px solid '+C.line,borderRadius:9,fontSize:13}}):h('div',{style:{position:'relative'}},h('select',{style:{height:38,padding:'0 32px 0 12px',border:'1px solid '+C.line,borderRadius:9,fontSize:13,appearance:'none',background:'#fff',cursor:'pointer',fontWeight:600,color:C.ink}},h('option',null,label)),h('span',{style:{position:'absolute',right:10,top:11,color:C.mut2,pointerEvents:'none'}},ic('chevD',15)));
    const AvatarMini=(name)=>{ const init=name.split(' ').map(w=>w[0]).slice(0,2).join(''); const hue=(name.charCodeAt(0)*7+name.length*13)%360; return h('div',{style:{width:34,height:34,borderRadius:'50%',flex:'none',background:'hsl('+hue+',55%,92%)',color:'hsl('+hue+',45%,38%)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:12.5}},init); };
    const MarksEntry=()=>{ const subs=this.CLASS_STD; const MAXM=100; const examKey='HY2026|VIII-A|Mathematics'; const saved=(S.marks&&S.marks[examKey])||{}; const draft=(S.marksDraft&&S.marksDraft.k===examKey)?S.marksDraft.v:saved; const grOf=m=>m>=91?'A+':m>=81?'A':m>=71?'B':m>=61?'C':m>=45?'D':'F'; const setMark=(reg,rawIn)=>{ let v=''; if(rawIn!==''){ let n=parseInt(rawIn,10); if(isNaN(n))return; if(n>MAXM){toast('Marks cannot exceed '+MAXM,'dng'); n=MAXM;} if(n<0)n=0; v=n; } this.setState(st=>{ const cur=(st.marksDraft&&st.marksDraft.k===examKey)?st.marksDraft.v:((st.marks&&st.marks[examKey])||{}); const nv={...cur}; if(v==='')delete nv[reg]; else nv[reg]=v; return {marksDraft:{k:examKey,v:nv}}; }); }; const saveMarks=()=>{ const cur=(S.marksDraft&&S.marksDraft.k===examKey)?S.marksDraft.v:saved; const entered=subs.filter(s=>{const x=cur[s[0]];return x!=null&&x!=='';}).length; this.setState(st=>({marks:{...(st.marks||{}),[examKey]:{...cur}}})); toast('Marks saved · '+entered+' of '+subs.length+' entered','ok'); }; return h('div',null,
      h('div',{style:{display:'flex',gap:10,flexWrap:'wrap',marginBottom:14}},ctrlMini('Half-Yearly 2026','select'),ctrlMini('Class VIII-A','select'),ctrlMini('Mathematics','select')),
      Card({flush:true,style:{overflow:'hidden'}},h('div',{style:{overflowX:'auto'}},h('table',{style:{width:'100%',borderCollapse:'collapse',minWidth:520}},h('thead',null,h('tr',null,['Student','Obtained','Total','Grade'].map((c,i)=>h('th',{key:i,style:{textAlign:i?'right':'left',fontSize:11,fontWeight:700,letterSpacing:.4,textTransform:'uppercase',color:C.mut,padding:'11px 18px',background:'#F8F9FB',borderBottom:'1px solid '+C.line}},c)))),h('tbody',null,subs.map((s,i)=>{ const reg=s[0]; const raw=draft[reg]; const has=raw!=null&&raw!==''; const gr=has?grOf(raw):''; return h('tr',{key:i,style:{borderBottom:'1px solid '+C.line2}},h('td',{style:{padding:'10px 18px',fontSize:13.5,fontWeight:600,color:C.ink2}},s[1]),h('td',{style:{padding:'8px 18px',textAlign:'right'}},h('input',{type:'number',min:0,max:MAXM,value:has?raw:'',onChange:ev=>setMark(reg,ev.target.value),style:{width:70,height:34,textAlign:'right',padding:'0 10px',border:'1px solid '+C.line,borderRadius:8,fontSize:13.5,fontVariantNumeric:'tabular-nums',outline:'none'}})),h('td',{style:{padding:'10px 18px',textAlign:'right',color:C.mut,fontVariantNumeric:'tabular-nums'}},String(MAXM)),h('td',{style:{padding:'10px 18px',textAlign:'right'}},has?Pill(gr,gr==='F'?'dng':gr[0]==='A'?'ok':'info'):h('span',{style:{color:C.mut2}},'—'))); })))),h('div',{style:{padding:'13px 18px',borderTop:'1px solid '+C.line2,display:'flex',justifyContent:'flex-end'}},Btn('Save Marks',{icon:'check',onClick:saveMarks}))) ); }
    function ResultCard(){ return Card({title:'Result Card Preview',icon:'award',right:Btn('Download PDF',{variant:'soft',sm:true,icon:'download'})},ResultCardInner()); }
    function ResultCardInner(){ const rows=[['English',88,100],['Mathematics',76,100],['Science',92,100],['Social Studies',81,100],['Hindi',79,100],['Computer',95,100]]; const obt=rows.reduce((a,r)=>a+r[1],0); const tot=rows.reduce((a,r)=>a+r[2],0); const pct=Math.round(obt/tot*100);
      return h('div',null,
        h('div',{style:{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,padding:'4px 0 16px',borderBottom:'1px solid '+C.line2,marginBottom:14}},h('div',null,h('div',{style:{fontSize:16,fontWeight:800,color:C.ink2}},'Aarav Sharma'),h('div',{style:{fontSize:12.5,color:C.mut,marginTop:3}},'Reg 2026-0142 \u00b7 Class VI-A \u00b7 Half-Yearly 2026')),h('div',{style:{display:'flex',gap:10}},[['Percentage',pct+'%'],['Grade','A'],['Rank','3 / 32']].map((k,i)=>h('div',{key:i,style:{textAlign:'center',padding:'8px 16px',background:tint,borderRadius:10}},h('div',{style:{fontSize:18,fontWeight:800,color:accent}},k[1]),h('div',{style:{fontSize:10.5,color:C.mut,fontWeight:600}},k[0]))))),
        h('table',{style:{width:'100%',borderCollapse:'collapse'}},h('thead',null,h('tr',null,['Subject','Obtained','Total','Grade'].map((c,i)=>h('th',{key:i,style:{textAlign:i?'right':'left',fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:.4,color:C.mut,padding:'8px 4px',borderBottom:'1px solid '+C.line}},c)))),h('tbody',null,rows.map((r,i)=>{ const g=r[1]>=91?'A+':r[1]>=81?'A':r[1]>=71?'B':'C'; return h('tr',{key:i,style:{borderBottom:'1px solid '+C.line2}},h('td',{style:{padding:'9px 4px',fontSize:13.5,fontWeight:600}},r[0]),h('td',{style:{padding:'9px 4px',textAlign:'right',fontVariantNumeric:'tabular-nums'}},r[1]),h('td',{style:{padding:'9px 4px',textAlign:'right',color:C.mut,fontVariantNumeric:'tabular-nums'}},r[2]),h('td',{style:{padding:'9px 4px',textAlign:'right'}},Pill(g,g[0]==='A'?'ok':'info'))); }))) ); }
    const CertPreview=()=>Card({title:'Live Preview',icon:'eye'},h('div',{style:{border:'2px solid '+accent+'40',borderRadius:12,padding:'28px 24px',textAlign:'center',background:'linear-gradient(180deg,#fff,'+tint+')'}},h('div',{style:{width:42,height:42,borderRadius:11,background:accent,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',fontWeight:800}},'G'),h('div',{style:{fontSize:11,letterSpacing:2,textTransform:'uppercase',color:C.mut,fontWeight:700}},'Greenfield International School'),h('div',{style:{fontSize:20,fontWeight:800,color:C.ink2,margin:'14px 0 6px',fontFamily:'Georgia,serif'}},'Bonafide Certificate'),h('div',{style:{fontSize:13,color:C.mut,lineHeight:1.7,maxWidth:300,margin:'0 auto'}},'This is to certify that ',h('b',{style:{color:C.ink2}},'Aarav Sharma'),', Class VI-A, is a bonafide student of this institution for the session 2025-26.'),h('div',{style:{marginTop:24,fontSize:11.5,color:C.mut2,display:'flex',justifyContent:'space-between'}},h('span',null,'Date: 20 Jun 2026'),h('span',null,'Principal'))));
    const dlBtn=()=>({width:30,height:30,borderRadius:8,border:'1px solid '+C.line,background:'#fff',color:accent,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'});

    // ===== stateful module builders =====
    const openCollect=reg=>this.setState({collectReg:reg});
    const closeCollect=()=>this.setState({collectReg:null});
    const collectEl=()=>{ const reg=S.collectReg; if(!reg) return null; const s=S.students.find(x=>x[0]===reg); const d=dueOf(reg); return h('div',{style:{position:'fixed',inset:0,background:'rgba(16,20,31,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:310,padding:20},onClick:closeCollect}, h('div',{onClick:ev=>ev.stopPropagation(),style:{background:'#fff',borderRadius:16,maxWidth:420,width:'100%',boxShadow:'0 24px 60px rgba(16,20,31,.3)',overflow:'hidden'}}, h('div',{style:{padding:'18px 22px',borderBottom:'1px solid '+C.line2}}, h('div',{style:{fontWeight:700,fontSize:16,color:C.ink2}},'Collect fees'), h('div',{style:{fontSize:13,color:C.mut,marginTop:4}}, s[1]+' \u00b7 Reg '+reg+' \u00b7 balance '+rupee(d))), h('div',{style:{padding:'18px 22px'}}, h('label',{style:{display:'block',fontSize:12.5,fontWeight:600,marginBottom:6}},'Amount (\u20b9)'), h('input',{id:'__amt',type:'number',defaultValue:d,style:{width:'100%',height:42,padding:'0 12px',border:'1px solid '+C.line,borderRadius:9,fontSize:15,fontWeight:700,outline:'none'}}), h('div',{style:{fontSize:11.5,color:C.mut,marginTop:8}},'Partial payments allowed \u00b7 overpayment is blocked.')), h('div',{style:{display:'flex',justifyContent:'flex-end',gap:10,padding:'14px 22px',background:'#F8F9FB',borderTop:'1px solid '+C.line2}}, Btn('Cancel',{variant:'outline',sm:true,onClick:closeCollect}), Btn('Collect payment',{sm:true,icon:'check',onClick:()=>{ const el=document.getElementById('__amt'); if(collectFee(reg, el?el.value:0)) closeCollect(); }})))); };
    const CollectStudent=()=>{ const rows=S.students.map(s=>{ const reg=s[0]; const d=dueOf(reg); const fs=feeStatus(reg); return [ h('div',{style:{display:'flex',alignItems:'center',gap:9}},Avatar(s[1],26),s[1]), reg, Pill(s[3],'acc'), d<=0?'\u2014':rupee(d), Pill(fs[0],fs[1]), d>0?Btn('Collect',{sm:true,icon:'coins',onClick:()=>openCollect(reg)}):Pill('Cleared','ok') ]; }); return Table(['Student','Reg #','Class','Balance','Status','Action'],rows,{tools:['Reload','Search'],searchVal:S.stq,onSearch:ev=>this.setState({stq:ev.target.value}),searchPh:'Search student'}); };
    const CollectFees=()=>Tabs('collect',['Student Wise','Family Wise','Scan Invoice'],a=> a===2? EmptyCard({icon:'idcard',title:'Scan a paid invoice',line:'Use the camera or a barcode scanner to pull up an invoice instantly.',cta:'Open Scanner'}) : CollectStudent());
    const Defaulters=()=>{ const list=S.students.filter(s=>dueOf(s[0])>0); if(!list.length) return EmptyCard({icon:'check',title:'No fee defaulters',line:'All invoices for the selected period have been cleared. Nice work!'}); const total=list.reduce((acc,s)=>acc+dueOf(s[0]),0); const rows=list.map(s=>{ const fs=feeStatus(s[0]); return [ h('div',{style:{display:'flex',alignItems:'center',gap:9}},Avatar(s[1],26),s[1]), s[0], Pill(s[3],'acc'), rupee(dueOf(s[0])), Pill(fs[0],fs[1]), Btn('Collect',{sm:true,icon:'coins',onClick:()=>openCollect(s[0])}) ]; }); return h('div',null, collapsible('feesViz','Collection funnel & aging','chart','Generated \u2192 Partial \u2192 Paid, plus overdue aging buckets',FeesFunnel), Stats([StatCard('Defaulters',String(list.length),{icon:'receipt',tone:'dng'}),StatCard('Total Outstanding',rupee(total),{icon:'coins',tone:'warn'})]), Table(['Student','Reg #','Class','Balance','Status','Action'],rows,{tools:['Reload','Search','Print']})); };
    const PromoteStudents=()=>{ const list=this.CLASS_STD.map(s=>({reg:s[0],name:s[1]})); const sel=S.promoteSel||{}; const toggle=reg=>this.setState(st=>({promoteSel:{...(st.promoteSel||{}),[reg]:!(st.promoteSel||{})[reg]}})); const selected=list.filter(x=>sel[x.reg]&&!S.promoted[x.reg]).map(x=>x.reg); const rows=list.map(s=>{ const d=dueOf(s.reg); const pr=S.promoted[s.reg]; return [ h('input',{type:'checkbox',checked:!!sel[s.reg],disabled:!!pr,onChange:()=>toggle(s.reg),style:{width:16,height:16,accentColor:accent}}), h('div',{style:{display:'flex',alignItems:'center',gap:9}},AvatarMini(s.name),s.name), 'VIII-A', pr?Pill('Promoted \u2192 IX-A','ok'):(d>0?Pill(rupee(d)+' due','dng'):Pill('Clear','ok')) ]; }); const dueSel=selected.filter(r=>dueOf(r)>0).length; const right=Card({title:'Promote To',icon:'up'}, h('div',{style:{display:'flex',flexDirection:'column',gap:13}}, h('div',null,h('label',{style:{display:'block',fontSize:12.5,fontWeight:600,marginBottom:6}},'Target Class'),ctrl('Select Class \u25be*')), dueSel>0&&h('div',{style:{display:'flex',gap:9,background:C.dngBg,border:'1px solid '+C.dng+'33',borderRadius:10,padding:'10px 12px'}}, h('span',{style:{color:C.dng,flex:'none'}},ic('bell',16)), h('div',{style:{fontSize:12.5,color:C.ink2,lineHeight:1.5}}, dueSel+' selected student(s) have outstanding dues \u2014 promotion needs an override.')), Btn(selected.length?('Promote '+selected.length+' selected'):'Select students',{icon:'up',onClick:()=>selected.length?promote(selected):toast('Select at least one student','dng')}), h('div',{style:{fontSize:12,color:C.mut}},'Promotion carries forward profile, fee ledger and prior results.'))); return Split(Table(['','Student','Class','Fee Status'],rows,{tools:['Reload','Search']}),right); };
    const StaffLeave=()=>{ const ns=needsSub(); const rows=S.teachers.map(t=>{ const periods=Object.keys(S.tt).filter(k=>S.tt[k].tId===t.id).length; const uncov=ns.filter(k=>S.tt[k].tId===t.id).length; return [ h('div',{style:{display:'flex',alignItems:'center',gap:9}},AvatarMini(t.name),t.name), t.id, t.subj, String(periods), t.leave?Pill('On leave','warn'):Pill('Available','ok'), h('div',{style:{display:'flex',gap:8,justifyContent:'flex-end',alignItems:'center'}}, uncov>0?Pill(uncov+' uncovered','dng'):null, Btn(t.leave?'Clear leave':'Mark on leave',{sm:true,variant:t.leave?'outline':'soft',onClick:()=>setLeave(t.id,!t.leave)})) ]; }); const banner= ns.length? h('div',{style:{display:'flex',alignItems:'center',gap:11,background:C.warnBg,border:'1px solid '+C.warn+'44',borderRadius:12,padding:'12px 16px',marginBottom:16}}, h('span',{style:{color:C.warn,flex:'none'}},ic('bell',18)), h('div',{style:{flex:1,fontSize:13,color:C.ink2,fontWeight:600}}, ns.length+' class period(s) are uncovered and need a substitute.'), Btn('Assign in Timetable',{sm:true,onClick:()=>setPage2('tt_edit')})):null; return h('div',null, banner, Table(['Teacher','ID','Subject','Periods / wk','Status','Action'],rows,{tools:['Reload','Search']})); };

    // ===================== GUARD RESOLVER (canDo) + SETUP HEALTH =====================
    const noTimetable=()=>this.TT_CLASSES.filter(c=>!S.ttSet[c]);
    const defaulterList=()=>S.students.filter(s=>dueOf(s[0])>0);
    const NO_CLASS_TEACHER=['IX-B','X-B'];                 // seed: sections missing a class teacher
    const SUBJ_NO_TEACHER=[['IX-B',6]];                    // seed: class IX-B has subjects, 0 assigned
    const MARKS_INCOMPLETE=[['Science',4]];                // seed: Science marks incomplete for 4
    const canDo=(action,ctx)=>{ ctx=ctx||{};
      switch(action){
        case 'feestructure': return {ok:true};            // independent of teachers (key rule)
        case 'timetable': { const c=ctx.cls; if(c&&!S.ttSet[c]) return {ok:false,why:'No timetable configured for Class '+c+'.',cta:['Set timetable','tt_edit']}; return {ok:true}; }
        case 'attendance': { if(ctx.date&&ctx.date>this.TODAY) return {ok:false,why:'Attendance cannot be marked for a future date.'}; const u=needsSub().length; if(u>0) return {ok:false,why:u+' period(s) today have no teacher \u2014 assign a substitute.',cta:['Open timetable','tt_edit']}; return {ok:true}; }
        case 'invoice': return {ok:true};
        case 'publish': { const inc=MARKS_INCOMPLETE.reduce((a,m)=>a+m[1],0); if(inc>0) return {ok:false,why:MARKS_INCOMPLETE.map(m=>m[0]+' marks incomplete for '+m[1]+' students').join('; ')+'.',cta:['Enter marks','exammarks']}; return {ok:true}; }
        case 'promotion': { const d=defaulterList().length; if(d>0) return {ok:false,why:d+' student(s) have outstanding dues \u2014 override or collect.',cta:['Open Promote','promote']}; return {ok:true}; }
        default: return {ok:true};
      } };
    // overall status of a dependency node: 'ready' | 'partial' | 'blocked'
    const nodeStatus=k=>{ const nt=noTimetable().length, tot=this.TT_CLASSES.length;
      if(k==='TimetableSlot') return nt===0?'ready':(nt<tot?'partial':'blocked');
      if(k==='AttendanceRecord') return needsSub().length>0?'partial':'ready';
      if(k==='ReportCard') return defaulterList().length>0?'partial':'ready';
      if(k==='Promotion') return defaulterList().length>0?'blocked':'ready';
      if(k==='Mark') return 'partial';
      return 'ready'; };

    const healthItems=()=>{ const out=[]; const nt=noTimetable(); if(nt.length) out.push({sev:'warn',t:nt.length+' sections have no timetable',d:'Attendance & period flows are blocked for: '+nt.join(', ')+'.',cta:['Configure','tt_edit']});
      const u=needsSub(); if(u.length) out.push({sev:'dng',t:u.length+' periods need a substitute today',d:'A teacher on leave has uncovered classes \u2014 attendance can\u2019t be locked until covered.',cta:['Assign','tt_edit']});
      SUBJ_NO_TEACHER.forEach(s=>out.push({sev:'warn',t:'Class '+s[0]+': '+s[1]+' subjects with no teacher',d:'Timetable can\u2019t be finalised until every subject has an assigned teacher.',cta:['Assign teachers','assignsub']}));
      if(NO_CLASS_TEACHER.length) out.push({sev:'info',t:NO_CLASS_TEACHER.length+' sections without a class teacher',d:'Required before term start: '+NO_CLASS_TEACHER.join(', ')+'.',cta:['Open classes','classes']});
      const d=defaulterList(); if(d.length) out.push({sev:'dng',t:d.length+' students with outstanding dues',d:'Blocks report cards & promotion until cleared or overridden.',cta:['View defaulters','defaulters']});
      MARKS_INCOMPLETE.forEach(m=>out.push({sev:'warn',t:m[0]+' marks incomplete for '+m[1]+' students',d:'Results can\u2019t be published until every subject\u2019s marks are entered.',cta:['Enter marks','exammarks']}));
      const prov=S.adm.filter(a=>a.status==='provisional').length; if(prov) out.push({sev:'info',t:prov+' provisional admissions pending confirmation',d:'Complete enrollment (capacity + guardian + fee structure) to admit these students.',cta:['Open pipeline','admission']});
      return out; };

    const SetupHealth=()=>{ const items=healthItems(); const sev={dng:[C.dng,C.dngBg],warn:[C.warn,C.warnBg],info:[C.info,C.infoBg]};
      const counts={dng:items.filter(i=>i.sev==='dng').length,warn:items.filter(i=>i.sev==='warn').length,info:items.filter(i=>i.sev==='info').length};
      const head=h('div',{style:{display:'flex',gap:12,flexWrap:'wrap',marginBottom:16}}, [['Blockers',counts.dng,C.dng,C.dngBg],['Warnings',counts.warn,C.warn,C.warnBg],['Advisories',counts.info,C.info,C.infoBg],['Healthy modules',Math.max(0,10-items.length),C.ok,C.okBg]].map((x,i)=>h('div',{key:i,style:{flex:'1 1 180px',background:'#fff',border:'1px solid '+C.line,borderRadius:14,padding:'15px 18px'}}, h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center'}}, h('span',{style:{fontSize:12.5,fontWeight:600,color:C.mut}},x[0]), h('span',{style:{width:30,height:30,borderRadius:9,background:x[3],color:x[2],display:'flex',alignItems:'center',justifyContent:'center'}},ic('bell',15))), h('div',{style:{fontSize:26,fontWeight:800,color:C.ink2,marginTop:8}},x[1]))));
      const list=Card({title:'Unmet prerequisites across the school',icon:'list',sub:items.length+' open',flush:true}, items.length? h('div',{style:{display:'flex',flexDirection:'column'}}, items.map((it,i)=>{ const sv=sev[it.sev]; return h('div',{key:i,style:{display:'flex',alignItems:'center',gap:14,padding:'15px 18px',borderBottom:i<items.length-1?'1px solid '+C.line2:0}}, h('span',{style:{width:10,height:10,borderRadius:10,background:sv[0],flex:'none'}}), h('div',{style:{flex:1,minWidth:0}}, h('div',{style:{fontSize:13.5,fontWeight:700,color:C.ink2}},it.t), h('div',{style:{fontSize:12.5,color:C.mut,marginTop:2}},it.d)), it.cta&&Btn(it.cta[0],{sm:true,variant:'outline',onClick:()=>setPage2(it.cta[1])})); })) : EmptyRow({icon:'check',title:'All clear',line:'Every prerequisite across the school is satisfied.'}));
      return h('div',null, head, list); };

    // ===================== SYSTEM MAP =====================
    const mc=mod=>this.MODCOL[mod]||C.mut;
    const ESummary=ent=>{ const fc=ent.groups.reduce((a,g)=>a+g[1].split(',').length,0); const rels=this.REL.filter(r=>r[0]===ent.k||r[1]===ent.k).length; return {fc,rels}; };
    const selectEnt=k=>this.setState({mapSel:k});
    const EntityBrowser=()=>{ const sel=this.ERD.find(e=>e.k===S.mapSel)||this.ERD[0]; const mods=[...new Set(this.ERD.map(e=>e.mod))];
      const grid=h('div',{style:{display:'flex',flexDirection:'column',gap:18}}, mods.map(mo=>h('div',{key:mo}, h('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:9}}, h('span',{style:{width:9,height:9,borderRadius:3,background:mc(mo)}}), h('span',{style:{fontSize:11.5,fontWeight:700,letterSpacing:.5,textTransform:'uppercase',color:C.mut}},mo)), h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:9}}, this.ERD.filter(e=>e.mod===mo).map(e=>{ const sm=ESummary(e); const on=e.k===sel.k; return h('button',{key:e.k,onClick:()=>selectEnt(e.k),style:{textAlign:'left',border:'1px solid '+(on?mc(mo):C.line),background:on?mc(mo)+'0E':'#fff',borderRadius:11,padding:'11px 13px',cursor:'pointer',boxShadow:on?'0 2px 8px '+mc(mo)+'22':'none',transition:'all .12s'}}, h('div',{style:{display:'flex',alignItems:'center',gap:7}}, h('span',{style:{width:24,height:24,borderRadius:7,background:mc(mo)+'18',color:mc(mo),display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}},ic('grid',13)), h('span',{style:{fontSize:12.8,fontWeight:700,color:C.ink2,lineHeight:1.2}},e.name)), h('div',{style:{display:'flex',gap:10,marginTop:8,fontSize:10.5,color:C.mut,fontWeight:600}}, h('span',null,sm.fc+' fields'), h('span',null,sm.rels+' links'))); }))) ));
      const col=mc(sel.mod);
      const rels=this.REL.filter(r=>r[0]===sel.k||r[1]===sel.k).map(r=>{ const out=r[0]===sel.k; const other=out?r[1]:r[0]; const oe=this.ERD.find(x=>x.k===other); return h('button',{key:r[0]+r[1]+other,onClick:()=>oe&&selectEnt(other),style:{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',border:'1px solid '+C.line,borderRadius:8,background:'#fff',cursor:oe?'pointer':'default',fontSize:12}}, h('span',{style:{fontSize:10.5,fontWeight:700,color:out?col:C.mut2}},out?'\u2192':'\u2190'), h('span',{style:{fontWeight:600,color:C.ink2}},oe?oe.name:other), h('span',{style:{marginLeft:'auto',fontSize:10.5,color:C.mut,fontWeight:600,fontFamily:'ui-monospace,monospace'}},r[2])); });
      const detail=h('div',{style:{background:'#fff',border:'1px solid '+C.line,borderRadius:14,overflow:'hidden',position:'sticky',top:0}}, h('div',{style:{padding:'16px 18px',borderBottom:'1px solid '+C.line2,background:col+'0C'}}, h('div',{style:{display:'flex',alignItems:'center',gap:10}}, h('span',{style:{width:34,height:34,borderRadius:9,background:col,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}},ic('grid',17)), h('div',null, h('div',{style:{fontSize:15.5,fontWeight:800,color:C.ink2}},sel.name), h('div',{style:{fontSize:11.5,fontWeight:600,color:col}},sel.mod+' \u00b7 '+ESummary(sel).fc+' fields')))), h('div',{style:{padding:'16px 18px',maxHeight:'62vh',overflowY:'auto'}}, sel.groups.map((g,gi)=>h('div',{key:gi,style:{marginBottom:14}}, h('div',{style:{fontSize:10.5,fontWeight:700,letterSpacing:.5,textTransform:'uppercase',color:C.mut,marginBottom:7}},g[0]), h('div',{style:{display:'flex',flexWrap:'wrap',gap:6}}, g[1].split(',').map((f,fi)=>h('span',{key:fi,style:{fontSize:11.5,fontWeight:500,color:C.ink,background:'#F4F6F8',border:'1px solid '+C.line2,borderRadius:6,padding:'4px 8px',fontFamily:'ui-monospace,SFMono-Regular,monospace'}},f.trim()))))), h('div',{style:{marginTop:6,paddingTop:14,borderTop:'1px solid '+C.line2}}, h('div',{style:{fontSize:10.5,fontWeight:700,letterSpacing:.5,textTransform:'uppercase',color:C.mut,marginBottom:9}},'Relationships'), h('div',{style:{display:'flex',flexDirection:'column',gap:6}}, rels.length?rels:h('div',{style:{fontSize:12,color:C.mut2}},'No direct relationships.')))));
      return h('div',{style:{display:'grid',gridTemplateColumns:S.narrow?'1fr':'1.55fr 1fr',gap:18,alignItems:'start'}}, h('div',null,grid), detail); };

    const DepGraph=()=>{ const tiers=[...new Set(this.DEP.map(d=>d.tier))].sort((a,b)=>a-b); const stc={ready:[C.ok,C.okBg,'Ready'],partial:[C.warn,C.warnBg,'Partial'],blocked:[C.dng,C.dngBg,'Blocked']};
      const name=k=>{ const e=this.ERD.find(x=>x.k===k); return e?e.name:k; };
      const pageOf={TimetableSlot:'tt_edit',AttendanceRecord:'markatt',Invoice:'geninvoice',ReportCard:'resultcard',Promotion:'promote',Student:'allstd',FeeStructure:'feepart',TeacherAssignment:'assignsub',Exam:'addexam',Mark:'exammarks',Subject:'subjview',Section:'classes',Class:'classes',Employee:'allemp'};
      const tierLabels=['Foundation','Structure','Building blocks','Assignment','Scheduling & billing','Assessment','Marks','Reporting','Rollover'];
      const rows=tiers.map(t=>{ const nodes=this.DEP.filter(d=>d.tier===t); return h('div',{key:t,style:{display:'flex',gap:14,alignItems:'stretch',marginBottom:6}}, h('div',{style:{width:54,flex:'none',display:'flex',flexDirection:'column',alignItems:'center'}}, h('span',{style:{width:28,height:28,borderRadius:'50%',background:accent,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,flex:'none'}},t), t<tiers.length-1&&h('span',{style:{flex:1,width:2,background:C.line,marginTop:4}})), h('div',{style:{flex:1,paddingBottom:14}}, h('div',{style:{fontSize:11,fontWeight:700,letterSpacing:.5,textTransform:'uppercase',color:C.mut2,marginBottom:8}},tierLabels[t]||('Tier '+t)), h('div',{style:{display:'flex',gap:10,flexWrap:'wrap'}}, nodes.map(nd=>{ const st=nodeStatus(nd.k); const sc=stc[st]; const pg=pageOf[nd.k]; return h('button',{key:nd.k,onClick:()=>pg&&setPage2(pg),style:{textAlign:'left',minWidth:178,border:'1px solid '+sc[0]+'44',borderLeft:'3px solid '+sc[0],background:'#fff',borderRadius:11,padding:'11px 13px',cursor:pg?'pointer':'default'}}, h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}, h('span',{style:{fontSize:13,fontWeight:700,color:C.ink2}},name(nd.k)), h('span',{style:{fontSize:9.5,fontWeight:700,color:sc[0],background:sc[1],padding:'2px 7px',borderRadius:20}},sc[2])), nd.deps.length?h('div',{style:{fontSize:10.5,color:C.mut,marginTop:5}},'needs: '+nd.deps.map(name).join(' \u00b7 ')):h('div',{style:{fontSize:10.5,color:C.mut2,marginTop:5}},'no prerequisites')); }))) ); });
      const rule=h('div',{style:{display:'flex',gap:12,background:tint,border:'1px solid '+accent+'33',borderRadius:12,padding:'13px 16px',marginBottom:18}}, h('span',{style:{color:accent,flex:'none'}},ic('star',18)), h('div',null, h('div',{style:{fontWeight:700,fontSize:13,color:C.ink2}},'Independence rule'), h('div',{style:{fontSize:12.5,color:C.mut,marginTop:2,lineHeight:1.5}},'Fee structures, classes, subjects and admissions do NOT depend on teachers. Teachers are a hard prerequisite only for Teacher Assignment \u2192 Timetable \u2192 Attendance / Homework / Marks.')));
      return Card({title:'Setup dependency graph',icon:'layers',sub:'each node is blocked until its parents exist'}, rule, h('div',null,rows)); };

    const FlowMaps=()=>h('div',{style:{display:'flex',flexDirection:'column',gap:14}}, this.FLOWS.map((f,i)=>{ const col=mc(f.c); return h('div',{key:i,style:{background:'#fff',border:'1px solid '+C.line,borderRadius:14,padding:'16px 18px'}}, h('div',{style:{display:'flex',alignItems:'center',gap:9,marginBottom:13}}, h('span',{style:{width:26,height:26,borderRadius:8,background:col+'18',color:col,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800}},i+1), h('span',{style:{fontSize:14.5,fontWeight:800,color:C.ink2}},f.t), h('span',{style:{fontSize:10.5,fontWeight:700,color:col,background:col+'14',padding:'3px 9px',borderRadius:20,marginLeft:4}},f.c)), h('div',{style:{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginBottom:11}}, f.steps.map((s,si)=>h('div',{key:si,style:{display:'flex',alignItems:'center',gap:6}}, h('span',{style:{fontSize:12.5,fontWeight:600,color:C.ink,background:'#F4F6F8',border:'1px solid '+C.line2,borderRadius:8,padding:'7px 12px'}},s), si<f.steps.length-1&&h('span',{style:{color:col,fontWeight:800}},'\u2192')))), h('div',{style:{display:'flex',gap:8,fontSize:12,color:C.mut,lineHeight:1.5,paddingTop:11,borderTop:'1px solid '+C.line2}}, h('span',{style:{color:C.warn,flex:'none',marginTop:1}},ic('bell',13)), f.note)); }));

    const SystemMap=()=>h('div',null, h('div',{style:{fontSize:13.5,color:C.mut,lineHeight:1.6,marginBottom:18,maxWidth:760}},'A live model of the ERP: ',h('b',{style:{color:C.ink2}},this.ERD.length+' entities'),', their full field sets and ',h('b',{style:{color:C.ink2}},this.REL.length+' relationships'),', the setup dependency graph (with live readiness), and the lifecycle flows. Statuses and counts reconcile with the seeded store.'), Tabs('sysmap',['Entities & Fields','Dependency Graph','Lifecycle Flows'],a=> a===0?EntityBrowser() : a===1?DepGraph() : FlowMaps()));

    // ===================== STUDENT PROFILE (deep, tabbed) =====================
    const openStudent=reg=>this.setState({stView:reg,page:'stdprofile'});
    const synthStudent=reg=>{ const s=S.students.find(x=>x[0]===reg)||S.students[0]; const i=S.students.indexOf(s); const houses=['Red','Blue','Green','Yellow']; const cats=['General','OBC','General','EWS','SC']; const blood=['O+','B+','A+','AB+','O-']; const rel=['Hindu','Muslim','Christian','Sikh','Hindu']; const cities=['Mumbai','Pune','Bengaluru','Chennai','Delhi'];
      return {s,i,
        gender:i%2?'Female':'Male', dob:'20'+(10+i%4)+'-0'+(1+i%9)+'-1'+(i%9), age:14-(i%3), roll:String(i+1).padStart(2,'0'),
        house:houses[i%4], cat:cats[i%5], blood:blood[i%5], rel:rel[i%5], city:cities[i%5],
        admDate:'2024-04-0'+(1+i%8), admType:i%4===0?'Transfer':'New', prev:i%4===0?'St. Xavier\u2019s High':'\u2014', rte:i%5===0,
        email:s[1].toLowerCase().replace(/[^a-z]/g,'.')+'@greenfield.edu',
        occ:['Engineer','Doctor','Business','Teacher','Lawyer'][i%5], income:['\u20b912,00,000','\u20b918,00,000','\u20b924,00,000','\u20b99,00,000','\u20b915,00,000'][i%5],
        route:i%3===0?'Route 4 \u2014 Andheri':'\u2014', stop:i%3===0?'Lokhandwala (07:55)':'\u2014', uses:i%3===0,
        allergy:i%4===0?'Peanuts':'None', cond:i%5===0?'Mild asthma':'None'};
    };
    const Field=(label,val,wide)=>h('div',{style:{gridColumn:wide?'1 / -1':'auto'}}, h('div',{style:{fontSize:11,fontWeight:600,letterSpacing:.3,textTransform:'uppercase',color:C.mut2,marginBottom:4}},label), h('div',{style:{fontSize:13.5,fontWeight:600,color:C.ink2}},val||'\u2014'));
    const FieldGrid=(arr)=>h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'18px 22px'}}, arr.map((f,i)=>h('div',{key:i,style:f[2]?{gridColumn:'1 / -1'}:{}}, Field(f[0],f[1],f[2]))));
    const StudentProfile=()=>{ const reg=S.stView||S.students[0][0]; const d=synthStudent(reg); const s=d.s; const due=dueOf(reg); const fs=feeStatus(reg); const att=attPct(reg);
      const back=h('button',{onClick:()=>setPage2('allstd'),style:{display:'inline-flex',alignItems:'center',gap:6,border:'1px solid '+C.line,background:'#fff',borderRadius:9,padding:'7px 13px',fontSize:12.5,fontWeight:600,color:C.mut,cursor:'pointer',marginBottom:14}}, h('span',{style:{display:'flex',transform:'scaleX(-1)'}},ic('chevR',14)), 'Back to all students');
      const header=Card({}, h('div',{style:{display:'flex',gap:18,flexWrap:'wrap',alignItems:'center'}}, PhotoSlot('std_'+reg,72,Avatar(s[1],72)), h('div',{style:{flex:1,minWidth:200}}, h('div',{style:{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}, h('span',{style:{fontSize:20,fontWeight:800,color:C.ink2}},s[1]), Pill('Enrolled','ok'), d.rte&&Pill('RTE','info')), h('div',{style:{display:'flex',gap:16,flexWrap:'wrap',marginTop:8,fontSize:12.5,color:C.mut,fontWeight:600}}, h('span',null,'Adm# '+reg), h('span',null,'Roll '+d.roll), h('span',null,'Class '+s[3]), h('span',null,'House '+d.house))), h('div',{style:{display:'flex',gap:9}}, due>0&&Btn('Collect Fee',{sm:true,icon:'coins',onClick:()=>openCollect(reg)}), Btn('Edit',{sm:true,variant:'outline',icon:'pencil'}), Btn('Print',{sm:true,variant:'soft',icon:'printer'}))));
      const quick=Stats([StatCard('Attendance',att+'%',{icon:'calcheck',tone:att<75?'dng':'ok'}),StatCard('Fee Balance',due<=0?'\u20b90':rupee(due),{icon:'receipt',tone:due<=0?'ok':'warn'}),StatCard('Last Result','A \u00b7 88%',{icon:'award',tone:'ok'}),StatCard('Status',fs[0],{icon:'badge',tone:fs[1]==='ok'?'ok':fs[1]})]);
      const body=Tabs('stdprofile',['Personal','Contact','Guardians','Medical','Academic','Fees','Transport','Documents'],a=>{
        const G=[
          [['First name',s[1].split(' ')[0]],['Last name',s[1].split(' ').slice(-1)[0]],['Gender',d.gender],['Date of birth',d.dob],['Age',d.age+' yrs'],['Blood group',d.blood],['Nationality','Indian'],['Religion',d.rel],['Category',d.cat],['Mother tongue',['Hindi','Marathi','Tamil','Kannada','English'][d.i%5]],['Aadhaar','\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 '+(2000+d.i)]],
          [['Primary phone',s[5]],['Email',d.email],['Current address',d.i+', Maple Residency, '+d.city+' \u2013 4000'+(10+d.i),true],['Permanent address','Same as current',true],['City',d.city],['State',['Maharashtra','Maharashtra','Karnataka','Tamil Nadu','Delhi'][d.i%5]],['Pincode','4000'+(10+d.i)],['Country','India']],
          [['Father',s[2]],['Father occupation',d.occ],['Annual income',d.income],['Mother',s[1].split(' ').slice(-1)[0]+' '+['Devi','Bai','Kumari'][d.i%3]],['Primary contact',s[2]+' (Father)'],['Emergency',s[2]+' \u00b7 '+s[5],true],['Parent login','Enabled']],
          [['Blood group',d.blood],['Allergies',d.allergy],['Medical conditions',d.cond],['Medications','None'],['Doctor','Dr. '+['Kapoor','Shah','Reddy','Menon','Rao'][d.i%5]],['Doctor phone','+91 90'+(100+d.i)+' 4'+(2000+d.i)],['Disability','No']],
          [['Academic year','2026\u201327'],['Class / Section',s[3]],['Roll no',d.roll],['Admission date',d.admDate],['Admission type',d.admType],['Previous school',d.prev,true],['House',d.house],['Status','Enrolled'],['RTE',d.rte?'Yes':'No']],
          [['Fee category',d.rte?'RTE':'Regular'],['Concession',d.rte?'100% (RTE quota)':(d.i%4===0?'10% (Sibling)':'None')],['Annual fee',rupee(48000)],['Paid to date',rupee((S.fees[reg]||0)+(48000-baseDue(reg)))],['Current balance',due<=0?'\u20b90':rupee(due)],['Invoice status',fs[0]],['Due date','10 Jun 2026']],
          [['Uses transport',d.uses?'Yes':'No'],['Route',d.route],['Stop',d.stop],['Pickup / drop',d.uses?'Gate B \u00b7 07:55 / 15:20':'\u2014',true]],
          null
        ];
        if(a===7){ const docs=[['Birth Certificate',true],['Transfer Certificate',d.admType==='Transfer'],['Aadhaar Card',true],['Previous Report Card',d.admType==='Transfer'],['Passport Photo',true],['Medical Record',false]]; return Card({title:'Documents',icon:'download'}, h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}, docs.map((dc,i)=>{ const dkey='doc_'+reg+'_'+String(dc[0]).replace(/[^a-z0-9]+/gi,'_').toLowerCase(); const up=(S.img||{})[dkey]; const ok=dc[1]||!!up; return h('div',{key:i,style:{display:'flex',alignItems:'center',gap:11,border:'1px solid '+C.line,borderRadius:11,padding:'12px 14px'}}, up? h('img',{src:up,alt:dc[0],style:{width:34,height:34,borderRadius:9,objectFit:'cover',flex:'none',border:'1px solid '+C.line2}}) : h('span',{style:{width:34,height:34,borderRadius:9,background:dc[1]?C.okBg:'#F4F6F8',color:dc[1]?C.ok:C.mut2,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}},ic(dc[1]?'check':'download',16)), h('div',{style:{flex:1}}, h('div',{style:{fontSize:13,fontWeight:600,color:C.ink2}},dc[0]), h('div',{style:{fontSize:11.5,color:ok?C.ok:C.mut2,fontWeight:600}},up?'Uploaded':(dc[1]?'Verified':'Not uploaded'))), ok? ic('eye',16,C.mut2) : h('label',{style:{display:'inline-flex',alignItems:'center',gap:7,fontSize:13,fontWeight:600,padding:'7px 12px',borderRadius:9,cursor:'pointer',border:'1px solid transparent',background:tint,color:accent,whiteSpace:'nowrap',lineHeight:1}}, fileInput(dkey,'Document uploaded · reload-safe'), 'Upload')); }))); }
        const titles=['Personal Information','Contact & Address','Guardians','Medical','Academic','Fees','Transport'];
        const icons=['user','message','user','star','grad','receipt','calendar'];
        return Card({title:titles[a],icon:icons[a]}, FieldGrid(G[a]));
      });
      return h('div',null, back, header, h('div',{style:{height:16}}), quick, body); };

    // ===================== DELETE / STATUS GUARDS =====================
    const DELRULES={
      class:{label:'Class',dep:['2 sections (A, B)','8 subjects','61 enrolled students','1 fee structure','2 scheduled exams'],why:'A class with sections, students, fees or exams cannot be deleted.',action:'archive',cta:'Archive class instead'},
      section:{label:'Section',dep:['38 enrolled students','timetable for 6 days'],why:'Move or withdraw the students and clear the timetable before deleting a section.',action:'block',cta:'Move students first'},
      subject:{label:'Subject',dep:['12 timetable slots','1 exam schedule','marks records'],why:'Remove this subject from the timetable and exams before deleting it.',action:'block',cta:'Open timetable'},
      teacher:{label:'Teacher',dep:['timetable slots','entered marks','assigned homework','class-teacher of VIII-A'],why:'This teacher is referenced across the system. Reassign their work to another teacher first.',action:'reassign',cta:'Bulk-reassign & remove'},
      student:{label:'Student',dep:['attendance history','fee invoices','exam results'],why:'Students are never hard-deleted. Withdraw or graduate them to preserve history and free the seat.',action:'withdraw',cta:'Withdraw student'},
      parent:{label:'Parent',dep:['1 active linked student'],why:'Reassign the guardian on the linked student before removing this parent.',action:'block',cta:'Reassign guardian'},
      feestructure:{label:'Fee Structure',dep:['generated invoices for this class'],why:'Cancel or settle the open invoices before deleting a fee structure. Future-only edits are allowed.',action:'block',cta:'View invoices'},
      invoice:{label:'Invoice',dep:['recorded payments'],why:'Invoices with payments can only be cancelled (with a reason) if unpaid; paid invoices are immutable.',action:'cancel',cta:'Cancel invoice'}
    };
    const tryDelete=(entity,name,ctx)=>{ const r=DELRULES[entity]; if(!r){toast('Deleted '+name,'ok');return;} this.setState({guard:{entity,name,...r,ctx:ctx||{}}}); };
    const closeGuard=()=>this.setState({guard:null});
    const doArchive=(g)=>this.setState(st=>({archive:[...st.archive,{type:g.label,name:g.name,reason:'Archived (had dependents)',by:'Admin',at:this.TODAY}],guard:null}),()=>toast(g.label+' archived · history retained','ok'));
    const doReassign=(g)=>{ const to=document.getElementById('__reassign'); const id=to?to.value:''; if(!id){toast('Pick a replacement teacher','dng');return;} this.setState(st=>({archive:[...st.archive,{type:'Teacher',name:g.name,reason:'Reassigned to '+tname(id)+' then removed',by:'Admin',at:this.TODAY}],guard:null}),()=>toast('Assignments moved to '+tname(id)+' · '+g.name+' removed','ok')); };
    const doWithdraw=(g)=>{ const reg=g.ctx.reg; const sec=g.ctx.section; this.setState(st=>{ const ss={...st.secStrength}; if(sec&&ss[sec]) ss[sec]=ss[sec]-1; return {archive:[...st.archive,{type:'Student (withdrawn)',name:g.name,reason:'Withdrawn · seat freed'+(sec?' in '+sec:''),by:'Admin',at:this.TODAY}],secStrength:ss,guard:null}; },()=>toast(g.name+' withdrawn · seat freed'+(sec?' in '+sec:''),'ok')); };
    const doCancel=(g)=>this.setState(st=>({archive:[...st.archive,{type:'Invoice (cancelled)',name:g.name,reason:'Cancelled · unpaid',by:'Admin',at:this.TODAY}],guard:null}),()=>toast('Invoice '+g.name+' cancelled','ok'));
    const guardEl=()=>{ const g=S.guard; if(!g) return null; const reassign=g.action==='reassign'; const freeT=S.teachers.filter(t=>!t.leave);
      const run={archive:doArchive,reassign:doReassign,withdraw:doWithdraw,cancel:doCancel,block:closeGuard}[g.action];
      return h('div',{style:{position:'fixed',inset:0,background:'rgba(16,20,31,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:310,padding:20},onClick:closeGuard}, h('div',{onClick:e=>e.stopPropagation(),style:{background:'#fff',borderRadius:16,maxWidth:460,width:'100%',boxShadow:'0 24px 60px rgba(16,20,31,.3)',overflow:'hidden'}},
        h('div',{style:{padding:'20px 22px'}}, h('div',{style:{display:'flex',gap:13}}, h('span',{style:{width:40,height:40,borderRadius:11,flex:'none',background:C.dngBg,color:C.dng,display:'flex',alignItems:'center',justifyContent:'center'}},ic('lock',20)), h('div',null, h('div',{style:{fontWeight:700,fontSize:16,color:C.ink2}},'Can\u2019t delete '+g.label+' \u00b7 '+g.name), h('div',{style:{fontSize:13,color:C.mut,marginTop:5,lineHeight:1.5}},g.why))),
          h('div',{style:{marginTop:14,background:'#F8F9FB',border:'1px solid '+C.line2,borderRadius:10,padding:'12px 14px'}}, h('div',{style:{fontSize:11,fontWeight:700,letterSpacing:.4,textTransform:'uppercase',color:C.mut,marginBottom:8}},'Referenced by'), h('div',{style:{display:'flex',flexDirection:'column',gap:6}}, g.dep.map((d,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:8,fontSize:12.5,color:C.ink}}, h('span',{style:{color:C.dng,display:'flex'}},ic('x',13)), d)))),
          reassign&&h('div',{style:{marginTop:14}}, h('label',{style:{display:'block',fontSize:12.5,fontWeight:600,marginBottom:6}},'Reassign all work to'), h('div',{style:{position:'relative'}}, h('select',{id:'__reassign',style:{width:'100%',height:40,padding:'0 34px 0 12px',border:'1px solid '+C.line,borderRadius:9,fontSize:13.5,appearance:'none',background:'#fff',cursor:'pointer'}}, h('option',{value:''},'Select a teacher\u2026'), freeT.map(t=>h('option',{key:t.id,value:t.id},t.name+' \u00b7 '+t.subj))), h('span',{style:{position:'absolute',right:11,top:11,color:C.mut2,pointerEvents:'none'}},ic('chevD',16))))),
        h('div',{style:{display:'flex',justifyContent:'flex-end',gap:10,padding:'14px 22px',background:'#F8F9FB',borderTop:'1px solid '+C.line2}}, Btn('Cancel',{variant:'outline',sm:true,onClick:closeGuard}), Btn(g.cta,{variant:g.action==='block'?'primary':'danger',sm:true,onClick:()=>run(g)})))); };

    // ===================== ADMISSIONS LIFECYCLE =====================
    const ADM_STAGES=[['enquiry','Enquiry',C.info],['provisional','Provisional',C.warn],['enrolled','Enrolled',C.ok]];
    const admBy=st=>S.adm.filter(a=>a.status===st);
    const classNum=cls=>cls; const sectionsOf=cls=>this.TT_CLASSES.filter(s=>s.split('-')[0]===cls);
    const capOf=sec=>({used:S.secStrength[sec]||0,cap:this.SECTION_CAP});
    const dupCheck=(name,dob,phone)=>{ const n=(name||'').trim().toLowerCase(); const inAdm=S.adm.find(a=>a.name.toLowerCase()===n&&(a.dob===dob)); const inStd=S.students.find(s=>s[1].toLowerCase()===n); const byPhone=S.adm.find(a=>phone&&a.phone===phone); return inAdm||inStd?{name:(inAdm?inAdm.name:inStd[1]),where:inAdm?'admissions pipeline':'enrolled students'}:(byPhone?{name:byPhone.name,where:'admissions pipeline (same phone)'}:null); };
    const openWiz=(lead,step)=>this.setState({admWiz:{step:step||0,draft:lead?{...lead}:{name:'',dob:'',gender:'',phone:'',cls:'',source:'Walk-in'},dupAck:false,id:lead?lead.id:null}});
    const closeWiz=()=>this.setState({admWiz:null});
    const wizSet=(k,v)=>this.setState(st=>({admWiz:{...st.admWiz,draft:{...st.admWiz.draft,[k]:v}}}));
    const wizGo=step=>this.setState(st=>({admWiz:{...st.admWiz,step}}));
    const saveProvisional=()=>{ const w=S.admWiz, d=w.draft; this.setState(st=>{ let adm=st.adm.slice(); if(w.id){ adm=adm.map(a=>a.id===w.id?{...a,...d,status:'provisional',hist:[...(a.hist||[]),['Moved to Provisional',this.TODAY.slice(8)+' Jun']]}:a); } else { adm=[{...d,id:'ADM-'+(1044+adm.length),status:'provisional',created:this.TODAY.slice(8)+' Jun',hist:[['Enquiry created',this.TODAY.slice(8)+' Jun'],['Moved to Provisional',this.TODAY.slice(8)+' Jun']]},...adm]; } return {adm,admWiz:null}; },()=>toast('Saved as Provisional · admission letter generated','ok')); };
    const confirmEnroll=()=>{ const w=S.admWiz, d=w.draft; const sec=d.section; const cls=d.cls;
      if(!S.feeStructSet[cls]){ toast('No fee structure for Grade '+cls+' — set one before enrolling','dng'); return; }
      const c=capOf(sec); if(!sec){toast('Assign a section first','dng');return;} if(c.used>=c.cap){ toast('Section '+sec+' is full ('+c.used+'/'+c.cap+')','dng'); return; }
      if(!d.parent){ toast('Link a guardian before enrolling','dng'); return; }
      this.setState(st=>{ const ss={...st.secStrength}; ss[sec]=(ss[sec]||0)+1; const admNo='2026-0'+(157+st.adm.filter(a=>a.status==='enrolled').length); let adm=st.adm.slice(); const rec={...d,status:'enrolled',admNo,roll:String(ss[sec]),hist:[...(adm.find(a=>a.id===w.id)?.hist||[['Enquiry created',this.TODAY.slice(8)+' Jun']]),['Enrolled · '+sec,this.TODAY.slice(8)+' Jun']]};
        if(w.id) adm=adm.map(a=>a.id===w.id?{...a,...rec}:a); else adm=[{...rec,id:'ADM-'+(1044+adm.length),created:this.TODAY.slice(8)+' Jun'},...adm];
        return {adm,secStrength:ss,admWiz:null}; },()=>toast('Enrolled · admission no assigned · seat taken in '+sec,'ok')); };
    const withdrawLead=lead=>this.setState(st=>{ const ss={...st.secStrength}; if(lead.section&&ss[lead.section]) ss[lead.section]--; return {adm:st.adm.map(a=>a.id===lead.id?{...a,status:'withdrawn',reason:'Withdrawn by office',hist:[...(a.hist||[]),['Withdrawn',this.TODAY.slice(8)+' Jun']]}:a),secStrength:ss}; },()=>toast(lead.name+' withdrawn · seat freed','ok'));

    const admCard=lead=>{ const stg=ADM_STAGES.find(s=>s[0]===lead.status)||ADM_STAGES[0]; return h('div',{key:lead.id,style:{background:'#fff',border:'1px solid '+C.line,borderRadius:12,padding:'13px 14px',marginBottom:10,boxShadow:'0 1px 2px rgba(20,30,55,.04)'}},
      h('div',{style:{display:'flex',alignItems:'center',gap:10}}, AvatarMini(lead.name), h('div',{style:{flex:1,minWidth:0}}, h('div',{style:{fontSize:13.5,fontWeight:700,color:C.ink2}},lead.name), h('div',{style:{fontSize:11.5,color:C.mut}},lead.id+' · Grade '+lead.cls+(lead.section?' · '+lead.section:''))) ),
      h('div',{style:{display:'flex',gap:8,marginTop:9,fontSize:11,color:C.mut,fontWeight:600}}, h('span',{style:{background:'#F4F6F8',borderRadius:6,padding:'3px 8px'}},lead.source), h('span',{style:{background:'#F4F6F8',borderRadius:6,padding:'3px 8px'}},lead.created), lead.admNo&&h('span',{style:{background:C.okBg,color:C.ok,borderRadius:6,padding:'3px 8px'}},lead.admNo)),
      h('div',{style:{display:'flex',gap:7,marginTop:11}},
        lead.status==='enquiry'&&Btn('Start admission',{sm:true,icon:'up',onClick:()=>openWiz(lead,1)}),
        lead.status==='provisional'&&Btn('Confirm enrollment',{sm:true,icon:'check',onClick:()=>openWiz(lead,3)}),
        lead.status==='provisional'&&Btn('Letter',{sm:true,variant:'soft',onClick:()=>toast('Admission letter generated','ok')}),
        lead.status==='enrolled'&&Btn('View',{sm:true,variant:'outline',icon:'eye',onClick:()=>S.students.find(s=>s[0]===lead.admNo)?openStudent(lead.admNo):toast('Profile created','ok')}),
        (lead.status!=='enrolled')&&h('button',{onClick:()=>withdrawLead(lead),title:'Withdraw',style:{marginLeft:'auto',width:30,height:30,borderRadius:8,border:'1px solid '+C.line,background:'#fff',color:C.dng,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},ic('trash',14)) )); };
    const AdmissionsBoard=()=>{ const wd=admBy('withdrawn');
      const header=h('div',{style:{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',marginBottom:16}}, h('div',{style:{flex:1}}, h('div',{style:{fontSize:13.5,color:C.mut}},'Pipeline of admission leads through their lifecycle. Drag-free Kanban — advance each lead with its card action.')), Btn('New Enquiry',{icon:'plus',onClick:()=>openWiz(null,0)}));
      const cols=h('div',{style:{display:'grid',gridTemplateColumns:S.narrow?'1fr':'repeat(3,1fr)',gap:14}}, ADM_STAGES.map(s=>{ const items=admBy(s[0]); return h('div',{key:s[0],style:{background:'#F8F9FB',border:'1px solid '+C.line2,borderRadius:14,padding:'12px 12px 4px'}}, h('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:12,padding:'2px 2px'}}, h('span',{style:{width:9,height:9,borderRadius:9,background:s[2]}}), h('span',{style:{fontSize:13,fontWeight:700,color:C.ink2}},s[1]), h('span',{style:{marginLeft:'auto',fontSize:12,fontWeight:700,color:s[2],background:s[2]+'18',borderRadius:20,padding:'2px 9px'}},items.length)), items.length?items.map(admCard):h('div',{style:{textAlign:'center',padding:'24px 10px',color:C.mut2,fontSize:12.5}},'No leads in this stage')); }));
      const wdrow= wd.length?h('div',{style:{marginTop:16,display:'flex',alignItems:'center',gap:10,background:'#fff',border:'1px solid '+C.line,borderRadius:12,padding:'12px 16px'}}, h('span',{style:{color:C.mut2,flex:'none'}},ic('inbox',17)), h('div',{style:{flex:1,fontSize:13,color:C.mut}}, wd.length+' withdrawn lead(s) retained in the archive.'), Btn('View archive',{sm:true,variant:'outline',onClick:()=>setPage2('archive')})):null;
      return h('div',null, collapsible('admViz','Pipeline conversion & sources','chart','Enquiry \u2192 Provisional \u2192 Enrolled, with enquiry source mix',AdmFunnel), header, cols, wdrow); };

    const wizField=(label,k,type,opts)=>{ const d=S.admWiz.draft; const bs={width:'100%',height:40,padding:'0 12px',border:'1px solid '+C.line,borderRadius:9,fontSize:13.5,outline:'none'};
      const ctl= type==='select'? h('div',{style:{position:'relative'}}, h('select',{value:d[k]||'',onChange:e=>wizSet(k,e.target.value),style:{...bs,padding:'0 34px 0 12px',appearance:'none',background:'#fff',cursor:'pointer'}}, h('option',{value:''},'Select\u2026'), (opts||[]).map(o=>h('option',{key:o,value:o},o))), h('span',{style:{position:'absolute',right:11,top:11,color:C.mut2,pointerEvents:'none'}},ic('chevD',16)))
        : h('input',{type:type==='date'?'date':'text',value:d[k]||'',onInput:e=>wizSet(k,e.target.value),style:bs});
      return h('div',null, h('label',{style:{display:'block',fontSize:12.5,fontWeight:600,marginBottom:6}},label), ctl); };
    const admWizEl=()=>{ const w=S.admWiz; if(!w) return null; const d=w.draft; const steps=['Enquiry','Student detail','Section & guardian','Confirm']; const col=accent;
      const dup=w.step===0?dupCheck(d.name,d.dob,d.phone):null;
      const grid2={display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px 16px'};
      let bodyEl;
      if(w.step===0){ bodyEl=h('div',null, h('div',{style:grid2}, wizField('Full name *','name'), wizField('Date of birth *','dob','date'), wizField('Gender *','gender','select',['Male','Female','Other']), wizField('Phone *','phone'), wizField('Class applied for *','cls','select',['VI','VII','VIII','IX','X','XI']), wizField('Source','source','select',['Walk-in','Website','Referral','Transfer','Campaign'])), dup&&h('div',{style:{display:'flex',gap:10,marginTop:14,background:C.warnBg,border:'1px solid '+C.warn+'44',borderRadius:10,padding:'11px 13px'}}, h('span',{style:{color:C.warn,flex:'none'}},ic('bell',17)), h('div',{style:{fontSize:12.5,color:C.ink2,lineHeight:1.5}}, h('b',null,'Possible duplicate: '),'\u201c'+dup.name+'\u201d already exists in '+dup.where+'. Link to the existing record or continue if this is a different person.'))); }
      else if(w.step===1){ bodyEl=h('div',{style:{display:'flex',flexDirection:'column',gap:16}}, [['Personal',['Blood group','Category (Gen/OBC/SC/ST/EWS)','Religion','Nationality']],['Contact & Address',['Email','Current address','City','Pincode']],['Medical',['Allergies','Medical conditions']],['Academic',['Previous school','Admission type']]].map((grp,gi)=>h('div',{key:gi}, h('div',{style:{fontSize:11,fontWeight:700,letterSpacing:.4,textTransform:'uppercase',color:C.mut,marginBottom:9}},grp[0]), h('div',{style:grid2}, grp[1].map((f,fi)=>h('div',{key:fi}, h('label',{style:{display:'block',fontSize:12.5,fontWeight:600,marginBottom:6}},f), h('input',{placeholder:'Enter '+f.toLowerCase().replace(/\s*\(.*\)/,''),style:{width:'100%',height:38,padding:'0 12px',border:'1px solid '+C.line,borderRadius:9,fontSize:13,outline:'none'}}))))))); }
      else if(w.step===2){ const secs=sectionsOf(d.cls); bodyEl=h('div',null, h('div',{style:{fontSize:12.5,fontWeight:600,marginBottom:8}},'Assign section — Grade '+(d.cls||'?')), secs.length?h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:10,marginBottom:18}}, secs.map(sec=>{ const c=capOf(sec); const full=c.used>=c.cap; const on=d.section===sec; return h('button',{key:sec,disabled:full,onClick:()=>wizSet('section',sec),style:{textAlign:'left',border:'1px solid '+(on?accent:(full?C.dng+'44':C.line)),background:on?tint:(full?C.dngBg:'#fff'),borderRadius:11,padding:'12px 13px',cursor:full?'not-allowed':'pointer',opacity:full?.75:1}}, h('div',{style:{fontSize:14,fontWeight:700,color:C.ink2}},'Section '+sec.split('-')[1]), h('div',{style:{fontSize:11.5,fontWeight:600,color:full?C.dng:C.mut,marginTop:4}},c.used+' / '+c.cap+(full?' · Full':' seats')) ); })):h('div',{style:{fontSize:13,color:C.mut2,marginBottom:16}},'Pick a class in step 1 first.'),
        h('div',{style:{fontSize:11,fontWeight:700,letterSpacing:.4,textTransform:'uppercase',color:C.mut,margin:'4px 0 9px'}},'Guardian (≥ 1 primary required)'), h('div',{style:grid2}, wizField('Guardian name *','parent'), wizField('Relation','prel','select',['Father','Mother','Guardian'])) ); }
      else { const noFee=!S.feeStructSet[d.cls]; const c=d.section?capOf(d.section):null; const full=c&&c.used>=c.cap;
        bodyEl=h('div',null, h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px 16px',background:'#F8F9FB',border:'1px solid '+C.line2,borderRadius:11,padding:'14px 16px',marginBottom:14}}, [['Name',d.name||'\u2014'],['Class / Section','Grade '+(d.cls||'?')+(d.section?' · '+d.section:'')],['Guardian',d.parent||'\u2014'],['Phone',d.phone||'\u2014']].map((r,i)=>h('div',{key:i}, h('div',{style:{fontSize:10.5,fontWeight:700,textTransform:'uppercase',letterSpacing:.3,color:C.mut2}},r[0]), h('div',{style:{fontSize:13.5,fontWeight:600,color:C.ink2,marginTop:3}},r[1])))),
          h('div',{style:{display:'flex',flexDirection:'column',gap:8}}, [['Fee structure for Grade '+(d.cls||'?'),!noFee,noFee?'Missing — set it first':'Configured'],['Section seat available',!full,full?'Section full':'Seat free'],['Guardian linked',!!d.parent,d.parent?'Linked':'Not linked']].map((chk,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:9,fontSize:13}}, h('span',{style:{width:22,height:22,borderRadius:6,background:chk[1]?C.okBg:C.dngBg,color:chk[1]?C.ok:C.dng,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}},ic(chk[1]?'check':'x',13)), h('span',{style:{color:C.ink2,fontWeight:600}},chk[0]), h('span',{style:{marginLeft:'auto',fontSize:11.5,fontWeight:600,color:chk[1]?C.ok:C.dng}},chk[2])))),
          noFee&&h('div',{style:{marginTop:12}},Btn('Set fee structure for Grade '+d.cls,{sm:true,variant:'soft',icon:'receipt',onClick:()=>{closeWiz();setPage2('feepart');}}))); }
      const canNext= w.step!==0 || (d.name&&d.dob&&d.gender&&d.phone&&d.cls);
      const footerLeft= w.step>0? Btn('Back',{variant:'outline',sm:true,onClick:()=>wizGo(w.step-1)}) : h('span',null);
      const footerRight= w.step<2? Btn('Continue',{sm:true,onClick:()=>{ if(!canNext){toast('Fill all required (*) fields','dng');return;} wizGo(w.step+1); }})
        : w.step===2? h('div',{style:{display:'flex',gap:9}}, Btn('Save as Provisional',{variant:'soft',sm:true,onClick:saveProvisional}), Btn('Review & enroll',{sm:true,onClick:()=>wizGo(3)}))
        : h('div',{style:{display:'flex',gap:9}}, Btn('Save as Provisional',{variant:'soft',sm:true,onClick:saveProvisional}), Btn('Confirm & Enroll',{sm:true,icon:'check',onClick:confirmEnroll}));
      return h('div',{style:{position:'fixed',inset:0,background:'rgba(16,20,31,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:310,padding:20},onClick:closeWiz}, h('div',{onClick:e=>e.stopPropagation(),style:{background:'#fff',borderRadius:18,maxWidth:620,width:'100%',maxHeight:'90vh',display:'flex',flexDirection:'column',boxShadow:'0 24px 60px rgba(16,20,31,.3)',overflow:'hidden'}},
        h('div',{style:{padding:'18px 22px',borderBottom:'1px solid '+C.line2}}, h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between'}}, h('div',{style:{fontWeight:800,fontSize:16.5,color:C.ink2}},w.id?'Admission · '+d.name:'New Admission'), h('button',{onClick:closeWiz,style:{width:30,height:30,borderRadius:8,border:0,background:'#F4F6F8',color:C.mut,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},ic('x',16))),
          h('div',{style:{display:'flex',gap:6,marginTop:14}}, steps.map((s,i)=>h('div',{key:i,style:{flex:1,display:'flex',flexDirection:'column',gap:6}}, h('div',{style:{height:4,borderRadius:4,background:i<=w.step?col:C.line2}}), h('div',{style:{fontSize:11,fontWeight:i===w.step?700:600,color:i===w.step?col:C.mut2}},(i+1)+'. '+s))))),
        h('div',{style:{padding:'20px 22px',overflowY:'auto',flex:1}}, bodyEl),
        h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 22px',background:'#F8F9FB',borderTop:'1px solid '+C.line2}}, footerLeft, footerRight))); };

    const ArchiveView=()=>{ const items=S.archive; const stale=S.adm.filter(a=>a.status==='withdrawn').map(a=>({type:'Admission (withdrawn)',name:a.name,reason:a.reason||'Withdrawn',by:'Office',at:a.created})); const all=[...items,...stale];
      const prov=admBy('provisional').length;
      const head=prov?h('div',{style:{display:'flex',alignItems:'center',gap:11,background:C.warnBg,border:'1px solid '+C.warn+'44',borderRadius:12,padding:'12px 16px',marginBottom:16}}, h('span',{style:{color:C.warn,flex:'none'}},ic('bell',18)), h('div',{style:{flex:1,fontSize:13,color:C.ink2,fontWeight:600}},prov+' provisional admission(s) pending confirmation.'), Btn('Open pipeline',{sm:true,onClick:()=>setPage2('admission')})):null;
      if(!all.length) return h('div',null, head, EmptyCard({icon:'inbox',title:'Archive is empty',line:'Withdrawn students, cancelled invoices and archived records will appear here with full audit history.'}));
      return h('div',null, head, Table(['Type','Record','Reason','By','Date'],all.map(r=>[Pill(r.type,'neu'),r.name,r.reason,r.by,r.at]),{tools:['Reload','Search']})); };

    // ---- Coordinator dashboard (mirrors Admin, scoped to assigned classes VIII-A/B) ----
    const CoordDash=()=>{
      const myStrength=[{c:'VIII',A:S.secStrength['VIII-A']||0,B:S.secStrength['VIII-B']||0}];
      const myTotal=(S.secStrength['VIII-A']||0)+(S.secStrength['VIII-B']||0);
      const tiles=h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:16}}, [
        {label:'My Classes',value:'2',delta:0,down:false,icon:'book',grad:'linear-gradient(135deg,#0E9488,#22A99C)',shadow:'#0E9488',spark:spk(2,1),key:'students'},
        {label:'My Students',value:String(myTotal),delta:1.2,down:false,icon:'grad',grad:'linear-gradient(135deg,#5B47E0,#6F5BE8)',shadow:'#5B47E0',spark:spk(myTotal,5),key:'students'},
        {label:'Avg Attendance',value:attMean+'%',delta:0.8,down:false,icon:'calcheck',grad:'linear-gradient(135deg,#5B8DEF,#74A0F2)',shadow:'#5B8DEF',spark:spk(attMean,4),key:'students'},
        {label:'Outstanding',value:liveOutstanding>0?rupee(liveOutstanding):'₹0',delta:2.1,down:true,icon:'receipt',grad:'linear-gradient(135deg,#F2728C,#F58AA0)',shadow:'#F2728C',spark:spk(5,2),key:'revenue'}
      ].map((g,i)=>h('div',{key:i},kpiTile(g))));
      const filterRow=h('div',{style:{display:'flex',alignItems:'center',gap:12,marginBottom:16}}, h('div',{style:{fontSize:13,fontWeight:700,color:C.ink2}},'My classes · VIII-A, VIII-B'), h('div',{style:{flex:1}}), RangeCtl());
      const feeChart=chartCard({id:'coFee',title:'Fee Collection vs Outstanding',icon:'receipt',sub:'₹ by month · my classes',aria:'Stacked bar of fees by month'},
        chartBox('coFee','bar',[{name:'Collected',data:feeMonths.map(f=>Math.round(f.collected*0.3))},{name:'Pending',data:feeMonths.map(f=>Math.round(f.pending*0.3))},{name:'Overdue',data:feeMonths.map(f=>Math.round(f.overdue*0.3))}],Object.assign({chart:{stacked:true},xaxis:{categories:feeMonths.map(f=>f.m)},colors:[PAL.gold,PAL.amber,PAL.coral],legend:{position:'top',horizontalAlign:'right'}},evts('feeMonth')),240),
        miniTable(['Month','Collected'],feeMonths.map(f=>[f.m,rupee(Math.round(f.collected*0.3))])));
      const attChart=chartCard({id:'coAtt',title:'Attendance Trend',icon:'calcheck',sub:'my classes · avg '+attMean+'%',aria:'Line of daily attendance with 75% threshold'},
        chartBox('coAtt','line',[{name:'Attendance %',data:attDays}],{chart:{events:{dataPointSelection:(e,ctx,cfg)=>openDrill('attDay',cfg.dataPointIndex)}},xaxis:{categories:attDays.map((_,i)=>i+1),tickAmount:6,labels:{formatter:v=>'D'+v}},yaxis:{min:60,max:100},colors:[PAL.blue],annotations:{yaxis:[{y:75,borderColor:PAL.coral,strokeDashArray:5,label:{text:'75%',style:{color:'#fff',background:PAL.coral}}}]}},230),
        miniTable(['Day','%'],attDays.map((v,i)=>['Day '+(i+1),v+'%'])));
      const feeDonut=chartCard({id:'coFeeD',title:'Fee Status',icon:'receipt',aria:'Donut of fee status'},
        chartBox('coFeeD','donut',[fc.Paid,fc.Partial,fc.Overdue,fc.Due],Object.assign({labels:['Paid','Partial','Overdue','Due'],colors:[PAL.gold,PAL.amber,PAL.coral,PAL.slate],legend:{position:'bottom'}},evts('feeStatus')),210),
        miniTable(['Status','Count'],[['Paid',String(fc.Paid)],['Partial',String(fc.Partial)],['Overdue',String(fc.Overdue)],['Due',String(fc.Due)]]));
      const strengthChart=chartCard({id:'coStr',title:'Section Strength',icon:'grad',sub:'VIII-A / VIII-B',aria:'Bar of section strength'},
        chartBox('coStr','bar',[{name:'Students',data:[S.secStrength['VIII-A']||0,S.secStrength['VIII-B']||0]}],Object.assign({xaxis:{categories:['VIII-A','VIII-B']},colors:[accent],plotOptions:{bar:{columnWidth:'45%'}}},{chart:{events:{dataPointSelection:(e,ctx,cfg)=>openDrill('sectionAtt',cfg.dataPointIndex)}}}),210),
        miniTable(['Section','Students'],[['VIII-A',String(S.secStrength['VIII-A']||0)],['VIII-B',String(S.secStrength['VIII-B']||0)]]));
      const rail=h('div',{style:{display:'flex',flexDirection:'column',gap:16}}, feeDonut, strengthChart);
      const mainCol=h('div',{style:{display:'flex',flexDirection:'column',gap:16}}, feeChart, attChart);
      return h('div',null, tiles, filterRow, Split(mainCol, rail, '1.9fr 1fr'));
    };
    // ---- Teacher dashboard ----
    const TeacherDash=()=>{
      const tiles=h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:16}}, [
        {label:'My Classes',value:'3',delta:0,down:false,icon:'book',grad:'linear-gradient(135deg,#2563EB,#4A82F0)',shadow:'#2563EB',spark:spk(3,1),key:'students'},
        {label:'Periods Today',value:'4',delta:0,down:false,icon:'calendar',grad:'linear-gradient(135deg,#5B47E0,#6F5BE8)',shadow:'#5B47E0',spark:spk(4,2),key:'students'},
        {label:'Homework to Grade',value:'9',delta:3,down:true,icon:'pencil',grad:'linear-gradient(135deg,#D9913F,#E8A95B)',shadow:'#D9913F',spark:spk(9,4),key:'students'},
        {label:'My Students',value:String((S.secStrength['VIII-A']||0)+(S.secStrength['VIII-B']||0)),delta:1.1,down:false,icon:'grad',grad:'linear-gradient(135deg,#2F8F83,#46A89B)',shadow:'#2F8F83',spark:spk(72,6),key:'students'}
      ].map((g,i)=>h('div',{key:i},kpiTile(g))));
      const filterRow=h('div',{style:{display:'flex',alignItems:'center',gap:12,marginBottom:16}}, h('div',{style:{fontSize:13,fontWeight:700,color:C.ink2}},'My teaching · VIII-A, VIII-B, IX-A'), h('div',{style:{flex:1}}), RangeCtl());
      const secAtt=chartCard({id:'tAtt',title:"My Sections' Attendance %",icon:'calcheck',sub:'this week · click a section',aria:'Grouped bar of attendance per section this week'},
        chartBox('tAtt','bar',[{name:'Mon',data:[94,90,92]},{name:'Wed',data:[91,88,90]},{name:'Fri',data:[96,93,89]}],{chart:{events:{dataPointSelection:(e,ctx,cfg)=>openDrill('sectionAtt',cfg.dataPointIndex)}},xaxis:{categories:['VIII-A','VIII-B','IX-A']},colors:[accent,PAL.blue,PAL.gold],legend:{position:'top',horizontalAlign:'right'},yaxis:{max:100}},250),
        miniTable(['Section','Mon','Wed','Fri'],[['VIII-A','94','91','96'],['VIII-B','90','88','93'],['IX-A','92','90','89']]));
      const perf=chartCard({id:'tPerf',title:'Class Performance (my subject)',icon:'award',sub:'avg marks per assessment',aria:'Line of average class marks per assessment'},
        chartBox('tPerf','line',[{name:'VIII-A avg',data:[72,75,78,82,85]},{name:'VIII-B avg',data:[68,71,74,77,80]}],{xaxis:{categories:['UT1','Mid','UT2','Pre','Term']},colors:[accent,PAL.coral],legend:{position:'top',horizontalAlign:'right'},yaxis:{max:100}},230),
        miniTable(['Assessment','VIII-A','VIII-B'],[['UT1','72','68'],['Mid','75','71'],['UT2','78','74'],['Pre','82','77'],['Term','85','80']]));
      const hw=chartCard({id:'tHw',title:'Homework Status',icon:'pencil',sub:'click a section to grade',aria:'Stacked bar of homework status per section'},
        chartBox('tHw','bar',[{name:'Assigned',data:[12,10,11]},{name:'Submitted',data:[9,7,8]},{name:'Graded',data:[7,5,6]}],{chart:{stacked:true,events:{dataPointSelection:(e,ctx,cfg)=>openDrill('hwSection',cfg.dataPointIndex)}},xaxis:{categories:['VIII-A','VIII-B','IX-A']},colors:[PAL.slate,PAL.blue,PAL.gold],legend:{position:'top',horizontalAlign:'right'}},230),
        miniTable(['Section','Assigned','Submitted','Graded'],[['VIII-A','12','9','7'],['VIII-B','10','7','5'],['IX-A','11','8','6']]));
      // today timetable strip — coral = substitute needed (ties to leave/substitute guard)
      const ns=needsSub();
      const strip=Card({title:"My Timetable Today",icon:'calendar',sub:ns.length?ns.length+' need cover':null}, h('div',{style:{display:'flex',gap:8,flexWrap:'wrap'}}, [['P1','08:00','VIII-A','ENG'],['P2','08:50','VIII-B','ENG'],['P4','10:45','IX-A','ENG'],['P6','13:00','VIII-A','LIB']].map((p,i)=>{ const need=i===3&&ns.length>0; return h('div',{key:i,style:{flex:'1 1 120px',borderRadius:11,border:'1px solid '+(need?C.dng+'44':C.line),background:need?C.dngBg:'#fff',borderLeft:'3px solid '+(need?C.dng:accent),padding:'11px 13px'}}, h('div',{style:{display:'flex',justifyContent:'space-between',fontSize:11,fontWeight:700,color:C.mut}}, h('span',null,p[0]), h('span',null,p[1])), h('div',{style:{fontSize:14,fontWeight:700,color:C.ink2,marginTop:5}},p[2]), h('div',{style:{fontSize:11.5,color:need?C.dng:C.mut,fontWeight:600,marginTop:2}},need?'Substitute needed':p[3])); })));
      const rail=h('div',{style:{display:'flex',flexDirection:'column',gap:16}}, hw, strip);
      const mainCol=h('div',{style:{display:'flex',flexDirection:'column',gap:16}}, secAtt, perf);
      return h('div',null, tiles, filterRow, Split(mainCol, rail, '1.7fr 1fr'));
    };
    // ---- Finance / Statistics (moved off Admin home) ----
    const FinanceView=()=>{
      const inc=feeMonths.map(f=>f.collected); const exp=feeMonths.map(f=>Math.round(f.collected*0.78));
      const filterRow=h('div',{style:{display:'flex',alignItems:'center',gap:12,marginBottom:16}}, h('div',{style:{fontSize:13,fontWeight:700,color:C.ink2}},'Income vs Expense'), h('div',{style:{flex:1}}), RangeCtl());
      const main=chartCard({id:'finMain',title:'Income vs Expense',icon:'chart',sub:'click a month for the breakdown',aria:'Area spline of income and expense over months'},
        chartBox('finMain','area',[{name:'Income',data:inc},{name:'Expense',data:exp}],{chart:{events:{dataPointSelection:(e,ctx,cfg)=>openDrill('finMonth',cfg.dataPointIndex)}},stroke:{curve:'smooth'},xaxis:{categories:feeMonths.map(f=>f.m)},colors:[accent,PAL.coral],legend:{position:'top',horizontalAlign:'right'},yaxis:{labels:{formatter:v=>'₹'+Math.round(v/100000)+'L'}}},300),
        miniTable(['Month','Income','Expense','Net'],feeMonths.map((f,i)=>[f.m,rupee(inc[i]),rupee(exp[i]),rupee(inc[i]-exp[i])])));
      const headDonut=chartCard({id:'finHead',title:'Income by Fee Head',icon:'receipt',aria:'Donut of income by fee head'},
        chartBox('finHead','donut',[62,14,10,8,6],{labels:['Tuition','Transport','Lab','Exam','Admission'],colors:[accent,PAL.gold,PAL.blue,PAL.amber,PAL.lilac],legend:{position:'bottom'}},230),
        miniTable(['Head','%'],[['Tuition','62%'],['Transport','14%'],['Lab','10%'],['Exam','8%'],['Admission','6%']]));
      const expDonut=chartCard({id:'finExp',title:'Expense by Category',icon:'wallet',aria:'Donut of expense by category'},
        chartBox('finExp','donut',[58,18,12,12],{labels:['Salaries','Utilities','Maintenance','Misc'],colors:[PAL.coral,PAL.amber,PAL.slate,PAL.lilac],legend:{position:'bottom'}},230),
        miniTable(['Category','%'],[['Salaries','58%'],['Utilities','18%'],['Maintenance','12%'],['Misc','12%']]));
      const net=inc.reduce((a,b)=>a+b,0)-exp.reduce((a,b)=>a+b,0);
      const kpis=Stats([StatCard('Total Income',rupee(inc.reduce((a,b)=>a+b,0)),{icon:'coins',tone:'ok'}),StatCard('Total Expense',rupee(exp.reduce((a,b)=>a+b,0)),{icon:'wallet',tone:'dng'}),StatCard('Net Surplus',rupee(net),{icon:'chart',tone:'info'})]);
      const rail=h('div',{style:{display:'flex',flexDirection:'column',gap:16}}, headDonut, expDonut);
      return h('div',null, kpis, filterRow, Split(main, rail, '1.9fr 1fr'));
    };

    // ===================== IN-MODULE CHARTS (collapsible, one per page) =====================
    const toggleModChart=id=>this.setState(st=>({modChart:{...st.modChart,[id]:!st.modChart[id]}}));
    // collapsed by default; never blocks the data table below it
    const collapsible=(id,title,icon,sub,chartFn)=>{ const open=S.modChart[id]!==false ? (S.modChart[id]===undefined?true:S.modChart[id]) : false;
      return h('div',{style:{background:'#fff',border:'1px solid '+C.line,borderRadius:14,boxShadow:'0 1px 2px rgba(20,30,55,.04)',marginBottom:16,overflow:'hidden'}},
        h('button',{onClick:()=>toggleModChart(id),style:{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'13px 18px',border:0,background:'transparent',cursor:'pointer',textAlign:'left'}},
          h('span',{style:{color:accent,display:'flex'}},ic(icon,18)), h('div',{style:{flex:1}}, h('div',{style:{fontWeight:700,fontSize:14,color:C.ink2}},title), sub&&h('div',{style:{fontSize:12,color:C.mut,marginTop:1}},sub)), h('span',{style:{display:'flex',color:C.mut2,transform:open?'rotate(180deg)':'none',transition:'transform .2s'}},ic('chevD',18))),
        open&&h('div',{style:{padding:'4px 18px 18px'}}, chartFn())); };

    // 1. FEES — collection funnel (Generated→Partial→Paid) + aging buckets
    const FeesFunnel=()=>{ const gen=S.students.length; let paid=0,partial=0; S.students.forEach(s=>{ const d=dueOf(s[0]); const pd=S.fees[s[0]]||0; if(d<=0)paid++; else if(pd>0)partial++; });
      // aging buckets from due date: deterministic split of current defaulters by days overdue
      const defs=S.students.filter(s=>dueOf(s[0])>0); const b={'0–30':0,'31–60':0,'60+':0}; defs.forEach((s,i)=>{ const k=i%3===0?'60+':(i%2?'31–60':'0–30'); b[k]++; });
      return h('div',{style:{display:'grid',gridTemplateColumns:S.narrow?'1fr':'1fr 1fr',gap:18,alignItems:'center'}},
        h('div',null, h('div',{style:{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:.4,color:C.mut,marginBottom:8}},'Collection funnel'), chartBox('feeFunnel','bar',[{name:'Invoices',data:[gen,gen-paid,partial,paid]}],{plotOptions:{bar:{horizontal:true,distributed:true,columnWidth:'62%'}},colors:[PAL.slate,PAL.amber,PAL.blue,PAL.gold],xaxis:{categories:['Generated','Outstanding','Partial','Paid']},legend:{show:false},dataLabels:{enabled:true}},220)),
        h('div',null, h('div',{style:{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:.4,color:C.mut,marginBottom:8}},'Aging of overdue (click a bucket)'), chartBox('feeAging','bar',[{name:'Students',data:[b['0–30'],b['31–60'],b['60+']]}],{chart:{events:{dataPointSelection:(e,ctx,cfg)=>openDrill('feeStatus',2)}},plotOptions:{bar:{columnWidth:'48%',distributed:true}},colors:[PAL.gold,PAL.amber,PAL.coral],xaxis:{categories:['0–30 d','31–60 d','60+ d']},legend:{show:false}},220))); };

    // 2. ADMISSIONS — pipeline conversion bar + source donut
    const AdmFunnel=()=>{ const enq=S.adm.filter(a=>['enquiry','provisional','enrolled'].includes(a.status)).length; const prov=S.adm.filter(a=>['provisional','enrolled'].includes(a.status)).length; const enr=S.adm.filter(a=>a.status==='enrolled').length;
      const src2={}; S.adm.forEach(a=>{ src2[a.source]=(src2[a.source]||0)+1; }); const sl=Object.keys(src2);
      const conv=enq>0?Math.round(enr/enq*100):0;
      return h('div',{style:{display:'grid',gridTemplateColumns:S.narrow?'1fr':'1.4fr 1fr',gap:18,alignItems:'center'}},
        h('div',null, h('div',{style:{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:.4,color:C.mut,marginBottom:8}},'Pipeline · '+conv+'% enquiry→enrolled'), chartBox('admFunnel','bar',[{name:'Leads',data:[enq,prov,enr]}],{plotOptions:{bar:{horizontal:true,distributed:true,columnWidth:'58%'}},colors:[PAL.blue,PAL.amber,PAL.gold],xaxis:{categories:['Enquiry','Provisional','Enrolled']},legend:{show:false},dataLabels:{enabled:true}},200)),
        h('div',null, h('div',{style:{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:.4,color:C.mut,marginBottom:8}},'Source of enquiry'), chartBox('admSource','donut',sl.map(k=>src2[k]),{labels:sl,colors:[accent,PAL.gold,PAL.coral,PAL.blue,PAL.lilac],legend:{position:'bottom'}},210))); };

    // 3. EXAMS — grade distribution histogram + subject pass% + topper
    const GRADES=[['A+',91],['A',81],['B',71],['C',61],['D',45],['F',0]];
    const gradeOf=m=>{ for(const g of GRADES) if(m>=g[1]) return g[0]; return 'F'; };
    const ExamCharts=()=>{ const marks=[88,76,92,58,64,81,95,72,67,84,90,55,78,61]; // seeded class marks
      const dist=GRADES.map(g=>0); marks.forEach(m=>{ const gi=GRADES.findIndex(g=>g[0]===gradeOf(m)); dist[gi]++; });
      const subs=[['English',92],['Maths',79],['Science',88],['Social',81],['Hindi',85],['Computer',96]];
      return h('div',{style:{display:'grid',gridTemplateColumns:S.narrow?'1fr':'1fr 1fr',gap:18,alignItems:'start'}},
        h('div',null, h('div',{style:{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:.4,color:C.mut,marginBottom:8}},'Grade distribution'), chartBox('exGrade','bar',[{name:'Students',data:dist}],{plotOptions:{bar:{distributed:true,columnWidth:'58%'}},colors:[PAL.gold,'#3FA796',PAL.blue,PAL.amber,'#C98A4B',PAL.coral],xaxis:{categories:GRADES.map(g=>g[0])},legend:{show:false},dataLabels:{enabled:true}},220)),
        h('div',null, h('div',{style:{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:.4,color:C.mut,marginBottom:8}},'Subject-wise pass %'), chartBox('exPass','bar',[{name:'Pass %',data:subs.map(x=>x[1])}],{plotOptions:{bar:{horizontal:true,columnWidth:'62%'}},colors:[accent],xaxis:{categories:subs.map(x=>x[0]),max:100}},220))); };

    // 4. ATTENDANCE — sections × days heatmap (SVG, click a cell -> register)
    const AttHeatmap=()=>{ const secs=['VI-A','VII-A','VIII-A','IX-A','X-A']; const days=['Mon','Tue','Wed','Thu','Fri','Sat'];
      // deterministic per section/day % from seeded sinusoid
      const val=(si,di)=>Math.max(68,Math.min(99, 90 + Math.round(6*Math.sin((si*2+di)/1.7)) - ((si+di)%5===0?12:0)));
      const colFor=v=> v>=92?PAL.gold : v>=85?'#7FC0A8' : v>=78?PAL.amber : v>=72?'#E89A6B' : PAL.coral;
      return h('div',null, h('div',{style:{overflowX:'auto'}}, h('div',{style:{display:'grid',gridTemplateColumns:'72px repeat('+days.length+',1fr)',gap:5,minWidth:520}},
        h('div'), days.map(d=>h('div',{key:d,style:{textAlign:'center',fontSize:11,fontWeight:700,color:C.mut}},d)),
        secs.map((sec,si)=>[ h('div',{key:'l'+si,style:{display:'flex',alignItems:'center',fontSize:12,fontWeight:700,color:C.ink2}},sec),
          days.map((d,di)=>{ const v=val(si,di); return h('button',{key:si+'_'+di,onClick:()=>openDrill('attDay',di),title:sec+' '+d+': '+v+'%',style:{border:0,cursor:'pointer',borderRadius:8,height:42,background:colFor(v),color:'#fff',fontSize:12,fontWeight:700,opacity:.92}},v); }) ]) )),
        h('div',{style:{display:'flex',alignItems:'center',gap:14,marginTop:12,fontSize:11,color:C.mut,fontWeight:600}}, h('span',null,'Low'), [PAL.coral,'#E89A6B',PAL.amber,'#7FC0A8',PAL.gold].map((c,i)=>h('span',{key:i,style:{width:22,height:12,borderRadius:3,background:c}})), h('span',null,'High'), h('span',{style:{marginLeft:'auto'}},'Click a cell → that register'))); };

    // ------- build sidebar -------
    const q=S.q.trim().toLowerCase();
    const groups=this.NAV[S.role].map(g=>{ const top=g.label===''; const items=g.items.filter(i=>!q||i.l.toLowerCase().includes(q)||g.label.toLowerCase().includes(q)); const hasActive=g.items.some(i=>i.k===S.page);
      return {...g,top,items,hasActive}; }).filter(g=>!q||g.top||g.items.length);
    const sidebarGroups=groups.map(g=>{ const open= g.top?false : (q? g.items.length>0 : (S.open[g.label]!==undefined? S.open[g.label] : g.hasActive));
      const isActiveTop=g.top&&g.hasActive;
      return {
        label: g.top? g.items[0].l : g.label,
        icon: ic(g.icon,17),
        chev: g.top?'': ic(open?'chevD':'chevR',15),
        open,
        onToggle: g.top? (()=>setPage2(g.items[0].k)) : (()=>toggleGroup(g.label)),
        headStyle:{display:'flex',alignItems:'center',gap:11,padding:'9px 11px',borderRadius:9,cursor:'pointer',fontSize:13,fontWeight:g.top?700:600,color:isActiveTop?accent:'#414856',background:isActiveTop?tint:'transparent',transition:'background .15s',userSelect:'none'},
        iconWrap:{width:26,height:26,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',color:isActiveTop?accent:'#7C8493',flex:'none'},
        chevStyle:{color:'#AEB4BF',display:'flex',flex:'none'},
        items: g.top?[]:g.items.map(i=>{ const on=i.k===S.page; return {
          label:i.l, locked:i.lock,
          lockEl: i.lock? h('span',{style:{color:'#B6BCC6',display:'flex'}},ic('lock',13)) : null,
          onClick:()=>setPage2(i.k),
          dotStyle:{width:6,height:6,borderRadius:6,flex:'none',background:on?accent:'transparent',marginLeft:2,transition:'background .15s'},
          style:{display:'flex',alignItems:'center',gap:11,padding:'7px 11px 7px 14px',marginLeft:13,borderLeft:'2px solid '+(on?accent:'#EDEFF3'),fontSize:12.8,fontWeight:on?700:500,color:on?accent:'#5A616E',background:on?tint:'transparent',borderRadius:'0 8px 8px 0',cursor:'pointer',transition:'all .15s'} }; })
      }; });

    // ------- top right cluster -------
    const iconBtn=(name,badge,onClick)=>h('button',{onClick,title:name,'aria-label':name,style:{position:'relative',width:38,height:38,borderRadius:10,border:0,background:'transparent',color:'#5A616E',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},ic(name,19),badge&&h('span',{style:{position:'absolute',top:7,right:7,width:7,height:7,borderRadius:7,background:C.dng,border:'1.5px solid #fff'}}));
    const sess=this.props.session||{};
    const avName=sess.displayName||({admin:'R. Mehta',coord:'S. Nair',teach:'A. Rao',student:'Aarav Sharma'}[S.role]);
    const avSub=sess.isGuest?'Guest \u00b7 Demo session':(sess.email||{admin:'Administrator',coord:'Coordinator \u00b7 VIII',teach:'Teacher \u00b7 VIII-A',student:'Class VI-A'}[S.role]);
    const toggleFull=()=>{ try{ if(document.fullscreenElement){document.exitFullscreen();} else {document.documentElement.requestFullscreen();} }catch(e){ toast('Fullscreen not available here','info'); } };
    const toggleNotif=()=>this.setState(st=>({notifOpen:!st.notifOpen, notifRead:true, avatar:false}));
    const _ME='2026-0143';
    const alerts = S.role==='student'
      ? [ (dueOf(_ME)>0?{t:'Fees overdue — '+rupee(dueOf(_ME))+' due',pg:'payonline',tone:'dng'}:null), {t:'Your result card has been published',pg:'myresult',tone:'info'} ].filter(Boolean)
      : [ (defaulterList().length?{t:defaulterList().length+' students have overdue fees',pg:'defaulters',tone:'dng'}:null),
          (S.adm.filter(a=>a.status==='provisional').length?{t:S.adm.filter(a=>a.status==='provisional').length+' admission(s) pending confirmation',pg:'admission',tone:'warn'}:null),
          (needsSub().length?{t:needsSub().length+' period(s) need a substitute',pg:'tt_edit',tone:'warn'}:null) ].filter(Boolean);
    const notifDrop = S.notifOpen && h('div',{style:{position:'absolute',right:0,top:46,width:300,background:'#fff',border:'1px solid '+C.line,borderRadius:12,boxShadow:'0 12px 32px rgba(20,30,55,.14)',padding:6,zIndex:60}},
      h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 10px',borderBottom:'1px solid '+C.line2,marginBottom:4}}, h('span',{style:{fontWeight:700,fontSize:13,color:C.ink2}},'Notifications'), h('span',{style:{fontSize:11,color:C.mut}},alerts.length+' new')),
      alerts.length? alerts.map((a,i)=>h('button',{key:i,onClick:()=>{ setPage2(a.pg); },style:{display:'flex',gap:10,width:'100%',textAlign:'left',padding:'9px 10px',border:0,background:'transparent',borderRadius:8,cursor:'pointer'}}, h('span',{style:{width:8,height:8,borderRadius:8,marginTop:5,flex:'none',background:a.tone==='dng'?C.dng:(a.tone==='warn'?C.warn:C.info)}}), h('span',{style:{fontSize:12.5,color:C.ink,lineHeight:1.4}},a.t)))
        : h('div',{style:{padding:'18px 12px',textAlign:'center',color:C.mut,fontSize:12.5}},'You are all caught up.'));
    const topRight=h('div',{style:{display:'flex',alignItems:'center',gap:4}},
      !S.narrow&&h('div',{style:{display:'flex',gap:6,marginRight:6}},['App Store','Google Play'].map((b,i)=>h('button',{key:i,onClick:()=>toast('eschool365 mobile app — demo only','info'),style:{fontSize:10.5,fontWeight:600,color:'#9AA0AC',background:'#fff',border:'1px solid '+C.line,borderRadius:7,padding:'4px 8px',whiteSpace:'nowrap',cursor:'pointer'}},b))),
      iconBtn('max',false,toggleFull),
      iconBtn('mail',false,()=>setPage2('messaging')),
      h('div',{style:{position:'relative'}}, iconBtn('bell',!S.notifRead&&alerts.length>0,toggleNotif), notifDrop),
      iconBtn('cart',false,()=>toast('Your school store cart is empty','info')),
      h('div',{style:{width:1,height:26,background:C.line,margin:'0 6px'}}),
      h('div',{style:{position:'relative'}},
        h('button',{onClick:toggleAvatar,style:{display:'flex',alignItems:'center',gap:9,padding:'4px 8px 4px 4px',borderRadius:10,border:'1px solid '+C.line,background:'#fff',cursor:'pointer'}},
          h('div',{style:{width:32,height:32,borderRadius:9,background:tint,color:accent,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13}},avName.split(' ').map(w=>w[0]).join('')),
          !S.narrow&&h('div',{style:{textAlign:'left',lineHeight:1.2}},h('div',{style:{fontSize:12.5,fontWeight:700,color:C.ink2}},avName),h('div',{style:{fontSize:10.5,color:C.mut}},avSub)),
          ic('chevD',15,C.mut2)),
        S.avatar&&h('div',{style:{position:'absolute',right:0,top:46,width:250,background:'#fff',border:'1px solid '+C.line,borderRadius:12,boxShadow:'0 12px 32px rgba(20,30,55,.14)',padding:6,zIndex:60}},
          h('div',{style:{padding:'9px 11px',display:'flex',alignItems:'center',gap:10,borderBottom:'1px solid '+C.line2,marginBottom:5}},
            h('div',{style:{width:36,height:36,borderRadius:'50%',background:tint,color:accent,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,flex:'none'}},avName.split(' ').map(w=>w[0]).join('').slice(0,2)),
            h('div',{style:{minWidth:0}},h('div',{style:{fontSize:13,fontWeight:700,color:C.ink2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}},avName),h('div',{style:{fontSize:11,color:C.mut,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}},avSub))),
          sess.isGuest&&h('div',{style:{margin:'0 5px 6px',padding:'6px 9px',background:C.warnBg,color:C.warn,borderRadius:7,fontSize:11,fontWeight:700,display:'flex',alignItems:'center',gap:6}},ic('user',13,C.warn),'Guest / demo session'),
          [['My Profile','user','myprofile'],['Account Settings','settings','acct'],['Change Password','lock','pwd']].map((m,i)=>h('button',{key:i,onClick:()=>{setPage2(m[2]);toggleAvatar();},style:{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 11px',border:0,background:'transparent',borderRadius:8,cursor:'pointer',fontSize:13,color:C.ink,fontWeight:500,textAlign:'left'}},ic(m[1],16,C.mut),m[0])),
          h('div',{style:{height:1,background:C.line2,margin:'5px 0'}}),
          h('button',{onClick:()=>{toggleAvatar(); if(this.props.onLogout) this.props.onLogout();},style:{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 11px',border:0,background:'transparent',borderRadius:8,cursor:'pointer',fontSize:13,color:C.dng,fontWeight:600,textAlign:'left'}},ic('x',16,C.dng),'Log out'))));

    // ------- assemble -------
    const meta=this.M[S.page]||(S.page==='__404'?['eschool365','Page not found']:['','']);
    const roles=Object.keys(this.RLAB).map(r=>({label:this.RLAB[r],value:r,onClick:()=>setRole(r),
      style:{padding:'7px 13px',borderRadius:7,border:0,cursor:'pointer',fontSize:12.5,fontWeight:600,whiteSpace:'nowrap',transition:'all .15s',background:r===S.role?'#fff':'transparent',color:r===S.role?(roleAccents?this.ROLE[r]:this.IND[500]):'#7C8493',boxShadow:r===S.role?'0 1px 3px rgba(20,30,55,.12)':'none'}}));
    const scope={admin:'Whole institute',coord:'My assigned classes',teach:'My class \u00b7 VIII-A',student:'My own record'}[S.role];
    const sidebarStyle = S.collapsed
      ? {width:0,minWidth:0,overflow:'hidden',background:'#fff',borderRight:'1px solid '+C.line,display:'flex',flexDirection:'column',transition:'width .2s'}
      : (S.narrow
        ? {width:264,position:'absolute',top:0,bottom:0,left:0,zIndex:50,background:'#fff',borderRight:'1px solid '+C.line,display:'flex',flexDirection:'column',boxShadow:'0 12px 40px rgba(20,30,55,.18)'}
        : {width:264,flex:'none',background:'#fff',borderRight:'1px solid '+C.line,display:'flex',flexDirection:'column',transition:'width .2s'});

    const BNAV=({
      admin:[['Dashboard','grid','dash_admin'],['Students','user','allstd'],['Fees','wallet','collect'],['Attend','calcheck','markatt']],
      coord:[['Dashboard','grid','dash_coord'],['Students','user','allstd'],['Attend','calcheck','markatt'],['Time','calendar','tt_edit']],
      teach:[['Dashboard','grid','dash_teach'],['Attend','calcheck','markatt'],['Marks','award','exammarks'],['Time','calendar','tt_view']],
      student:[['Home','grid','dash_std'],['Fees','wallet','payonline'],['Results','award','myresult'],['Attend','calcheck','myatt']]
    }[S.role]||[]);
    const bottomNav=BNAV.map(b=>({label:b[0],iconEl:ic(b[1],22),active:S.page===b[2],onClick:()=>setPage2(b[2])})).concat([{label:'More',iconEl:ic('menu',22),active:false,onClick:toggleSidebar}]);
    return {
      brand:'eschool365', institute:'Greenfield International',
      narrow:S.narrow, accent, bottomNav,
      brandMark: h('div',{style:{width:38,height:38,borderRadius:11,background:accent,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:17,boxShadow:'0 2px 6px '+accent+'55',flex:'none'}},'G'),
      menuIcon: ic('menu',19), searchIcon: ic('search',16),
      roles, topRight,
      accentStrip:{background:'linear-gradient(90deg,'+accent+','+accent+'00)'},
      sidebarStyle, sidebarGroups,
      q:S.q, onMenuSearch, toggleSidebar,
      crumbEl: meta[0].split(' \u203a ').map((p,i,a)=>h('span',{key:i,style:{display:'inline-flex',alignItems:'center',gap:6,color:i===a.length-1?'#5A616E':'#A9AEB9',fontWeight:i===a.length-1?600:500}},p, i<a.length-1&&ic('chevR',13,'#C7CCD4'))),
      pageTitle: meta[1], pageKey:S.page,
      roleLabel:this.RLAB[S.role],
      pillStyle:{fontSize:11.5,fontWeight:700,color:accent,background:tint,padding:'4px 11px',borderRadius:20},
      scopeStyle:{display:'inline-flex',alignItems:'center',gap:5,fontSize:12,fontWeight:600,color:'#8A909E'},
      scopeIcon: ic('eye',14,'#A9AEB9'), scopeText: scope,
      mainContent: (PG[S.page]||(()=>h('div',{style:{background:C.card,border:'1px solid '+C.line,borderRadius:14,padding:'56px 20px',textAlign:'center'}},
        h('div',{style:{width:60,height:60,borderRadius:16,background:C.bg,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}},ic('search',26,C.mut2)),
        h('div',{style:{fontSize:17,fontWeight:700,color:C.ink2}}, S.page==='__404'?'Page not found':'Coming soon'),
        h('div',{style:{fontSize:13,color:C.mut,margin:'6px auto 16px',maxWidth:340}}, S.page==='__404'?'This page does not exist or is not available.':'This module is part of a later build pass.'),
        Btn('Go to dashboard',{icon:'grid',onClick:()=>setPage2({admin:'dash_admin',coord:'dash_coord',teach:'dash_teach',student:'dash_std'}[S.role])}))))(),
      subBanner: subBanner(),
      overlays: h(React.Fragment,null, toastsEl(), confirmEl(), subPickEl(), collectEl(), guardEl(), admWizEl(), drillEl())
    };
  }

  // ---- Shell (ported from the <x-dc> mustache template) ----
  render(){
    const h = React.createElement;
    const v = this.renderVals();
    return h('div',{style:{fontFamily:'Inter,-apple-system,Segoe UI,sans-serif',height:'100vh',display:'flex',flexDirection:'column',background:'#F4F6F8',color:'#1C2230',overflow:'hidden',WebkitFontSmoothing:'antialiased'}},
      h('header',{style:{height:60,flex:'none',display:'flex',alignItems:'center',gap:16,padding:'0 18px',background:'#fff',borderBottom:'1px solid #E7E9EF',position:'relative',zIndex:40}},
        h('button',{onClick:v.toggleSidebar,'aria-label':'Toggle menu',style:{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid #E7E9EF',borderRadius:8,background:'#fff',color:'#4A5160',cursor:'pointer',flex:'none'}}, v.menuIcon),
        h('div',{style:{display:'flex',alignItems:'center',gap:11,flex:'none'}}, v.brandMark,
          !v.narrow && h('div',{style:{lineHeight:1.15}},
            h('div',{style:{fontWeight:800,fontSize:14,letterSpacing:'-.2px'}}, v.institute),
            h('div',{style:{fontSize:11,color:'#8A909E',fontWeight:500}}, v.brand)
          )
        ),
        h('div',{style:{flex:1}}),
        !v.narrow && h('div',{style:{display:'flex',gap:5,background:'#F4F6F8',borderRadius:9,padding:4}},
          (v.roles||[]).map((r,i)=>h('button',{key:i,onClick:r.onClick,style:r.style}, r.label))
        ),
        v.topRight
      ),
      h('div',{style:{height:3,flex:'none',...(v.accentStrip||{})}}),
      h('div',{style:{flex:1,display:'flex',minHeight:0,position:'relative'}},
        h('aside',{style:v.sidebarStyle},
          h('div',{style:{padding:'12px 12px 8px',flex:'none'}},
            h('div',{style:{display:'flex',alignItems:'center',gap:8,background:'#F4F6F8',border:'1px solid #EAECF1',borderRadius:9,padding:'8px 11px'}},
              h('span',{style:{color:'#9AA0AC',display:'flex'}}, v.searchIcon),
              h('input',{value:v.q,onChange:v.onMenuSearch,placeholder:'Search menu…','aria-label':'Search menu',style:{border:0,background:'transparent',outline:'none',fontSize:13,width:'100%',color:'#1C2230'}})
            )
          ),
          h('nav',{style:{flex:1,overflowY:'auto',overflowX:'hidden',padding:'4px 8px 18px'}},
            (v.sidebarGroups||[]).map((g,i)=>h('div',{key:i,style:{marginBottom:1}},
              h('div',{onClick:g.onToggle,style:g.headStyle},
                h('span',{style:g.iconWrap}, g.icon),
                h('span',{style:{flex:1,textAlign:'left'}}, g.label),
                h('span',{style:g.chevStyle}, g.chev)
              ),
              g.open && h('div',{style:{padding:'2px 0 4px'}},
                (g.items||[]).map((it,j)=>h('a',{key:j,onClick:it.onClick,style:it.style},
                  h('span',{style:it.dotStyle}),
                  h('span',{style:{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}, it.label),
                  it.lockEl
                ))
              )
            ))
          )
        ),
        h('main',{style:{flex:1,overflow:'auto',minWidth:0}},
          h('div',{style:{maxWidth:1240,margin:'0 auto',padding:v.narrow?'16px 14px 88px':'22px 28px 60px'}},
            h('div',{style:{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'#9AA0AC',fontWeight:500,marginBottom:7}}, v.crumbEl),
            h('div',{style:{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',marginBottom:4}},
              h('h1',{style:{fontSize:23,fontWeight:800,letterSpacing:'-.5px',margin:0,color:'#10141F'}}, v.pageTitle),
              h('span',{style:v.pillStyle}, v.roleLabel),
              h('span',{style:v.scopeStyle}, v.scopeIcon,' ',v.scopeText)
            ),
            v.subBanner,
            h('div',{key:v.pageKey,style:{marginTop:18}}, v.mainContent)
          )
        )
      ),
      v.narrow && h('nav',{style:{position:'fixed',left:0,right:0,bottom:0,height:60,background:'#fff',borderTop:'1px solid #E7E9EF',display:'flex',zIndex:45,boxShadow:'0 -2px 12px rgba(20,30,55,.06)'}},
        (v.bottomNav||[]).map((b,i)=>h('button',{key:i,onClick:b.onClick,'aria-label':b.label,style:{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,border:0,background:'transparent',cursor:'pointer',color:b.active?v.accent:'#8A909E',fontWeight:b.active?700:500,minWidth:44}}, b.iconEl, h('span',{style:{fontSize:10.5}},b.label)))),
      v.overlays
    );
  }
}

/* ---- Error boundary: never white-screen; offer reload / reset ---- */
class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state={err:null}; }
  static getDerivedStateFromError(e){ return { err:(e&&e.message)||String(e) }; }
  componentDidCatch(e,info){ console.error('[eschool365] render error:', e, info&&info.componentStack); }
  render(){
    if(!this.state.err) return this.props.children;
    const h=React.createElement;
    return h('div',{style:{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24,fontFamily:'Inter,-apple-system,Segoe UI,sans-serif',background:'#F4F6F8'}},
      h('div',{style:{maxWidth:440,background:'#fff',border:'1px solid #E7E9EF',borderRadius:14,padding:'26px 24px',textAlign:'center',boxShadow:'0 12px 32px rgba(20,30,55,.1)'}},
        h('div',{style:{fontSize:18,fontWeight:800,color:'#10141F'}},'Something went wrong'),
        h('div',{style:{fontSize:13,color:'#737A88',margin:'8px 0 18px',lineHeight:1.55}},'The app hit an unexpected error. Your saved data is safe in this browser.'),
        h('div',{style:{display:'flex',gap:10,justifyContent:'center'}},
          h('button',{onClick:()=>location.reload(),style:{background:'#5B47E0',color:'#fff',border:0,borderRadius:9,padding:'10px 18px',fontWeight:700,cursor:'pointer'}},'Reload app'),
          h('button',{onClick:()=>{ try{ RWStore.resetDemo(); }catch(e){ location.reload(); } },style:{background:'#fff',color:'#1C2230',border:'1px solid #E7E9EF',borderRadius:9,padding:'10px 18px',fontWeight:600,cursor:'pointer'}},'Reset demo data')),
        h('div',{style:{marginTop:16,fontSize:11,color:'#9AA0AC',fontFamily:'ui-monospace,monospace',wordBreak:'break-word'}}, String(this.state.err).slice(0,180))));
  }
}

/* ---- Root: auth gate — Login when no session, the app otherwise ---- */
class Root extends React.Component {
  constructor(p){ super(p); this.state={ session:(window.RWAuth&&RWAuth.session())||null }; }
  render(){
    const h=React.createElement;
    const s=this.state.session;
    if(!s) return h(window.RWLogin,{ onAuthed:()=>this.setState({session:RWAuth.session()}) });
    RWStore.useGuest(!!s.isGuest);   // route reads/writes to the guest sandbox when guest
    return h(React.Fragment,null, h(ErrorBoundary,null, h(Component,{
      key:(s.isGuest?'g':'u')+'|'+(s.loginAt||0),       // remount on login/guest change (fresh boot + namespace)
      defaultRole:s.role, roleAccents:true, density:'comfortable', session:s,
      onLogout:()=>{ if(s.isGuest){ RWStore.useGuest(true); RWStore.clear(); } RWAuth.logout(); RWStore.useGuest(false); try{history.replaceState(null,'','#');}catch(e){} this.setState({session:null}); },
      onSwitchRole:(r)=>{ RWAuth.switchRole(r); this.setState({session:RWAuth.session()}); }
    })), (window.RWAssistant ? h(window.RWAssistant,{session:s}) : null));
  }
}

/* ---- mount ---- */
(function(){
  function mount(){
    var el=document.getElementById('root'); if(!el) return;
    ReactDOM.createRoot(el).render(React.createElement(Root));
    var b=document.getElementById('boot'); if(b) b.classList.add('boot-hidden');
  }
  if(document.readyState!=='loading') mount(); else document.addEventListener('DOMContentLoaded',mount);
})();
