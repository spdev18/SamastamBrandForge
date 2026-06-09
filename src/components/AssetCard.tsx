"use client";

import { Download, Maximize2, Copy, Check } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface AssetCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function AssetCard({ title, subtitle, icon, children }: AssetCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300" style={{ background: "#0EA5E9", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "0 4px 24px rgba(14,165,233,0.3), 0 1px 4px rgba(0,0,0,0.08)" }}>
      {/* Card header */}
      <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
        <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">{title}</h3>
          {subtitle && <p className="text-white/60 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {/* Card body — white background so images show clearly */}
      <div className="p-5 bg-white rounded-b-2xl">{children}</div>
    </div>
  );
}

interface ImageAssetProps {
  imageData: string;
  mimeType: string;
  title: string;
  filename: string;
}

export function ImageAsset({ imageData, mimeType, title, filename }: ImageAssetProps) {
  const [expanded, setExpanded] = useState(false);
  const dataUrl = `data:${mimeType};base64,${imageData}`;

  const download = () => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  return (
    <>
      <div className="relative group rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
        <Image src={dataUrl} alt={title} width={800} height={600}
          className="w-full h-auto object-contain" unoptimized />
        <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-sm">
          <button onClick={() => setExpanded(true)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Maximize2 className="w-4 h-4 text-slate-600" />
          </button>
          <button onClick={download}
            className="p-2.5 rounded-xl text-white transition-colors" style={{ background: "#0EA5E9" }}>
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <button onClick={download}
        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all btn-primary">
        <Download className="w-4 h-4" />
        Download {title}
      </button>

      {expanded && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setExpanded(false)}>
          <div className="max-w-4xl max-h-full bg-white rounded-2xl shadow-2xl overflow-hidden p-4"
            onClick={(e) => e.stopPropagation()}>
            <Image src={dataUrl} alt={title} width={1200} height={900}
              className="max-w-full max-h-[78vh] object-contain rounded-xl" unoptimized />
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={download}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold btn-primary">
                <Download className="w-4 h-4" /> Download
              </button>
              <button onClick={() => setExpanded(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 text-sm font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ScriptAsset({ script }: { script: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "anchor-script.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 leading-relaxed max-h-52 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#0EA5E9" }}>30-Second Script</p>
        <p className="font-mono">{script}</p>
      </div>
      <div className="flex gap-2.5 mt-3">
        <button onClick={copy}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white btn-primary">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Script"}
        </button>
        <button onClick={download}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white btn-primary">
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
}
