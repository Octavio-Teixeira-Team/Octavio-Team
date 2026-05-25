import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const PATIENTS = [
  {
    id: 1, name: "Ana Beatriz Souza", age: 34, avatar: "ABS",
    condition: "Hipertensão", specialty: "Cardiologia",
    stage: "tratamento", priority: "media", progress: 68,
    phone: "(11) 98765-4321", email: "ana@email.com",
    channel: "whatsapp", lastContact: "Hoje, 09:41",
    nextVisit: "19 Jun 2026", lastVisit: "15 Mai 2026",
    checkins: [
      { week: "S1", score: 6, date: "02 Jan", adherence: 80 },
      { week: "S2", score: 7, date: "09 Jan", adherence: 85 },
      { week: "S3", score: 7, date: "16 Jan", adherence: 88 },
      { week: "S4", score: 8, date: "23 Jan", adherence: 92 },
      { week: "S5", score: 8, date: "30 Jan", adherence: 90 },
      { week: "S6", score: 9, date: "06 Fev", adherence: 95 },
    ],
    tags: ["Retorno pendente", "Boa adesão"],
    nps: 9, ltvScore: 87,
    steps: [
      { id: "lead", label: "Lead", icon: "✦", done: true, date: "28 Dez 2025" },
      { id: "agendamento", label: "Agendamento", icon: "📅", done: true, date: "02 Jan 2026" },
      { id: "consulta", label: "Consulta Inicial", icon: "🩺", done: true, date: "10 Jan 2026" },
      { id: "plano", label: "Plano de Cuidado", icon: "📋", done: true, date: "18 Jan 2026" },
      { id: "tratamento", label: "Tratamento", icon: "💊", done: false, active: true, date: "Em andamento" },
      { id: "retorno", label: "Retorno", icon: "🔁", done: false, date: "19 Jun 2026" },
      { id: "alta", label: "Alta / Manutenção", icon: "⭐", done: false, date: "—" },
    ],
    messages: [
      { from: "system", text: "Check-in S6 enviado via WhatsApp", time: "06 Fev, 08:00", auto: true },
      { from: "patient", text: "Oi! Estou me sentindo muito melhor, pressão estabilizou 😊", time: "06 Fev, 08:34" },
      { from: "doctor", text: "Ótima notícia, Ana! Vamos manter o protocolo. Retorno em junho.", time: "06 Fev, 09:00" },
      { from: "system", text: "Lembrete de retorno agendado para 19/06", time: "Hoje, 09:41", auto: true },
    ],
    exams: [
      { name: "Hemograma", date: "10 Jan", status: "ok", value: "Normal" },
      { name: "ECG", date: "18 Jan", status: "ok", value: "Normal" },
      { name: "Ecocardiograma", date: "—", status: "pendente", value: "Aguardando" },
    ],
    notes: "Paciente com boa adesão ao tratamento. Pressão estabilizando entre 120/80. Reduzir sal. Caminhada 30min/dia.",
  },
  {
    id: 2, name: "Carlos Menezes", age: 52, avatar: "CM",
    condition: "Diabetes Tipo 2", specialty: "Endocrinologia",
    stage: "monitoramento", priority: "alta", progress: 85,
    phone: "(11) 91234-5678", email: "carlos@email.com",
    channel: "instagram", lastContact: "Ontem, 14:22",
    nextVisit: "08 Jun 2026", lastVisit: "08 Mai 2026",
    checkins: [
      { week: "S1", score: 4, date: "05 Out", adherence: 55 },
      { week: "S2", score: 5, date: "12 Out", adherence: 62 },
      { week: "S3", score: 6, date: "19 Out", adherence: 70 },
      { week: "S4", score: 6, date: "26 Out", adherence: 68 },
      { week: "S5", score: 7, date: "02 Nov", adherence: 75 },
      { week: "S6", score: 7, date: "09 Nov", adherence: 78 },
    ],
    tags: ["Glicemia alta", "Urgente"],
    nps: 7, ltvScore: 64,
    steps: [
      { id: "lead", label: "Lead", icon: "✦", done: true, date: "01 Out 2025" },
      { id: "agendamento", label: "Agendamento", icon: "📅", done: true, date: "05 Out 2025" },
      { id: "consulta", label: "Consulta Inicial", icon: "🩺", done: true, date: "12 Out 2025" },
      { id: "plano", label: "Plano de Cuidado", icon: "📋", done: true, date: "20 Out 2025" },
      { id: "tratamento", label: "Tratamento", icon: "💊", done: true, date: "01 Nov 2025" },
      { id: "retorno", label: "Retorno", icon: "🔁", done: false, active: true, date: "Em andamento" },
      { id: "alta", label: "Alta / Manutenção", icon: "⭐", done: false, date: "—" },
    ],
    messages: [
      { from: "system", text: "Check-in S6 enviado via Instagram DM", time: "09 Nov, 08:00", auto: true },
      { from: "patient", text: "Doutora, o glicosímetro marcou 148 hoje cedo...", time: "Ontem, 14:22" },
      { from: "doctor", text: "Carlos, vou ajustar a metformina. Tente fazer 20min de caminhada após o jantar.", time: "Ontem, 15:10" },
    ],
    exams: [
      { name: "Glicemia", date: "08 Mai", status: "alerta", value: "148 mg/dL" },
      { name: "HbA1c", date: "08 Mai", status: "ok", value: "7.2%" },
      { name: "Função Renal", date: "01 Abr", status: "ok", value: "Normal" },
    ],
    notes: "Glicemia em jejum elevada (148). Ajustar metformina para 850mg 2x/dia. Atividade física obrigatória.",
  },
  {
    id: 3, name: "Fernanda Lima", age: 28, avatar: "FL",
    condition: "Asma", specialty: "Pneumologia",
    stage: "consulta", priority: "baixa", progress: 30,
    phone: "(11) 94444-3333", email: "fernanda@email.com",
    channel: "email", lastContact: "20 Mai, 11:00",
    nextVisit: "20 Jun 2026", lastVisit: "20 Mai 2026",
    checkins: [
      { week: "S1", score: 5, date: "14 Mai", adherence: 60 },
      { week: "S2", score: 6, date: "20 Mai", adherence: 65 },
    ],
    tags: ["Nova paciente", "Iniciar plano"],
    nps: 8, ltvScore: 42,
    steps: [
      { id: "lead", label: "Lead", icon: "✦", done: true, date: "12 Mai 2026" },
      { id: "agendamento", label: "Agendamento", icon: "📅", done: true, date: "14 Mai 2026" },
      { id: "consulta", label: "Consulta Inicial", icon: "🩺", done: false, active: true, date: "20 Mai 2026" },
      { id: "plano", label: "Plano de Cuidado", icon: "📋", done: false, date: "—" },
      { id: "tratamento", label: "Tratamento", icon: "💊", done: false, date: "—" },
      { id: "retorno", label: "Retorno", icon: "🔁", done: false, date: "—" },
      { id: "alta", label: "Alta / Manutenção", icon: "⭐", done: false, date: "—" },
    ],
    messages: [
      { from: "system", text: "Confirmação de consulta enviada por e-mail", time: "14 Mai, 08:00", auto: true },
      { from: "patient", text: "Olá! Confirmo minha presença na consulta de segunda.", time: "14 Mai, 10:22" },
      { from: "system", text: "Check-in S1 enviado por e-mail", time: "14 Mai, 08:00", auto: true },
    ],
    exams: [
      { name: "Espirometria", date: "—", status: "pendente", value: "Solicitada" },
      { name: "IgE Total", date: "20 Mai", status: "ok", value: "Normal" },
    ],
    notes: "Crise moderada. Iniciar corticoide inalatório + broncodilatador. Evitar poeira e mofo.",
  },
];

