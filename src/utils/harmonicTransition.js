// Camelot Wheel: each key maps to a position number (1–12) and mode ("A"=minor, "B"=major)
// Adjacent numbers (±1, wrapping) = perfect fifth = "green"
// Same number, different mode = relative major/minor = "green"
// Two steps away (±2) = whole-step shift = "yellow"
// Everything else = dissonant = "red"
const CAMELOT = {
  "B":   { n: 1,  m: "B" }, "Abm": { n: 1,  m: "A" },
  "Gb":  { n: 2,  m: "B" }, "Ebm": { n: 2,  m: "A" },
  "Db":  { n: 3,  m: "B" }, "Bbm": { n: 3,  m: "A" },
  "Ab":  { n: 4,  m: "B" }, "Fm":  { n: 4,  m: "A" },
  "Eb":  { n: 5,  m: "B" }, "Cm":  { n: 5,  m: "A" },
  "Bb":  { n: 6,  m: "B" }, "Gm":  { n: 6,  m: "A" },
  "F":   { n: 7,  m: "B" }, "Dm":  { n: 7,  m: "A" },
  "C":   { n: 8,  m: "B" }, "Am":  { n: 8,  m: "A" },
  "G":   { n: 9,  m: "B" }, "Em":  { n: 9,  m: "A" },
  "D":   { n: 10, m: "B" }, "Bm":  { n: 10, m: "A" },
  "A":   { n: 11, m: "B" }, "F#m": { n: 11, m: "A" },
  "E":   { n: 12, m: "B" }, "C#m": { n: 12, m: "A" },
};

export function getTransitionFlag(keyA, keyB) {
  const a = CAMELOT[keyA];
  const b = CAMELOT[keyB];
  if (!a || !b) return null;
  if (a.n === b.n && a.m === b.m) return "green"; // identical key
  if (a.n === b.n) return "green";                 // relative major/minor (same number)
  const dist = Math.min(Math.abs(a.n - b.n), 12 - Math.abs(a.n - b.n));
  if (dist === 1) return "green";                  // perfect fifth step
  if (dist === 2) return "yellow";                 // whole-step shift
  return "red";
}
