import { useRef, useState } from "react";
import { I, MeridianMark } from "./icons";

type Props = {
  initial?: { resumeName?: string };
  onCancel?: () => void;
  onSave: (data: { resumeName: string; resumeText: string }) => void;
  dark?: boolean;
};

export function ResumeUpload({ initial, onCancel, onSave }: Props) {
  const [name, setName] = useState(initial?.resumeName || "");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function extractPdfText(file: File) {
    const pdfjs = await import("pdfjs-dist");
    const worker = await import("pdfjs-dist/build/pdf.worker.mjs?url");
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages: string[] = [];
    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
      const page = await pdf.getPage(pageNo);
      const content = await page.getTextContent();
      pages.push(content.items.map((item: any) => item.str || "").join(" "));
    }
    return pages.join("\n");
  }

  async function extractDocxText(file: File) {
    const mammoth = await import("mammoth/mammoth.browser");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value || "";
  }

  async function handleFile(f: File) {
    setErr(null);
    setBusy(true);
    try {
      let extracted = "";
      const lower = f.name.toLowerCase();
      if (f.type.startsWith("text/") || lower.endsWith(".txt") || lower.endsWith(".md")) {
        extracted = await f.text();
      } else if (f.type === "application/pdf" || lower.endsWith(".pdf")) {
        extracted = await extractPdfText(f);
      } else if (lower.endsWith(".docx")) {
        extracted = await extractDocxText(f);
      } else if (lower.endsWith(".doc")) {
        throw new Error("Old .doc files do not expose reliable text here. Please export as PDF/DOCX or paste the text below.");
      } else {
        try { extracted = await f.text(); } catch { extracted = ""; }
      }
      extracted = extracted.replace(/\s+/g, " ").trim();
      if (extracted.length < 80) throw new Error("We could not extract enough resume text. If this is a scanned PDF, paste the resume text below.");
      setName(f.name);
      setText(extracted.slice(0, 12000));
    } catch (e: any) {
      setErr(e.message || "Could not read file");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col fade-in" style={{ background: "var(--background)" }}>
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <button onClick={onCancel} className="w-9 h-9 rounded-md bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-ink2">
          <I.X width={16} height={16} />
        </button>
        <div className="text-[10px] tracking-[0.2em] uppercase text-ink3">Calibration</div>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-7 pt-2 pb-6 flex flex-col">
        <div className="text-[var(--olo)] mb-4"><MeridianMark size={38} /></div>
        <h2 className="font-serif text-[30px] leading-[1.1] text-ink font-light mb-2">Upload your resume.</h2>
        <p className="text-[12.5px] text-ink2 font-light leading-relaxed mb-6">
          We need your resume to benchmark you against placed candidates and produce a meaningful Positioning Score. PDF or text. You can update it any time.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md,.doc,.docx,text/plain,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        <button
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-black/15 dark:border-white/15 rounded-2xl px-6 py-8 flex flex-col items-center gap-3 hover:border-[var(--olo)] transition"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--olo)]/10 flex items-center justify-center text-[var(--olo)]">
            <I.FileText width={22} height={22} />
          </div>
          <div className="text-[13px] text-ink font-normal">{busy ? "Reading…" : name ? "Replace file" : "Tap to choose a file"}</div>
          <div className="text-[11px] text-ink3 font-light">PDF · DOCX · TXT — up to ~10MB</div>
        </button>

        {name && (
          <div className="mt-4 bg-surface rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
            <I.CheckCircle width={16} height={16} className="text-emerald-600" />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-ink truncate">{name}</div>
              <div className="text-[10px] text-ink3 font-light">{text.length ? `${text.length.toLocaleString()} chars extracted` : "File attached"}</div>
            </div>
          </div>
        )}

        {err && <div className="mt-3 text-[11px] text-red-600">{err}</div>}

        <div className="flex-1" />

        <button
          onClick={() => onSave({ resumeName: name, resumeText: text })}
          disabled={!name}
          className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl text-[12px] tracking-[0.16em] uppercase font-light disabled:opacity-30 transition mt-6"
        >
          {initial?.resumeName ? "Save changes" : "Unlock my Positioning Score"}
        </button>
        {onCancel && (
          <button onClick={onCancel} className="text-[11px] text-ink3 tracking-[0.1em] uppercase font-light mt-3 hover:text-ink">
            Not now
          </button>
        )}
      </div>
    </div>
  );
}
