"use client";

import { useState } from "react";
import RequirementForm from "@/components/RequirementForm";
import GenerationProgress from "@/components/GenerationProgress";
import ResultsPanel from "@/components/ResultsPanel";
import { RequirementForm as FormData, GeneratedAssets, GenerationStatus } from "@/types";
import { Sparkles, Zap, ImageIcon, Video, LayoutTemplate, Code2 } from "lucide-react";

const FEATURES = [
  { icon: ImageIcon,      label: "AI Logo",       desc: "Professional brand mark" },
  { icon: LayoutTemplate, label: "Social Poster", desc: "Campaign-ready visual"   },
  { icon: Video,          label: "Anchor Video",  desc: "Female AI presenter"     },
  { icon: Zap,            label: "Instant",       desc: "Results in seconds"      },
];

export default function Home() {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [assets, setAssets] = useState<GeneratedAssets>({
    logo: null, poster: null, videoScript: null, videoUrl: null,
  });
  const [errors, setErrors] = useState<Partial<Record<"logo" | "poster" | "script" | "video", string>>>({});
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleGenerate = async (data: FormData) => {
    setFormData(data);
    setStatus("analyzing");
    setErrors({});
    setAssets({ logo: null, poster: null, videoScript: null, videoUrl: null });

    try {
      setStatus("logo");
      try {
        const res = await fetch("/api/generate-logo", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
        });
        const d = await res.json();
        if (d.imageData) setAssets((p) => ({ ...p, logo: d.imageData }));
        else setErrors((p) => ({ ...p, logo: d.error || "Failed to generate logo" }));
      } catch { setErrors((p) => ({ ...p, logo: "Logo generation failed" })); }

      setStatus("poster");
      try {
        const res = await fetch("/api/generate-poster", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
        });
        const d = await res.json();
        if (d.imageData) setAssets((p) => ({ ...p, poster: d.imageData }));
        else setErrors((p) => ({ ...p, poster: d.error || "Failed to generate poster" }));
      } catch { setErrors((p) => ({ ...p, poster: "Poster generation failed" })); }

      setStatus("script");
      let script: string | null = null;
      try {
        const res = await fetch("/api/generate-script", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
        });
        const d = await res.json();
        if (d.script) { script = d.script; setAssets((p) => ({ ...p, videoScript: d.script })); }
        else setErrors((p) => ({ ...p, script: d.error || "Failed to generate script" }));
      } catch { setErrors((p) => ({ ...p, script: "Script generation failed" })); }

      setStatus("video");
      if (script) {
        try {
          const res = await fetch("/api/generate-video", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ script }),
          });
          const d = await res.json();
          if (!d.demoMode && d.videoId) {
            let attempts = 0;
            while (attempts < 30) {
              await new Promise((r) => setTimeout(r, 5000));
              const check = await fetch(`/api/check-video?videoId=${d.videoId}`);
              const cd = await check.json();
              if (cd.status === "completed" && cd.videoUrl) { setAssets((p) => ({ ...p, videoUrl: cd.videoUrl })); break; }
              if (cd.status === "failed") { setErrors((p) => ({ ...p, video: "Video rendering failed" })); break; }
              attempts++;
            }
          }
        } catch { setErrors((p) => ({ ...p, video: "Video generation failed" })); }
      }
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setAssets({ logo: null, poster: null, videoScript: null, videoUrl: null });
    setErrors({});
    setFormData(null);
  };

  const isLoading = status !== "idle" && status !== "done" && status !== "error";

  return (
    <main className="min-h-screen bg-white relative overflow-x-hidden">

      {/* ── Graph-paper grid — light blue, tight spacing ── */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Fine grid — 32px cells, more visible light blue */}
        <div className="absolute inset-0" style={{
          backgroundImage:
            "linear-gradient(rgba(14,165,233,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.14) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
      </div>

      {/* ── Navbar — #0EA5E9 background ── */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4" style={{ background: "#0EA5E9" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-black text-white text-xl tracking-tight">SPDEV</span>
            <span className="font-black text-white/80 text-xl tracking-tight ml-1">AI</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-xs text-white font-medium">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="hidden sm:inline">Powered by Gemini AI</span>
          <span className="sm:hidden">Live</span>
        </div>
      </nav>

      {/* ── Page content ── */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-24">

        {/* Hero */}
        {status === "idle" && (
          <div className="text-center pt-16 sm:pt-20 pb-12 max-w-4xl mx-auto">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold mb-8 tracking-widest uppercase" style={{ background: "rgba(14,165,233,0.08)", borderColor: "rgba(14,165,233,0.25)", color: "#0EA5E9" }}>
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Brand Asset Generator
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
              <span className="text-gray-900">Turn your idea into a</span>
              <br />
              <span className="gradient-text">complete brand</span>
              <br />
              <span className="text-gray-900">in seconds</span>
            </h1>

            <p className="text-slate-500 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
              Enter your business requirements and SPDEV AI instantly generates
              your logo, social media poster, and a short video with a female AI anchor —
              all ready to publish.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap justify-center gap-3 mb-14">
              {FEATURES.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border"
                  style={{ background: "rgba(14,165,233,0.07)", borderColor: "rgba(14,165,233,0.2)" }}>
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "#0EA5E9" }} />
                  <div className="text-left">
                    <div className="text-gray-800 text-xs font-bold leading-none">{label}</div>
                    <div className="text-slate-400 text-[10px] leading-none mt-1">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#0EA5E9" }} />
              Fill in the form below to get started
            </p>
          </div>
        )}

        {/* Working / done heading */}
        {(isLoading || status === "done") && (
          <div className="text-center pt-14 pb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {status === "done" ? (
                <><span className="gradient-text">Assets ready</span> for {formData?.businessName}</>
              ) : (
                <>Creating assets for <span className="gradient-text">{formData?.businessName}</span>...</>
              )}
            </h2>
          </div>
        )}

        {/* Form */}
        {status === "idle" && <RequirementForm onSubmit={handleGenerate} isLoading={isLoading} />}

        {/* Progress */}
        {isLoading && (
          <div className="flex justify-center">
            <GenerationProgress status={status} />
          </div>
        )}

        {/* Results */}
        {status === "done" && formData && (
          <ResultsPanel assets={assets} businessName={formData.businessName} onReset={handleReset} errors={errors} />
        )}

        {/* Error */}
        {status === "error" && (
          <div className="text-center py-20">
            <div className="inline-flex flex-col items-center gap-4 p-8 max-w-sm mx-auto rounded-2xl" style={{ background: "#0EA5E9", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "0 4px 24px rgba(14,165,233,0.3)", color: "white" }}>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <p className="text-white font-bold">Something went wrong</p>
              <p className="text-white/60 text-sm">Please check your API keys and try again.</p>
              <button onClick={handleReset}
                className="w-full py-2.5 rounded-xl font-semibold text-sm bg-white font-bold transition-all hover:bg-white/90"
                style={{ color: "#0EA5E9" }}>
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ background: "#0EA5E9" }}>
        <div className="flex items-center gap-2 text-white/80 text-xs">
          <Code2 className="w-3.5 h-3.5 text-white" />
          <span className="font-bold text-white">SPDEV AI</span>
          <span>— Brand Asset Generator</span>
        </div>
        <span className="text-white/60 text-xs">Powered by Google Gemini &amp; HeyGen</span>
      </footer>
    </main>
  );
}
