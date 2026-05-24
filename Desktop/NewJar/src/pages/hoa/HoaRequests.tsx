import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  useDraggable, useDroppable, PointerSensor, useSensor, useSensors
} from "@dnd-kit/core";
import { apiRequest } from "@/lib/queryClient";
import type { MaintenanceRequest, RequestStatus } from "@/lib/types";

const GREEN = "#7FD4A0";
const TEAL  = "#0D9488";
const TEXT  = "#F8FAFC";
const MUTED = "#94A3B8";

const URGENCY_COLOR: Record<string, string> = {
  low: MUTED, medium: "#F59E0B", high: "#F97316", emergency: "#EF4444"
};

const COLUMNS: { id: RequestStatus; labelKey: string; color: string }[] = [
  { id: "submitted",   labelKey: "hoa.kanban.submitted",  color: "#F59E0B" },
  { id: "assigned",    labelKey: "hoa.kanban.assigned",   color: TEAL      },
  { id: "in_progress", labelKey: "hoa.kanban.inProgress", color: GREEN     },
  { id: "completed",   labelKey: "hoa.kanban.completed",  color: "#10B981" },
];

function RequestCard({ request }: { request: MaintenanceRequest }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: request.id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="rounded-xl p-3 cursor-grab active:cursor-grabbing select-none"
      style={{
        transform: transform ? `translate3d(${transform.x}px,${transform.y}px,0)` : undefined,
        opacity: isDragging ? 0 : 1,
        touchAction: "none",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(127,212,160,0.1)",
      }}
    >
      <div className="text-sm font-medium leading-snug mb-1.5" style={{ color: TEXT }}>
        {request.title}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: "rgba(127,212,160,0.1)", color: GREEN }}>
          {request.category}
        </span>
        <span className="text-xs" style={{ color: URGENCY_COLOR[request.urgency] ?? MUTED }}>
          {request.urgency}
        </span>
        {request.unit && (
          <span className="text-xs" style={{ color: MUTED }}>{request.unit.unitNumber}</span>
        )}
      </div>
    </div>
  );
}

function KanbanColumn({ id, label, color, requests }: {
  id: string; label: string; color: string; requests: MaintenanceRequest[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 min-w-[200px] flex flex-col rounded-2xl p-3 transition-colors"
      style={{
        background: isOver ? "rgba(127,212,160,0.07)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isOver ? "rgba(127,212,160,0.35)" : "rgba(127,212,160,0.1)"}`,
        minHeight: 300,
      }}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
          {label}
        </span>
        <span className="ltr:ml-auto rtl:mr-auto text-xs px-1.5 py-0.5 rounded-full"
          style={{ background: "rgba(127,212,160,0.1)", color: GREEN }}>
          {requests.length}
        </span>
      </div>
      <div className="space-y-2 flex-1">
        {requests.map(r => <RequestCard key={r.id} request={r} />)}
      </div>
    </div>
  );
}

export default function HoaRequests() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [activeRequest, setActiveRequest] = useState<MaintenanceRequest | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const { data: requests = [] } = useQuery<MaintenanceRequest[]>({
    queryKey: ["maintenance-requests"],
    queryFn: () => apiRequest("GET", "/api/maintenance-requests")
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RequestStatus }) =>
      apiRequest("PATCH", `/api/maintenance-requests/${id}`, { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["maintenance-requests"] });
      const prev = qc.getQueryData<MaintenanceRequest[]>(["maintenance-requests"]);
      qc.setQueryData<MaintenanceRequest[]>(["maintenance-requests"], old =>
        old?.map(r => r.id === id ? { ...r, status } : r) ?? []
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      qc.setQueryData(["maintenance-requests"], ctx?.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["maintenance-requests"] })
  });

  const onDragStart = (e: DragStartEvent) => {
    const r = requests.find(req => req.id === e.active.id);
    setActiveRequest(r ?? null);
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveRequest(null);
    const { active, over } = e;
    if (!over) return;
    const newStatus = over.id as RequestStatus;
    const req = requests.find(r => r.id === active.id);
    if (req && req.status !== newStatus) {
      updateStatus.mutate({ id: req.id, status: newStatus });
    }
  };

  const byStatus = (status: RequestStatus) => requests.filter(r => r.status === status);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold" style={{ color: TEXT }}>{t("hoa.requests")}</h1>
      <div className="overflow-x-auto pb-2">
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="flex gap-3 min-w-max lg:min-w-0">
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                label={t(col.labelKey)}
                color={col.color}
                requests={byStatus(col.id)}
              />
            ))}
          </div>
          <DragOverlay>
            {activeRequest && (
              <div className="rounded-xl p-3 shadow-2xl"
                style={{ background: "rgba(13,31,26,0.95)", border: "1px solid rgba(127,212,160,0.3)" }}>
                <div className="text-sm font-medium" style={{ color: TEXT }}>{activeRequest.title}</div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
