export default function SectionTag({ text, className = "" }) {
  return <p className={`section-tag font-mono ${className}`}>{text}</p>;
}
