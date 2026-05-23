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
  const doComment = () => { if (commentText.trim()) { onComment(post.id, commentText.trim()); setCommentText(""); } };

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

      <div style={{ height:280, background:`linear-gradient(135deg,${C.surfaceHover},${C.bg})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:90 }}>{post.image}</div>

      <div style={{ padding:"12px 16px" }}>
        <div style={{ display:"flex", gap:16, marginBottom:10, alignItems:"center" }}>
          <button onClick={()=>onLike(post.id)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:24, padding:0, filter:post.liked?"none":"grayscale(1)", transform:post.liked?"scale(1.2)":"scale(1)", transition:"all 0.2s" }}>{post.liked?"❤️":"🤍"}</button>
          <button onClick={()=>setShowComments(!showComments)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, padding:0 }}>💬</button>
          <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, padding:0 }}>📤</button>
          <div style={{ marginLeft:"auto", position:"relative" }}>
            <button onClick={()=>setShowSaveMenu(!showSaveMenu)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, padding:0 }}>{post.saved?"🔖":"🏷️"}</button>
            {showSaveMenu && (
              <div style={{ position:"absolute", right:0, bottom:36, background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:12, width:160, zIndex:10, boxShadow:"0 8px 32px #00000066" }}>
                <div style={{ fontSize:12, color:C.muted, marginBottom:8, fontWeight:700 }}>컬렉션에 저장</div>
                {COLLECTIONS.map(col => (
                  <button key={col.id} onClick={()=>{ onSave(post.id, col.id); setShowSaveMenu(false); }} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", background:"none", border:"none", cursor:"pointer", color:C.text, fontSize:13, padding:"6px 0" }}>
                    <span>{col.emoji}</span><span>{col.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:6 }}>좋아요 {fmt(post.likes+(post.liked?1:0))}개</div>
        <div style={{ fontSize:14, color:C.text, marginBottom:6 }}>
          <span style={{ fontWeight:700 }}>{post.user.name}</span>{" "}
          <span style={{ opacity:0.85 }}>{post.caption}</span>
        </div>

        {post.tags?.length>0 && (
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
            {post.tags.map(t => <span key={t} onClick={()=>onTagClick(t)} style={{ fontSize:12, color:C.accent, background:C.accentGlow, borderRadius:8, padding:"2px 8px", cursor:"pointer" }}>#{t}</span>)}
          </div>
        )}

        {post.comments.length>0 && <button onClick={()=>setShowComments(!showComments)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:C.muted, padding:0, marginBottom:6 }}>댓글 {post.comments.length}개 보기</button>}
        {showComments && <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:8 }}>{post.comments.map((c,i)=><div key={i} style={{ fontSize:13, color:C.text }}><span style={{ fontWeight:700 }}>{c.user.name}</span>{" "}<span style={{ opacity:0.85 }}>{c.text}</span></div>)}</div>}

        <div style={{ display:"flex", gap:10, marginTop:8, alignItems:"center" }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:C.surfaceHover, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>😎</div>
          <input value={commentText} onChange={e=>setCommentText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doComment()} placeholder="댓글 달기..." style={{ flex:1, background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:20, padding:"8px 14px", color:C.text, fontSize:13, outline:"none" }} />
          {commentText && <button onClick={doComment} style={{ background:C.accent, border:"none", borderRadius:12, padding:"6px 14px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>게시</button>}
        </div>
      </div>
    </div>
  );
}

// ─── TRENDING / HASHTAG PAGE ───────────────────────────────────────────────────
function ExplorePage({ posts, C, onTagClick, onUserClick }) {
  const [query, setQuery]     = useState("");
  const [activeTag, setActive] = useState(null);

  const handleTag = t => { setActive(t); onTagClick(t); };

  return (
    <div>
      <div style={{ background:C.surfaceHover, borderRadius:14, display:"flex", alignItems:"center", gap:10, padding:"12px 16px", margin:"16px 0", border:`1px solid ${C.border}` }}>
        <span style={{ fontSize:18 }}>🔍</span>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="검색" style={{ background:"none", border:"none", color:C.text, fontSize:15, outline:"none", flex:1 }} />
      </div>

      {/* Trending tags */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontWeight:800, fontSize:15, color:C.text, marginBottom:10 }}>🔥 트렌딩 해시태그</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {TRENDING.map((tag,i) => (
            <button key={tag} onClick={()=>handleTag(tag)} style={{ background:activeTag===tag?C.accent:C.surfaceHover, border:`1px solid ${activeTag===tag?C.accent:C.border}`, borderRadius:20, padding:"6px 14px", color:activeTag===tag?"#fff":C.text, fontSize:13, cursor:"pointer" }}>
              #{tag} <span style={{ color:activeTag===tag?"#ffffffaa":C.muted, fontSize:11 }}>{(9-i)*1.2|0}k</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI recs */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontWeight:800, fontSize:15, background:C.grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:10 }}>✨ AI 맞춤 추천</div>
        <div style={{ display:"flex", gap:12, overflowX:"auto", scrollbarWidth:"none" }}>
          {[{avatar:"📷",name:"sora.photo",image:"🗻",reason:"풍경 관심사"},{avatar:"🥐",name:"bakelife_",image:"🥐",reason:"음식 콘텐츠"},{avatar:"🎵",name:"urban.wav",image:"🎹",reason:"음악 팔로우 기반"}].map(r=>(
            <div key={r.name} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", minWidth:160, flexShrink:0 }}>
              <div style={{ height:100, background:`linear-gradient(135deg,${C.surfaceHover},${C.bg})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:44 }}>{r.image}</div>
              <div style={{ padding:"10px 12px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                  <span style={{ fontSize:20 }}>{r.avatar}</span>
                  <span style={{ fontWeight:700, fontSize:13, color:C.text }}>{r.name}</span>
                </div>
                <div style={{ fontSize:11, color:C.accent, background:C.accentGlow, borderRadius:6, padding:"2px 8px", display:"inline-block" }}>🤖 {r.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:3, borderRadius:16, overflow:"hidden" }}>
        {["🌅","🎨","🌊","☕","🌸","🎸","🏄","🌙","🌿","🐱","🍜","🌃"].map((img,i)=>(
          <div key={i} onClick={()=>onUserClick(USERS[i%USERS.length])} style={{ aspectRatio:"1", background:C.surfaceHover, display:"flex", alignItems:"center", justifyContent:"center", fontSize:38, cursor:"pointer", transition:"opacity 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.7"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>{img}</div>
        ))}
      </div>
    </div>
  );
}

// ─── HASHTAG FEED ─────────────────────────────────────────────────────────────
function HashtagFeed({ tag, posts, onBack, onLike, onComment, onSave, C }) {
  const filtered = posts.filter(p => p.tags?.includes(tag));
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 0", borderBottom:`1px solid ${C.border}`, marginBottom:16 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:C.accent, fontSize:22 }}>←</button>
        <div>
          <div style={{ fontWeight:800, fontSize:18, color:C.text }}>#{tag}</div>
          <div style={{ fontSize:12, color:C.muted }}>{filtered.length}개의 게시물</div>
        </div>
      </div>
      {filtered.length===0
        ? <div style={{ textAlign:"center", color:C.muted, padding:40, fontSize:32 }}>🔍<br/><span style={{ fontSize:14 }}>게시물이 없어요</span></div>
        : filtered.map(p=><Post key={p.id} post={p} onLike={onLike} onComment={onComment} onSave={onSave} onTagClick={()=>{}} C={C} />)
      }
    </div>
  );
}

