import { useState } from "react";
import { getTransitionFlag } from "./utils/harmonicTransition";
import MyMusicBrowser from "./components/MyMusicBrowser";
import MyMixPanel from "./components/MyMixPanel";

const HYPE_TRACKS = [
  { order: 1,  artist: "Madness",               track: "One Step Beyond",                       album: "One Step Beyond...",           bpm: 155, key: "Cm",  genre: "2-Tone Ska",          length: "2:18", mix_note: "Iconic opener — that count-in gets the room instantly" },
  { order: 2,  artist: "Joystick!",             track: "No Sleep After Brooklyn",               album: "I Can't Take It Anymore",      bpm: 158, key: "Bb",  genre: "Ska-Punk",            length: "2:45", mix_note: "Similar tempo, nudge pitch up slightly to match" },
  { order: 3,  artist: "Bad Operation",         track: "Rico",                                  album: "Everything Must Go",           bpm: 155, key: "Gm",  genre: "Ska-Punk",            length: "2:30", mix_note: "Keeps 2-tone energy rolling, same BPM zone" },
  { order: 4,  artist: "The Toasters",          track: "2Tone Army",                            album: "2 Tone Army",                  bpm: 148, key: "Em",  genre: "2-Tone / Third Wave", length: "3:10", mix_note: "Slight tempo dip — a breath before the energy climb" },
  { order: 5,  artist: "Catbite",               track: "Put Em Away",                           album: "Nice One",                     bpm: 160, key: "F",   genre: "Ska",                 length: "2:50", mix_note: "Bump tempo back up — melodic crowd pleaser" },
  { order: 6,  artist: "No Doubt",              track: "Different People",                      album: "Tragic Kingdom",               bpm: 103, key: "C#m", genre: "Ska-Punk / Alt Rock", length: "4:35", mix_note: "Deliberate tempo drop — let the room sway and breathe" },
  { order: 7,  artist: "Less Than Jake",        track: "Gainesville Rock City",                 album: "Borders & Boundaries",         bpm: 150, key: "E",   genre: "Ska-Punk",            length: "2:45", mix_note: "Huge energy jump back up — get the room moving" },
  { order: 8,  artist: "Mustard Plug",          track: "Beer (Song)",                           album: "Evildoers Beware!",            bpm: 168, key: "A",   genre: "Ska-Punk",            length: "2:28", mix_note: "Fastest in the set — peak energy moment" },
  { order: 9,  artist: "Jeff Rosenstock",       track: "Leave It In The Ska",                  album: "Ska Dream",                    bpm: 152, key: "Bb",  genre: "Ska / Pop-Punk",      length: "3:10", mix_note: "Pull back from peak — meta-ska moment the crowd will love" },
  { order: 10, artist: "Operation Ivy",         track: "Take Warning",                          album: "Energy",                       bpm: 162, key: "Bb",  genre: "Ska-Punk",            length: "2:05", mix_note: "Same key as prev — slam straight in, raw punk energy" },
  { order: 11, artist: "Catbite",               track: "Bidi Bidi Bom Bom",                    album: "Nice One",                     bpm: 155, key: "F#m", genre: "Ska (cover)",         length: "2:40", mix_note: "Fun surprise cover — crowd wildcard moment" },
  { order: 12, artist: "Less Than Jake",        track: "The Science of Selling Yourself Short", album: "Anthem",                       bpm: 176, key: "E",   genre: "Ska-Punk",            length: "2:37", mix_note: "Ramp to peak energy — LTJ at their most anthemic" },
  { order: 13, artist: "Lagwagon",              track: "May 16",                                album: "Let's Talk About Feelings",    bpm: 174, key: "D",   genre: "Melodic Punk",        length: "3:20", mix_note: "Emotional gut-punch — keeps momentum, shifts feel" },
  { order: 14, artist: "Streetlight Manifesto", track: "Here's to Life",                       album: "Everything Goes Numb",         bpm: 140, key: "Am",  genre: "Ska-Punk",            length: "4:42", mix_note: "Intentional wind-down — anthemic, lets tension release" },
  { order: 15, artist: "Descendents",           track: "One More Day",                          album: "Cool To Be You",               bpm: 156, key: "G",   genre: "Melodic Punk",        length: "2:25", mix_note: "Quick burst of nostalgic melodic punk before the finish" },
  { order: 16, artist: "Omnigone",              track: "Against The Rest",                      album: "Against The Rest",             bpm: 162, key: "Bb",  genre: "Ska-Punk",            length: "2:50", mix_note: "Modern Bad Time Records energy — strong penultimate track" },
  { order: 17, artist: "Jer",                   track: "Nobody Can Dull My Sparkle",            album: "Death Of The Heart",           bpm: 158, key: "F",   genre: "Ska-Punk",            length: "3:05", mix_note: "Uplifting closer — leaves the room smiling" },
];

