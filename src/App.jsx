import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://luxwxnyqsdfihqdyvzjj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1eHd4bnlxc2RmaWhxZHl2empqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNTYxNTQsImV4cCI6MjA5NzczMjE1NH0.BfCPf1wP2LrSQnaKkSFSn6fB7rTLu9D8TMUne02MdoQ";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const fmt = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);
const fmtDate = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "—";
const today = () => new Date().toISOString().split("T")[0];
const addMonths = (dateStr, n) => {
  const d = new Date(dateStr + "T00:00:00");
  d.setMonth(d.getMonth() + n);
  return d.toISOString().split("T")[0];
};

// ── CORES ──────────────────────────────────────────────────────────────────────
const C = {
  bg: "#0d0d0d",
  card: "#1a1a1a",
  border: "#2a2a2a",
  gold: "#c8a96e",
  goldLight: "#f0dfb4",
  goldDark: "#8a6f3e",
  text: "#f5f5f5",
  muted: "#888",
  danger: "#e05555",
  success: "#4caf70",
  warning: "#e0a030",
};

const s = {
  app: { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, -apple-system, sans-serif", paddingBottom: 80 },
  header: { background: C.card, borderBottom: `1px solid ${C.border}`, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 },
  headerTitle: { color: C.gold, fontWeight: 700, fontSize: 16, letterSpacing: 1 },
  nav: { position: "fixed", bottom: 0, left: 0, right: 0, background: C.card, borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 10 },
  navBtn: (active) => ({ flex: 1, padding: "12px 4px 10px", background: "none", border: "none", color: active ? C.gold : C.muted, fontSize: 10, fontWeight: active ? 700 : 400, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "color .2s" }),
  page: { padding: "20px 16px" },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px", marginBottom: 12 },
  goldCard: { background: `linear-gradient(135deg, ${C.goldDark}22, ${C.gold}11)`, border: `1px solid ${C.gold}44`, borderRadius: 12, padding: 16, marginBottom: 12 },
  label: { fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  value: { fontSize: 22, fontWeight: 700, color: C.gold },
  btn: { background: C.gold, color: "#0d0d0d", border: "none", borderRadius: 8, padding: "12px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", width: "100%" },
  btnOutline: { background: "none", color: C.gold, border: `1px solid ${C.gold}`, borderRadius: 8, padding: "10px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer" },
  btnDanger: { background: "none", color: C.danger, border: `1px solid ${C.danger}44`, borderRadius: 8, padding: "8px 14px", fontSize: 12, cursor: "pointer" },
  btnSmall: { background: C.gold, color: "#0d0d0d", border: "none", borderRadius: 6, padding: "6px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer" },
  btnSmallOutline: { background: "none", color: C.muted, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" },
  input: { width: "100%", background: "#111", border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" },
  select: { width: "100%", background: "#111", border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box", appearance: "none" },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 12, color: C.muted, marginBottom: 6, display: "block" },
  row: { display: "flex", gap: 10 },
  tag: (color) => ({ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: color + "22", color, letterSpacing: 0.5 }),
  divider: { height: 1, background: C.border, margin: "16px 0" },
  section: { fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12, marginTop: 4 },
  modal: { position: "fixed", inset: 0, background: "#000c", zIndex: 100, display: "flex", alignItems: "flex-end" },
  modalContent: { background: C.card, borderRadius: "20px 20px 0 0", padding: 20, width: "100%", maxHeight: "90vh", overflowY: "auto", border: `1px solid ${C.border}` },
  modalTitle: { fontSize: 16, fontWeight: 700, color: C.gold, marginBottom: 20 },
  statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 },
  statCard: (accent) => ({ background: C.card, border: `1px solid ${accent || C.border}`, borderRadius: 10, padding: "14px 12px" }),
  toast: (type) => ({ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: type === "error" ? C.danger : C.success, color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, zIndex: 999, whiteSpace: "nowrap" }),
};

// ── TOAST ──────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, []);
  return <div style={s.toast(type)}>{msg}</div>;
}

// ── PAINEL PRINCIPAL (Dashboard) ───────────────────────────────────────────────
function Dashboard({ onNav }) {
  const [data, setData] = useState(null);
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const mes = new Date().toLocaleString("pt-BR", { month: "long", year: "numeric" });

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: dash }, { data: parc }] = await Promise.all([
      supabase.from("vw_dashboard").select("*").single(),
      supabase.from("parcelas").select("*, mentorados(nome, tipos_mentoria(nome))").eq("pago", false).order("vencimento").limit(10),
    ]);
    setData(dash);
    setParcelas(parc || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div style={{ ...s.page, textAlign: "center", color: C.muted, paddingTop: 60 }}>Carregando...</div>;

  const vencidas = parcelas.filter(p => p.vencimento < today());
  const proximas = parcelas.filter(p => p.vencimento >= today());

  return (
    <div style={s.page}>
      <div style={{ ...s.goldCard, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: C.gold, letterSpacing: 1, marginBottom: 4 }}>⚔ HOMEM ESPIRITUAL — FINANCEIRO</div>
        <div style={{ fontSize: 13, color: C.muted }}>Visão geral das mentorias</div>
      </div>

      <div style={s.statGrid}>
        <div style={s.statCard(C.gold + "44")}>
          <div style={s.label}>Total contratado</div>
          <div style={{ ...s.value, fontSize: 18 }}>{fmt(data?.total_contratado)}</div>
        </div>
        <div style={s.statCard(C.success + "44")}>
          <div style={s.label}>Total recebido</div>
          <div style={{ ...s.value, fontSize: 18, color: C.success }}>{fmt(data?.total_recebido)}</div>
        </div>
        <div style={s.statCard(C.warning + "44")}>
          <div style={s.label}>A receber</div>
          <div style={{ ...s.value, fontSize: 18, color: C.warning }}>{fmt(data?.total_a_receber)}</div>
        </div>
        <div style={s.statCard(C.border)}>
          <div style={s.label}>Mentorados ativos</div>
          <div style={{ ...s.value, fontSize: 28 }}>{data?.mentorados_ativos}</div>
        </div>
      </div>

      <div style={{ ...s.card, border: `1px solid ${C.gold}44` }}>
        <div style={s.label}>📅 {mes}</div>
        <div style={s.row}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: C.muted }}>A receber no mês</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.warning }}>{fmt(data?.a_receber_mes_atual)}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: C.muted }}>Recebido no mês</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.success }}>{fmt(data?.recebido_mes_atual)}</div>
          </div>
        </div>
      </div>

      {vencidas.length > 0 && (
        <>
          <div style={s.section}>⚠️ Parcelas vencidas ({vencidas.length})</div>
          {vencidas.map(p => (
            <div key={p.id} style={{ ...s.card, borderColor: C.danger + "66" }}>
              <div style={s.row}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.mentorados?.nome}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{p.mentorados?.tipos_mentoria?.nome} • Parcela {p.numero}</div>
                  <div style={{ fontSize: 11, color: C.danger }}>Venceu {fmtDate(p.vencimento)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: C.gold }}>{fmt(p.valor)}</div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {proximas.length > 0 && (
        <>
          <div style={s.section}>Próximas parcelas</div>
          {proximas.slice(0, 5).map(p => (
            <div key={p.id} style={s.card}>
              <div style={s.row}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.mentorados?.nome}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{p.mentorados?.tipos_mentoria?.nome} • Parcela {p.numero}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{fmtDate(p.vencimento)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: C.gold }}>{fmt(p.valor)}</div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {parcelas.length === 0 && (
        <div style={{ textAlign: "center", color: C.muted, padding: "40px 0" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
          <div>Nenhuma parcela pendente</div>
        </div>
      )}
    </div>
  );
}

// ── FORMULÁRIO NOVO MENTORADO ──────────────────────────────────────────────────
function NovoMentorado({ onClose, onSaved, toast }) {
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", tipo_mentoria_id: "", valor_total: "", parcelado: false, num_parcelas: 1, valor_entrada: "", data_inicio: today(), dia_cobranca: 10, status: "ativo", observacoes: "" });
  const [tipoSel, setTipoSel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    supabase.from("tipos_mentoria").select("*").eq("ativo", true).then(({ data }) => setTipos(data || []));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (form.tipo_mentoria_id) {
      const t = tipos.find(t => t.id === form.tipo_mentoria_id);
      if (t) { setTipoSel(t); set("valor_total", t.valor); }
    }
  }, [form.tipo_mentoria_id, tipos]);

  // Calcula preview de parcelas
  useEffect(() => {
    const total = parseFloat(form.valor_total) || 0;
    const entrada = parseFloat(form.valor_entrada) || 0;
    const nParc = parseInt(form.num_parcelas) || 1;
    if (!total || !form.data_inicio) { setPreview([]); return; }

    const parcelas = [];
    if (form.parcelado && entrada > 0) {
      parcelas.push({ numero: 0, tipo: "entrada", valor: entrada, vencimento: form.data_inicio });
    }
    const restante = form.parcelado ? total - entrada : total;
    const valorParc = restante / (form.parcelado ? nParc : 1);

    for (let i = 0; i < (form.parcelado ? nParc : 1); i++) {
      parcelas.push({ numero: i + 1, tipo: "parcela", valor: valorParc, vencimento: addMonths(form.data_inicio, i + (form.parcelado && entrada > 0 ? 1 : 0)) });
    }
    setPreview(parcelas);
  }, [form.valor_total, form.valor_entrada, form.num_parcelas, form.parcelado, form.data_inicio]);

  const salvar = async () => {
    if (!form.nome || !form.tipo_mentoria_id || !form.valor_total) { toast("Preencha nome, tipo e valor", "error"); return; }
    setLoading(true);
    const { data: men, error } = await supabase.from("mentorados").insert({ nome: form.nome, telefone: form.telefone, email: form.email, tipo_mentoria_id: form.tipo_mentoria_id, valor_total: parseFloat(form.valor_total), parcelado: form.parcelado, num_parcelas: form.parcelado ? parseInt(form.num_parcelas) : 1, valor_entrada: parseFloat(form.valor_entrada) || 0, data_inicio: form.data_inicio, dia_cobranca: parseInt(form.dia_cobranca), status: form.status, observacoes: form.observacoes }).select().single();
    if (error) { toast("Erro ao salvar: " + error.message, "error"); setLoading(false); return; }

    // Insere parcelas
    const parcInsert = preview.map(p => ({ mentorado_id: men.id, numero: p.numero, tipo: p.tipo, valor: p.valor, vencimento: p.vencimento, pago: false }));
    await supabase.from("parcelas").insert(parcInsert);

    toast("Mentorado salvo com sucesso!", "success");
    setLoading(false);
    onSaved();
  };

  const restante = (parseFloat(form.valor_total) || 0) - (parseFloat(form.valor_entrada) || 0);
  const valorParc = form.parcelado && form.num_parcelas > 0 ? restante / form.num_parcelas : restante;

  return (
    <div style={s.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modalContent}>
        <div style={s.modalTitle}>+ Novo Mentorado</div>

        <div style={s.fieldGroup}>
          <label style={s.fieldLabel}>Nome completo *</label>
          <input style={s.input} value={form.nome} onChange={e => set("nome", e.target.value)} placeholder="Nome do mentorado" />
        </div>
        <div style={s.row}>
          <div style={{ ...s.fieldGroup, flex: 1 }}>
            <label style={s.fieldLabel}>Telefone / WhatsApp</label>
            <input style={s.input} value={form.telefone} onChange={e => set("telefone", e.target.value)} placeholder="(44) 9 9999-9999" />
          </div>
        </div>

        <div style={s.fieldGroup}>
          <label style={s.fieldLabel}>Tipo de mentoria *</label>
          <select style={s.select} value={form.tipo_mentoria_id} onChange={e => set("tipo_mentoria_id", e.target.value)}>
            <option value="">Selecione...</option>
            {tipos.map(t => <option key={t.id} value={t.id}>{t.nome} — {fmt(t.valor)}</option>)}
          </select>
        </div>

        <div style={s.row}>
          <div style={{ ...s.fieldGroup, flex: 1 }}>
            <label style={s.fieldLabel}>Valor total (R$) *</label>
            <input style={s.input} type="number" value={form.valor_total} onChange={e => set("valor_total", e.target.value)} placeholder="0,00" />
          </div>
          <div style={{ ...s.fieldGroup, flex: 1 }}>
            <label style={s.fieldLabel}>Data de início</label>
            <input style={s.input} type="date" value={form.data_inicio} onChange={e => set("data_inicio", e.target.value)} />
          </div>
        </div>

        <div style={s.divider} />

        <div style={{ ...s.fieldGroup, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <label style={{ ...s.fieldLabel, margin: 0 }}>Parcelado?</label>
          <button onClick={() => set("parcelado", !form.parcelado)} style={{ background: form.parcelado ? C.gold : C.border, border: "none", borderRadius: 20, width: 44, height: 24, cursor: "pointer", transition: "background .2s", position: "relative" }}>
            <div style={{ position: "absolute", top: 3, left: form.parcelado ? 22 : 3, width: 18, height: 18, borderRadius: 9, background: form.parcelado ? "#000" : C.muted, transition: "left .2s" }} />
          </button>
        </div>

        {form.parcelado && (
          <>
            <div style={s.row}>
              <div style={{ ...s.fieldGroup, flex: 1 }}>
                <label style={s.fieldLabel}>Entrada (R$)</label>
                <input style={s.input} type="number" value={form.valor_entrada} onChange={e => set("valor_entrada", e.target.value)} placeholder="0,00" />
              </div>
              <div style={{ ...s.fieldGroup, flex: 1 }}>
                <label style={s.fieldLabel}>Nº de parcelas</label>
                <select style={s.select} value={form.num_parcelas} onChange={e => set("num_parcelas", e.target.value)}>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}x</option>)}
                </select>
              </div>
            </div>

            {form.valor_total && (
              <div style={{ ...s.card, background: "#111", marginBottom: 16 }}>
                <div style={s.row}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: C.muted }}>Entrada</div>
                    <div style={{ fontWeight: 700, color: C.gold }}>{fmt(form.valor_entrada || 0)}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: C.muted }}>Restante</div>
                    <div style={{ fontWeight: 700 }}>{fmt(restante)}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: C.muted }}>Cada parcela</div>
                    <div style={{ fontWeight: 700, color: C.success }}>{fmt(valorParc)}</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div style={s.fieldGroup}>
          <label style={s.fieldLabel}>Status</label>
          <select style={s.select} value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="ativo">Ativo</option>
            <option value="aguardando">Aguardando</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {preview.length > 0 && (
          <>
            <div style={s.section}>Preview das parcelas</div>
            {preview.map((p, i) => (
              <div key={i} style={{ ...s.row, marginBottom: 6, padding: "8px 10px", background: "#111", borderRadius: 6 }}>
                <div style={{ flex: 1, fontSize: 12 }}>{p.tipo === "entrada" ? "🏁 Entrada" : `Parcela ${p.numero}`}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{fmtDate(p.vencimento)}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, minWidth: 80, textAlign: "right" }}>{fmt(p.valor)}</div>
              </div>
            ))}
          </>
        )}

        <div style={{ ...s.row, marginTop: 20 }}>
          <button style={{ ...s.btnOutline, flex: 1 }} onClick={onClose}>Cancelar</button>
          <button style={{ ...s.btn, flex: 2 }} onClick={salvar} disabled={loading}>{loading ? "Salvando..." : "Salvar Mentorado"}</button>
        </div>
      </div>
    </div>
  );
}

