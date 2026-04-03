import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, MessageSquare, FileText, Check, X, AlertTriangle,
  Clock, User, Star, Table as TableIcon
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDate, formatCurrency, getInitials } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const statuses = ["submitted", "assigned", "in_progress", "completed", "closed"];

function statusVariant(s: string) {
  return ({ submitted: "info", assigned: "purple", in_progress: "warning", completed: "success", closed: "gray" } as any)[s] ?? "secondary";
}
function priorityVariant(p: string) {
  return ({ low: "success", medium: "warning", high: "orange", urgent: "red" } as any)[p] ?? "secondary";
}

const statusColors: Record<string, string> = {
  submitted: "bg-blue-500",
  assigned: "bg-purple-500",
  in_progress: "bg-yellow-500",
  completed: "bg-green-500",
  closed: "bg-gray-500"
};

const statusIcons: Record<string, React.ReactNode> = {
  submitted: <Clock className="w-3 h-3" />,
  assigned: <User className="w-3 h-3" />,
  in_progress: <AlertTriangle className="w-3 h-3" />,
  completed: <Check className="w-3 h-3" />,
  closed: <X className="w-3 h-3" />
};

export default function MaintenanceDetail() {
  const [, params] = useRoute("/maintenance/:id");
  const { t } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();
  const id = params?.id ?? "";
  const [comment, setComment] = useState("");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [quoteData, setQuoteData] = useState({ amount: "", description: "", estimatedDuration: "" });
  const [quoteView, setQuoteView] = useState<"cards" | "compare">("cards");

  const { data: request, isLoading } = useQuery<any>({
    queryKey: ["maintenance-request", id],
    queryFn: () => apiRequest("GET", `/api/maintenance-requests/${id}`),
    enabled: !!id
  });

  const { data: quotes = [] } = useQuery<any[]>({
    queryKey: ["quotes", id],
    queryFn: () => apiRequest("GET", `/api/quotes?maintenanceRequestId=${id}`),
    enabled: !!id
  });

  const { data: comments = [] } = useQuery<any[]>({
    queryKey: ["comments", id],
    queryFn: () => apiRequest("GET", `/api/comments/${id}`),
    enabled: !!id
  });

  const { data: contractors = [] } = useQuery<any[]>({
    queryKey: ["contractors"],
    queryFn: () => apiRequest("GET", "/api/contractors"),
    enabled: !!id && !!user && ["owner", "super_admin", "union_admin"].includes(user.role ?? "")
  });

  const updateStatus = useMutation({
    mutationFn: (status: string) => apiRequest("PATCH", `/api/maintenance-requests/${id}`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["maintenance-request", id] }); toast({ title: t("common.success") }); },
    onError: (err: any) => toast({ title: err.message, variant: "destructive" })
  });

  const assignContractor = useMutation({
    mutationFn: (contractorId: string) => apiRequest("PATCH", `/api/maintenance-requests/${id}`, { assignedToId: contractorId, status: "assigned" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["maintenance-request", id] });
      setAssignOpen(false);
      toast({ title: t("maintenanceDetail.contractorAssigned") });
    },
    onError: (err: any) => toast({ title: err.message, variant: "destructive" })
  });

  const submitQuote = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/quotes", { ...data, maintenanceRequestId: id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["quotes", id] }); setQuoteOpen(false); toast({ title: t("common.success") }); },
    onError: (err: any) => toast({ title: err.message, variant: "destructive" })
  });

  const updateQuote = useMutation({
    mutationFn: ({ quoteId, status }: { quoteId: string; status: string }) =>
      apiRequest("PATCH", `/api/quotes/${quoteId}`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["quotes", id] }); toast({ title: t("common.success") }); },
    onError: (err: any) => toast({ title: err.message, variant: "destructive" })
  });

  const addComment = useMutation({
    mutationFn: () => apiRequest("POST", "/api/comments", { maintenanceRequestId: id, content: comment }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["comments", id] }); setComment(""); },
    onError: (err: any) => toast({ title: err.message, variant: "destructive" })
  });

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;
  if (!request) return <div className="text-center py-16 text-muted-foreground">{t("maintenanceDetail.requestNotFound")}</div>;

  const canChangeStatus = user && ["owner", "super_admin", "union_admin", "contractor"].includes(user.role);
  const isContractor = user?.role === "contractor";
  const isOwner = user && ["owner", "super_admin", "union_admin"].includes(user.role);

  // Urgency banner: urgent + submitted + > 24h
  const isUrgentOverdue = request.priority === "urgent" &&
    request.status === "submitted" &&
    (Date.now() - new Date(request.createdAt).getTime()) > 86400000;

  // Build timeline from status (mock — a real app would store history)
  const timelineSteps = statuses.slice(0, statuses.indexOf(request.status) + 1).map((s, i, arr) => ({
    status: s,
    isLast: i === arr.length - 1
  }));

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Urgency banner */}
      {isUrgentOverdue && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-pulse-slow">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <p className="font-semibold text-red-800 dark:text-red-400 text-sm">{t("maintenanceDetail.urgentBannerTitle")}</p>
            <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">{t("maintenanceDetail.urgentBannerDesc")}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/maintenance">
          <a>
            <Button variant="ghost" size="icon" aria-label="Back to maintenance">
              <ArrowLeft className="w-4 h-4 rtl-flip" />
            </Button>
          </a>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{request.title}</h1>
          <p className="text-sm text-muted-foreground">{t(`maintenance.categories.${request.category}`)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={priorityVariant(request.priority) as any}>{t(`maintenance.priorities.${request.priority}`)}</Badge>
          <Badge variant={statusVariant(request.status) as any}>{t(`maintenance.statuses.${request.status}`)}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="hover-card">
            <CardHeader><CardTitle className="text-base">{t("maintenance.description")}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{request.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                {request.estimatedCost && (
                  <div><span className="text-muted-foreground">{t("maintenance.estimatedCost")}:</span> <span className="font-medium">{formatCurrency(request.estimatedCost)}</span></div>
                )}
                {request.actualCost && (
                  <div><span className="text-muted-foreground">{t("maintenance.actualCost")}:</span> <span className="font-medium">{formatCurrency(request.actualCost)}</span></div>
                )}
                {request.scheduledDate && (
                  <div><span className="text-muted-foreground">{t("maintenance.scheduledDate")}:</span> <span className="font-medium">{formatDate(request.scheduledDate)}</span></div>
                )}
                {request.completedAt && (
                  <div><span className="text-muted-foreground">{t("maintenance.completedAt")}:</span> <span className="font-medium">{formatDate(request.completedAt)}</span></div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quotes */}
          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-base">{t("quote.quotes")} ({quotes.length})</CardTitle>
                {quotes.length > 1 && (
                  <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
                    <Button variant="ghost" size="sm" className={cn("h-6 px-2 text-xs", quoteView === "cards" && "bg-background shadow")} onClick={() => setQuoteView("cards")}>{t("maintenanceDetail.quoteCards")}</Button>
                    <Button variant="ghost" size="sm" className={cn("h-6 px-2 text-xs", quoteView === "compare" && "bg-background shadow")} onClick={() => setQuoteView("compare")}>
                      <TableIcon className="w-3 h-3 mr-1" />{t("maintenanceDetail.quoteCompare")}
                    </Button>
                  </div>
                )}
              </div>
              {isContractor && (
                <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gradient-primary text-white border-0">
                      <FileText className="w-4 h-4 mr-1" />{t("quote.submitQuote")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>{t("quote.submitQuote")}</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label>{t("quote.amount")}</Label>
                        <Input type="number" step="0.01" className="h-10" value={quoteData.amount} onChange={e => setQuoteData(d => ({ ...d, amount: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t("quote.description")}</Label>
                        <Textarea value={quoteData.description} onChange={e => setQuoteData(d => ({ ...d, description: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t("quote.estimatedDuration")}</Label>
                        <Input className="h-10" value={quoteData.estimatedDuration} onChange={e => setQuoteData(d => ({ ...d, estimatedDuration: e.target.value }))} placeholder={t("maintenanceDetail.estimatedDaysPlaceholder")} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setQuoteOpen(false)}>{t("common.cancel")}</Button>
                      <Button className="gradient-primary text-white border-0" onClick={() => submitQuote.mutate(quoteData)} disabled={submitQuote.isPending}>{t("common.submit")}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {quotes.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">{t("common.noData")}</p>
                </div>
              )}

              {/* Quote comparison table */}
              {quotes.length > 1 && quoteView === "compare" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">{t("maintenanceDetail.quoteContractor")}</th>
                        <th className="text-left py-2 font-medium">{t("maintenanceDetail.quoteAmount")}</th>
                        <th className="text-left py-2 font-medium">{t("maintenanceDetail.quoteDuration")}</th>
                        <th className="text-left py-2 font-medium">{t("maintenance.status")}</th>
                        {isOwner && <th className="text-left py-2 font-medium">{t("maintenanceDetail.quoteAction")}</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.map((q: any) => (
                        <tr key={q.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="py-3 font-medium">{t("maintenanceDetail.quoteContractor")}</td>
                          <td className="py-3 text-green-600 font-semibold">{formatCurrency(q.amount)}</td>
                          <td className="py-3 text-muted-foreground">{q.estimatedDuration || "—"}</td>
                          <td className="py-3">
                            <Badge variant={({ pending: "warning", accepted: "success", rejected: "destructive" } as any)[q.status]}>
                              {t(`quote.statuses.${q.status}`)}
                            </Badge>
                          </td>
                          {isOwner && q.status === "pending" && (
                            <td className="py-3">
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="h-7 text-xs text-green-600 border-green-300" onClick={() => updateQuote.mutate({ quoteId: q.id, status: "accepted" })}>
                                  <Check className="w-3 h-3 mr-1" />{t("quote.accept")}
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-300" onClick={() => updateQuote.mutate({ quoteId: q.id, status: "rejected" })}>
                                  <X className="w-3 h-3 mr-1" />{t("quote.reject")}
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Quote cards */}
              {(quoteView === "cards" || quotes.length <= 1) && quotes.map((q: any) => (
                <div key={q.id} className="border rounded-xl p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-lg text-green-600">{formatCurrency(q.amount)}</span>
                    <Badge variant={({ pending: "warning", accepted: "success", rejected: "destructive" } as any)[q.status]}>
                      {t(`quote.statuses.${q.status}`)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{q.description}</p>
                  {q.estimatedDuration && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t("quote.estimatedDuration")}: {q.estimatedDuration}
                    </p>
                  )}
                  {isOwner && q.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-300" onClick={() => updateQuote.mutate({ quoteId: q.id, status: "accepted" })}>
                        <Check className="w-3 h-3 mr-1" />{t("quote.accept")}
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={() => updateQuote.mutate({ quoteId: q.id, status: "rejected" })}>
                        <X className="w-3 h-3 mr-1" />{t("quote.reject")}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Comments */}
          <Card className="hover-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">{t("maintenanceDetail.noComments")}</p>
              )}
              {comments.map((c: any) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {getInitials(c.user?.name ?? "?")}
                  </div>
                  <div className="flex-1 bg-muted/40 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{c.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{c.content}</p>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex gap-2">
                <Textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder={t("maintenanceDetail.addComment")}
                  rows={2}
                  className="flex-1"
                  aria-label="Comment"
                />
                <Button
                  onClick={() => addComment.mutate()}
                  disabled={!comment.trim() || addComment.isPending}
                  className="self-end gradient-primary text-white border-0"
                  aria-label="Submit comment"
                >
                  {t("common.submit")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status card */}
          <Card className="hover-card">
            <CardHeader><CardTitle className="text-base">{t("maintenance.status")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Badge variant={statusVariant(request.status) as any} className="w-full justify-center py-1.5">
                {t(`maintenance.statuses.${request.status}`)}
              </Badge>

              {canChangeStatus && (
                <Select onValueChange={(s) => updateStatus.mutate(s)}>
                  <SelectTrigger><SelectValue placeholder={t("maintenanceDetail.changeStatus")} /></SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => <SelectItem key={s} value={s}>{t(`maintenance.statuses.${s}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}

              <div className="text-xs text-muted-foreground space-y-1">
                <div>Created: {formatDate(request.createdAt)}</div>
                {request.completedAt && <div>Completed: {formatDate(request.completedAt)}</div>}
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card className="hover-card">
            <CardHeader><CardTitle className="text-sm">{t("maintenanceDetail.statusTimeline")}</CardTitle></CardHeader>
            <CardContent>
              <div className="relative space-y-4">
                {timelineSteps.map(({ status, isLast }, i) => (
                  <div key={status} className="flex gap-3 relative">
                    {!isLast && (
                      <div className="absolute left-3.5 top-7 bottom-0 w-px bg-border" />
                    )}
                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10", isLast ? statusColors[status] + " text-white" : "bg-muted text-muted-foreground")}>
                      {statusIcons[status]}
                    </div>
                    <div className="pb-4">
                      <p className={cn("text-sm font-medium", isLast ? "text-foreground" : "text-muted-foreground")}>
                        {t(`maintenance.statuses.${status}`)}
                      </p>
                      {isLast && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDistanceToNow(new Date(request.updatedAt || request.createdAt), { addSuffix: true })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assign Contractor (Owner only) */}
          {isOwner && request.status === "submitted" && (
            <Card className="hover-card">
              <CardContent className="pt-4">
                <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full gradient-primary text-white border-0" size="sm">
                      <User className="w-4 h-4 mr-2" />{t("maintenanceDetail.assignContractor")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>{t("maintenanceDetail.assignContractor")}</DialogTitle></DialogHeader>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {contractors.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">{t("maintenanceDetail.noContractors")}</p>
                      )}
                      {contractors.map((c: any) => (
                        <div key={c.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                              {getInitials(c.companyName || c.name || "C")}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{c.companyName || c.name}</p>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-muted-foreground">{c.averageRating?.toFixed(1) || "—"}</span>
                                {c.specialties && <span className="text-xs text-muted-foreground ml-1">• {c.specialties}</span>}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="gradient-primary text-white border-0"
                            onClick={() => assignContractor.mutate(c.id)}
                            disabled={assignContractor.isPending}
                          >
                            {t("maintenanceDetail.select")}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
