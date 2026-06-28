import { useState } from "react";
import { getTransitionFlag } from "../utils/harmonicTransition";

const MIX_STORAGE_KEY = "ska_setlist_my_mix";

const TRANSITION_FLAG_STYLES = {
  green:  { bg: "#16a34a28", color: "#4ade80", border: "#16a34a55", label: "Great" },
  yellow: { bg: "#d9770628", color: "#fbbf24", border: "#d9770655", label: "Okay"  },
  red:    { bg: "#dc262628", color: "#f87171", border: "#dc262655", label: "Bad"   },
};

const KEY_COLORS = {
  "A": "#e74c3c", "Am": "#e74c3c",
  "Bb": "#e67e22", "Bbm": "#e67e22",
  "B": "#f1c40f", "Bm": "#f1c40f",
  "C": "#2ecc71", "Cm": "#c0392b",
  "C#m": "#1abc9c", "Db": "#1abc9c",
  "D": "#3498db", "Dm": "#5d6d7e",
  "Eb": "#9b59b6", "Ebm": "#9b59b6",
  "E": "#27ae60", "Em": "#27ae60",
  "F": "#e91e63", "Fm": "#e91e63",
  "F#m": "#00bcd4", "Gb": "#00bcd4",
  "G": "#8bc34a", "Gm": "#795548",
  "Ab": "#ff9800", "Abm": "#ff9800",
};

function keyColor(key) {
  return KEY_COLORS[key] || "#888";
}