const CHILL_TRACKS = [
  { order: 1,  artist: "Madness",               track: "My Girl",                              album: "One Step Beyond...",           bpm: 100, key: "Bb",  genre: "2-Tone Ska",          length: "3:10", mix_note: "Warm, breezy opener — sets a relaxed tone immediately" },
  { order: 2,  artist: "No Doubt",              track: "Sunday Morning",                       album: "Tragic Kingdom",               bpm: 96,  key: "Eb",  genre: "Ska / Pop",           length: "4:05", mix_note: "Tempo settles down — dreamy and melodic, easy blend" },
  { order: 3,  artist: "The Toasters",          track: "Don't Let The Bastards Grind You Down",album: "2 Tone Army",                  bpm: 102, key: "G",   genre: "2-Tone / Ska",        length: "3:25", mix_note: "Slight lift — rootsy and soulful, keeps the groove" },
  { order: 4,  artist: "Operation Ivy",         track: "Room Without A Window",                album: "Energy",                       bpm: 95,  key: "D",   genre: "Ska",                 length: "2:55", mix_note: "Op Ivy's softer side — mellow skank, perfect here" },
  { order: 5,  artist: "Less Than Jake",        track: "The Ghosts Of Me And You",             album: "Hello Rockview",               bpm: 104, key: "G",   genre: "Ska-Punk",            length: "3:45", mix_note: "Same key as prev — emotional and slow-burning LTJ" },
  { order: 6,  artist: "Catbite",               track: "Easy",                                 album: "Nice One",                     bpm: 98,  key: "C",   genre: "Ska",                 length: "3:00", mix_note: "Gentle drop — sweet and understated, lets the room breathe" },
  { order: 7,  artist: "Streetlight Manifesto", track: "If Only For Memories",                 album: "The Hands That Thieve",        bpm: 108, key: "Em",  genre: "Ska-Punk",            length: "5:10", mix_note: "Builds slowly and beautifully — the emotional centrepiece" },
  { order: 8,  artist: "No Doubt",              track: "Don't Speak",                          album: "Tragic Kingdom",               bpm: 76,  key: "Cm",  genre: "Pop / Ska-adjacent",  length: "4:23", mix_note: "Biggest tempo dip — everyone knows it, total room moment" },
  { order: 9,  artist: "Less Than Jake",        track: "History Of A Boring Town",             album: "Borders & Boundaries",         bpm: 112, key: "A",   genre: "Ska-Punk",            length: "3:23", mix_note: "Gentle lift back up — nostalgic and anthemic without rushing" },
  { order: 10, artist: "Madness",               track: "Night Boat To Cairo",                  album: "One Step Beyond...",           bpm: 105, key: "Dm",  genre: "2-Tone Ska",          length: "3:35", mix_note: "Exotic feel shifts the vibe — one of Madness's best grooves" },
  { order: 11, artist: "Jeff Rosenstock",       track: "Nate's Song",                          album: "Ska Dream",                    bpm: 95,  key: "F",   genre: "Ska / Indie",         length: "3:50", mix_note: "Warm and introspective — dips back to a thoughtful groove" },
  { order: 12, artist: "Streetlight Manifesto", track: "Here's to Life",                       album: "Everything Goes Numb",         bpm: 140, key: "Am",  genre: "Ska-Punk",            length: "4:42", mix_note: "The one tempo lift — earned after all this slow burn" },
  { order: 13, artist: "No Doubt",              track: "Sixteen",                              album: "Tragic Kingdom",               bpm: 88,  key: "Gm",  genre: "Ska / Pop",           length: "3:42", mix_note: "Cool down after the peak — melancholy and gorgeous" },
  { order: 14, artist: "Less Than Jake",        track: "Danny Says",                           album: "Hello Rockview",               bpm: 100, key: "D",   genre: "Ska-Punk",            length: "2:58", mix_note: "Upbeat but gentle — a wistful, warm closer" },
];

