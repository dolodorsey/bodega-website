"use client";
import { useMemo, useState } from "react";

const ENDPOINT = "https://dzlmtvodpyhetvektfuo.supabase.co/functions/v1/ambassador-intake";

const initial = {
  first_name:"",last_name:"",email:"",phone:"",instagram_handle:"",tiktok_handle:"",
  city:"",audience_size:"",average_story_views:"",average_reel_views:"",
  content_lane:"",monthly_commitment:"",referral_source:"",why_you:"",availability:"",
  experience:"",consent:false,company_website:""
};

export default function FenyxAmbassadorsPage(){
  const [form,setForm]=useState(initial);
  const [status,setStatus]=useState("idle");
  const [message,setMessage]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const valid=useMemo(()=>form.first_name.trim().length>1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.instagram_handle.trim().length>1 && form.content_lane.trim().length>1 && form.why_you.trim().length>=5 && form.consent,[form]);

  async function submit(e){
    e.preventDefault();
    if(!valid||status==="sending")return;
    setStatus("sending");setMessage("");
    try{
      const r=await fetch(ENDPOINT,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
        brand_key:"fenyx",...form,
        full_name:`${form.first_name} ${form.last_name}`.trim(),
        audience_size:form.audience_size?Number(form.audience_size):null,
        average_story_views:form.average_story_views?Number(form.average_story_views):null,
        average_reel_views:form.average_reel_views?Number(form.average_reel_views):null,
        source:"bodegabodegabodega.com/fenyx/ambassadors"
      })});
      const body=await r.json().catch(()=>({}));
      if(!r.ok||!body.ok)throw new Error(body.error||"Application could not be submitted.");
      setStatus("success");
      setMessage(body.email?.provider_accepted
        ?"Application received. Check your email for confirmation."
        :"Application received. The FĚNYX team will review it and contact you directly.");
      setForm(initial);
    }catch(err){setStatus("error");setMessage(err?.message||"Application could not be submitted.");}
  }

  return <main style={S.page}>
    <div style={S.gridBg}/>
    <section style={S.wrap}>
      <a href="/fenyx" style={S.back}>← FĚNYX</a>
      <div style={S.kicker}>FĚNYX PERFORMANCE NETWORK</div>
      <h1 style={S.h1}>Earn the uniform.</h1>
      <p style={S.lead}>FĚNYX is building an athlete, trainer and performance-creator network around discipline, competition and consistency. We are looking for people who actually live the work.</p>

      {status==="success"?<div style={S.success}><div style={S.mark}>F</div><h2>APPLICATION RECEIVED</h2><p>{message}</p><button onClick={()=>setStatus("idle")} style={S.button}>SUBMIT ANOTHER</button></div>:
      <form onSubmit={submit} style={S.card}>
        <div style={S.section}>01 — ATHLETE / CREATOR PROFILE</div>
        <div style={S.grid}>
          <Field label="First name"><input value={form.first_name} onChange={e=>set("first_name",e.target.value)} required style={S.input}/></Field>
          <Field label="Last name"><input value={form.last_name} onChange={e=>set("last_name",e.target.value)} style={S.input}/></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} required style={S.input}/></Field>
          <Field label="Phone"><input type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)} style={S.input}/></Field>
          <Field label="City / market"><input value={form.city} onChange={e=>set("city",e.target.value)} style={S.input}/></Field>
          <Field label="Instagram"><input value={form.instagram_handle} onChange={e=>set("instagram_handle",e.target.value)} placeholder="@username" required style={S.input}/></Field>
          <Field label="TikTok · optional"><input value={form.tiktok_handle} onChange={e=>set("tiktok_handle",e.target.value)} placeholder="@username" style={S.input}/></Field>
          <Field label="Audience size · optional"><input inputMode="numeric" value={form.audience_size} onChange={e=>set("audience_size",e.target.value)} style={S.input}/></Field>
        </div>

        <div style={S.section}>02 — PERFORMANCE FIT</div>
        <div style={S.grid}>
          <Field label="Sport / training / content lane"><input value={form.content_lane} onChange={e=>set("content_lane",e.target.value)} placeholder="Basketball, football, trainer, fitness..." required style={S.input}/></Field>
          <Field label="Average Story views · optional"><input inputMode="numeric" value={form.average_story_views} onChange={e=>set("average_story_views",e.target.value)} style={S.input}/></Field>
          <Field label="Average Reel/video views · optional"><input inputMode="numeric" value={form.average_reel_views} onChange={e=>set("average_reel_views",e.target.value)} style={S.input}/></Field>
          <Field label="Monthly commitment · optional"><input value={form.monthly_commitment} onChange={e=>set("monthly_commitment",e.target.value)} placeholder="2 training Reels + 4 Stories" style={S.input}/></Field>
          <Field label="Who referred you? · optional"><input value={form.referral_source} onChange={e=>set("referral_source",e.target.value)} style={S.input}/></Field>
          <Field label="Availability · optional"><input value={form.availability} onChange={e=>set("availability",e.target.value)} placeholder="Training, events, travel..." style={S.input}/></Field>
        </div>
        <Field label="Your athletic / training / performance background"><textarea rows={5} value={form.experience} onChange={e=>set("experience",e.target.value)} style={S.textarea}/></Field>
        <Field label="Why should FĚNYX choose you?"><textarea rows={6} value={form.why_you} onChange={e=>set("why_you",e.target.value)} required style={S.textarea}/></Field>
        <label style={{display:"none"}}>Website<input tabIndex={-1} autoComplete="off" value={form.company_website} onChange={e=>set("company_website",e.target.value)}/></label>
        <label style={S.consent}><input type="checkbox" checked={form.consent} onChange={e=>set("consent",e.target.checked)}/><span>I agree to receive FĚNYX application and program communications. Applying does not guarantee acceptance, product, compensation or an ambassador title.</span></label>
        {status==="error"&&<div style={S.error}>{message}</div>}
        <button disabled={!valid||status==="sending"} style={{...S.button,opacity:valid?1:.4}}>{status==="sending"?"SUBMITTING...":"SUBMIT APPLICATION"}</button>
      </form>}
    </section>
  </main>
}

