"use client";

import React, { useState } from "react";
import {
  Users, Mail, Phone, Calendar, CheckCircle2, Clock, Filter, MessageSquare, ChevronRight, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { updateLeadStatus, LeadStatus } from "@/server/actions/business/leads";
import { toast } from "sonner";

interface LeadItem {
  id: string;
  visitorName: string;
  email: string;
  phone: string;
  preferredContact: string | null;
  subject: string | null;
  message: string;
  status: LeadStatus;
  createdAt: Date;
}

interface LeadsManagerProps {
  businessId: string;
  initialLeads: LeadItem[];
}

export function LeadsManager({ businessId, initialLeads = [] }: LeadsManagerProps) {
  const safeInitial = initialLeads || [];
  const [leads, setLeads] = useState<LeadItem[]>(safeInitial);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(safeInitial[0] || null);

  const filteredLeads = leads.filter((l) =>
    filterStatus === "all" ? true : l.status === filterStatus
  );

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await updateLeadStatus(leadId, newStatus);
      if (res.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        toast.success(`Lead status updated to ${newStatus}`);
      } else {
        toast.error(res.error || "Failed to update lead status");
      }
    } catch {
      toast.error("Error updating lead status");
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold">New</Badge>;
      case "contacted":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold">Contacted</Badge>;
      case "qualified":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">Qualified</Badge>;
      case "closed":
        return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 font-bold">Closed</Badge>;
      case "archived":
        return <Badge className="bg-zinc-500/10 text-zinc-600 border-zinc-500/20 font-bold">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold tracking-tight">Leads & Customer Inquiries</h3>
            <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs font-extrabold">
              {leads.length} Total
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage inquiries submitted by potential customers from your BachatLal profile.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val || "all")}>
            <SelectTrigger className="w-36 h-9 rounded-xl text-xs font-semibold">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New Only</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          {/* Premium Subscription Lock Placeholder */}
          <Button variant="outline" size="sm" className="h-9 rounded-xl text-xs font-semibold gap-1 text-muted-foreground border-dashed">
            <Lock className="w-3.5 h-3.5 text-amber-500" /> Export CSV (Pro)
          </Button>
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground space-y-3">
          <MessageSquare className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
          <p className="font-semibold text-sm">No leads recorded yet</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            When visitors submit contact forms on your business detail page, inquiries will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead List */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  selectedLead?.id === lead.id
                    ? "border-red-500/50 bg-red-50/30 dark:bg-red-950/20 shadow-xs"
                    : "border-border/50 bg-card hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm truncate max-w-[140px]">{lead.visitorName}</span>
                  {getStatusBadge(lead.status)}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 font-medium">{lead.subject || lead.message}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>
                  <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Lead Details Inspector */}
          {selectedLead && (
            <div className="lg:col-span-2 p-6 rounded-2xl border border-border/60 bg-card space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
                  <div>
                    <h4 className="text-lg font-bold">{selectedLead.visitorName}</h4>
                    <p className="text-xs text-muted-foreground">Received on {new Date(selectedLead.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">Status:</span>
                    <Select
                      value={selectedLead.status}
                      onValueChange={(val) => handleStatusChange(selectedLead.id, val as LeadStatus)}
                    >
                      <SelectTrigger className="w-32 h-8 rounded-lg text-xs font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Contact Pills */}
                <div className="flex flex-wrap gap-3">
                  <a href={`tel:${selectedLead.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:underline">
                    <Phone className="w-3.5 h-3.5" /> {selectedLead.phone}
                  </a>
                  <a href={`mailto:${selectedLead.email}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:underline">
                    <Mail className="w-3.5 h-3.5" /> {selectedLead.email}
                  </a>
                  {selectedLead.preferredContact && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
                      Prefers: <span className="uppercase font-bold">{selectedLead.preferredContact}</span>
                    </span>
                  )}
                </div>

                {/* Message Body */}
                <div className="space-y-1 pt-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inquiry Message</h5>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border/50 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-wrap">
                    {selectedLead.message}
                  </div>
                </div>
              </div>

              {/* CRM Quick Actions */}
              <div className="pt-4 border-t border-border/40 flex flex-wrap gap-3">
                <a href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">
                  <Button size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
                    Reply via WhatsApp
                  </Button>
                </a>
                <a href={`tel:${selectedLead.phone}`}>
                  <Button size="sm" variant="outline" className="rounded-xl text-xs font-bold">
                    Call Customer
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
