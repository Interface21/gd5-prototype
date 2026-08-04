/* ══════════════════════════════════════════════════════════════
   GD5 SHARED APP SHELL — Top bar + Icon rail + Profile menu
   Loaded by every page: fetched as text, concatenated with the
   page's own jsx-src, then transpiled together in one Babel pass.
   (See bootstrap <script> at the bottom of each page.)

   Usage in a page's jsx-src:
     <GD5AppShell active="pa" bg="#eef1f6">
       ...page content (was previously the sibling of ICON RAIL)...
     </GD5AppShell>

   `active` — one of: dashboard | org | received | sent | meeting | pa
   `bg`     — page background color (default #eef1f6)
   `onGoAdmin` / `onGoPA` — optional overrides; pages that host their
     own PA app state (pa-my.html) pass internal setView() callbacks,
     every other page falls back to a normal page navigation.

   NOTE: internal names are prefixed with GD5_ / GD5 to avoid colliding
   with each page's own `primary`, `primarySoft`, etc.
══════════════════════════════════════════════════════════════ */
const GD5_PRIMARY='#15a08f', GD5_PRIMARY_SOFT='#e3f3f0';
if(!document.getElementById('gd5-proto-style')){
  const st=document.createElement('style');
  st.id='gd5-proto-style';
  st.textContent="@keyframes gd5dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}";
  document.head.appendChild(st);
}
const GD5_RAIL=[
  {icon:'bi-layout-sidebar',key:'dashboard',href:'dashboard.html'},
  {icon:'bi-graph-up',key:'org',href:'org-dashboard.html'},
  {icon:'bi-arrow-down-left',key:'received',href:'assignee-action-list.html'},
  {icon:'bi-arrow-up-right',key:'sent',href:'commander-action-dashboard.html'},
  {icon:'bi-easel',key:'meeting',href:'user-virtual-meeting.html'},
  {icon:'bi-file-earmark-arrow-down',key:'download',href:null},
  {icon:'bi-book',key:'book',href:null},
  {icon:'bi-clipboard-data',key:'business',href:'business-plan-responsible-list.html'},
];
/* NOTE: PA ("ประเมินผลงาน (PA)") is intentionally NOT on the icon rail —
   it's reached only via the profile dropdown menu (see GD5ProfileMenu below),
   consistent with how pa-my.html itself is entered. Passing active="pa" simply
   leaves the rail with nothing highlighted, which is correct. */

function GD5ProfileMenu({onClose,onGoAdmin,onGoPA}){
  const ref=React.useRef(null);
  React.useEffect(()=>{
    const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))onClose();};
    document.addEventListener('mousedown',h);
    return ()=>document.removeEventListener('mousedown',h);
  },[]);
  const Row=({icon,label,chevron,accent,danger,onClick})=>(
    <button onClick={()=>{onClick&&onClick();onClose();}} className="nav-item" style={{display:'flex',alignItems:'center',gap:11,padding:'9px 14px',fontSize:13,color:danger?'#d83a3a':accent?GD5_PRIMARY:'#2b3440',fontWeight:accent?700:500,width:'100%',background:'none',border:'none',cursor:'pointer',textAlign:'left',borderRadius:0}}>
      <i className={'bi '+icon} style={{fontSize:15,color:danger?'#d83a3a':accent?GD5_PRIMARY:'#8a93a3',flex:'none'}}></i>
      <span style={{flex:1}}>{label}</span>
      {chevron&&<i className="bi bi-chevron-right" style={{fontSize:11,color:'#c4ccd4'}}></i>}
    </button>
  );
  return (
    <div ref={ref} style={{position:'absolute',top:52,right:0,width:250,background:'#fff',border:'1px solid #e3e7ec',borderRadius:12,boxShadow:'0 8px 24px rgba(16,24,40,.14)',zIndex:999,padding:'6px 0',animation:'popIn .15s ease'}}>
      <button onClick={onClose} className="nav-item" style={{display:'flex',alignItems:'center',gap:11,padding:'10px 14px',width:'100%',background:'none',border:'none',cursor:'pointer',textAlign:'left'}}>
        <i className="bi bi-gift-fill" style={{fontSize:15,color:GD5_PRIMARY,flex:'none'}}></i>
        <span style={{flex:1,fontSize:13,fontWeight:600,color:GD5_PRIMARY,textDecoration:'underline',textUnderlineOffset:3}}>ให้รางวัลได้อีก</span>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:16,fontWeight:800,color:GD5_PRIMARY,lineHeight:1}}>46</div>
          <div style={{fontSize:10,color:'#9aa3af'}}>ครั้ง</div>
        </div>
      </button>
      <Row icon="bi-people-fill" label="ดูโปรไฟล์ทั้งหมด" chevron/>
      <Row icon="bi-gear" label="ตั้งค่าโปรไฟล์"/>
      <Row icon="bi-shield-lock-fill" label="ผู้ดูแลระบบ" accent onClick={onGoAdmin}/>

      <div style={{height:1,background:'#eceef2',margin:'5px 0'}}></div>
      <Row icon="bi-clipboard-data-fill" label="ประเมินผลงาน (PA)" accent onClick={onGoPA}/>

      <div style={{height:1,background:'#eceef2',margin:'5px 0'}}></div>
      <Row icon="bi-question-circle" label="ศูนย์ช่วยเหลือ"/>
      <Row icon="bi-sun" label="ธีมของแอป : กลางวัน" chevron/>
      <Row icon="bi-globe2" label="ภาษา : ไทย" chevron/>

      <div style={{height:1,background:'#eceef2',margin:'5px 0'}}></div>
      <Row icon="bi-headset" label="ติดต่อเจ้าหน้าที่"/>
      <Row icon="bi-box-arrow-right" label="ออกจากระบบ" danger/>
    </div>
  );
}