export default function MyMixPanel({ mix, onRemove, onClear, onSave, onReorder, theme: T }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  function handleDragStart(i) { setDragIndex(i); }

  function handleDragOver(e, i) {
    e.preventDefault();
    setDragOverIndex(i);
  }

  function handleDrop(i) {
    if (dragIndex === null || dragIndex === i) {
      setDragIndex(null); setDragOverIndex(null); return;
    }
    const reordered = [...mix];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(i, 0, moved);
    onReorder(reordered);
    setDragIndex(null); setDragOverIndex(null);
  }

  function handleDragEnd() { setDragIndex(null); setDragOverIndex(null); }

  if (mix.length === 0) {
    return (
      <div style={{
        border: `2px dashed ${T.border}`, borderRadius: 12,
        padding: "48px 24px", textAlign: "center",
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🎛️</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.textSecondary }}>Your mix is empty</div>
        <div style={{ fontSize: 12, color: T.textMuted, marginTop: 6 }}>
          Browse your collection and click <strong style={{ color: "#22c55e" }}>+ Mix</strong> to add tracks
        </div>
      </div>
    );
  }

  const greenCount  = mix.filter((_, i) => i > 0 && getTransitionFlag(mix[i-1].key, mix[i].key) === "green").length;
  const yellowCount = mix.filter((_, i) => i > 0 && getTransitionFlag(mix[i-1].key, mix[i].key) === "yellow").length;
  const redCount    = mix.filter((_, i) => i > 0 && getTransitionFlag(mix[i-1].key, mix[i].key) === "red").length;

  return (
    <div>
      {/* Stats + actions */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {[
          { label: "Tracks",            value: mix.length,    color: "#22c55e" },
          { label: "Great transitions", value: greenCount,    color: "#4ade80" },
          { label: "Okay transitions",  value: yellowCount,   color: "#fbbf24" },
          { label: "Bad transitions",   value: redCount,      color: "#f87171" },
        ].map(s => (
          <div key={s.label} style={{
            background: T.surface, borderRadius: 8, padding: "10px 18px",
            border: `1px solid ${T.border}`,
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
          </div>
        ))}

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={onSave}
            style={{
              background: "#22c55e18", border: "1px solid #22c55e55",
              color: "#22c55e", borderRadius: 8, padding: "8px 16px",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}
          >Save Mix</button>
          <button
            onClick={onClear}
            style={{
              background: "transparent", border: `1px solid ${T.border}`,
              color: T.textMuted, borderRadius: 8, padding: "8px 16px",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}
          >Clear</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #22c55e" }}>
              {["", "#", "Track", "Artist", "Album", "BPM", "Key", "Transition"].map(h => (
                <th key={h} style={{
                  textAlign: "left", padding: "10px 10px",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
                  textTransform: "uppercase", color: T.textMuted,
                  background: T.bg,
                }}>{h}</th>
              ))}
              <th style={{ background: T.bg }} />
            </tr>
          </thead>
          <tbody>
            {mix.map((track, i) => {
              const flag = i > 0 ? getTransitionFlag(mix[i - 1].key, track.key) : null;
              const flagStyle = flag ? TRANSITION_FLAG_STYLES[flag] : null;
              const isDragging = dragIndex === i;
              const isDragOver = dragOverIndex === i && dragIndex !== i;

              return (
                <tr
                  key={`${track.artist}-${track.title}-${i}`}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={e => handleDragOver(e, i)}
                  onDrop={() => handleDrop(i)}
                  onDragEnd={handleDragEnd}
                  style={{
                    borderBottom: `1px solid ${T.borderSubtle}`,
                    background: isDragOver ? "#22c55e10" : isDragging ? T.bg : i % 2 === 0 ? "transparent" : T.rowAlt,
                    opacity: isDragging ? 0.4 : 1,
                    cursor: "grab",
                    outline: isDragOver ? "1px solid #22c55e44" : "none",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => { if (!isDragging) e.currentTarget.style.background = T.surfaceHover; }}
                  onMouseLeave={e => { if (!isDragging) e.currentTarget.style.background = isDragOver ? "#22c55e10" : i % 2 === 0 ? "transparent" : T.rowAlt; }}
                >
                  <td style={{ padding: "10px 6px 10px 10px", color: T.textMuted, fontSize: 14, cursor: "grab", userSelect: "none" }}>⠿</td>
                  <td style={{ padding: "10px 10px", color: T.textMuted, fontWeight: 800, fontSize: 12 }}>{i + 1}</td>
                  <td style={{ padding: "10px 10px", color: "#22c55e", fontWeight: 600 }}>"{track.title}"</td>
                  <td style={{ padding: "10px 10px", fontWeight: 700, color: T.textTable, whiteSpace: "nowrap" }}>{track.artist}</td>
                  <td style={{ padding: "10px 10px", color: T.textSecondary, fontStyle: "italic", fontSize: 12 }}>{track.album}</td>
                  <td style={{ padding: "10px 10px", color: T.bpmColor, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                    {track.bpm != null ? track.bpm : "—"}
                  </td>
                  <td style={{ padding: "10px 10px" }}>
                    {track.key != null ? (
                      <span style={{
                        background: keyColor(track.key) + "28",
                        color: keyColor(track.key),
                        border: `1px solid ${keyColor(track.key)}55`,
                        borderRadius: 4, padding: "2px 7px",
                        fontSize: 11, fontWeight: 700,
                      }}>{track.key}</span>
                    ) : <span style={{ color: T.textMuted }}>—</span>}
                  </td>
                  <td style={{ padding: "10px 10px" }}>
                    {flagStyle ? (
                      <span style={{
                        background: flagStyle.bg, color: flagStyle.color,
                        border: `1px solid ${flagStyle.border}`,
                        borderRadius: 4, padding: "2px 8px",
                        fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                      }}>{flagStyle.label}</span>
                    ) : <span style={{ color: T.textMuted, fontSize: 11 }}>—</span>}
                  </td>
                  <td style={{ padding: "10px 10px" }}>
                    <button
                      onClick={() => onRemove(i)}
                      title="Remove from mix"
                      style={{
                        background: "transparent", border: `1px solid ${T.border}`,
                        borderRadius: 4, color: T.textMuted,
                        cursor: "pointer", fontSize: 11, padding: "2px 7px",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.color = "#f87171"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
                    >×</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 14, fontSize: 11, color: T.textDim, lineHeight: 1.6 }}>
        Drag rows to reorder · Transition quality recalculates automatically · Save Mix persists to localStorage
      </p>
    </div>
  );
}
