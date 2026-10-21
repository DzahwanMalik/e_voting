import { Vote, ShieldCheck, Users, Lock } from "lucide-react";
import type { AuthLayoutProps } from "./AuthLayout.types";

const trustPoints = [
  { icon: ShieldCheck, label: "Terverifikasi" },
  { icon: Lock, label: "Terenkripsi" },
  { icon: Users, label: "Berbasis Peran" },
];

const AuthLayout = ({
  children,
  title = "E-Voting",
  subtitle = "Sistem Pemungutan Suara Digital",
  badgeText = "MVP v0.1.0",
  videoSrc = "https://res.cloudinary.com/dmndt2ffk/video/upload/q_auto/p_auto/v1792491292/bumper_1_krsml3.mp4",
  videoPoster,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-background font-sans lg:grid lg:grid-cols-2">
      {/* Form Panel — kiri, selalu tampil */}
      <div className="flex min-h-screen flex-col bg-card px-5 py-6 sm:px-8 lg:border-r lg:border-border lg:px-12">
        {/* Brand: orientasi produk selalu ada di sisi form */}
        <header className="flex w-full items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Vote className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            E-Voting
          </span>
        </header>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <div className="mb-7">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Portal Pemilihan
              </p>
              <h1 className="font-sans text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
                {title}
              </h1>
              <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                {subtitle}
              </p>
            </div>

            {children}
          </div>
        </main>

        <footer className="flex w-full flex-col gap-1 py-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>E-Voting System</p>
          {badgeText && <p>{badgeText}</p>}
        </footer>
      </div>

      {/* Video Thumbnail Panel — kanan, desktop only */}
      <aside className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          poster={videoPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* Overlay gradient agar teks tetap terbaca di atas video */}
        <div
          className="absolute inset-0 bg-linear-to-t from-primary via-primary/80 to-primary/40"
          aria-hidden="true"
        />

        {/* Konteks singkat — bukan brand, karena brand sudah ada di sisi form */}
        <div className="relative z-10 flex items-center gap-2 self-start rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur-sm">
          <ShieldCheck className="h-3.5 w-3.5" />
          Pemungutan Suara Digital
        </div>

        {/* Storytelling: satu pesan utama + trust indicators ringkas */}
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="space-y-3">
            <h2 className="font-sans text-3xl font-bold leading-tight text-primary-foreground xl:text-4xl">
              Suara Anda Menentukan Masa Depan Bersama.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-primary-foreground/80">
              Platform pemungutan suara digital yang aman, transparan, dan mudah
              digunakan untuk seluruh civitas akademika.
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-primary-foreground/15 pt-5">
            {trustPoints.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-xs font-medium text-primary-foreground/85"
              >
                <Icon className="h-4 w-4 text-primary-foreground" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default AuthLayout;
