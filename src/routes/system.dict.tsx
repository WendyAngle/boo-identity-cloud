import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  RotateCcw,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  AlertTriangle,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";

type DictItem = {
  id: number;
  name: string;
  type: string;
  status: "enabled" | "disabled";
  remark: string;
  createdAt: string;
};

const initialData: DictItem[] = [
  { id: 1, name: "性别", type: "sys_user_gender", status: "enabled", remark: "用户性别列表", createdAt: "2025-04-12 10:22:31" },
  { id: 2, name: "菜单状态", type: "sys_show_hide", status: "enabled", remark: "菜单显示/隐藏", createdAt: "2025-04-12 10:23:11" },
  { id: 3, name: "系统状态", type: "sys_normal_disable", status: "enabled", remark: "启用/停用通用状态", createdAt: "2025-04-12 10:24:02" },
  { id: 4, name: "任务状态", type: "sys_job_status", status: "disabled", remark: "定时任务状态", createdAt: "2025-04-12 10:25:45" },
  { id: 5, name: "操作类型", type: "sys_oper_type", status: "enabled", remark: "操作日志分类", createdAt: "2025-04-12 10:26:31" },
];

export const Route = createFileRoute("/system/dict")({
  head: () => ({ meta: [{ title: "后台系统字典管理 — Boo Identity Cloud" }] }),
  component: DictPage,
});

