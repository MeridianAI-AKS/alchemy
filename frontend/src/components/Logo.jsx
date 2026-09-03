import logoUrl from '../assets/meridian-logo.png'

/* Meridian Data & AI — official lockup (mark + wordmark + descriptor).
 *
 * The artwork is imported from src/assets so Vite bundles and fingerprints it.
 * To swap in a different file (e.g. an SVG), replace
 * `src/assets/meridian-logo.png` or change the import above. */

export function Wordmark() {
  return (
    <div className="wordmark">
      <img className="wordmark-img" src={logoUrl} alt="Meridian Data &amp; AI" />
    </div>
  )
}

/** Mark only — the "M" glyph cropped out of the lockup. Used where a compact
 *  square badge is needed rather than the full horizontal lockup. */
export function Mark({ size = 30 }) {
  return (
    <span
      className="mark"
      style={{ width: size, height: size }}
      role="img"
      aria-label="Meridian"
    >
      <img src={logoUrl} alt="" />
    </span>
  )
}