const LEADS = [
  { id: 10, name: "Ricardo Alves", channel: "Instagram", status: "novo", time: "Há 5 min", msg: "Quero saber sobre consultas de cardiologia" },
  { id: 11, name: "Patrícia Viana", channel: "WhatsApp", status: "respondido", time: "Há 30 min", msg: "Vocês atendem pelo plano Amil?" },
  { id: 12, name: "João Silva", channel: "Site", status: "agendado", time: "Há 2h", msg: "Preciso de uma avaliação urgente" },
  { id: 13, name: "Mariana Costa", channel: "Email", status: "novo", time: "Há 3h", msg: "Gostaria de saber os valores de consulta" },
];

const AUTOMATIONS = [
  { id: 1, name: "Check-in Semanal", trigger: "Todo domingo, 08:00", channel: "WhatsApp", active: true, sent: 248, rate: 89 },
  { id: 2, name: "Lembrete de Consulta", trigger: "24h antes do agendamento", channel: "WhatsApp + SMS", active: true, sent: 134, rate: 97 },
  { id: 3, name: "Pós-Procedimento D+1", trigger: "1 dia após procedimento", channel: "WhatsApp", active: true, sent: 67, rate: 82 },
  { id: 4, name: "Recuperação de Falta", trigger: "Após cancelamento", channel: "WhatsApp", active: false, sent: 23, rate: 61 },
  { id: 5, name: "Manutenção 30 dias", trigger: "30 dias sem retorno", channel: "Email + WhatsApp", active: true, sent: 91, rate: 74 },
];

const METRICS = {
  totalPatients: 247, newThisMonth: 18, retention: 84,
  npsAvg: 8.6, conversionRate: 72, absenteeism: 8,
  monthlyRevenue: 48700, growthRate: 12,
};

const CHECKIN_QUESTIONS = [
  "Como você avalia seu nível de energia esta semana?",
  "Você seguiu o plano alimentar prescrito?",
  "Praticou atividade física conforme orientado?",
  "Teve algum sintoma ou desconforto?",
  "Dorme bem? Quantas horas em média?",
];