function DictPage() {
  const [data, setData] = useState<DictItem[]>(initialData);
  const [qName, setQName] = useState("");
  const [qType, setQType] = useState("");
  const [qStatus, setQStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DictItem | null>(null);
  const [delTarget, setDelTarget] = useState<DictItem | null>(null);

  const filtered = useMemo(() => {
    return data.filter((d) => {
      if (qName && !d.name.includes(qName)) return false;
      if (qType && !d.type.includes(qType)) return false;
      if (qStatus !== "all" && d.status !== qStatus) return false;
      return true;
    });
  }, [data, qName, qType, qStatus]);

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const reset = () => {
    setQName("");
    setQType("");
    setQStatus("all");
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (row: DictItem) => {
    setEditing(row);
    setFormOpen(true);
  };

  const handleSave = (payload: Omit<DictItem, "id" | "createdAt">) => {
    if (editing) {
      setData((prev) => prev.map((d) => (d.id === editing.id ? { ...d, ...payload } : d)));
      toast.success("字典已更新");
    } else {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const id = Math.max(0, ...data.map((d) => d.id)) + 1;
      setData((prev) => [{ id, createdAt, ...payload }, ...prev]);
      toast.success("字典已创建");
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (!delTarget) return;
    setData((prev) => prev.filter((d) => d.id !== delTarget.id));
    toast.success(`已删除字典"${delTarget.name}"`);
    setDelTarget(null);
  };

  const allChecked = paged.length > 0 && paged.every((r) => selected.includes(r.id));
  const toggleAll = () => {
    if (allChecked) {
      setSelected((prev) => prev.filter((id) => !paged.some((r) => r.id === id)));
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...paged.map((r) => r.id)])));
    }
  };
  const toggleOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Filter Bar */}
        <div className="rounded-lg border bg-card p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Label className="w-20 shrink-0 text-right text-sm">字典名称：</Label>
              <Input placeholder="请输入" value={qName} onChange={(e) => setQName(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Label className="w-20 shrink-0 text-right text-sm">字典类型：</Label>
              <Input placeholder="请输入" value={qType} onChange={(e) => setQType(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Label className="w-20 shrink-0 text-right text-sm">状态：</Label>
              <Select value={qStatus} onValueChange={setQStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="enabled">启用</SelectItem>
                  <SelectItem value="disabled">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button onClick={() => setPage(1)} className="bg-primary hover:bg-primary/90">
              <Search className="mr-1 h-4 w-4" /> 搜索
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="mr-1 h-4 w-4" /> 重置
            </Button>
          </div>
        </div>

        {/* Toolbar + Table */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b p-3">
            <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-1 h-4 w-4" /> 新增字典
            </Button>
            <Button variant="outline" size="icon" onClick={() => toast.success("已刷新")}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox checked={allChecked} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead className="w-16">#</TableHead>
                <TableHead>字典名称</TableHead>
                <TableHead>字典类型</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>备注</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="w-40">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-64 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox className="h-10 w-10 opacity-40" />
                      <span>暂无数据</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(row.id)}
                        onCheckedChange={() => toggleOne(row.id)}
                      />
                    </TableCell>
                    <TableCell>{(page - 1) * pageSize + idx + 1}</TableCell>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{row.type}</TableCell>
                    <TableCell>
                      {row.status === "enabled" ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">启用</Badge>
                      ) : (
                        <Badge variant="secondary">停用</Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate text-muted-foreground">{row.remark}</TableCell>
                    <TableCell className="text-muted-foreground">{row.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
                          <Pencil className="mr-1 h-3.5 w-3.5" /> 编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDelTarget(row)}
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" /> 删除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-4 border-t px-4 py-3 text-sm">
            <span className="text-muted-foreground">共 {total} 条</span>
            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}条/页</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={(e) => { e.preventDefault(); setPage(p); }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">前往</span>
              <Input
                className="h-8 w-14 text-center"
                defaultValue={page}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const v = Math.min(totalPages, Math.max(1, Number((e.target as HTMLInputElement).value) || 1));
                    setPage(v);
                  }
                }}
              />
              <span className="text-muted-foreground">页</span>
            </div>
          </div>
        </div>
      </div>

      <DictFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        onSave={handleSave}
      />

      <AlertDialog open={!!delTarget} onOpenChange={(o) => !o && setDelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              删除确认
            </AlertDialogTitle>
            <AlertDialogDescription>
              是否确认删除字典名称为"{delTarget?.name}"的数据？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function DictFormDialog({
  open,
  onOpenChange,
  editing,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: DictItem | null;
  onSave: (payload: Omit<DictItem, "id" | "createdAt">) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState<"enabled" | "disabled">("enabled");
  const [remark, setRemark] = useState("");

  // Reset when opened
  useMemo(() => {
    if (open) {
      setName(editing?.name ?? "");
      setType(editing?.type ?? "");
      setStatus(editing?.status ?? "enabled");
      setRemark(editing?.remark ?? "");
    }
  }, [open, editing]);

  const submit = () => {
    if (!name.trim()) return toast.error("请输入字典名称");
    if (!type.trim()) return toast.error("请输入字典类型");
    onSave({ name: name.trim(), type: type.trim(), status, remark: remark.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "编辑字典类型" : "新增字典类型"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-[100px_1fr] items-center gap-3">
            <Label className="text-right text-sm">
              <span className="text-destructive">*</span> 字典名称：
            </Label>
            <Input
              placeholder="请输入字典名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={64}
            />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-3">
            <Label className="text-right text-sm">
              <span className="text-destructive">*</span> 字典类型：
            </Label>
            <Input
              placeholder="请输入字典类型"
              value={type}
              onChange={(e) => setType(e.target.value)}
              maxLength={64}
            />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-3">
            <Label className="text-right text-sm">
              <span className="text-destructive">*</span> 状态：
            </Label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  className="h-4 w-4 accent-primary"
                  checked={status === "enabled"}
                  onChange={() => setStatus("enabled")}
                />
                启用
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  className="h-4 w-4 accent-primary"
                  checked={status === "disabled"}
                  onChange={() => setStatus("disabled")}
                />
                停用
              </label>
            </div>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-start gap-3">
            <Label className="pt-2 text-right text-sm">备注：</Label>
            <Textarea
              placeholder="请输入备注"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              maxLength={255}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={submit} className="bg-primary hover:bg-primary/90">确定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
