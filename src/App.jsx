import { useState, useEffect, useRef } from "react";

// ─── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  dark:   { name:"다크 퍼플", emoji:"🌙", bg:"#0a0a0f", surface:"#13131a", surfaceHover:"#1c1c27", border:"#ffffff12", accent:"#c084fc", accentGlow:"#c084fc33", text:"#f0f0ff", muted:"#6b6b8a", grad:"linear-gradient(135deg,#c084fc,#f472b6)" },
  ocean:  { name:"오션 블루", emoji:"🌊", bg:"#050d1a", surface:"#0d1f35", surfaceHover:"#152b47", border:"#ffffff15", accent:"#38bdf8", accentGlow:"#38bdf833", text:"#e0f2fe", muted:"#4a7a9b", grad:"linear-gradient(135deg,#38bdf8,#818cf8)" },
  rose:   { name:"로즈 핑크", emoji:"🌸", bg:"#12080f", surface:"#1f0d18", surfaceHover:"#2d1224", border:"#ffffff12", accent:"#fb7185", accentGlow:"#fb718533", text:"#fff0f4", muted:"#7a4a5a", grad:"linear-gradient(135deg,#fb7185,#c084fc)" },
  forest: { name:"포레스트",  emoji:"🌿", bg:"#060f08", surface:"#0f1f12", surfaceHover:"#162b1a", border:"#ffffff12", accent:"#4ade80", accentGlow:"#4ade8033", text:"#f0fff4", muted:"#4a7a5a", grad:"linear-gradient(135deg,#4ade80,#34d399)" },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const USERS = [
  { id:1, name:"hayeon_",    avatar:"🌸", bio:"photographer | seoul 🇰🇷", followers:12400, following:340,  posts:87  },
  { id:2, name:"junho.v",    avatar:"🎸", bio:"music & coffee",            followers:5820,  following:210,  posts:43  },
  { id:3, name:"minjee_art", avatar:"🎨", bio:"illustrator | open comms",  followers:31000, following:512,  posts:201 },
  { id:4, name:"taewoo__",   avatar:"🏄", bio:"surf | travel | vibes",     followers:8900,  following:890,  posts:62  },
];

const INIT_ME = { id:99, name:"me._.here", avatar:"😎", bio:"나의 첫 SNS 🚀", followers:128, following:97, posts:12 };

const INIT_POSTS = [
  { id:1, user:USERS[0], image:"🌅", caption:"오늘의 노을 ✨ 서울 하늘이 이렇게 예쁠 수가", likes:847,  liked:false, saved:false, comments:[{user:USERS[1],text:"와 진짜 이쁘다 😍"},{user:USERS[2],text:"여기 어디에요?"}], time:"2시간 전", tags:["풍경","서울","노을"] },
  { id:2, user:USERS[2], image:"🎨", caption:"새 작업 완성 🖌️ 수채화 느낌으로",              likes:2341, liked:true,  saved:true,  comments:[{user:USERS[0],text:"색감이 너무 좋아요 💜"}],                        time:"5시간 전", tags:["아트","일러스트"] },
  { id:3, user:USERS[3], image:"🌊", caption:"파도야 나랑 놀자 🏄‍♂️ 오늘 컨디션 최고",        likes:512,  liked:false, saved:false, comments:[],                                                                  time:"8시간 전", tags:["서핑","바다"] },
  { id:4, user:USERS[1], image:"☕", caption:"월요일 아침은 커피 한 잔 ☕ 화이팅",            likes:234,  liked:false, saved:false, comments:[{user:USERS[3],text:"나도 한 잔 줘 ㅋㅋ"}],                          time:"1일 전",   tags:["카페","커피"] },
];

const INIT_STORIES = [
  { id:1, user:USERS[0], seen:false, emoji:"🌸" },
  { id:2, user:USERS[1], seen:false, emoji:"🎸" },
  { id:3, user:USERS[2], seen:true,  emoji:"🎨" },
  { id:4, user:USERS[3], seen:false, emoji:"🏄" },
];

const INIT_CHATS = [
  { id:1, user:USERS[0], messages:[{from:"them",text:"안녕! 사진 너무 이뻐 🌸",time:"2시간 전"},{from:"me",text:"감사해요 ㅎㅎ",time:"2시간 전"}], unread:1 },
  { id:2, user:USERS[2], messages:[{from:"them",text:"커미션 문의해도 될까요?",time:"5시간 전"}], unread:1 },
  { id:3, user:USERS[3], messages:[{from:"me",text:"서핑 어디서 배웠어요?",time:"1일 전"},{from:"them",text:"부산에서요! 같이 가요 🏄",time:"1일 전"}], unread:0 },
];

