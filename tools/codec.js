/* =====================================================================
   Day 01 submission code — shared codec.
   The page ENCODES; tools/decode-day01.js DECODES. Keep the two in sync:
   this exact source is embedded in the artifact.

   Format:  D1.<payload-b32>.<sig>
   payload: <rosterIndex>.<checkBits-b32>.<dayMinutes>
   sig:     4 chars of a salted hash over the payload

   The signature is not cryptography — the salt ships in the page. It only
   stops a student from hand-typing a better code than they earned, which
   is the realistic threat here.
   ===================================================================== */

const SALT = "js-everywhere-day01-v1";

/* Crockford base32, minus the letters that get misread when retyped. */
const B32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function toB32(n){
  if (n === 0) return "0";
  let s = "";
  while (n > 0){ s = B32[n % 32] + s; n = Math.floor(n / 32); }
  return s;
}
function fromB32(s){
  let n = 0;
  for (const ch of s.toUpperCase()){
    const i = B32.indexOf(ch);
    if (i < 0) return NaN;
    n = n * 32 + i;
  }
  return n;
}

/* Bits -> base32 string, chunked so we never exceed safe integer range.
   67 checks = 67 bits, so we pack 15 bits at a time into 3-char groups. */
function bitsToB32(bools){
  let out = "";
  for (let i = 0; i < bools.length; i += 15){
    let chunk = 0;
    for (let j = 0; j < 15; j++){
      if (bools[i + j]) chunk |= (1 << j);
    }
    out += toB32(chunk).padStart(3, "0");
  }
  return out;
}
function b32ToBits(s, count){
  const bools = [];
  for (let i = 0; i < s.length; i += 3){
    const chunk = fromB32(s.slice(i, i + 3));
    if (Number.isNaN(chunk)) return null;
    for (let j = 0; j < 15; j++) bools.push((chunk & (1 << j)) !== 0);
  }
  return bools.slice(0, count);
}

/* FNV-1a, 32-bit. Small, dependency-free, good enough to detect edits. */
function sign(payload){
  let h = 0x811c9dc5;
  const s = payload + "|" + SALT;
  for (let i = 0; i < s.length; i++){
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return toB32(h).padStart(7, "0").slice(-4);
}

function encodeSubmission(rosterIndex, checkBools){
  const day = Math.floor(Date.now() / 60000);       // minute resolution
  const payload = toB32(rosterIndex) + "." + bitsToB32(checkBools) + "." + toB32(day);
  return "D1." + payload + "." + sign(payload);
}

function decodeSubmission(code, checkCount){
  const clean = String(code).trim().toUpperCase().replace(/\s+/g, "");
  const parts = clean.split(".");
  if (parts.length !== 5 || parts[0] !== "D1") return { ok:false, error:"Not a Day 01 code." };
  const payload = parts[1] + "." + parts[2] + "." + parts[3];
  if (sign(payload) !== parts[4]) return { ok:false, error:"Code was edited or mistyped." };
  const rosterIndex = fromB32(parts[1]);
  const bits = b32ToBits(parts[2], checkCount);
  const day = fromB32(parts[3]);
  if (Number.isNaN(rosterIndex) || !bits || Number.isNaN(day)){
    return { ok:false, error:"Code is malformed." };
  }
  return { ok:true, rosterIndex, bits, submittedAt: new Date(day * 60000) };
}

if (typeof module !== "undefined") {
  module.exports = { encodeSubmission, decodeSubmission, sign, SALT };
}
