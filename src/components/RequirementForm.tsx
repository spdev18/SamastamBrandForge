"use client";

import { useState } from "react";
import { RequirementForm as FormData } from "@/types";
import { Building2, Palette, Users, Sparkles, ChevronRight, Zap, Monitor } from "lucide-react";

const INDUSTRIES = [
  "Technology", "Healthcare", "Education", "Finance", "Retail",
  "Food & Beverage", "Fashion", "Real Estate", "Fitness & Wellness",
  "Entertainment", "Travel & Tourism", "Automotive", "Beauty & Cosmetics",
  "Legal Services", "Marketing Agency", "Other",
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram",       ratio: "1:1" },
  { id: "story",     label: "Stories / Reels", ratio: "9:16" },
  { id: "facebook",  label: "Facebook",        ratio: "1.91:1" },
  { id: "twitter",   label: "Twitter / X",     ratio: "16:9" },
  { id: "linkedin",  label: "LinkedIn",        ratio: "1.91:1" },
];

const STEPS = [
  { n: 1, label: "Business", icon: Building2 },
  { n: 2, label: "Brand",    icon: Sparkles   },
  { n: 3, label: "Design",   icon: Palette    },
];

interface Props {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export default function RequirementForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<FormData>({
    businessName: "", industry: "", description: "",
    brandColors: "", targetAudience: "", tagline: "", platform: "instagram",
  });
  const [step, setStep] = useState(1);

  const update = (f: keyof FormData, v: string) => setForm((p) => ({ ...p, [f]: v }));

  const canNext =
    step === 1 ? !!(form.businessName.trim() && form.industry) :
    step === 2 ? form.description.trim().length >= 20 : true;

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(form); };

  const inputCls = "w-full border border-white/30 rounded-xl px-4 py-3 text-sm transition-all bg-white/90 text-slate-800 placeholder-slate-400";
  const labelCls = "block text-sm font-semibold text-white mb-2";
  const reqStar  = <span className="text-white/60 ml-0.5">*</span>;
  const optLabel = <span className="text-white/50 font-normal text-xs ml-1">(optional)</span>;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map(({ n, label, icon: Icon }) => (
          <div key={n} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                n < step  ? "bg-white text-[#0EA5E9] shadow" :
                n === step ? "bg-white text-[#0EA5E9] shadow-md scale-110 ring-2 ring-white/40" :
                             "bg-white/20 text-white/50 border border-white/20"
              }`}>
                {n < step ? "✓" : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className={`text-xs font-semibold hidden sm:block transition-colors ${
                n === step ? "text-gray-700" : n < step ? "text-gray-500" : "text-gray-300"
              }`}>{label}</span>
            </div>
            {n < 3 && (
              <div className={`w-10 sm:w-16 h-px mx-1 transition-all duration-500 ${
                n < step ? "bg-[#0EA5E9]" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Card — forced #0EA5E9 background via inline style */}
      <div className="rounded-2xl p-6 md:p-8" style={{ background: "#0EA5E9", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "0 4px 24px rgba(14,165,233,0.3), 0 1px 4px rgba(0,0,0,0.08)", color: "white" }}>

        {/* Step 1 */}
        {step === 1 && (
          <div className="fade-in-up space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-white/20">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Business Identity</h2>
                <p className="text-white/60 text-xs">Tell us about your business</p>
              </div>
            </div>

            <div>
              <label className={labelCls}>Business Name {reqStar}</label>
              <input type="text" value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
                placeholder="e.g. Nova Studios" className={inputCls} required />
            </div>

            <div>
              <label className={labelCls}>Industry {reqStar}</label>
              <select value={form.industry} onChange={(e) => update("industry", e.target.value)}
                className={inputCls} required>
                <option value="">Select industry...</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls}>Tagline {optLabel}</label>
              <input type="text" value={form.tagline}
                onChange={(e) => update("tagline", e.target.value)}
                placeholder="e.g. Elevate your brand" className={inputCls} />
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="fade-in-up space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-white/20">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Brand Details</h2>
                <p className="text-white/60 text-xs">Describe your brand and audience</p>
              </div>
            </div>

            <div>
              <label className={labelCls}>Business Description {reqStar}</label>
              <textarea value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe what your business does, your unique value proposition, products or services..."
                rows={4} className={`${inputCls} resize-none`} required />
              <div className="flex justify-between mt-1.5">
                <p className="text-xs text-white/50">{form.description.length} chars</p>
                {form.description.trim().length < 20 && <p className="text-xs text-white/50">minimum 20 characters</p>}
              </div>
            </div>

            <div>
              <label className={labelCls}>
                <Users className="w-3.5 h-3.5 inline mr-1.5" />
                Target Audience {optLabel}
              </label>
              <input type="text" value={form.targetAudience}
                onChange={(e) => update("targetAudience", e.target.value)}
                placeholder="e.g. Young professionals aged 25–40 interested in fitness" className={inputCls} />
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="fade-in-up space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-white/20">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Visual &amp; Platform</h2>
                <p className="text-white/60 text-xs">Set your design preferences</p>
              </div>
            </div>

            <div>
              <label className={labelCls}>Brand Colors {optLabel}</label>
              <input type="text" value={form.brandColors}
                onChange={(e) => update("brandColors", e.target.value)}
                placeholder="e.g. Deep blue and gold, or #0EA5E9 and #F59E0B" className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>
                <Monitor className="w-3.5 h-3.5 inline mr-1.5" />
                Target Platform
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PLATFORMS.map((p) => (
                  <button key={p.id} type="button" onClick={() => update("platform", p.id)}
                    className={`rounded-xl p-3 text-left transition-all duration-200 border text-sm ${
                      form.platform === p.id
                        ? "bg-white text-[#0EA5E9] border-white font-bold shadow"
                        : "bg-white/15 border-white/25 text-white/80 hover:bg-white/25"
                    }`}>
                    <div className="font-semibold text-xs">{p.label}</div>
                    <div className="text-[10px] opacity-60 mt-0.5">{p.ratio}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-[10px] text-white/60 mb-3 font-bold uppercase tracking-widest">Review</p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div><p className="text-[10px] text-white/50 uppercase tracking-wider">Business</p><p className="text-white font-semibold text-sm truncate">{form.businessName}</p></div>
                <div><p className="text-[10px] text-white/50 uppercase tracking-wider">Industry</p><p className="text-white font-semibold text-sm truncate">{form.industry}</p></div>
                <div><p className="text-[10px] text-white/50 uppercase tracking-wider">Platform</p><p className="text-white font-semibold text-sm capitalize">{form.platform}</p></div>
                {form.tagline && <div><p className="text-[10px] text-white/50 uppercase tracking-wider">Tagline</p><p className="text-white font-semibold text-sm truncate">{form.tagline}</p></div>}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/20">
          {step > 1 ? (
            <button type="button" onClick={() => setStep(step - 1)}
              className="btn-white px-5 py-2.5 rounded-xl text-sm font-semibold">
              Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button type="button" onClick={() => setStep(step + 1)} disabled={!canNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-white text-[#0EA5E9] hover:bg-white/90 shadow transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" disabled={isLoading || !canNext}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm bg-white text-[#0EA5E9] hover:bg-white/90 shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              <Zap className="w-4 h-4" />
              {isLoading ? "Generating..." : "Generate All Assets"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