const INIT_NOTIFS = [
  { id:1, type:"like",    user:USERS[0], text:"님이 게시물을 좋아합니다.",             time:"5분 전",  read:false },
  { id:2, type:"follow",  user:USERS[2], text:"님이 팔로우하기 시작했습니다.",          time:"1시간 전", read:false },
  { id:3, type:"comment", user:USERS[1], text:"님이 댓글: \"너무 이뻐요! 💜\"",       time:"2시간 전", read:false },
  { id:4, type:"like",    user:USERS[3], text:"님이 게시물을 좋아합니다.",             time:"3시간 전", read:true  },
  { id:5, type:"live",    user:USERS[0], text:"님이 라이브를 시작했습니다! 📡",        time:"방금",     read:false },
];

const TRENDING = ["서울","아트","카페","서핑","여행","음악","일상","패션","맛집","노을","바다","일러스트"];

const COLLECTIONS = [
  { id:1, name:"나중에 보기", emoji:"🔖", postIds:[2] },
  { id:2, name:"여행 인스피",  emoji:"✈️", postIds:[] },
  { id:3, name:"아트 레퍼런스",emoji:"🎨", postIds:[2] },
];

const STORY_EMOJIS = ["🌅","🌸","🎸","🎨","🏄","☕","🌊","🌙","🌿","🔥","💜","✨"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = n => n >= 1000 ? (n/1000).toFixed(1)+"k" : n;

function Avatar({ emoji, size=40, ring=false, seen=false, live=false, C }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background: ring?(seen?"#333":C.grad):(live?C.grad:C.surfaceHover), display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.45, flexShrink:0, padding:ring||live?2:0, boxSizing:"border-box", position:"relative" }}>
      <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", border:(ring||live)?`2px solid ${C.bg}`:"none" }}>{emoji}</div>
      {live && <div style={{ position:"absolute", bottom:-2, left:"50%", transform:"translateX(-50%)", background:"#ef4444", color:"#fff", fontSize:9, fontWeight:800, borderRadius:4, padding:"1px 5px", border:`1px solid ${C.bg}` }}>LIVE</div>}
    </div>
  );
}

