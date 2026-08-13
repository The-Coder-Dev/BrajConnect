"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ShieldCheck, Mail, Calendar, ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalLayoutProps {
  title: string;
  eyebrow?: string;
  lastUpdated: string;
  description: string;
  sections: LegalSection[];
  children?: React.ReactNode;
}

export function LegalLayout({
  title,
  eyebrow = "Legal & Compliance",
  lastUpdated,
  description,
  sections,
  children,
}: LegalLayoutProps) {
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header Hero */}
        <header className="max-w-3xl mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 mb-4 border border-red-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{eyebrow}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {description}
          </p>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-lg w-fit">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Last updated: <time dateTime={lastUpdated}>{lastUpdated}</time></span>
          </div>
        </header>

        {/* Mobile Table of Contents Accordion */}
        <div className="lg:hidden mb-10 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <button
            onClick={() => setMobileTocOpen(!mobileTocOpen)}
            className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-slate-900 dark:text-white"
            aria-expanded={mobileTocOpen}
          >
            <span>Table of Contents ({sections.length} Sections)</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                mobileTocOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {mobileTocOpen && (
            <nav className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-1">
              {sections.map((section, idx) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setMobileTocOpen(false)}
                  className="block py-2 px-3 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <span className="text-slate-400 mr-2 font-mono">{String(idx + 1).padStart(2, "0")}.</span>
                  {section.title}
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* 2-Column Grid for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Sticky Desktop TOC Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                On This Page
              </h3>
              <nav className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 custom-scrollbar">
                {sections.map((section, idx) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-start gap-2.5 py-1.5 px-2.5 text-xs font-medium text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all leading-snug"
                  >
                    <span className="text-slate-400 group-hover:text-red-500 font-mono shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="line-clamp-2">{section.title}</span>
                  </a>
                ))}
              </nav>

              {/* Quick Contact Card */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Have questions about these legal terms?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 group"
                >
                  <Mail className="w-3.5 h-3.5 mr-1.5" />
                  Contact Legal Support
                  <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Legal Content */}
          <main className="lg:col-span-8 space-y-12">
            {children}

            {sections.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    Section {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {section.title}
                  </h2>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  {section.content}
                </div>
              </section>
            ))}

            {/* Bottom Contact Callout */}
            <div className="p-8 rounded-3xl bg-linear-to-br from-slate-900 to-slate-950 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Questions or Concerns?</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Contact our compliance and support team directly at{" "}
                  <a
                    href={`mailto:${siteConfig.contact.supportEmail}`}
                    className="underline text-red-400 hover:text-red-300 font-medium"
                  >
                    {siteConfig.contact.supportEmail}
                  </a>
                </p>
              </div>
              <Button
                render={<Link href="/contact" />}
                className="rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs px-5 h-10 shrink-0"
              >
                Get in Touch
              </Button>
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}
