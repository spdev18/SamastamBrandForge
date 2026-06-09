"use client";

import { GeneratedAssets } from "@/types";
import { AssetCard, ImageAsset, ScriptAsset } from "./AssetCard";
import { ImageIcon, LayoutTemplate, FileText, Video, RefreshCw, AlertCircle, ExternalLink, CheckCircle2 } from "lucide-react";

interface Props {
  assets: GeneratedAssets;
  businessName: string;
  onReset: () => void;
  errors: Partial<Record<"logo" | "poster" | "script" | "video", string>>;
}

export default function ResultsPanel({ assets, businessName, onReset, errors }: Props) {
  const assetCount = [assets.logo, assets.poster, assets.videoScript, assets.videoUrl].filter(Boolean).length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 fade-in-up">

      {/* Header banner */}
      <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: "#0EA5E9", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "0 4px 24px rgba(14,165,233,0.3)", color: "white" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold">
              Assets ready for <span className="font-black">{businessName}</span>
            </p>
            <p className="text-white/60 text-xs mt-0.5">{assetCount} of 4 assets generated successfully</p>
          </div>
        </div>
        <button onClick={onReset}
          className="btn-white flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0">
          <RefreshCw className="w-4 h-4" />
          Generate New
        </button>
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <AssetCard title="Brand Logo" subtitle="AI-generated logo"
          icon={<ImageIcon className="w-4 h-4 text-white" />}>
          {errors.logo ? <ErrorBlock message={errors.logo} /> :
           assets.logo ? <ImageAsset imageData={assets.logo} mimeType="image/png" title="Logo"
              filename={`${businessName.toLowerCase().replace(/\s+/g, "-")}-logo.png`} /> :
           <SkeletonBlock />}
        </AssetCard>

        <AssetCard title="Social Media Poster" subtitle="Marketing-ready campaign visual"
          icon={<LayoutTemplate className="w-4 h-4 text-white" />}>
          {errors.poster ? <ErrorBlock message={errors.poster} /> :
           assets.poster ? <ImageAsset imageData={assets.poster} mimeType="image/png" title="Social Poster"
              filename={`${businessName.toLowerCase().replace(/\s+/g, "-")}-poster.png`} /> :
           <SkeletonBlock />}
        </AssetCard>

        <AssetCard title="Anchor Video Script" subtitle="30-second spoken script for female anchor"
          icon={<FileText className="w-4 h-4 text-white" />}>
          {errors.script ? <ErrorBlock message={errors.script} /> :
           assets.videoScript ? <ScriptAsset script={assets.videoScript} /> :
           <SkeletonLines />}
        </AssetCard>

        <AssetCard title="AI Anchor Video" subtitle="Female AI presenter video clip"
          icon={<Video className="w-4 h-4 text-white" />}>
          {errors.video ? <ErrorBlock message={errors.video} /> :
           assets.videoUrl ? <VideoBlock url={assets.videoUrl} /> :
           <VideoPlaceholder />}
        </AssetCard>
      </div>
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-red-600 text-sm font-semibold">Generation failed</p>
        <p className="text-red-400 text-xs mt-1">{message}</p>
      </div>
    </div>
  );
}

function SkeletonBlock() {
  return <div className="aspect-video bg-slate-100 rounded-xl shimmer" />;
}

function SkeletonLines() {
  return (
    <div className="space-y-2.5 py-2">
      {[100, 88, 95, 78, 90, 65].map((w, i) => (
        <div key={i} className="h-2.5 bg-slate-100 rounded-full shimmer" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

function VideoBlock({ url }: { url: string }) {
  return (
    <div>
      <video src={url} controls className="w-full rounded-xl bg-slate-100" />
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white btn-primary">
        <ExternalLink className="w-4 h-4" /> Open Video
      </a>
    </div>
  );
}

function VideoPlaceholder() {
  return (
    <div className="space-y-3">
      <div className="aspect-video bg-slate-50 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 p-6 text-center" style={{ borderColor: "rgba(14,165,233,0.2)" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(14,165,233,0.08)" }}>
          <Video className="w-5 h-5" style={{ color: "#0EA5E9" }} />
        </div>
        <p className="text-slate-600 text-sm font-semibold">HeyGen API Key Required</p>
        <p className="text-slate-400 text-xs leading-relaxed max-w-[200px]">
          Add your HeyGen API key to{" "}
          <code className="px-1 rounded" style={{ color: "#0EA5E9", background: "rgba(14,165,233,0.08)" }}>.env.local</code>{" "}
          to enable AI anchor video generation
        </p>
      </div>
      <a href="https://www.heygen.com" target="_blank" rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white btn-primary">
        <ExternalLink className="w-4 h-4" /> Get HeyGen API Key (Free Tier)
      </a>
    </div>
  );
}