// ─── LOGIN / SIGNUP ───────────────────────────────────────────────────────────
function AuthPage({ onLogin, C }) {
  const [mode, setMode]       = useState("login"); // login | signup
  const [step, setStep]       = useState(1);
  const [email, setEmail]     = useState("");
  const [pw, setPw]           = useState("");
  const [name, setName]       = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar]   = useState("😎");
  const avatarOptions = ["😎","🐱","🦊","🐼","🦋","🌸","🎸","🎨","🏄","🚀","🌙","🔥"];

  const doLogin = () => {
    if (!email || !pw) return;
    onLogin({ ...INIT_ME, name: username || INIT_ME.name, avatar });
  };

  const doSignup = () => {
    if (step === 1) { if (email && pw) setStep(2); }
    else if (step === 2) { if (name && username) setStep(3); }
    else { onLogin({ ...INIT_ME, name: username, avatar, bio: "새로 가입했어요 👋" }); }
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"'Apple SD Gothic Neo',sans-serif" }}>
      <div style={{ width:"100%", maxWidth:380 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontWeight:900, fontSize:42, background:C.grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:-2 }}>PULSE</div>
          <div style={{ color:C.muted, fontSize:14, marginTop:6 }}>나만의 SNS, 지금 시작해요 ✨</div>
        </div>

        <div style={{ background:C.surface, borderRadius:24, border:`1px solid ${C.border}`, padding:28 }}>
          {/* Tabs */}
          <div style={{ display:"flex", background:C.surfaceHover, borderRadius:14, padding:4, marginBottom:24 }}>
            {["login","signup"].map(m => (
              <button key={m} onClick={()=>{setMode(m);setStep(1);}} style={{ flex:1, background:mode===m?C.accent:"none", border:"none", borderRadius:10, padding:"10px 0", color:mode===m?"#fff":C.muted, fontWeight:700, fontSize:14, cursor:"pointer", transition:"all 0.2s" }}>
                {m==="login"?"로그인":"회원가입"}
              </button>
            ))}
          </div>

          {mode === "login" ? (
            <>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="이메일" style={{ width:"100%", background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 16px", color:C.text, fontSize:14, outline:"none", marginBottom:12, boxSizing:"border-box" }} />
              <input value={pw} onChange={e=>setPw(e.target.value)} type="password" placeholder="비밀번호" style={{ width:"100%", background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 16px", color:C.text, fontSize:14, outline:"none", marginBottom:20, boxSizing:"border-box" }} />
              <button onClick={doLogin} style={{ width:"100%", background:C.grad, border:"none", borderRadius:14, padding:"14px 0", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer" }}>로그인</button>
              <div style={{ textAlign:"center", marginTop:16, color:C.muted, fontSize:13 }}>비밀번호를 잊으셨나요? <span style={{ color:C.accent, cursor:"pointer" }}>재설정</span></div>
            </>
          ) : (
            <>
              {/* Step indicator */}
              <div style={{ display:"flex", gap:6, marginBottom:24 }}>
                {[1,2,3].map(s => <div key={s} style={{ flex:1, height:4, borderRadius:2, background:step>=s?C.accent:C.surfaceHover, transition:"all 0.3s" }} />)}
              </div>

              {step===1 && <>
                <div style={{ color:C.muted, fontSize:13, marginBottom:16 }}>1단계 · 계정 정보</div>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="이메일" style={{ width:"100%", background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 16px", color:C.text, fontSize:14, outline:"none", marginBottom:12, boxSizing:"border-box" }} />
                <input value={pw} onChange={e=>setPw(e.target.value)} type="password" placeholder="비밀번호 (8자 이상)" style={{ width:"100%", background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 16px", color:C.text, fontSize:14, outline:"none", marginBottom:20, boxSizing:"border-box" }} />
              </>}

              {step===2 && <>
                <div style={{ color:C.muted, fontSize:13, marginBottom:16 }}>2단계 · 프로필 기본 정보</div>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="이름" style={{ width:"100%", background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 16px", color:C.text, fontSize:14, outline:"none", marginBottom:12, boxSizing:"border-box" }} />
                <input value={username} onChange={e=>setUsername(e.target.value.replace(/\s/,""))} placeholder="사용자 이름 (영문/숫자)" style={{ width:"100%", background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 16px", color:C.text, fontSize:14, outline:"none", marginBottom:20, boxSizing:"border-box" }} />
              </>}

              {step===3 && <>
                <div style={{ color:C.muted, fontSize:13, marginBottom:16 }}>3단계 · 프로필 사진 선택</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:20, justifyContent:"center" }}>
                  {avatarOptions.map(a => (
                    <button key={a} onClick={()=>setAvatar(a)} style={{ width:52, height:52, fontSize:28, background:avatar===a?C.accentGlow:C.surfaceHover, border:avatar===a?`2px solid ${C.accent}`:`1px solid ${C.border}`, borderRadius:14, cursor:"pointer" }}>{a}</button>
                  ))}
                </div>
                <div style={{ textAlign:"center", marginBottom:20 }}>
                  <Avatar emoji={avatar} size={72} ring C={C} />
                  <div style={{ color:C.text, fontWeight:700, marginTop:8 }}>{username}</div>
                </div>
              </>}

              <button onClick={doSignup} style={{ width:"100%", background:C.grad, border:"none", borderRadius:14, padding:"14px 0", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer" }}>
                {step===3?"완료하고 시작하기 🚀":"다음"}
              </button>
            </>
          )}
        </div>

        <div style={{ textAlign:"center", marginTop:20, color:C.muted, fontSize:12 }}>가입하면 PULSE 이용약관에 동의하게 됩니다.</div>
      </div>
    </div>
  );
}

// ─── STORY BAR ────────────────────────────────────────────────────────────────
function StoryBar({ stories, onView, onAddStory, C }) {
  return (
    <div style={{ display:"flex", gap:16, overflowX:"auto", padding:"16px 0", scrollbarWidth:"none" }}>
      <div onClick={onAddStory} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer", minWidth:60 }}>
        <div style={{ position:"relative" }}>
          <div style={{ width:60, height:60, borderRadius:"50%", background:C.surfaceHover, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>😎</div>
          <div style={{ position:"absolute", bottom:0, right:0, width:20, height:20, borderRadius:"50%", background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, border:`2px solid ${C.bg}`, color:"#fff" }}>+</div>
        </div>
        <span style={{ fontSize:11, color:C.muted }}>내 스토리</span>
      </div>
      {stories.map(s => (
        <div key={s.id} onClick={()=>onView(s)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer", minWidth:60 }}>
          <Avatar emoji={s.user.avatar} size={60} ring seen={s.seen} live={s.live} C={C} />
          <span style={{ fontSize:11, color:s.seen?C.muted:C.text, maxWidth:60, textAlign:"center", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.user.name}</span>
        </div>
      ))}
    </div>
  );
}

// ─── POST ─────────────────────────────────────────────────────────────────────
function Post({ post, onLike, onComment, onSave, onTagClick, C }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText]   = useState("");
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  const doComment = () => {
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText("");
  };

  return (
    <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, overflow:"hidden", marginBottom:16, position:"relative" }}>
      <div style={{ display:"flex", alignItems:"center", padding:"14px 16px", gap:12 }}>
        <Avatar emoji={post.user.avatar} size={38} ring C={C} />
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{post.user.name}</div>
          <div style={{ fontSize:11, color:C.muted }}>{post.time}</div>
        </div>
        <span style={{ fontSize:20, cursor:"pointer", color:C.muted }}>···</span>
      </div>
      <div style={{ height:280, background:`linear-gradient(135deg,${C.surfaceHover},${C.bg})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:90 }}>{post.image}<
(Content truncated due to size limit. Use line ranges to read remaining content)