// ── DETALHE DO MENTORADO ───────────────────────────────────────────────────────
function DetalhesMentorado({ mentorado, onClose, onUpdate, toast }) {
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.from("parcelas").select("*").eq("mentorado_id", mentorado.id).order("numero");
    setParcelas(data || []);
    setLoading(false);
  }, [mentorado.id]);

  useEffect(() => { load(); }, [load]);

  const marcarPago = async (p) => {
    const { error } = await supabase.from("parcelas").update({ pago: !p.pago, data_pagamento: !p.pago ? today() : null }).eq("id", p.id);
    if (error) { toast("Erro ao atualizar", "error"); return; }
    toast(!p.pago ? "Parcela marcada como paga!" : "Parcela desmarcada", "success");
    load();
    onUpdate();
  };

  const pago = parcelas.filter(p => p.pago).reduce((a, p) => a + p.valor, 0);
  const aberto = parcelas.filter(p => !p.pago).reduce((a, p) => a + p.valor, 0);

  const statusColor = { ativo: C.gold, concluido: C.success, aguardando: C.warning, cancelado: C.danger };

  return (
    <div style={s.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modalContent}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{mentorado.nome}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{mentorado.tipos_mentoria?.nome}</div>
          </div>
          <span style={s.tag(statusColor[mentorado.status] || C.muted)}>{mentorado.status}</span>
        </div>

        <div style={s.statGrid}>
          <div style={s.statCard(C.gold + "33")}>
            <div style={s.label}>Recebido</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.success }}>{fmt(pago)}</div>
          </div>
          <div style={s.statCard()}>
            <div style={s.label}>A receber</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.warning }}>{fmt(aberto)}</div>
          </div>
        </div>

        <div style={s.divider} />
        <div style={s.section}>Parcelas</div>

        {loading ? <div style={{ color: C.muted, textAlign: "center" }}>Carregando...</div> : parcelas.map(p => (
          <div key={p.id} style={{ ...s.card, borderColor: p.pago ? C.success + "44" : (p.vencimento < today() ? C.danger + "44" : C.border), padding: "12px 14px", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => marcarPago(p)} style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${p.pago ? C.success : C.border}`, background: p.pago ? C.success : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {p.pago && <span style={{ color: "#fff", fontSize: 14, fontWeight: 900 }}>✓</span>}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.tipo === "entrada" ? "Entrada" : `Parcela ${p.numero}`}</div>
                <div style={{ fontSize: 11, color: p.pago ? C.success : (p.vencimento < today() ? C.danger : C.muted) }}>
                  {p.pago ? `Pago em ${fmtDate(p.data_pagamento)}` : `Vence ${fmtDate(p.vencimento)}`}
                </div>
              </div>
              <div style={{ fontWeight: 700, color: p.pago ? C.success : C.gold }}>{fmt(p.valor)}</div>
            </div>
          </div>
        ))}

        <button style={{ ...s.btnOutline, width: "100%", marginTop: 12 }} onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

// ── LISTA DE MENTORADOS ────────────────────────────────────────────────────────
function Mentorados({ toast }) {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNovo, setShowNovo] = useState(false);
  const [detalhe, setDetalhe] = useState(null);
  const [filtro, setFiltro] = useState("todos");

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("mentorados").select("*, tipos_mentoria(nome)").order("created_at", { ascending: false });
    setLista(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const statusColor = { ativo: C.gold, concluido: C.success, aguardando: C.warning, cancelado: C.danger };
  const filtros = ["todos", "ativo", "aguardando", "concluido", "cancelado"];
  const filtrado = filtro === "todos" ? lista : lista.filter(m => m.status === filtro);

  return (
    <div style={s.page}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {filtros.map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{ background: filtro === f ? C.gold : "transparent", color: filtro === f ? "#000" : C.muted, border: `1px solid ${filtro === f ? C.gold : C.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", textTransform: "capitalize" }}>{f}</button>
        ))}
      </div>

      {loading ? <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>Carregando...</div> : (
        <>
          {filtrado.length === 0 && <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>Nenhum mentorado encontrado</div>}
          {filtrado.map(m => (
            <div key={m.id} style={{ ...s.card, cursor: "pointer" }} onClick={() => setDetalhe(m)}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{m.nome}</div>
                <span style={s.tag(statusColor[m.status] || C.muted)}>{m.status}</span>
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{m.tipos_mentoria?.nome}</div>
              <div style={s.row}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: C.muted }}>Valor total</div>
                  <div style={{ fontWeight: 700, color: C.gold }}>{fmt(m.valor_total)}</div>
                </div>
                {m.parcelado && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: C.muted }}>Parcelas</div>
                    <div style={{ fontWeight: 600 }}>{m.num_parcelas}x de {fmt((m.valor_total - (m.valor_entrada || 0)) / m.num_parcelas)}</div>
                  </div>
                )}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: C.muted }}>Início</div>
                  <div style={{ fontSize: 12 }}>{fmtDate(m.data_inicio)}</div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      <button style={{ ...s.btn, position: "fixed", bottom: 80, right: 16, width: "auto", borderRadius: 28, padding: "14px 20px", fontSize: 22, boxShadow: `0 4px 20px ${C.gold}44` }} onClick={() => setShowNovo(true)}>+</button>

      {showNovo && <NovoMentorado onClose={() => setShowNovo(false)} onSaved={() => { setShowNovo(false); load(); }} toast={toast} />}
      {detalhe && <DetalhesMentorado mentorado={detalhe} onClose={() => setDetalhe(null)} onUpdate={load} toast={toast} />}
    </div>
  );
}