function Field({label,children}){return <label style={S.field}><span style={S.label}>{label}</span>{children}</label>}
const S={
  page:{minHeight:"100vh",background:"#050505",color:"#f7f7f2",fontFamily:"Arial,Helvetica,sans-serif",position:"relative"},
  gridBg:{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)",backgroundSize:"44px 44px",pointerEvents:"none"},
  wrap:{width:"min(920px,calc(100% - 32px))",margin:"0 auto",padding:"48px 0 100px",position:"relative"},
  back:{color:"#818181",textDecoration:"none",fontSize:12,letterSpacing:2},
  kicker:{marginTop:70,fontSize:10,letterSpacing:4,color:"#d7ff43",fontWeight:900},
  h1:{fontSize:"clamp(58px,10vw,112px)",lineHeight:.86,letterSpacing:"-.06em",textTransform:"uppercase",margin:"18px 0 24px"},
  lead:{maxWidth:700,color:"#aaa",fontSize:17,lineHeight:1.7,marginBottom:34},
  card:{background:"#0b0b0b",border:"1px solid #242424",borderRadius:22,padding:"clamp(22px,5vw,44px)",boxShadow:"0 28px 90px rgba(0,0,0,.55)"},
  section:{fontSize:10,letterSpacing:3,color:"#d7ff43",fontWeight:900,margin:"12px 0 20px"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14},
  field:{display:"block",marginBottom:16},
  label:{display:"block",fontSize:10,letterSpacing:1.4,textTransform:"uppercase",color:"#aaa",fontWeight:800,marginBottom:8},
  input:{width:"100%",boxSizing:"border-box",background:"#111",border:"1px solid #2b2b2b",borderRadius:9,color:"#fff",padding:"14px 15px",fontSize:16},
  textarea:{width:"100%",boxSizing:"border-box",background:"#111",border:"1px solid #2b2b2b",borderRadius:9,color:"#fff",padding:"14px 15px",fontSize:16,resize:"vertical"},
  consent:{display:"flex",gap:10,alignItems:"flex-start",color:"#888",fontSize:12,lineHeight:1.55,margin:"6px 0 20px"},
  button:{width:"100%",border:0,borderRadius:9,padding:"17px 20px",background:"#d7ff43",color:"#050505",fontWeight:950,letterSpacing:2,cursor:"pointer"},
  error:{padding:12,border:"1px solid #743737",background:"#2b1111",borderRadius:9,color:"#ffb4b4",marginBottom:14},
  success:{background:"#0b0b0b",border:"1px solid #2a2a2a",borderRadius:22,padding:"50px 32px",textAlign:"center"},
  mark:{width:68,height:68,display:"grid",placeItems:"center",margin:"0 auto 18px",borderRadius:"50%",border:"2px solid #d7ff43",color:"#d7ff43",fontSize:30,fontWeight:900}
};