// ─── COLORS ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#0C110D",
  surface: "#111A12",
  card: "#162018",
  border: "#1E2E20",
  accent: "#6B8F4E",
  accentGlow: "#6B8F4E33",
  green: "#4A7C59",
  yellow: "#C8A84B",
  red: "#B85C4A",
  purple: "#7A8F6B",
  text: "#DDE8D8",
  muted: "#5E7A5A",
  dim: "#2E4030",
};

const priorityMap = {
  alta: { label: "Alta", color: C.red, bg: "#FF4D6D18" },
  media: { label: "Média", color: C.yellow, bg: "#FFB80018" },
  baixa: { label: "Baixa", color: C.green, bg: "#00E5A018" },
};

const statusMap = {
  ok: { color: C.green, label: "Normal" },
  alerta: { color: C.yellow, label: "Atenção" },
  pendente: { color: C.muted, label: "Pendente" },
};

const channelIcon = { whatsapp: "💬", instagram: "📸", email: "📧", site: "🌐", sms: "📱" };

const leadStatusMap = {
  novo: { color: C.accent, label: "Novo" },
  respondido: { color: C.yellow, label: "Respondido" },
  agendado: { color: C.green, label: "Agendado" },
};

// ─── MINI CHART ──────────────────────────────────────────────────────────────
function SparkLine({ data, color = C.accent, width = 120, height = 40 }) {
  if (!data || data.length < 2) return null;
  const vals = data.map(d => d.score || d.adherence || 0);
  const min = Math.min(...vals), max = Math.max(...vals);
  const norm = v => ((v - min) / (max - min || 1)) * (height - 8) + 4;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * width},${height - norm(v)}`).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`g${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(vals.length - 1) / (vals.length - 1) * width} cy={height - norm(vals[vals.length - 1])} r="3" fill={color} />
    </svg>
  );
}

// ─── RADIAL PROGRESS ─────────────────────────────────────────────────────────
function RadialProgress({ value, size = 56, color = C.accent, label }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth="4" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
        flexDirection: "column",
      }}>
        <span style={{ fontSize: size < 60 ? 12 : 16, fontWeight: 800, color }}>{value}</span>
        {label && <span style={{ fontSize: 9, color: C.muted, marginTop: 1 }}>{label}</span>}
      </div>
    </div>
  );
}

// ─── NAV ITEMS ───────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "pacientes", icon: "👤", label: "Pacientes" },
  { id: "jornada", icon: "🗺", label: "Jornada" },
  { id: "checkins", icon: "✅", label: "Check-ins" },
  { id: "crm", icon: "💬", label: "CRM / Canais" },
  { id: "automacoes", icon: "⚡", label: "Automações" },
  { id: "ia", icon: "🤖", label: "IA Assistente" },
  { id: "agenda", icon: "📅", label: "Agenda" },
  { id: "relatorios", icon: "📊", label: "Relatórios" },
];

// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [nav, setNav] = useState("dashboard");
  const [selPatient, setSelPatient] = useState(PATIENTS[0]);
  const [chatMsg, setChatMsg] = useState("");
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", text: "Olá! Sou sua assistente de IA. Posso analisar pacientes, sugerir protocolos, redigir mensagens automáticas e muito mais. Como posso ajudar?" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [crmMsg, setCrmMsg] = useState("");
  const [activeCheckin, setActiveCheckin] = useState(null);
  const [checkinAnswers, setCheckinAnswers] = useState({});
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [aiMessages]);

  async function sendAI(text) {
    if (!text.trim() || aiLoading) return;
    const userMsg = { role: "user", text };
    setAiMessages(m => [...m, userMsg]);
    setChatMsg("");
    setAiLoading(true);
    try {
      const context = `Você é uma assistente de IA para uma clínica de saúde chamada CareFlow. 
      Paciente atual em foco: ${selPatient.name}, ${selPatient.age} anos, condição: ${selPatient.condition}, 
      estágio: ${selPatient.stage}, progresso: ${selPatient.progress}%, última consulta: ${selPatient.lastVisit}.
      Notas clínicas: ${selPatient.notes}.
      Responda em português, seja conciso, clínico e prático. Máximo 3 parágrafos.`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: context,
          messages: [
            ...aiMessages.filter(m => m.role === "user" || m.role === "assistant").map(m => ({ role: m.role, content: m.text })),
            { role: "user", content: text }
          ]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Erro ao processar resposta.";
      setAiMessages(m => [...m, { role: "assistant", text: reply }]);
    } catch {
      setAiMessages(m => [...m, { role: "assistant", text: "Erro de conexão. Tente novamente." }]);
    }
    setAiLoading(false);
  }

  // ── UI HELPERS ────────────────────────────────────────────────────────────
  const Card = ({ children, style = {} }) => (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: "20px 22px", ...style
    }}>
      {children}
    </div>
  );

  const Badge = ({ text, color, bg }) => (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "3px 9px",
      borderRadius: 6, color, background: bg,
      letterSpacing: "0.03em",
    }}>{text}</span>
  );

  const SectionTitle = ({ children, sub }) => (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.text, letterSpacing: "-0.4px" }}>{children}</h2>
      {sub && <p style={{ margin: "4px 0 0", fontSize: 13, color: C.muted }}>{sub}</p>}
    </div>
  );

  // ── VIEWS ─────────────────────────────────────────────────────────────────

  // DASHBOARD
  const Dashboard = () => (
    <div>
      <SectionTitle sub="Visão geral da sua clínica hoje">Painel Principal</SectionTitle>
      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Pacientes Ativos", value: METRICS.totalPatients, sub: `+${METRICS.newThisMonth} este mês`, color: C.accent },
          { label: "Taxa de Retenção", value: `${METRICS.retention}%`, sub: "Meta: 90%", color: C.green },
          { label: "NPS Médio", value: METRICS.npsAvg, sub: "Promotores: 72%", color: C.purple },
          { label: "Receita / Mês", value: `R$ ${METRICS.monthlyRevenue.toLocaleString("pt-BR")}`, sub: `↑ ${METRICS.growthRate}% vs mês anterior`, color: C.yellow },
        ].map((k, i) => (
          <Card key={i}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: k.color, marginTop: 6, letterSpacing: "-0.8px" }}>{k.value}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        {/* Jornada funil */}
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 16 }}>Funil de Jornada</div>
          {[
            { stage: "Leads captados", count: 38, color: C.accent },
            { stage: "Consulta agendada", count: 31, color: C.purple },
            { stage: "Em tratamento", count: 24, color: C.yellow },
            { stage: "Monitoramento", count: 18, color: C.green },
            { stage: "Alta / Manutenção", count: 9, color: C.muted },
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: C.text }}>{f.stage}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: f.color }}>{f.count}</span>
              </div>
              <div style={{ height: 6, borderRadius: 4, background: C.border }}>
                <div style={{ height: "100%", borderRadius: 4, background: f.color, width: `${(f.count / 38) * 100}%`, transition: "width 0.5s" }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Leads recentes */}
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 16 }}>Novos Leads</div>
          {LEADS.map(l => {
            const st = leadStatusMap[l.status];
            return (
              <div key={l.id} style={{
                display: "flex", gap: 12, padding: "10px 0",
                borderBottom: `1px solid ${C.border}`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `${C.accent}22`, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 16, flexShrink: 0,
                }}>
                  {channelIcon[l.channel.toLowerCase()] || "💬"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{l.name}</span>
                    <Badge text={st.label} color={st.color} bg={`${st.color}18`} />
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.msg}</div>
                  <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{l.channel} · {l.time}</div>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Automations summary */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 16 }}>Automações Ativas</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {AUTOMATIONS.filter(a => a.active).slice(0, 3).map(a => (
            <div key={a.id} style={{ background: C.surface, borderRadius: 12, padding: 14, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{a.name}</span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, display: "inline-block", marginTop: 4 }} />
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{a.trigger}</div>
              <div style={{ display: "flex", gap: 16 }}>
                <div><div style={{ fontSize: 18, fontWeight: 800, color: C.accent }}>{a.sent}</div><div style={{ fontSize: 10, color: C.muted }}>Enviados</div></div>
                <div><div style={{ fontSize: 18, fontWeight: 800, color: C.green }}>{a.rate}%</div><div style={{ fontSize: 10, color: C.muted }}>Abertura</div></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // PACIENTES
  const Pacientes = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <SectionTitle sub={`${PATIENTS.length} pacientes ativos`}>Pacientes</SectionTitle>
        <button style={{
          padding: "10px 20px", background: C.accent, border: "none",
          borderRadius: 10, color: C.bg, fontWeight: 700, fontSize: 13, cursor: "pointer",
        }}>+ Novo Paciente</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {PATIENTS.map(p => {
          const pr = priorityMap[p.priority];
          return (
            <Card key={p.id} style={{ cursor: "pointer", transition: "border-color 0.2s", borderColor: selPatient?.id === p.id ? C.accent : C.border }}
              onClick={() => { setSelPatient(p); setNav("jornada"); }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, color: C.bg, fontSize: 15, flexShrink: 0,
                }}>{p.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{p.name}</span>
                    <Badge text={pr.label} color={pr.color} bg={pr.bg} />
                    {p.tags.map(t => <Badge key={t} text={t} color={C.muted} bg={C.border} />)}
                  </div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                    {p.condition} · {p.specialty} · {p.age} anos
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Próxima consulta</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.nextVisit}</div>
                </div>
                <RadialProgress value={p.progress} size={52} color={C.accent} label="%" />
                <div style={{ fontSize: 20 }}>{channelIcon[p.channel]}</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <SparkLine data={p.checkins} color={C.accent} width={200} height={32} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // JORNADA
  const Jornada = () => {
    const p = selPatient;
    const [tab, setTab] = useState("timeline");
    return (
      <div>
        {/* Patient hero */}
        <Card style={{ marginBottom: 16, background: `linear-gradient(135deg, ${C.card} 60%, #0A1628)` }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 20, color: C.bg, flexShrink: 0,
              boxShadow: `0 0 24px ${C.accentGlow}`,
            }}>{p.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.text }}>{p.name}</h3>
                <Badge text={priorityMap[p.priority].label} color={priorityMap[p.priority].color} bg={priorityMap[p.priority].bg} />
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 6, flexWrap: "wrap" }}>
                {[
                  [`🏥`, p.condition], [`🎓`, p.specialty],
                  [`🎂`, `${p.age}a`], [`📅`, `Última: ${p.lastVisit}`],
                  [`📆`, `Próxima: ${p.nextVisit}`],
                ].map(([ic, tx], i) => (
                  <span key={i} style={{ fontSize: 13, color: C.muted }}>{ic} {tx}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ padding: "8px 16px", background: C.border, border: "none", borderRadius: 8, color: C.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>✏️ Editar</button>
              <button style={{ padding: "8px 16px", background: C.accent, border: "none", borderRadius: 8, color: C.bg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Registro</button>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: C.muted }}>Progresso da Jornada</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>{p.progress}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 8, background: C.border }}>
              <div style={{ height: "100%", borderRadius: 8, background: `linear-gradient(90deg, ${C.accent}, ${C.purple})`, width: `${p.progress}%`, boxShadow: `0 0 12px ${C.accentGlow}`, transition: "width 0.5s" }} />
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: C.surface, borderRadius: 10, padding: 4, border: `1px solid ${C.border}`, width: "fit-content" }}>
          {["timeline", "exames", "notas", "metricas"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "7px 16px", borderRadius: 7, border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: 13, textTransform: "capitalize",
              background: tab === t ? C.accent : "transparent",
              color: tab === t ? C.bg : C.muted, transition: "all 0.15s",
            }}>
              {t === "timeline" ? "🗺 Jornada" : t === "exames" ? "🔬 Exames" : t === "notas" ? "📝 Notas" : "📈 Métricas"}
            </button>
          ))}
        </div>

        {/* Timeline */}
        {tab === "timeline" && (
          <Card>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 24 }}>Etapas da Jornada</div>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 23, top: 24, bottom: 24, width: 2, background: C.border, zIndex: 0 }} />
              {p.steps.map((s, i) => (
                <div key={s.id} style={{ display: "flex", gap: 18, marginBottom: 28, position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                    background: s.done ? C.accent : s.active ? `${C.accent}22` : C.border,
                    border: s.active ? `2px solid ${C.accent}` : `2px solid ${s.done ? C.accent : C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: s.done ? 18 : 20,
                    boxShadow: s.active ? `0 0 18px ${C.accentGlow}` : "none",
                  }}>
                    {s.done ? "✓" : s.icon}
                  </div>
                  <div style={{ paddingTop: 12 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontWeight: s.active ? 800 : s.done ? 600 : 500, fontSize: 14, color: s.done || s.active ? C.text : C.muted }}>
                        {s.label}
                      </span>
                      {s.active && <Badge text="Atual" color={C.accent} bg={C.accentGlow} />}
                    </div>
                    <div style={{ fontSize: 12, color: C.dim, marginTop: 3 }}>{s.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Exames */}
        {tab === "exames" && (
          <Card>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 18 }}>Exames e Resultados</div>
            {p.exams.map((e, i) => {
              const st = statusMap[e.status];
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, marginBottom: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: st.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{e.name}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{e.date} · {e.value}</div>
                  </div>
                  <Badge text={st.label} color={st.color} bg={`${st.color}18`} />
                </div>
              );
            })}
            <button style={{ marginTop: 8, padding: "9px 18px", background: C.border, border: "none", borderRadius: 8, color: C.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Solicitar Exame</button>
          </Card>
        )}

        {/* Notas */}
        {tab === "notas" && (
          <Card>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 14 }}>Notas Clínicas</div>
            <div style={{ background: `${C.yellow}10`, border: `1px solid ${C.yellow}40`, borderRadius: 10, padding: "14px 16px", fontSize: 14, color: C.text, lineHeight: 1.7, marginBottom: 16 }}>
              {p.notes}
            </div>
            <textarea style={{
              width: "100%", borderRadius: 10, border: `1px solid ${C.border}`,
              padding: "12px 14px", fontSize: 13.5, color: C.text, resize: "vertical",
              minHeight: 90, fontFamily: "inherit", outline: "none",
              background: C.surface, boxSizing: "border-box",
            }} placeholder="Adicionar nova nota clínica..." />
            <button style={{ marginTop: 10, padding: "9px 20px", background: C.accent, border: "none", borderRadius: 8, color: C.bg, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Salvar Nota</button>
          </Card>
        )}

        {/* Métricas */}
        {tab === "metricas" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 14 }}>Evolução Check-ins</div>
              <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
                <div><div style={{ fontSize: 24, fontWeight: 900, color: C.green }}>{p.checkins[p.checkins.length - 1]?.adherence}%</div><div style={{ fontSize: 12, color: C.muted }}>Adesão atual</div></div>
                <div><div style={{ fontSize: 24, fontWeight: 900, color: C.accent }}>{p.checkins[p.checkins.length - 1]?.score}/10</div><div style={{ fontSize: 12, color: C.muted }}>Score bem-estar</div></div>
              </div>
              <SparkLine data={p.checkins} color={C.accent} width={280} height={60} />
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                {p.checkins.map((c, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: C.muted }}>{c.week}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 20 }}>Indicadores</div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div style={{ textAlign: "center" }}>
                  <RadialProgress value={p.nps * 10} size={72} color={C.purple} label="NPS" />
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Satisfação</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <RadialProgress value={p.ltvScore} size={72} color={C.green} label="LTV" />
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Fidelidade</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <RadialProgress value={p.progress} size={72} color={C.accent} label="%" />
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Progresso</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  };

  // CHECK-INS
  const CheckIns = () => (
    <div>
      <SectionTitle sub="Acompanhamento semanal automatizado">Check-ins Semanais</SectionTitle>
      {activeCheckin ? (
        <Card>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 4 }}>
            Check-in: {activeCheckin.name}
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Semana atual · Responda com honestidade</div>
          {CHECKIN_QUESTIONS.map((q, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10 }}>{i + 1}. {q}</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} onClick={() => setCheckinAnswers(a => ({ ...a, [i]: v }))}
                    style={{
                      width: 44, height: 44, borderRadius: 10, border: `1px solid ${checkinAnswers[i] === v ? C.accent : C.border}`,
                      background: checkinAnswers[i] === v ? `${C.accent}22` : C.surface,
                      color: checkinAnswers[i] === v ? C.accent : C.muted,
                      fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                    }}>{v}</button>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button onClick={() => { setActiveCheckin(null); setCheckinAnswers({}); }}
              style={{ padding: "10px 20px", background: C.border, border: "none", borderRadius: 8, color: C.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Cancelar
            </button>
            <button onClick={() => { setActiveCheckin(null); setCheckinAnswers({}); }}
              style={{ padding: "10px 24px", background: C.accent, border: "none", borderRadius: 8, color: C.bg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Enviar Check-in ✓
            </button>
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {PATIENTS.map(p => {
            const last = p.checkins[p.checkins.length - 1];
            return (
              <Card key={p.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 14, color: C.bg, flexShrink: 0,
                  }}>{p.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{p.condition} · {p.checkins.length} check-ins realizados</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: C.green }}>{last?.adherence}%</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Adesão</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: C.accent }}>{last?.score}/10</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Score</div>
                  </div>
                  <SparkLine data={p.checkins} color={C.accent} width={100} height={36} />
                  <button onClick={() => setActiveCheckin(p)}
                    style={{ padding: "8px 16px", background: C.accent, border: "none", borderRadius: 8, color: C.bg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    Iniciar
                  </button>
                </div>
              </Card>
            );
          })}
          <Card style={{ borderStyle: "dashed", opacity: 0.6 }}>
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Enviar check-in em massa</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Disparar formulário para todos os pacientes ativos via WhatsApp</div>
              <button style={{ marginTop: 14, padding: "10px 24px", background: C.accent, border: "none", borderRadius: 8, color: C.bg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Disparar Agora
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );

  // CRM
  const CRM = () => {
    const p = selPatient;
    return (
      <div>
        <SectionTitle sub="WhatsApp, Instagram, E-mail e mais em um só lugar">CRM & Canais</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 14, height: "65vh" }}>
          {/* Contacts */}
          <Card style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Conversas</div>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {PATIENTS.map(pat => (
                <div key={pat.id} onClick={() => setSelPatient(pat)} style={{
                  padding: "12px 16px", cursor: "pointer",
                  background: selPatient?.id === pat.id ? `${C.accent}10` : "transparent",
                  borderLeft: selPatient?.id === pat.id ? `3px solid ${C.accent}` : "3px solid transparent",
                  borderBottom: `1px solid ${C.border}`,
                  transition: "all 0.15s",
                }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: C.bg, flexShrink: 0 }}>{pat.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{pat.name}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {channelIcon[pat.channel]} {pat.lastContact}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {/* Chat */}
          <Card style={{ padding: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: C.bg }}>{p.avatar}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{p.name}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{channelIcon[p.channel]} {p.channel} · {p.phone}</div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
              {p.messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "doctor" ? "flex-end" : m.from === "system" ? "center" : "flex-start" }}>
                  {m.auto ? (
                    <div style={{ background: `${C.purple}22`, border: `1px solid ${C.purple}40`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: C.purple }}>
                      ⚡ {m.text} · {m.time}
                    </div>
                  ) : (
                    <div style={{
                      maxWidth: "70%", padding: "10px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.5,
                      background: m.from === "doctor" ? C.accent : C.surface,
                      color: m.from === "doctor" ? C.bg : C.text,
                      borderBottomRightRadius: m.from === "doctor" ? 4 : 12,
                      borderBottomLeftRadius: m.from === "patient" ? 4 : 12,
                    }}>
                      {m.text}
                      <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: "right" }}>{m.time}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
              <input value={crmMsg} onChange={e => setCrmMsg(e.target.value)}
                style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit" }}
                placeholder={`Mensagem via ${p.channel}...`} />
              <button onClick={() => setCrmMsg("")}
                style={{ padding: "10px 18px", background: C.accent, border: "none", borderRadius: 10, color: C.bg, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Enviar
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // AUTOMATIONS
  const Automacoes = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <SectionTitle sub="Fluxos automáticos para toda a jornada">Automações</SectionTitle>
        <button style={{ padding: "10px 20px", background: C.accent, border: "none", borderRadius: 10, color: C.bg, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Nova Automação</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {AUTOMATIONS.map(a => (
          <Card key={a.id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: a.active ? `${C.accent}18` : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              ⚡
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{a.name}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>🔔 {a.trigger} · {channelIcon[a.channel.toLowerCase().split("+")[0].trim()]} {a.channel}</div>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.accent }}>{a.sent}</div>
                <div style={{ fontSize: 11, color: C.muted }}>Enviados</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.green }}>{a.rate}%</div>
                <div style={{ fontSize: 11, color: C.muted }}>Abertura</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 44, height: 24, borderRadius: 12, cursor: "pointer", position: "relative",
                background: a.active ? C.accent : C.border, transition: "background 0.2s",
              }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: a.active ? 23 : 3, transition: "left 0.2s" }} />
              </div>
              <span style={{ fontSize: 12, color: a.active ? C.green : C.muted, fontWeight: 600 }}>{a.active ? "Ativa" : "Pausa"}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // IA ASSISTENTE
  const IAAssistente = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "75vh" }}>
      <SectionTitle sub={`Contexto: ${selPatient.name} · ${selPatient.condition}`}>IA Assistente Clínica</SectionTitle>
      <Card style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
        {/* Suggested actions */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 8, overflowX: "auto" }}>
          {[
            "Analisar check-ins recentes",
            "Sugerir próximo protocolo",
            "Redigir mensagem de retorno",
            "Avaliar risco de abandono",
            "Orientações nutricionais",
          ].map(s => (
            <button key={s} onClick={() => sendAI(s)} style={{
              padding: "6px 14px", background: `${C.accent}15`, border: `1px solid ${C.accent}40`,
              borderRadius: 20, color: C.accent, fontSize: 12, fontWeight: 600, cursor: "pointer",
              whiteSpace: "nowrap", flexShrink: 0,
            }}>{s}</button>
          ))}
        </div>
        {/* Messages */}
        <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {aiMessages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 10 }}>
              {m.role === "assistant" && (
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
              )}
              <div style={{
                maxWidth: "75%", padding: "12px 16px", borderRadius: 14, fontSize: 13.5, lineHeight: 1.6,
                background: m.role === "user" ? C.accent : C.surface,
                color: m.role === "user" ? C.bg : C.text,
                border: m.role === "assistant" ? `1px solid ${C.border}` : "none",
                borderBottomRightRadius: m.role === "user" ? 4 : 14,
                borderBottomLeftRadius: m.role === "assistant" ? 4 : 14,
              }}>{m.text}</div>
            </div>
          ))}
          {aiLoading && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
              <div style={{ padding: "10px 16px", background: C.surface, borderRadius: 14, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(d => (
                    <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, opacity: 0.6, animation: `pulse 1s ${d * 0.3}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Input */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
          <input value={chatMsg} onChange={e => setChatMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendAI(chatMsg)}
            style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 16px", color: C.text, fontSize: 13.5, outline: "none", fontFamily: "inherit" }}
            placeholder="Pergunte sobre o paciente, protocolos, automações..." />
          <button onClick={() => sendAI(chatMsg)} disabled={aiLoading}
            style={{ padding: "11px 20px", background: aiLoading ? C.dim : C.accent, border: "none", borderRadius: 10, color: C.bg, fontWeight: 700, fontSize: 13, cursor: aiLoading ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
            {aiLoading ? "..." : "Enviar"}
          </button>
        </div>
      </Card>
      <style>{`@keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }`}</style>
    </div>
  );

  // AGENDA
  const Agenda = () => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    const slots = { "09:00": { name: "Ana Beatriz Souza", type: "retorno", color: C.accent }, "11:00": { name: "Carlos Menezes", type: "consulta", color: C.green }, "14:00": { name: "Fernanda Lima", type: "avaliação", color: C.purple }, "16:00": { name: "Ricardo Alves", type: "consulta", color: C.yellow } };
    return (
      <div>
        <SectionTitle sub="Maio 2026">Agenda</SectionTitle>
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", gap: 0 }}>
            <div />
            {days.map((d, i) => (
              <div key={d} style={{ textAlign: "center", padding: "8px 4px", fontSize: 13, fontWeight: 700, color: i === 5 ? C.accent : C.muted }}>
                <div>{d}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: i === 5 ? C.accent : C.text, marginTop: 2 }}>{19 + i}</div>
              </div>
            ))}
            {hours.map(h => (
              <>
                <div key={h} style={{ padding: "0 8px", fontSize: 11, color: C.dim, paddingTop: 12, textAlign: "right" }}>{h}</div>
                {days.map((_, di) => {
                  const slot = di === 5 && slots[h];
                  return (
                    <div key={di} style={{ minHeight: 52, borderTop: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, padding: 4, background: di === 5 ? `${C.accent}05` : "transparent" }}>
                      {slot && (
                        <div style={{ background: `${slot.color}20`, border: `1px solid ${slot.color}60`, borderRadius: 6, padding: "4px 8px", fontSize: 11, fontWeight: 600, color: slot.color }}>
                          {slot.name.split(" ")[0]}<br />
                          <span style={{ fontWeight: 400, opacity: 0.7 }}>{slot.type}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  // RELATORIOS
  const Relatorios = () => (
    <div>
      <SectionTitle sub="Indicadores e métricas da clínica">Relatórios</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 14 }}>
        {[
          { label: "Taxa de Conversão", value: `${METRICS.conversionRate}%`, sub: "Lead → Paciente", color: C.accent },
          { label: "Absenteísmo", value: `${METRICS.absenteeism}%`, sub: "Meta: < 10%", color: C.yellow },
          { label: "NPS Clínica", value: METRICS.npsAvg, sub: "Promotores: 72%", color: C.green },
        ].map((k, i) => (
          <Card key={i}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: k.color, letterSpacing: "-1px", marginTop: 6 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{k.sub}</div>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 16 }}>Receita Mensal</div>
          {["Jan", "Fev", "Mar", "Abr", "Mai"].map((m, i) => {
            const vals = [38, 41, 44, 43, 48.7];
            const pct = (vals[i] / 50) * 100;
            return (
              <div key={m} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: C.text }}>{m}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>R$ {vals[i]}k</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: C.border }}>
                  <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${C.accent}, ${C.purple})`, width: `${pct}%`, transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}
        </Card>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 16 }}>Top Pacientes por LTV</div>
          {PATIENTS.map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.bg }}>{p.avatar.slice(0, 1)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{p.name}</div>
                <div style={{ height: 5, borderRadius: 4, background: C.border, marginTop: 4 }}>
                  <div style={{ height: "100%", borderRadius: 4, background: C.accent, width: `${p.ltvScore}%` }} />
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{p.ltvScore}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (nav) {
      case "dashboard": return <Dashboard />;
      case "pacientes": return <Pacientes />;
      case "jornada": return <Jornada />;
      case "checkins": return <CheckIns />;
      case "crm": return <CRM />;
      case "automacoes": return <Automacoes />;
      case "ia": return <IAAssistente />;
      case "agenda": return <Agenda />;
      case "relatorios": return <Relatorios />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: C.text, overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: `0 0 16px ${C.accentGlow}` }}>⚕</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, color: C.text, letterSpacing: "-0.4px" }}>CareFlow</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: -1 }}>Plataforma Inteligente</div>
            </div>
          </div>
        </div>
        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {NAV.map(item => {
            const active = nav === item.id;
            return (
              <button key={item.id} onClick={() => setNav(item.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10, border: "none",
                background: active ? `${C.accent}18` : "transparent",
                color: active ? C.accent : C.muted,
                fontSize: 13.5, fontWeight: active ? 700 : 500,
                cursor: "pointer", marginBottom: 2, textAlign: "left",
                transition: "all 0.15s",
                borderLeft: active ? `3px solid ${C.accent}` : "3px solid transparent",
              }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
        {/* Patient quick-select */}
        <div style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, paddingLeft: 4 }}>Foco atual</div>
          {PATIENTS.map(p => (
            <button key={p.id} onClick={() => { setSelPatient(p); setNav("jornada"); }} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 8,
              padding: "7px 10px", borderRadius: 8, border: "none",
              background: selPatient?.id === p.id ? `${C.accent}15` : "transparent",
              cursor: "pointer", marginBottom: 2, textAlign: "left",
              transition: "background 0.15s",
            }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: selPatient?.id === p.id ? `linear-gradient(135deg, ${C.accent}, ${C.purple})` : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: selPatient?.id === p.id ? C.bg : C.muted, flexShrink: 0 }}>{p.avatar}</div>
              <span style={{ fontSize: 12, color: selPatient?.id === p.id ? C.accent : C.muted, fontWeight: selPatient?.id === p.id ? 700 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>
        {renderContent()}
      </main>
    </div>
  );
}