const SKA_HIPHOP_TRACKS = [
  { order: 1,  artist: "Jack Lenz",                       track: "Goosebumps Original Theme Song",                        album: "Goosebumps (Original Television Soundtrack)", bpm: 103, key: "Gm",  genre: "TV Theme / Orchestral",  length: "1:05", mix_note: "Spooky opener — short and punchy, sets a playful tone before dropping into ska" },
  { order: 2,  artist: "Madness",                         track: "My Girl",                                               album: "One Step Beyond...",                          bpm: 100, key: "Bb",  genre: "2-Tone Ska",             length: "2:44", mix_note: "Breezy rhythm with plenty of space for a quick transition out" },
  { order: 3,  artist: "Pete Rock & C.L. Smooth",         track: "I Got a Love (LP Version)",                             album: "The Main Ingredient",                         bpm: 99,  key: "Gm",  genre: "Golden Era Hip Hop",     length: "5:11", mix_note: "From your vinyl! Pure brass samples lock into the 2-Tone swing" },
  { order: 4,  artist: "No Doubt",                        track: "Sunday Morning",                                        album: "Tragic Kingdom",                              bpm: 96,  key: "Eb",  genre: "Ska / Pop",              length: "4:33", mix_note: "Drop down slightly. Bass line grounds the upcoming abstract beats" },
  { order: 5,  artist: "MF Doom, Mr. Fantastik",          track: "Rapp Snitch Knishes",                                   album: "MM..FOOD (20th Anniversary Edition)",          bpm: 96,  key: "G",   genre: "Indie Rap",              length: "2:53", mix_note: "From your vinyl! Pitch match with No Doubt perfectly. Legendary string groove" },
  { order: 6,  artist: "Less Than Jake",                  track: "The Science of Selling Yourself Short",                 album: "Anthem (CD Only)",                            bpm: 90,  key: "G",   genre: "Ska Punk",               length: "3:06", mix_note: "Kick up the energy — fast horn-driven ska-punk injection mid-set" },
  { order: 7,  artist: "John Legend, The Roots, CL Smooth", track: "Our Generation (The Hope of the World)",             album: "Wake Up!",                                    bpm: 95,  key: "Fm",  genre: "Soul / Hip Hop",         length: "3:16", mix_note: "From your vinyl! Driving live organic instrumentation bridges styles" },
  { order: 8,  artist: "Kendrick Lamar",                  track: "Alright",                                               album: "To Pimp A Butterfly",                         bpm: 110, key: "Dm",  genre: "West Coast Hip Hop",     length: "3:39", mix_note: "Anthemic energy — live brass textures carry the groove forward" },
  { order: 9,  artist: "Catbite",                         track: "Stay",                                                  album: "Nice One",                                    bpm: 130, key: "G",   genre: "Ska",                    length: "3:42", mix_note: "Modern ska sweetness — clean melodic hook keeps the floor moving" },
  { order: 10, artist: "Run The Jewels, Killer Mike",     track: "ooh la la",                                             album: "ooh la la",                                   bpm: 125, key: "Am",  genre: "Hip Hop",                length: "3:03", mix_note: "Hypnotic loop — pairs well with the ska swing coming before it" },
  { order: 11, artist: "Descendents",                     track: "Nothing with You",                                      album: "Cool to Be You",                              bpm: 130, key: "C",   genre: "Punk / Pop Punk",        length: "2:29", mix_note: "Quick punk burst — short and cathartic before settling back down" },
  { order: 12, artist: "Catbite",                         track: "Bidi Bidi Bom Bom",                                     album: "Nice One",                                    bpm: 100, key: "C",   genre: "Ska",                    length: "3:26", mix_note: "Fun ska cover — crowd-pleasing energy, great sing-along moment" },
  { order: 13, artist: "The Notorious B.I.G.",            track: "Juicy (2005 Remaster)",                                 album: "Ready to Die (The Remaster)",                 bpm: 96,  key: "Bb",  genre: "Golden Era Hip Hop",     length: "5:02", mix_note: "From your vinyl! Classic breezy loop, timeless feel" },
  { order: 14, artist: "Flying Lotus, Anderson .Paak",    track: "More",                                                  album: "Flamagra",                                    bpm: 126, key: "Ebm", genre: "Experimental / Neo-Soul", length: "4:17", mix_note: "From your vinyl! Psychedelic neo-soul textures drift the late-night vibe" },
  { order: 15, artist: "Kendrick Lamar, Drake",           track: "Poetic Justice",                                        album: "good kid, m.A.A.d city (Deluxe)",             bpm: 136, key: "Fm",  genre: "West Coast Hip Hop",     length: "5:00", mix_note: "From your vinyl! Halftime feel makes this blend feel like 68 BPM" },
  { order: 16, artist: "Jeff Rosenstock",                 track: "Ohio Tpke",                                             album: "WORRY.",                                      bpm: 110, key: "Em",  genre: "Ska-Punk",               length: "3:24", mix_note: "Explosive ska-punk burst — Rosenstock's raw energy after the smooth hip hop cool-down" },
  { order: 17, artist: "The English Beat",                track: "I Confess",                                             album: "Special Beat Service",                        bpm: 118, key: "G",   genre: "2-Tone Ska",             length: "3:52", mix_note: "Smooth 2-Tone closer — shuffling groove and melodic hooks wind the set down perfectly" },
];