// ── PARCELAS (visão geral) ─────────────────────────────────────────────────────
function Parcelas({ toast }) {
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("pendentes");

  const load = useCallback(async () => {
    setLoading(true);
    const query = supabase.from("parcelas").select("*, mentorados(nome, tipos_mentoria(nome))").order("vencimento");
    if (filtro === "pendentes") query.eq("pago", false);
    if (filtro === "pagas") query.eq("pago", true);
    if (filtro === "mes") {
      const now = new Date();
      const ini = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
      const fim = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-31`;
      query.gte("vencimento", ini).lte("vencimento", fim);
    }
    const { data } = await query.limit(50);
    setParcelas(data || []);
    setLoading(false);
  }, [filtro]);

  useEffect(() => { load(); }, [load]);

  const marcarPago = async (p) => {
    await supabase.from("parcelas").update({ pago: !p.pago, data_pagamento: !p.pago ? today() : null }).eq("id", p.id);
    toast(!p.pago ? "Pago!" : "Desmarcado", "success");
    load();
  };

  return (
    <div style={s.page}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["pendentes", "mes", "pagas"].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{ flex: 1, background: filtro === f ? C.gold : "transparent", color: filtro === f ? "#000" : C.muted, border: `1px solid ${filtro === f ? C.gold : C.border}`, borderRadius: 8, padding: "8px 4px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
            {f === "pendentes" ? "Pendentes" : f === "mes" ? "Este mês" : "Pagas"}
          </button>
        ))}
      </div>

      {loading ? <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>Carregando...</div> : (
        <>
          {parcelas.length === 0 && <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>Nenhuma parcela encontrada</div>}
          {parcelas.map(p => (
            <div key={p.id} style={{ ...s.card, borderColor: p.pago ? C.success + "33" : (p.vencimento < today() ? C.danger + "44" : C.border) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => marcarPago(p)} style={{ width: 28, height: 28, borderRadius: 8, border: `2px solid ${p.pago ? C.success : C.border}`, background: p.pago ? C.success : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {p.pago && <span style={{ color: "#fff", fontSize: 16, fontWeight: 900 }}>✓</span>}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.mentorados?.nome}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{p.mentorados?.tipos_mentoria?.nome} • {p.tipo === "entrada" ? "Entrada" : `Parcela ${p.numero}`}</div>
                  <div style={{ fontSize: 11, color: p.pago ? C.success : (p.vencimento < today() ? C.danger : C.muted) }}>
                    {p.pago ? `Pago ${fmtDate(p.data_pagamento)}` : `Vence ${fmtDate(p.vencimento)}`}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: p.pago ? C.success : C.gold, fontSize: 14 }}>{fmt(p.valor)}</div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── APP ROOT ───────────────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard", label: "Painel", icon: "⊞" },
  { id: "mentorados", label: "Mentorados", icon: "◎" },
  { id: "parcelas", label: "Parcelas", icon: "◈" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [toastMsg, setToastMsg] = useState(null);

  const toast = (msg, type = "success") => setToastMsg({ msg, type });

  return (
    <div style={s.app}>
      {toastMsg && <Toast msg={toastMsg.msg} type={toastMsg.type} onDone={() => setToastMsg(null)} />}

      <div style={s.header}>
        <div style={s.headerTitle}>⚔ HOMEM ESPIRITUAL</div>
        <div style={{ fontSize: 11, color: C.muted }}>Financeiro</div>
      </div>

      {tab === "dashboard" && <Dashboard onNav={setTab} />}
      {tab === "mentorados" && <Mentorados toast={toast} />}
      {tab === "parcelas" && <Parcelas toast={toast} />}

      <nav style={s.nav}>
        {TABS.map(t => (
          <button key={t.id} style={s.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