// ─── DM ───────────────────────────────────────────────────────────────────────
function DMPage({ chats, setChats, C }) {
  const [active, setActive] = useState(null);
  const [input, setInput]   = useState("");
  const bottomRef           = useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[active]);

  const send = () => {
    if (!input.trim()||!active) return;
    const msg = {from:"me",text:input.trim(),time:"방금"};
    setChats(prev=>prev.map(c=>c.id===active.id?{...c,messages:[...c.messages,msg],unread:0}:c));
    setActive(prev=>({...prev,messages:[...prev.messages,msg]}));
    setInput("");
    setTimeout(()=>{
      const rs=["ㅎㅎ 맞아요!","오 진짜요?? 😮","완전 공감 ㅋㅋㅋ","나중에 같이 해요 🙌","👍","ㅋㅋㅋ"];
      const r={from:"them",text:rs[Math.random()*rs.length|0],time:"방금"};
      setChats(prev=>prev.map(c=>c.id===active.id?{...c,messages:[...c.messages,msg,r]}:c));
      setActive(prev=>({...prev,messages:[...prev.messages,r]}));
    },1200);
  };

  if (active) {
    const chat = chats.find(c=>c.id===active.id)||active;
    return (
      <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 140px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${C.border}`, marginBottom:12 }}>
          <button onClick={()=>setActive(null)} style={{ background:"none", border:"none", cursor:"pointer", color:C.accent, fontSize:22 }}>←</button>
          <Avatar emoji={active.user.avatar} size={38} ring C={C} />
          <div><div style={{ fontWeight:700, color:C.text }}>{active.user.name}</div><div style={{ fontSize:11, color:C.accent }}>● 온라인</div></div>
        </div>
        <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, paddingBottom:8 }}>
          {chat.messages.map((m,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:m.from==="me"?"flex-end":"flex-start", gap:8, alignItems:"flex-end" }}>
              {m.from==="them" && <div style={{ width:28, height:28, borderRadius:"50%", background:C.surfaceHover, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{active.user.avatar}</div>}
              <div style={{ maxWidth:"70%", background:m.from==="me"?C.accent:C.surfaceHover, color:m.from==="me"?"#fff":C.text, borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"10px 14px", fontSize:14, lineHeight:1.4 }}>{m.text}</div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center", paddingTop:8, borderTop:`1px solid ${C.border}` }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="메시지 입력..." style={{ flex:1, background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:22, padding:"10px 16px", color:C.text, fontSize:14, outline:"none" }} />
          <button onClick={send} style={{ background:C.grad, border:"none", borderRadius:"50%", width:42, height:42, fontSize:18, cursor:"pointer" }}>↑</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop:8 }}>
      <div style={{ fontWeight:800, fontSize:18, color:C.text, marginBottom:16 }}>메시지</div>
      {chats.map(chat=>(
        <div key={chat.id} onClick={()=>{ setActive(chat); setChats(chats.map(c=>c.id===chat.id?{...c,unread:0}:c)); }}
          style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:`1px solid ${C.border}`, cursor:"pointer" }}>
          <Avatar emoji={chat.user.avatar} size={50} ring C={C} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:chat.unread?800:600, color:C.text, marginBottom:3 }}>{chat.user.name}</div>
            <div style={{ fontSize:13, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{chat.messages[chat.messages.length-1]?.text}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
            <div style={{ fontSize:11, color:C.muted }}>{chat.messages[chat.messages.length-1]?.time}</div>
            {chat.unread>0&&<div style={{ background:C.accent, color:"#fff", borderRadius:"50%", width:20, height:20, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{chat.unread}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function NotifPage({ notifs, setNotifs, C }) {
  const icons = {like:"❤️",follow:"👤",comment:"💬",mention:"📣",live:"📡"};
  return (
    <div style={{ paddingTop:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ fontWeight:800, fontSize:18, color:C.text }}>알림</div>
        <button onClick={()=>setNotifs(notifs.map(n=>({...n,read:true})))} style={{ background:"none", border:"none", cursor:"pointer", color:C.accent, fontSize:13 }}>모두 읽음</button>
      </div>
      {notifs.map(n=>(
        <div key={n.id} onClick={()=>setNotifs(notifs.map(x=>x.id===n.id?{...x,read:true}:x))}
          style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${C.border}`, cursor:"pointer", opacity:n.read?0.55:1 }}>
          <div style={{ position:"relative" }}>
            <Avatar emoji={n.user.avatar} size={46} C={C} />
            <div style={{ position:"absolute", bottom:-2, right:-2, fontSize:16 }}>{icons[n.type]}</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, color:C.text }}><span style={{ fontWeight:700 }}>{n.user.name}</span> {n.text}</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{n.time}</div>
          </div>
          {!n.read&&<div style={{ width:8, height:8, borderRadius:"50%", background:C.accent, flexShrink:0 }} />}
        </div>
      ))}
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfilePage({ user, isMe, onEditSave, C }) {
  const [editing, setEditing] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [tab, setTab]   = useState("posts"); // posts | saved
  const [draftName, setDraftName] = useState(user.name);
  const [draftBio, setDraftBio]   = useState(user.bio);
  const [draftAvatar, setDraftAvatar] = useState(user.avatar);
  const avatarOpts = ["😎","🐱","🦊","🐼","🦋","🌸","🎸","🎨","🏄","🚀","🌙","🔥"];
  const images = ["🌅","🎨","🌊","☕","🌸","🎸","🏄","🌙","🌿"];

  return (
    <div>
      {/* Card */}
      <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, padding:24, marginBottom:16 }}>
        {editing ? (
          <>
            <div style={{ fontWeight:700, color:C.text, marginBottom:12 }}>프로필 편집</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
              {avatarOpts.map(a=><button key={a} onClick={()=>setDraftAvatar(a)} style={{ width:44, height:44, fontSize:24, background:draftAvatar===a?C.accentGlow:C.surfaceHover, border:draftAvatar===a?`2px solid ${C.accent}`:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer" }}>{a}</button>)}
            </div>
            <input value={draftName} onChange={e=>setDraftName(e.target.value)} placeholder="이름" style={{ width:"100%", background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 14px", color:C.text, fontSize:14, outline:"none", marginBottom:10, boxSizing:"border-box" }} />
            <textarea value={draftBio} onChange={e=>setDraftBio(e.target.value)} rows={3} placeholder="자기소개" style={{ width:"100%", background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 14px", color:C.text, fontSize:14, outline:"none", resize:"none", boxSizing:"border-box", marginBottom:14 }} />
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setEditing(false)} style={{ flex:1, background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:12, padding:10, color:C.text, fontWeight:700, cursor:"pointer" }}>취소</button>
              <button onClick={()=>{ onEditSave({name:draftName, bio:draftBio, avatar:draftAvatar}); setEditing(false); }} style={{ flex:1, background:C.grad, border:"none", borderRadius:12, padding:10, color:"#fff", fontWeight:700, cursor:"pointer" }}>저장</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display:"flex", gap:20, alignItems:"center", marginBottom:16 }}>
              <Avatar emoji={user.avatar} size={72} ring C={C} />
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:8 }}>
                  <span style={{ fontWeight:800, fontSize:18, color:C.text }}>{user.name}</span>
                  {isMe
                    ? <button onClick={()=>setEditing(true)} style={{ background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:10, padding:"6px 16px", color:C.text, fontWeight:700, fontSize:13, cursor:"pointer" }}>프로필 편집</button>
                    : <button onClick={()=>setFollowed(!followed)} style={{ background:followed?C.surfaceHover:C.accent, border:followed?`1px solid ${C.border}`:"none", borderRadius:10, padding:"6px 16px", color:followed?C.text:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>{followed?"팔로잉":"팔로우"}</button>
                  }
                </div>
                <div style={{ fontSize:13, color:C.text, opacity:0.8, lineHeight:1.5 }}>{user.bio}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:32 }}>
              {[["게시물",user.posts],["팔로워",fmt(user.followers)],["팔로잉",user.following]].map(([l,v])=>(
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontWeight:800, fontSize:18, color:C.text }}>{v}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{l}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      {!editing && isMe && (
        <div style={{ display:"flex", background:C.surfaceHover, borderRadius:14, padding:4, marginBottom:12 }}>
          {[["posts","📷 게시물"],["saved","🔖 저장됨"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ flex:1, background:tab===id?C.accent:"none", border:"none", borderRadius:10, padding:"9px 0", color:tab===id?"#fff":C.muted, fontWeight:700, fontSize:13, cursor:"pointer" }}>{label}</button>
          ))}
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:3, borderRadius:16, overflow:"hidden" }}>
        {images.map((img,i)=>(
          <div key={i} style={{ aspectRatio:"1", background:C.surfaceHover, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, cursor:"pointer", transition:"opacity 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.7"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>{img}</div>
        ))}
      </div>
    </div>
  );
}

// ─── LIVE ─────────────────────────────────────────────────────────────────────
function LivePage({ C }) {
  const [myLive, setMyLive]     = useState(false);
  const [viewers, setViewers]   = useState(142);
  const [liveChat, setLiveChat] = useState([
    {user:"hayeon_", text:"오 라이브다!! 🔥"},
    {user:"junho.v",  text:"ㅋㅋㅋ 드디어"},
    {user:"minjee",   text:"💜💜💜"},
  ]);
  const [liveInput, setLiveInput] = useState("");
  const liveChatRef = useRef(null);

  useEffect(()=>{
    if (!myLive) return;
    const t = setInterval(()=>{
      setViewers(v=>v + (Math.random()>0.5?1:-1));
      if (Math.random()>0.6) {
        const msgs=["ㅋㅋㅋ","대박","멋있어요!!","💜","👍","😍","오오오","좋아요~"];
        const users=["user_"+Math.random().toString(36).slice(2,5)];
        setLiveChat(prev=>[...prev.slice(-20),{user:users[0],text:msgs[Math.random()*msgs.length|0]}]);
        liveChatRef.current?.scrollTo(0,9999);
      }
    },1500);
    return ()=>clearInterval(t);
  },[myLive]);

  const sendLive = ()=>{
    if (!liveInput.trim()) return;
    setLiveChat(prev=>[...prev,{user:"me._.here",text:liveInput.trim(),me:true}]);
    setLiveInput("");
    setTimeout(()=>liveChatRef.current?.scrollTo(0,9999),50);
  };

  return (
    <div style={{ paddingTop:16 }}>
      {/* Live streams from others */}
      {!myLive && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontWeight:800, fontSize:18, color:C.text, marginBottom:12 }}>📡 라이브 중</div>
          <div style={{ display:"flex", gap:12, overflowX:"auto", scrollbarWidth:"none" }}>
            {USERS.slice(0,2).map(u=>(
              <div key={u.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", minWidth:160, flexShrink:0 }}>
                <div style={{ height:110, background:`linear-gradient(135deg,#1a0a2e,#0a0a1f)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:50, position:"relative" }}>
                  {u.avatar}
                  <div style={{ position:"absolute", top:8, left:8, background:"#ef4444", color:"#fff", fontSize:10, fontWeight:800, borderRadius:6, padding:"2px 7px" }}>LIVE</div>
                  <div style={{ position:"absolute", bottom:8, right:8, background:"#00000099", color:"#fff", fontSize:11, borderRadius:6, padding:"2px 7px" }}>👁 {(Math.random()*500+50|0)}</div>
                </div>
                <div style={{ padding:"10px 12px" }}>
                  <div style={{ fontWeight:700, fontSize:13, color:C.text }}>{u.name}</div>
                  <div style={{ fontSize:11, color:C.muted }}>라이브 방송 중</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My live */}
      <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, overflow:"hidden" }}>
        <div style={{ height:myLive?260:160, background:"linear-gradient(135deg,#1a0a2e,#0a0a1f)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:80, position:"relative", transition:"height 0.3s" }}>
          😎
          {myLive && <>
            <div style={{ position:"absolute", top:12, left:12, background:"#ef4444", color:"#fff", fontSize:11, fontWeight:800, borderRadius:8, padding:"3px 10px" }}>● LIVE</div>
            <div style={{ position:"absolute", top:12, right:12, background:"#00000099", color:"#fff", fontSize:12, borderRadius:8, padding:"3px 10px" }}>👁 {viewers}</div>
          </>}
        </div>

        <div style={{ padding:16 }}>
          {myLive ? (
            <>
              <div ref={liveChatRef} style={{ height:160, overflowY:"auto", display:"flex", flexDirection:"column", gap:6, marginBottom:12, scrollbarWidth:"none" }}>
                {liveChat.map((m,i)=>(
                  <div key={i} style={{ fontSize:13 }}>
                    <span style={{ fontWeight:700, color:m.me?C.accent:C.text }}>{m.user}</span>{" "}
                    <span style={{ color:C.text, opacity:0.85 }}>{m.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <input value={liveInput} onChange={e=>setLiveInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendLive()} placeholder="라이브 채팅..." style={{ flex:1, background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:20, padding:"8px 14px", color:C.text, fontSize:13, outline:"none" }} />
                <button onClick={sendLive} style={{ background:C.grad, border:"none", borderRadius:"50%", width:38, height:38, fontSize:16, cursor:"pointer" }}>↑</button>
              </div>
              <button onClick={()=>setMyLive(false)} style={{ width:"100%", background:"#ef4444", border:"none", borderRadius:12, padding:"12px 0", color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", marginTop:12 }}>방송 종료</button>
            </>
          ) : (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontWeight:800, fontSize:16, color:C.text, marginBottom:6 }}>라이브 방송 시작</div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:16 }}>팔로워들에게 실시간으로 보여주세요</div>
              <button onClick={()=>setMyLive(true)} style={{ background:C.grad, border:"none", borderRadius:14, padding:"13px 32px", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer" }}>📡 라이브 시작</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function StoryAddModal({ onClose, onAdd, C }) {
  const [selected, setSelected] = useState(STORY_EMOJIS[0]);
  const [caption, setCaption]   = useState("");
  return (
    <div style={{ position:"fixed", inset:0, background:"#000000aa", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }} onClick={onClose}>
      <div style={{ background:C.surface, borderRadius:24, border:`1px solid ${C.border}`, padding:24, width:"100%", maxWidth:380 }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontWeight:800, fontSize:18, color:C.text, marginBottom:16 }}>스토리 추가</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
          {STORY_EMOJIS.map(e=><button key={e} onClick={()=>setSelected(e)} style={{ width:44, height:44, fontSize:24, background:selected===e?C.accentGlow:C.surfaceHover, border:selected===e?`2px solid ${C.accent}`:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer" }}>{e}</button>)}
        </div>
        <div style={{ height:100, background:C.surfaceHover, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:60, marginBottom:14 }}>{selected}</div>
        <input value={caption} onChange={e=>setCaption(e.target.value)} placeholder="스토리 캡션 (선택)" style={{ width:"100%", background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 14px", color:C.text, fontSize:14, outline:"none", marginBottom:14, boxSizing:"border-box" }} />
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:12, padding:11, color:C.text, fontWeight:700, cursor:"pointer" }}>취소</button>
          <button onClick={()=>{ onAdd(selected, caption); onClose(); }} style={{ flex:1, background:C.grad, border:"none", borderRadius:12, padding:11, color:"#fff", fontWeight:800, cursor:"pointer" }}>공유</button>
        </div>
      </div>
    </div>
  );
}

function UploadModal({ onClose, onPost, C }) {
  const [caption, setCaption]   = useState("");
  const [sel, setSel]           = useState("🖼️");
  const [tag, setTag]           = useState("");
  const [tags, setTags]         = useState([]);
  const emojis = ["🌅","🎨","🌊","☕","🌸","🎸","🏄","🌙","🌿","🐱","🍜","🌃"];
  const addTag = ()=>{ if(tag.trim()&&tags.length<5){ setTags([...tags,tag.trim()]); setTag(""); } };
  return (
    <div style={{ position:"fixed", inset:0, background:"#000000aa", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }} onClick={onClose}>
      <div style={{ background:C.surface, borderRadius:24, border:`1px solid ${C.border}`, padding:24, width:"100%", maxWidth:400, maxHeight:"90vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontWeight:800, fontSize:18, color:C.text, marginBottom:16 }}>새 게시물</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
          {emojis.map(e=><button key={e} onClick={()=>setSel(e)} style={{ width:44, height:44, fontSize:22, background:sel===e?C.accentGlow:C.surfaceHover, border:sel===e?`2px solid ${C.accent}`:`1px solid ${C.border}`, borderRadius:10, cursor:"pointer" }}>{e}</button>)}
        </div>
        <div style={{ height:100, background:C.surfaceHover, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:55, marginBottom:14 }}>{sel}</div>
        <textarea value={caption} onChange={e=>setCaption(e.target.value)} placeholder="문구를 입력하세요..." rows={3} style={{ width:"100%", background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:12, padding:12, color:C.text, fontSize:14, outline:"none", resize:"none", boxSizing:"border-box", marginBottom:12 }} />
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          <input value={tag} onChange={e=>setTag(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag()} placeholder="태그 추가 (Enter)" style={{ flex:1, background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:10, padding:"8px 12px", color:C.text, fontSize:13, outline:"none" }} />
        </div>
        {tags.length>0&&<div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>{tags.map(t=><span key={t} style={{ fontSize:12, color:C.accent, background:C.accentGlow, borderRadius:8, padding:"2px 10px" }}>#{t} <span onClick={()=>setTags(tags.filter(x=>x!==t))} style={{ cursor:"pointer" }}>×</span></span>)}</div>}
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:12, padding:12, color:C.text, fontWeight:700, cursor:"pointer" }}>취소</button>
          <button onClick={()=>{ onPost(sel,caption,tags); onClose(); }} style={{ flex:1, background:C.grad, border:"none", borderRadius:12, padding:12, color:"#fff", fontWeight:800, cursor:"pointer" }}>공유</button>
        </div>
      </div>
    </div>
  );
}

function StoryModal({ story, onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,4000); return()=>clearTimeout(t); },[]);
  return (
    <div style={{ position:"fixed", inset:0, background:"#000", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, flexDirection:"column" }} onClick={onClose}>
      <div style={{ position:"absolute", top:20, left:0, right:0, height:3, background:"#ffffff22", margin:"0 16px", borderRadius:2 }}>
        <div style={{ height:"100%", background:"#fff", borderRadius:2, animation:"storyProg 4s linear forwards" }} />
      </div>
      <div style={{ position:"absolute", top:36, left:20, display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:40, height:40, borderRadius:"50%", background:"#fff2", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{story.user.avatar}</div>
        <span style={{ color:"#fff", fontWeight:700 }}>{story.user.name}</span>
      </div>
      <div style={{ fontSize:110 }}>{story.emoji}</div>
      {story.caption && <div style={{ color:"#ffffffcc", fontSize:16, marginTop:12 }}>{story.caption}</div>}
      <div style={{ color:"#ffffff44", fontSize:13, marginTop:20 }}>탭해서 닫기</div>
    </div>
  );
}

function ThemeModal({ current, onSelect, onClose, C }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"#000000bb", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
      <div style={{ background:C.surface, borderRadius:"24px 24px 0 0", border:`1px solid ${C.border}`, padding:28, width:"100%", maxWidth:480 }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontWeight:800, fontSize:18, color:C.text, marginBottom:16 }}>테마 선택</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {Object.entries(THEMES).map(([key,theme])=>(
            <button key={key} onClick={()=>{ onSelect(key); onClose(); }} style={{ display:"flex", alignItems:"center", gap:16, background:current===key?C.accentGlow:C.surfaceHover, border:current===key?`1px solid ${C.accent}`:`1px solid ${C.border}`, borderRadius:16, padding:"14px 18px", cursor:"pointer", textAlign:"left" }}>
              <span style={{ fontSize:26 }}>{theme.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, color:C.text }}>{theme.name}</div>
              </div>
              {current===key&&<span style={{ color:C.accent, fontSize:20 }}>✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [me, setMe]             = useState(INIT_ME);
  const [themeName, setThemeName] = useState("dark");
  const C = THEMES[themeName];

  const [tab, setTab]           = useState("feed");
  const [posts, setPosts]       = useState(INIT_POSTS);
  const [stories, setStories]   = useState(INIT_STORIES);
  const [chats, setChats]       = useState(INIT_CHATS);
  const [notifs, setNotifs]     = useState(INIT_NOTIFS);

  const [activeStory, setActiveStory] = useState(null);
  const [showUpload, setShowUpload]   = useState(false);
  const [showStoryAdd, setShowStoryAdd] = useState(false);
  const [showTheme, setShowTheme]     = useState(false);
  const [hashTag, setHashTag]         = useState(null);  // active hashtag feed
  const [profileUser, setProfileUser] = useState(null);  // viewing other profile

  const unreadN = notifs.filter(n=>!n.read).length;
  const unreadD = chats.reduce((a,c)=>a+c.unread,0);

  const handleLike    = id => setPosts(posts.map(p=>p.id===id?{...p,liked:!p.liked}:p));
  const handleComment = (id,text) => setPosts(posts.map(p=>p.id===id?{...p,comments:[...p.comments,{user:me,text}]}:p));
  const handleSave    = (postId) => setPosts(posts.map(p=>p.id===postId?{...p,saved:!p.saved}:p));
  const handlePost    = (image,caption,tags) => setPosts([{id:Date.now(),user:me,image,caption:caption||"새 게시물 📸",likes:0,liked:false,saved:false,comments:[],time:"방금 전",tags},...posts]);
  const handleStoryAdd = (emoji,caption) => {
    const newStory = {id:Date.now(),user:me,seen:false,emoji,caption};
    setStories([newStory,...stories]);
  };

  const tabs = [
    {id:"feed",   icon:"🏠", label:"홈"},
    {id:"explore",icon:"🔍", label:"탐색"},
    {id:"live",   icon:"📡", label:"라이브"},
    {id:"dm",     icon:"💬", label:"DM",    badge:unreadD},
    {id:"notif",  icon:"🔔", label:"알림",  badge:unreadN},
    {id:"profile",icon:"👤", label:"나"},
  ];

  if (!loggedIn) return <AuthPage onLogin={u=>{ setMe(u); setLoggedIn(true); }} C={C} />;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'Apple SD Gothic Neo',sans-serif", maxWidth:480, margin:"0 auto", position:"relative", paddingBottom:90, transition:"background 0.4s" }}>
      {/* Header */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:`${C.bg}ee`, backdropFilter:"blur(12px)", borderBottom:`1px solid ${C.border}`, padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontWeight:900, fontSize:22, background:C.grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:-1 }}>PULSE</div>
        <div style={{ display:"flex", gap:14 }}>
          <button onClick={()=>setShowUpload(true)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22 }}>➕</button>
          <button onClick={()=>setShowTheme(true)}  style={{ background:"none", border:"none", cursor:"pointer", fontSize:22 }}>🎨</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:"0 16px", paddingTop:8 }}>

        {tab==="feed" && !hashTag && (
          <>
            <StoryBar stories={stories} onView={s=>{ setActiveStory(s); setStories(stories.map(x=>x.id===s.id?{...x,seen:true}:x)); }} onAddStory={()=>setShowStoryAdd(true)} C={C} />
            <div style={{ height:1, background:C.border, margin:"8px 0 16px" }} />
            {posts.map(p=><Post key={p.id} post={p} onLike={handleLike} onComment={handleComment} onSave={handleSave} onTagClick={t=>setHashTag(t)} C={C} />)}
          </>
        )}

        {tab==="feed" && hashTag && (
          <HashtagFeed tag={hashTag} posts={posts} onBack={()=>setHashTag(null)} onLike={handleLike} onComment={handleComment} onSave={handleSave} C={C} />
        )}

        {tab==="explore" && !profileUser && (
          <ExplorePage posts={posts} C={C} onTagClick={t=>{ setHashTag(t); setTab("feed"); }} onUserClick={u=>setProfileUser(u)} />
        )}
        {tab==="explore" && profileUser && (
          <div style={{ paddingTop:16 }}>
            <button onClick={()=>setProfileUser(null)} style={{ background:"none", border:"none", cursor:"pointer", color:C.accent, fontSize:20, marginBottom:12, display:"block" }}>← 뒤로</button>
            <ProfilePage user={profileUser} isMe={false} onEditSave={()=>{}} C={C} />
          </div>
        )}

        {tab==="live"    && <LivePage C={C} />}
        {tab==="dm"      && <DMPage chats={chats} setChats={setChats} C={C} />}
        {tab==="notif"   && <NotifPage notifs={notifs} setNotifs={setNotifs} C={C} />}
        {tab==="profile" && (
          <div style={{ paddingTop:16 }}>
            <ProfilePage user={me} isMe onEditSave={data=>setMe({...me,...data})} C={C} />
            <button onClick={()=>setLoggedIn(false)} style={{ width:"100%", background:C.surfaceHover, border:`1px solid ${C.border}`, borderRadius:14, padding:13, color:"#ef4444", fontWeight:700, fontSize:14, cursor:"pointer", marginTop:20 }}>로그아웃</button>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:`${C.bg}f0`, backdropFilter:"blur(16px)", borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-around", padding:"8px 0" }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>{ setTab(t.id); if(t.id!=="explore")setProfileUser(null); if(t.id!=="feed")setHashTag(null); }} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, position:"relative", padding:"4px 8px" }}>
            <div style={{ fontSize:20, background:tab===t.id?C.accentGlow:"none", borderRadius:12, padding:"4px 8px", transition:"all 0.2s" }}>{t.icon}</div>
            <span style={{ fontSize:9, color:tab===t.id?C.accent:C.muted, fontWeight:tab===t.id?700:400 }}>{t.label}</span>
            {t.badge>0 && <div style={{ position:"absolute", top:2, right:4, background:"#ef4444", color:"#fff", borderRadius:"50%", width:15, height:15, fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{t.badge}</div>}
          </button>
        ))}
      </div>

      {showUpload   && <UploadModal   onClose={()=>setShowUpload(false)}   onPost={handlePost}      C={C} />}
      {showStoryAdd && <StoryAddModal onClose={()=>setShowStoryAdd(false)} onAdd={handleStoryAdd}   C={C} />}
      {activeStory  && <StoryModal    story={activeStory}                  onClose={()=>setActiveStory(null)} />}
      {showTheme    && <ThemeModal    current={themeName} onSelect={setThemeName} onClose={()=>setShowTheme(false)} C={C} />}

      <style>{`*{box-sizing:border-box;}::-webkit-scrollbar{display:none;}@keyframes storyProg{from{width:0%}to{width:100%}}`}</style>
    </div>
  );
}