function timeToSeconds(t) {
  const [m, s] = t.split(":").map(Number);
  return m * 60 + s;
}

function totalTime(tracks) {
  const secs = tracks.reduce((acc, t) => acc + timeToSeconds(t.length), 0);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

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
  "Ab": "#ff9800",
};

function keyColor(key) {
  return KEY_COLORS[key] || "#888";
}

const TRANSITION_FLAG_STYLES = {
  green:  { bg: "#16a34a28", color: "#4ade80", border: "#16a34a55", label: "Great" },
  yellow: { bg: "#d9770628", color: "#fbbf24", border: "#d9770655", label: "Okay"  },
  red:    { bg: "#dc262628", color: "#f87171", border: "#dc262655", label: "Bad"   },
};

// Theme token sets
const DARK = {
  mode: "dark",
  bg: "#0d0d0d",
  sidebar: "#080808",
  sidebarBorder: "#1a1a1a",
  surface: "#1a1a1a",
  surfaceHover: "#1c1c1c",
  border: "#2a2a2a",
  borderSubtle: "#1a1a1a",
  text: "#f0f0f0",
  textMuted: "#555",
  textDim: "#2a2a2a",
  textSecondary: "#777",
  textTable: "#e0e0e0",
  rowAlt: "#080808",
  bpmColor: "#ffffff",
  inputBg: "#1a1a1a",
};

const LIGHT = {
  mode: "light",
  bg: "#f4f4f5",
  sidebar: "#ffffff",
  sidebarBorder: "#e4e4e7",
  surface: "#ffffff",
  surfaceHover: "#f4f4f5",
  border: "#e4e4e7",
  borderSubtle: "#ececec",
  text: "#18181b",
  textMuted: "#a1a1aa",
  textDim: "#d4d4d8",
  textSecondary: "#71717a",
  textTable: "#27272a",
  rowAlt: "#fafafa",
  bpmColor: "#18181b",
  inputBg: "#f4f4f5",
};

