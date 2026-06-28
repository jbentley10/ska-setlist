import { useState } from "react";
import { MY_MUSIC_COLLECTION } from "../data/myMusicCollection";

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

export default function MyMusicBrowser({ onAddToMix, theme: T }) {
  const [search, setSearch] = useState("");
  const [expandedAlbums, setExpandedAlbums] = useState({});
  const [contextMenu, setContextMenu] = useState(null);

  const query = search.toLowerCase();

  const filtered = MY_MUSIC_COLLECTION.filter(album => {
    if (!query) return true;
    if (album.artist.toLowerCase().includes(query)) return true;
    if (album.album.toLowerCase().includes(query)) return true;
    return album.tracks.some(t => t.title.toLowerCase().includes(query));
  });

  function toggleAlbum(key) {
    setExpandedAlbums(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleContextMenu(e, album, track) {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, album, track });
  }

  function handleAddFromContext() {
    if (contextMenu) {
      onAddToMix({ ...contextMenu.track, artist: contextMenu.album.artist, album: contextMenu.album.album });
      setContextMenu(null);
    }
  }

  function handleAddButton(e, album, track) {
    e.stopPropagation();
    onAddToMix({ ...track, artist: album.artist, album: album.album });
  }

  const totalAlbums = MY_MUSIC_COLLECTION.length;
  const totalTracks = MY_MUSIC_COLLECTION.reduce((a, al) => a + al.tracks.length, 0);

  return (
    <div onClick={() => setContextMenu(null)}>
      {/* Stats + search */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {[
          { label: "Albums", value: totalAlbums },
          { label: "Tracks", value: totalTracks },
        ].map(s => (
          <div key={s.label} style={{
            background: T.surface, borderRadius: 8, padding: "10px 18px",
            border: `1px solid ${T.border}`,
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#22c55e" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
          </div>
        ))}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search artist, album, or track…"
          style={{
            marginLeft: "auto",
            background: T.inputBg, border: `1px solid ${T.border}`,
            borderRadius: 8, padding: "8px 14px",
            color: T.text, fontSize: 13,
            outline: "none", minWidth: 240,
          }}
        />
      </div>

      {/* Album list */}
      {filtered.length === 0 && (
        <div style={{ color: T.textMuted, textAlign: "center", padding: "40px 0", fontSize: 14 }}>
          No results for "{search}"
        </div>
      )}

      {filtered.map(album => {
        const key = `${album.artist}__${album.album}`;
        const isOpen = !!expandedAlbums[key];
        const tracksToShow = query
          ? album.tracks.filter(t =>
              t.title.toLowerCase().includes(query) ||
              album.artist.toLowerCase().includes(query) ||
              album.album.toLowerCase().includes(query)
            )
          : album.tracks;

        return (
          <div key={key} style={{ marginBottom: 4 }}>
            {/* Album header row */}
            <div
              onClick={() => toggleAlbum(key)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", cursor: "pointer",
                background: isOpen ? T.surfaceHover : "transparent",
                borderRadius: isOpen ? "8px 8px 0 0" : 8,
                border: `1px solid ${T.border}`,
                transition: "background 0.15s",
                userSelect: "none",
              }}
              onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = T.surfaceHover; }}
              onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ color: "#22c55e", fontSize: 12, width: 12, textAlign: "center" }}>
                {isOpen ? "▾" : "▸"}
              </span>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 700, color: T.text, fontSize: 13 }}>{album.artist}</span>
                <span style={{ color: T.textSecondary, fontSize: 13, fontStyle: "italic", marginLeft: 10 }}>{album.album}</span>
              </div>
              <span style={{ color: T.textMuted, fontSize: 11 }}>{album.released}</span>
              <span style={{ color: T.textMuted, fontSize: 11, minWidth: 60, textAlign: "right" }}>
                {album.tracks.length} track{album.tracks.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Track rows */}
            {(isOpen || query) && tracksToShow.map((track, i) => (
              <div
                key={track.title}
                onContextMenu={e => handleContextMenu(e, album, track)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 14px 8px 38px",
                  background: i % 2 === 0 ? T.bg : T.rowAlt,
                  borderLeft: `1px solid ${T.border}`,
                  borderRight: `1px solid ${T.border}`,
                  borderBottom: i === tracksToShow.length - 1 ? `1px solid ${T.border}` : "none",
                  borderRadius: i === tracksToShow.length - 1 ? "0 0 8px 8px" : 0,
                  cursor: "default",
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? T.bg : T.rowAlt}
              >
                <span style={{ color: T.textMuted, fontSize: 11, minWidth: 18, textAlign: "right" }}>{i + 1}</span>
                <span style={{ flex: 1, color: T.text, fontSize: 13 }}>{track.title}</span>
                <span style={{ color: T.textMuted, fontSize: 12, minWidth: 40, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {track.bpm != null ? track.bpm : "—"}
                </span>
                <span style={{ minWidth: 44 }}>
                  {track.key != null ? (
                    <span style={{
                      background: keyColor(track.key) + "28",
                      color: keyColor(track.key),
                      border: `1px solid ${keyColor(track.key)}55`,
                      borderRadius: 4, padding: "2px 6px",
                      fontSize: 10, fontWeight: 700,
                    }}>{track.key}</span>
                  ) : <span style={{ color: T.textMuted, fontSize: 11 }}>—</span>}
                </span>
                <button
                  onClick={e => handleAddButton(e, album, track)}
                  title="Add to Mix"
                  style={{
                    background: "transparent",
                    border: `1px solid ${T.border}`,
                    borderRadius: 5, color: T.textMuted,
                    cursor: "pointer", fontSize: 11, fontWeight: 700,
                    padding: "3px 8px", transition: "all 0.15s", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.color = "#22c55e"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
                >
                  + Mix
                </button>
              </div>
            ))}
          </div>
        );
      })}

      {/* Context menu */}
      {contextMenu && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "fixed",
            top: contextMenu.y, left: contextMenu.x,
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 8, padding: "4px 0",
            zIndex: 1000, minWidth: 160,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ padding: "6px 12px", fontSize: 11, color: T.textMuted, borderBottom: `1px solid ${T.border}` }}>
            "{contextMenu.track.title}"
          </div>
          <button
            onClick={handleAddFromContext}
            style={{
              display: "block", width: "100%", textAlign: "left",
              background: "transparent", border: "none",
              color: "#22c55e", padding: "8px 14px",
              fontSize: 13, cursor: "pointer", fontWeight: 600,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#22c55e18"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            Add to Mix
          </button>
        </div>
      )}
    </div>
  );
}
