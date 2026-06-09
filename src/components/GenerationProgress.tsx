"use client";

import { GenerationStatus } from "@/types";
import { ImageIcon, LayoutTemplate, FileText, Video, CheckCircle2, Loader2, Cpu } from "lucide-react";

const STEPS = [
  { key: "analyzing", icon: Cpu,           label: "Analyzing Requirements",  sub: "Understanding your brand..."        },
  { key: "logo",      icon: ImageIcon,      label: "Generating Logo",         sub: "Creating your brand mark..."        },
  { key: "poster",    icon: LayoutTemplate, label: "Creating Social Poster",  sub: "Designing campaign visual..."       },
  { key: "script",    icon: FileText,       label: "Writing Anchor Script",   sub: "Crafting 30-second script..."       },
  { key: "video",     icon: Video,          label: "Rendering Anchor Video",  sub: "Producing AI presenter video..."    },
] as const;

const ORDER = ["analyzing", "logo", "poster", "script", "video"] as const;

function getStepState(stepKey: string, status: GenerationStatus) {
  const ci = ORDER.indexOf(status as (typeof ORDER)[number]);
  const si = ORDER.indexOf(stepKey as (typeof ORDER)[number]);
  if (status === "done") return "done";
  if (si < ci) return "done";
  if (si === ci) return "active";
  return "pending";
}

export default function GenerationProgress({ status }: { status: GenerationStatus }) {
  if (status === "idle" || status === "done" || status === "error") return null;

  const doneCount = ORDER.indexOf(status as (typeof ORDER)[number]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl p-6" style={{ background: "#0EA5E9", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "0 4px 24px rgba(14,165,233,0.3), 0 1px 4px rgba(0,0,0,0.08)", color: "white" }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" style={{ animation: "spin 3s linear infinite" }} />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">SPDEV AI is working...</h3>
            <p className="text-white/60 text-xs">{doneCount} of 5 steps complete</p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="h-1.5 bg-white/20 rounded-full mb-5 overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(doneCount / 5) * 100}%` }} />
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {STEPS.map(({ key, icon: Icon, label, sub }) => {
            const state = getStepState(key, status);
            return (
              <div key={key} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                state === "active"  ? "bg-white/15 border border-white/30" :
                state === "done"    ? "opacity-60" : "opacity-30"
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  state === "active" || state === "done" ? "bg-white/20" : "bg-white/10"
                }`}>
                  {state === "done"   ? <CheckCircle2 className="w-4 h-4 text-white" /> :
                   state === "active" ? <Loader2 className="w-4 h-4 text-white animate-spin" /> :
                                        <Icon className="w-4 h-4 text-white/50" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${
                    state === "active" ? "text-white" : "text-white/70"
                  }`}>{label}</p>
                  {state === "active" && (
                    <>
                      <p className="text-white/50 text-[10px] mt-0.5">{sub}</p>
                      <div className="mt-1.5 h-0.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full shimmer w-2/3" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
