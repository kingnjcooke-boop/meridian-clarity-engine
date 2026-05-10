import type { SVGProps } from "react";

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const I = {
  Bell: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
  ),
  Search: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  Message: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
  ),
  Home: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Target: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  ),
  Radio: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
  ),
  Users: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
  ),
  Book: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
  ),
  Map: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
  ),
  TrendUp: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  ),
  ArrowUp: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
  ),
  ArrowRight: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  ),
  ChevronLeft: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><polyline points="15 18 9 12 15 6"/></svg>
  ),
  ChevronDown: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><polyline points="6 9 12 15 18 9"/></svg>
  ),
  Check: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><polyline points="20 6 9 17 4 12"/></svg>
  ),
  CheckCircle: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
  Sun: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  ),
  Linkedin: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
  ),
  FileText: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  ),
  Sparkles: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 3l1.9 4.7L18.5 9.5l-4.6 1.8L12 16l-1.9-4.7L5.5 9.5l4.6-1.8z"/><path d="M19 15l.7 1.7 1.8.7-1.8.7-.7 1.7-.7-1.7-1.8-.7 1.8-.7z"/></svg>
  ),
  Lock: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
  ),
  Globe: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 010 20a15 15 0 010-20"/></svg>
  ),
};

export const MeridianMark = ({ size = 32, accent = true }: { size?: number; accent?: boolean }) => (
  <svg viewBox="0 0 64 80" width={size} height={size * 1.25} className="meridian-mark" aria-hidden="true">
    <line x1="32" y1="4" x2="32" y2="76" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="32" cy="40" r="24" stroke="currentColor" strokeWidth="1.4" fill="none"/>
    {accent && <circle cx="32" cy="7" r="4.5" fill="var(--olo)"/>}
  </svg>
);