function GD5AppShell({active,bg,children,onGoAdmin,onGoPA}){
  const [showProfile,setShowProfile]=React.useState(false);
  const goAdmin=onGoAdmin||(()=>{window.location.href='pa-my.html';});
  const goPA=onGoPA||(()=>{window.location.href='pa-my.html';});
  return (
    <div style={{minHeight:'100vh',background:bg||'#eef1f6'}}>
      {/* TOP BAR */}
      <div style={{height:58,background:'#fff',borderBottom:'1px solid #e7eaef',display:'flex',alignItems:'center',gap:18,padding:'0 18px',position:'sticky',top:0,zIndex:40}}>
        <a href="dashboard.html" style={{display:'flex',alignItems:'center'}}>
          <img src="image/logo.png" style={{height:36,objectFit:'contain'}} alt="GiveD5"/>
        </a>
        <div style={{display:'flex',alignItems:'center',gap:8,background:'#f1f3f7',border:'1px solid #e7eaef',borderRadius:8,padding:'8px 12px',width:280}}>
          <i className="bi bi-search" style={{fontSize:15,color:'#9aa3af'}}></i>
          <span style={{color:'#9aa3af',fontSize:13}}>ค้นหา GiveD5</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:9,padding:'7px 16px 7px 11px',background:'rgba(225,235,242,0.62)',border:'1.5px solid rgba(180,205,220,0.55)',borderRadius:9,userSelect:'none',flex:'none'}}>
          <span style={{width:8,height:8,borderRadius:4,background:GD5_PRIMARY,flex:'none',animation:'gd5dot 2.4s ease-in-out infinite',boxShadow:'0 0 0 3px rgba(21,160,143,0.2)'}}></span>
          <span style={{fontSize:12,fontWeight:700,color:'rgba(18,30,44,0.65)',letterSpacing:'.8px',textTransform:'uppercase'}}>Prototype</span>
          <span style={{width:1,height:13,background:'rgba(18,30,44,0.15)',flex:'none'}}></span>
          <span style={{fontSize:11.5,fontWeight:500,color:'rgba(18,30,44,0.45)',letterSpacing:'.2px'}}>GiveD5</span>
        </div>
        <div style={{flex:1}}></div>
        <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',width:36,height:36}}>
          <i className="bi bi-bell" style={{fontSize:20,color:'#5a6473'}}></i>
          <span style={{position:'absolute',top:-2,right:-2,background:'#ef4444',color:'#fff',fontSize:10,fontWeight:700,borderRadius:4,minWidth:16,height:16,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 3px'}}>2</span>
        </div>
        <i className="bi bi-chat" style={{fontSize:20,color:'#5a6473'}}></i>
        <div style={{display:'flex',alignItems:'center',gap:5,color:'#5a6473'}}>
          <i className="bi bi-globe2" style={{fontSize:17}}></i>
          <span style={{fontSize:13}}>ไทย</span>
          <i className="bi bi-chevron-down" style={{fontSize:12,color:'#9aa3af'}}></i>
        </div>
        <i className="bi bi-moon" style={{fontSize:19,color:'#5a6473'}}></i>
        <div style={{display:'flex',alignItems:'center',gap:10,paddingLeft:10,borderLeft:'1px solid #e7eaef',position:'relative'}}>
          <div style={{lineHeight:1.2,textAlign:'right'}}>
            <div style={{fontWeight:700,fontSize:13.5,color:'#1f2733'}}>Piyawat Takaew</div>
            <div style={{fontSize:11.5,color:'#8a93a3'}}>SA Staff</div>
          </div>
          <div onClick={()=>setShowProfile(p=>!p)} style={{width:38,height:38,borderRadius:'50%',background:GD5_PRIMARY,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:16,flex:'none',cursor:'pointer',userSelect:'none'}}>P</div>
          <i className="bi bi-chevron-down" onClick={()=>setShowProfile(p=>!p)} style={{fontSize:12,color:'#9aa3af',cursor:'pointer'}}></i>
          {showProfile&&<GD5ProfileMenu onClose={()=>setShowProfile(false)} onGoAdmin={goAdmin} onGoPA={goPA}/>}
        </div>
      </div>

      <div style={{display:'flex'}}>
        {/* ICON RAIL */}
        <div style={{width:60,background:'#fff',borderRight:'1px solid #e7eaef',display:'flex',flexDirection:'column',alignItems:'center',gap:6,padding:'14px 0',position:'sticky',top:58,height:'calc(100vh - 58px)'}}>
          <div onClick={()=>setShowProfile(p=>!p)} style={{width:34,height:34,borderRadius:'50%',background:GD5_PRIMARY,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:14,marginBottom:4,flex:'none',cursor:'pointer'}}>P</div>
          {GD5_RAIL.map((n,i)=>{
            const act=n.key===active;
            return n.href ? (
              <a key={i} href={n.href} style={{textDecoration:'none',width:40,height:40,borderRadius:9,background:act?GD5_PRIMARY_SOFT:'transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <i className={'bi '+n.icon} style={{fontSize:20,color:act?GD5_PRIMARY:'#9aa3af'}}></i>
              </a>
            ) : (
              <div key={i} style={{width:40,height:40,borderRadius:9,background:'transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <i className={'bi '+n.icon} style={{fontSize:20,color:'#9aa3af'}}></i>
              </div>
            );
          })}
          <div style={{flex:1}}></div>
          <div style={{width:36,height:36,borderRadius:8,background:'#f0f2f5',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <i className="bi bi-chevron-down" style={{fontSize:17,color:'#5a6473'}}></i>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