function SetTable({ tracks, accentColor, theme: T }) {
  const [sortField, setSortField] = useState("order");

  const sorted = [...tracks].sort((a, b) => {
    if (sortField === "order") return a.order - b.order;
    if (sortField === "bpm") return a.bpm - b.bpm;
    if (sortField === "key") return a.key.localeCompare(b.key);
    return 0;
  });

  const inSetOrder = [...tracks].sort((a, b) => a.order - b.order);
  const avgBpm = Math.round(tracks.reduce((a, t) => a + t.bpm, 0) / tracks.length);
  const minBpm = Math.min(...tracks.map(t => t.bpm));
  const maxBpm = Math.max(...tracks.map(t => t.bpm));

  return (
    <>
      {/* Stats + sort */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
        {[
          { label: "Tracks", value: tracks.length },
          { label: "Total Time", value: totalTime(tracks) },
          { label: "Avg BPM", value: avgBpm },
          { label: "BPM Range", value: `${minBpm}–${maxBpm}` },
        ].map(s => (
          <div key={s.label} style={{
            background: T.surface, borderRadius: 8, padding: "10px 18px",
            border: `1px solid ${T.border}`,
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: accentColor }}>{s.value}</div>
            <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
          </div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Sort:</span>
          {[["order","Set Order"], ["bpm","BPM"], ["key","Key"]].map(([f, label]) => (
            <button key={f} onClick={() => setSortField(f)} style={{
              background: sortField === f ? accentColor : T.surface,
              color: sortField === f ? "#000" : T.textMuted,
              border: `1px solid ${T.border}`,
              borderRadius: 5, padding: "5px 12px",
              fontSize: 11, fontWeight: 700, cursor: "pointer",
              letterSpacing: "0.05em",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${accentColor}` }}>
              {["#","Artist","Track","Album","BPM","Key","Transition Quality","Genre","Length","Mix Note"].map(h => (
                <th key={h} style={{
                  textAlign: "left", padding: "10px 10px",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
                  textTransform: "uppercase", color: T.textMuted,
                  background: T.bg,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((t, i) => {
              const setPos = inSetOrder.findIndex(x => x.order === t.order);
              const prevTrack = setPos > 0 ? inSetOrder[setPos - 1] : null;
              const flag = prevTrack ? getTransitionFlag(prevTrack.key, t.key) : null;
              const flagStyle = flag ? TRANSITION_FLAG_STYLES[flag] : null;

              return (
                <tr key={t.order}
                  style={{ borderBottom: `1px solid ${T.borderSubtle}`, background: i % 2 === 0 ? "transparent" : T.rowAlt }}
                  onMouseEnter={e => e.currentTarget.style.background = T.surfaceHover}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "transparent" : T.rowAlt}
                >
                  <td style={{ padding: "12px 10px", color: T.textDim, fontWeight: 800, fontSize: 12 }}>{t.order}</td>
                  <td style={{ padding: "12px 10px", fontWeight: 700, color: T.textTable, whiteSpace: "nowrap" }}>{t.artist}</td>
                  <td style={{ padding: "12px 10px", color: accentColor, fontWeight: 600 }}>"{t.track}"</td>
                  <td style={{ padding: "12px 10px", color: T.textSecondary, fontStyle: "italic", fontSize: 12 }}>{t.album}</td>
                  <td style={{ padding: "12px 10px", color: T.bpmColor, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{t.bpm}</td>
                  <td style={{ padding: "12px 10px" }}>
                    <span style={{
                      background: keyColor(t.key) + "28",
                      color: keyColor(t.key),
                      border: `1px solid ${keyColor(t.key)}55`,
                      borderRadius: 4, padding: "2px 7px",
                      fontSize: 11, fontWeight: 700,
                    }}>{t.key}</span>
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    {flagStyle ? (
                      <span style={{
                        background: flagStyle.bg,
                        color: flagStyle.color,
                        border: `1px solid ${flagStyle.border}`,
                        borderRadius: 4, padding: "2px 8px",
                        fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                      }}>{flagStyle.label}</span>
                    ) : null}
                  </td>
                  <td style={{ padding: "12px 10px", color: T.textMuted, fontSize: 11 }}>{t.genre}</td>
                  <td style={{ padding: "12px 10px", color: T.textSecondary, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{t.length}</td>
                  <td style={{ padding: "12px 10px", color: T.textMuted, fontSize: 12, maxWidth: 220 }}>{t.mix_note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* BPM arc */}
      <div style={{ marginTop: 28 }}>
        <div style={{ fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>
          BPM Arc · Set Order · Bar color = key
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 56 }}>
          {[...tracks].sort((a, b) => a.order - b.order).map(t => {
            const h = maxBpm === minBpm ? 30 : ((t.bpm - minBpm) / (maxBpm - minBpm)) * 44 + 12;
            return (
              <div key={t.order} title={`${t.order}. ${t.artist} — ${t.bpm} BPM · ${t.key}`} style={{
                flex: 1, height: h,
                background: keyColor(t.key),
                borderRadius: "2px 2px 0 0",
                opacity: 0.75,
                cursor: "default",
              }} />
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 10, color: T.textDim }}>Track 1</span>
          <span style={{ fontSize: 10, color: T.textDim }}>Track {tracks.length}</span>
        </div>
      </div>

      <p style={{ marginTop: 16, fontSize: 11, color: T.textDim, lineHeight: 1.6 }}>
        BPM and key are approximate — always verify by ear on your actual pressings. Key sources: Tunebat / SongBPM / chord databases.
      </p>
    </>
  );
}

const MIX_STORAGE_KEY = "ska_setlist_my_mix";

function loadSavedMix() {
  try {
    const raw = localStorage.getItem(MIX_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Nav item for sidebar
function NavItem({ label, active, accent, onClick, badge, theme: T }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", textAlign: "left",
        padding: "8px 14px",
        borderRadius: 7,
        border: "none",
        background: active ? accent + "18" : "transparent",
        color: active ? accent : T.textSecondary,
        fontWeight: active ? 700 : 500,
        fontSize: 13,
        cursor: "pointer",
        letterSpacing: "0.01em",
        transition: "background 0.15s, color 0.15s",
        position: "relative",
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = T.surfaceHover; e.currentTarget.style.color = T.text; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textSecondary; } }}
    >
      <span>{label}</span>
      {badge != null && badge > 0 && (
        <span style={{
          background: "#22c55e", color: "#000",
          borderRadius: 10, minWidth: 18, height: 18, padding: "0 5px",
          fontSize: 10, fontWeight: 900,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>{badge}</span>
      )}
    </button>
  );
}

const VIEWS = {
  hype:    { accent: "#f5c518", subtitle: "Ska · 2-Tone · Ska-Punk · Melodic Punk" },
  chill:   { accent: "#7eb8d4", subtitle: "Slow Ska · 2-Tone · Laid-back Grooves" },
  hiphop:  { accent: "#a855f7", subtitle: "Boom-Bap meets 2-Tone Backbeats (Sourced from Vinyl)" },
  mymusic: { accent: "#22c55e", subtitle: "Vinyl Collection" },
  mymix:   { accent: "#22c55e", subtitle: "Custom Mix Builder" },
};

const VIEW_TITLES = {
  hype: "⚡ Hype Set", chill: "🌙 Chill Set", hiphop: "🎧 Ska Hip Hop",
  mymusic: "My Music", mymix: "My Mix",
};

export default function SetList() {
  const [activeView, setActiveView] = useState("mymusic");
  const [myMix, setMyMix] = useState(loadSavedMix);
  const [isDark, setIsDark] = useState(true);

  const T = isDark ? DARK : LIGHT;
  const { accent, subtitle } = VIEWS[activeView];

  function addToMix(track) {
    setMyMix(prev => [...prev, track]);
    setActiveView("mymix");
  }

  function removeFromMix(index) {
    setMyMix(prev => prev.filter((_, i) => i !== index));
  }

  function reorderMix(newOrder) {
    setMyMix(newOrder);
  }

  function saveMix() {
    localStorage.setItem(MIX_STORAGE_KEY, JSON.stringify(myMix));
  }

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      background: T.bg, color: T.text,
      transition: "background 0.2s, color 0.2s",
    }}>

      {/* ── Left Sidebar ── */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: T.sidebar,
        borderRight: `1px solid ${T.sidebarBorder}`,
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        {/* Branding */}
        <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${T.sidebarBorder}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: T.textMuted, marginBottom: 4 }}>
            Rosemary Hi-Fi
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: "-0.01em", color: T.text, lineHeight: 1.2 }}>
            SkankinToaster
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>1-Hour Vinyl Set</div>
        </div>

        {/* My Music — prominent */}
        <div style={{ padding: "16px 10px 8px" }}>
          <button
            onClick={() => setActiveView("mymusic")}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "12px 14px", borderRadius: 10,
              border: activeView === "mymusic" ? `1.5px solid ${accent}` : `1.5px solid transparent`,
              background: activeView === "mymusic" ? "#22c55e18" : T.mode === "dark" ? "#22c55e0a" : "#f0fdf4",
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (activeView !== "mymusic") e.currentTarget.style.borderColor = "#22c55e44"; }}
            onMouseLeave={e => { if (activeView !== "mymusic") e.currentTarget.style.borderColor = "transparent"; }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#22c55e", marginBottom: 3 }}>
              My Music
            </div>
            <div style={{ fontSize: 12, color: activeView === "mymusic" ? "#22c55e" : T.textSecondary }}>
              Vinyl Collection
            </div>
          </button>
        </div>

        {/* Divider + Mixes section */}
        <div style={{ padding: "8px 14px 6px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: T.textMuted }}>
            Mixes
          </div>
        </div>

        <nav style={{ padding: "0 10px", flex: 1 }}>
          <NavItem label="⚡ Hype Set"    active={activeView === "hype"}    accent="#f5c518" onClick={() => setActiveView("hype")}    theme={T} />
          <NavItem label="🌙 Chill Set"   active={activeView === "chill"}   accent="#7eb8d4" onClick={() => setActiveView("chill")}   theme={T} />
          <NavItem label="🎧 Ska Hip Hop" active={activeView === "hiphop"}  accent="#a855f7" onClick={() => setActiveView("hiphop")}  theme={T} />
          <div style={{ marginTop: 4, borderTop: `1px solid ${T.sidebarBorder}`, paddingTop: 4 }}>
            <NavItem
              label="🎛️ My Mix"
              active={activeView === "mymix"}
              accent="#22c55e"
              onClick={() => setActiveView("mymix")}
              badge={myMix.length}
              theme={T}
            />
          </div>
        </nav>

        {/* Theme toggle */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.sidebarBorder}` }}>
          <button
            onClick={() => setIsDark(d => !d)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 8, padding: "7px 12px",
              color: T.textSecondary, cursor: "pointer", fontSize: 12, fontWeight: 600,
              width: "100%", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = T.textMuted; }}
            onMouseLeave={e => { e.currentTarget.style.color = T.textSecondary; e.currentTarget.style.borderColor = T.border; }}
          >
            <span style={{ fontSize: 15 }}>{isDark ? "☀️" : "🌙"}</span>
            {isDark ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, padding: "32px 32px 48px", overflowX: "auto", minWidth: 0 }}>
        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ marginBottom: 4 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: accent,
              borderBottom: `2px solid ${accent}`, paddingBottom: 2,
            }}>Open Turntables Night · Indio</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: "4px 0 2px", letterSpacing: "-0.02em", color: T.text }}>
            {VIEW_TITLES[activeView]}
          </h1>
          <p style={{ color: T.textMuted, fontSize: 13, margin: 0 }}>{subtitle}</p>
        </div>

        {/* View content */}
        {activeView === "hype"    && <SetTable tracks={HYPE_TRACKS}       accentColor="#f5c518" theme={T} />}
        {activeView === "chill"   && <SetTable tracks={CHILL_TRACKS}      accentColor="#7eb8d4" theme={T} />}
        {activeView === "hiphop"  && <SetTable tracks={SKA_HIPHOP_TRACKS} accentColor="#a855f7" theme={T} />}
        {activeView === "mymusic" && <MyMusicBrowser onAddToMix={addToMix} theme={T} />}
        {activeView === "mymix"   && (
          <MyMixPanel
            mix={myMix}
            onRemove={removeFromMix}
            onClear={() => setMyMix([])}
            onSave={saveMix}
            onReorder={reorderMix}
            theme={T}
          />
        )}
      </main>
    </div>
  );
}
