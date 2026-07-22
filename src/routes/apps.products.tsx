import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  RotateCcw,
  RefreshCw,
  Info,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/apps/products")({
  head: () => ({
    meta: [
      { title: "产品/App管理 — Boo Identity Cloud" },
      { name: "description", content: "维护接入认证中心的产品与应用清单。" },
    ],
  }),
  component: ProductsPage,
});

// ---------- 数据模型 ----------
type ProductStatus = "enabled" | "disabled";

type LinkedCompany = {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
  openedAt: string;
  expiresAt: string; // "长期有效" 或日期
};

type Product = {
  id: string;
  code: string;
  name: string;
  status: ProductStatus;
  oauthClientName: string;
  oauthClientCode: string;
  owner?: string;
  email?: string;
  updatedAt: string;
  description?: string;
  commitment: {
    enabled: boolean;
    name: string;
    content: string;
  };
  linkedCompanyIds: string[];
};

const ALL_OAUTH_CLIENTS = [
  { code: "gts-prod-bff", name: "GTS业务系统BFF" },
  { code: "overseas_pad_bff", name: "出海神器pad服务" },
  { code: "atlas-dev02", name: "atlas-dev02" },
  { code: "atlas-test", name: "atlas-test" },
  { code: "boo-points-test", name: "积分系统" },
  { code: "mtxdevice-bff-test", name: "矩阵平台测试环境" },
  { code: "boopilot-test", name: "业务运营自动驾驶-测试" },
  { code: "atlas-dev", name: "atlas-dev" },
  { code: "iam-login-bff-test", name: "统一身份认证BFF" },
  { code: "video-editor-bff", name: "视频编辑网关" },
  { code: "gts", name: "gts" },
];

const ALL_COMPANIES: LinkedCompany[] = [
  { id: "c1", name: "成都朗瀚智途科技有限公司", code: "COMP202607030002", enabled: true, openedAt: "2026-07-15 14:31:37", expiresAt: "长期有效" },
  { id: "c2", name: "运营公司test", code: "COMP202607030001", enabled: true, openedAt: "2026-07-10 09:12:00", expiresAt: "长期有效" },
  { id: "c3", name: "自动化测试公司", code: "COMP202607020001", enabled: true, openedAt: "2026-07-08 10:00:00", expiresAt: "长期有效" },
  { id: "c4", name: "成都朗瀚智途科技有限公司", code: "COMP202606250001", enabled: true, openedAt: "2026-07-05 10:00:00", expiresAt: "长期有效" },
  { id: "c5", name: "博海悦意科技有限公司", code: "COMP202606240001", enabled: true, openedAt: "2026-07-08 13:40:38", expiresAt: "长期有效" },
  { id: "c6", name: "强制改密公司20260622170347", code: "COMP_FP_20260622170347", enabled: true, openedAt: "2026-07-01 10:00:00", expiresAt: "长期有效" },
  { id: "c7", name: "第三方认证公司20260622165047", code: "COMP_TP_20260622165047", enabled: true, openedAt: "2026-07-01 10:00:00", expiresAt: "长期有效" },
  { id: "c8", name: "第三方认证公司20260622164324", code: "COMP_TP_20260622164324", enabled: true, openedAt: "2026-07-01 10:00:00", expiresAt: "长期有效" },
  { id: "c9", name: "成都青鹿数据科技有限公司", code: "COMP202606180002", enabled: true, openedAt: "2026-07-07 16:35:50", expiresAt: "长期有效" },
  { id: "c10", name: "成都云帆科技有限公司", code: "COMP202606180001", enabled: true, openedAt: "2026-07-07 16:35:50", expiresAt: "长期有效" },
];

const seedProducts: Product[] = [
  {
    id: "1",
    code: "gts-prod-101",
    name: "gts采集-101",
    status: "enabled",
    oauthClientName: "GTS业务系统BFF",
    oauthClientCode: "gts-prod-bff",
    owner: "hzp",
    email: "hzp@bhyy.com",
    updatedAt: "2026-07-15 14:25:56",
    commitment: { enabled: false, name: "", content: "" },
    linkedCompanyIds: ["c9", "c10"],
  },
  {
    id: "2",
    code: "overseas_pad_svc",
    name: "出海神器pad服务",
    status: "enabled",
    oauthClientName: "出海神器pad服务",
    oauthClientCode: "overseas_pad_bff",
    owner: "ZYP",
    email: "zyp@boohign.com",
    updatedAt: "2026-07-07 16:33:40",
    commitment: { enabled: true, name: "产品使用承诺函", content: "<p>请仔细阅读本产品使用承诺函……</p>" },
    linkedCompanyIds: ["c5", "c9", "c10"],
  },
  {
    id: "3",
    code: "atlas-dev02",
    name: "atlas-dev02",
    status: "enabled",
    oauthClientName: "atlas-dev02",
    oauthClientCode: "atlas-dev02",
    updatedAt: "2026-07-05 14:54:34",
    commitment: { enabled: false, name: "", content: "" },
    linkedCompanyIds: [],
  },
  {
    id: "4",
    code: "atlas-test",
    name: "atlas-test",
    status: "enabled",
    oauthClientName: "atlas-test",
    oauthClientCode: "atlas-test",
    updatedAt: "2026-07-02 20:28:45",
    commitment: { enabled: true, name: "atlas 测试承诺函", content: "" },
    linkedCompanyIds: [],
  },
  {
    id: "5",
    code: "boo-points",
    name: "积分系统",
    status: "enabled",
    oauthClientName: "积分系统",
    oauthClientCode: "boo-points-test",
    owner: "DB",
    email: "db@bhyy.com",
    updatedAt: "2026-07-02 18:01:05",
    commitment: { enabled: false, name: "", content: "" },
    linkedCompanyIds: [],
  },
  {
    id: "6",
    code: "mtxdevice",
    name: "矩阵平台",
    status: "enabled",
    oauthClientName: "矩阵平台测试环境",
    oauthClientCode: "mtxdevice-bff-test",
    updatedAt: "2026-06-26 14:28:36",
    commitment: { enabled: false, name: "", content: "" },
    linkedCompanyIds: [],
  },
  {
    id: "7",
    code: "BooPilot",
    name: "业务运营自动驾驶",
    status: "enabled",
    oauthClientName: "业务运营自动驾驶-测试",
    oauthClientCode: "boopilot-test",
    owner: "hjl",
    updatedAt: "2026-06-24 11:35:52",
    commitment: { enabled: false, name: "", content: "" },
    linkedCompanyIds: [],
  },
  {
    id: "8",
    code: "atlas-dev",
    name: "atlas-dev",
    status: "enabled",
    oauthClientName: "atlas-dev",
    oauthClientCode: "atlas-dev",
    updatedAt: "2026-06-22 10:31:45",
    commitment: { enabled: false, name: "", content: "" },
    linkedCompanyIds: [],
  },
  {
    id: "9",
    code: "iam-login-app",
    name: "统一身份认证中心",
    status: "enabled",
    oauthClientName: "统一身份认证BFF",
    oauthClientCode: "iam-login-bff-test",
    owner: "IAM平台组",
    email: "iam-login-admin@example.com",
    updatedAt: "2026-06-18 03:44:59",
    commitment: { enabled: false, name: "", content: "" },
    linkedCompanyIds: [],
  },
  {
    id: "10",
    code: "boo-hub",
    name: "数据中台",
    status: "enabled",
    oauthClientName: "视频编辑网关",
    oauthClientCode: "video-editor-bff",
    updatedAt: "2026-02-03 14:04:02",
    commitment: { enabled: false, name: "", content: "" },
    linkedCompanyIds: [],
  },
  {
    id: "11",
    code: "gts",
    name: "gts",
    status: "disabled",
    oauthClientName: "gts",
    oauthClientCode: "gts",
    updatedAt: "2026-02-01 10:00:00",
    commitment: { enabled: false, name: "", content: "" },
    linkedCompanyIds: [],
  },
];

// ---------- 徽章 ----------
function StatusBadge({ status }: { status: ProductStatus }) {
  if (status === "enabled")
    return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">启用</Badge>;
  return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200">停用</Badge>;
}

function CommitmentBadge({ enabled }: { enabled: boolean }) {
  if (enabled) return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">已启用</Badge>;
  return <Badge variant="outline" className="text-muted-foreground">未启用</Badge>;
}

// ---------- 主页面 ----------
function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [applied, setApplied] = useState({ keyword: "", status: "all" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [commitmentOf, setCommitmentOf] = useState<Product | null>(null);
  const [linkingOf, setLinkingOf] = useState<Product | null>(null);
  const [toggling, setToggling] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [deleteBlocked, setDeleteBlocked] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (applied.status !== "all" && p.status !== applied.status) return false;
      if (applied.keyword) {
        const k = applied.keyword.toLowerCase();
        if (!p.name.toLowerCase().includes(k) && !p.code.toLowerCase().includes(k)) return false;
      }
      return true;
    });
  }, [products, applied]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = () => { setApplied({ keyword, status: statusFilter }); setPage(1); };
  const handleReset = () => {
    setKeyword(""); setStatusFilter("all");
    setApplied({ keyword: "", status: "all" }); setPage(1);
  };

  const saveProduct = (data: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === data.id);
      return exists ? prev.map((p) => (p.id === data.id ? data : p)) : [data, ...prev];
    });
    toast.success("已保存");
  };
  const saveCommitment = (id: string, c: Product["commitment"]) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, commitment: c } : p)));
    toast.success("承诺函已保存");
  };
  const saveLinks = (id: string, ids: string[]) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, linkedCompanyIds: ids } : p)));
    toast.success("关联公司已保存");
  };
  const toggleStatus = (id: string) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === "enabled" ? "disabled" : "enabled" } : p));
  };
  const requestDelete = (p: Product) => {
    const hasActive = p.linkedCompanyIds.some((id) => ALL_COMPANIES.find((c) => c.id === id)?.enabled);
    if (hasActive) setDeleteBlocked(p);
    else setDeleting(p);
  };
  const doDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("已删除");
  };

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-background to-background p-6 mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="text-xs font-semibold tracking-[0.2em] text-emerald-700 mb-2">
              PRODUCT CATALOG
            </div>
            <h1 className="text-2xl font-bold mb-2">产品/App 管理</h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              这里维护公司可以购买和开通的业务产品。OAuth Client 是技术接入凭证，产品/App 是授权给公司的业务入口。
            </p>
          </div>
          <Button onClick={() => setCreating(true)} className="shrink-0 shadow-md">
            <Plus className="mr-1 h-4 w-4" />
            新增产品
          </Button>
        </div>
      </section>

      {/* 过滤 */}
      <section className="rounded-xl border bg-card p-4 mb-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground shrink-0">关键词</Label>
            <Input
              value={keyword} onChange={(e) => setKeyword(e.target.value)}
              placeholder="产品名称 / 产品编码"
              className="w-[220px]"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground shrink-0">状态</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="enabled">启用</SelectItem>
                <SelectItem value="disabled">停用</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch}><Search className="mr-1 h-4 w-4" />查询</Button>
            <Button variant="outline" onClick={handleReset}><RotateCcw className="mr-1 h-4 w-4" />重置</Button>
          </div>
        </div>
      </section>

      {/* 表格 */}
      <section className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>产品编码</TableHead>
              <TableHead>产品名称</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>承诺函</TableHead>
              <TableHead>OAuth Client</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>联系邮箱</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.code}</TableCell>
                <TableCell className="max-w-[200px] truncate">{p.name}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CommitmentBadge enabled={p.commitment.enabled} />
                    <button
                      className="text-primary text-sm hover:underline"
                      onClick={() => setCommitmentOf(p)}
                    >编辑承诺函</button>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {p.oauthClientName}
                  <span className="text-muted-foreground font-mono text-xs ml-1">
                    （{p.oauthClientCode}）
                  </span>
                </TableCell>
                <TableCell>{p.owner ?? "-"}</TableCell>
                <TableCell className="text-muted-foreground">{p.email ?? "-"}</TableCell>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{p.updatedAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-sm">
                    <button className="text-primary hover:underline" onClick={() => setEditing(p)}>编辑</button>
                    <button className="text-primary hover:underline" onClick={() => setLinkingOf(p)}>关联公司</button>
                    <button
                      className={p.status === "enabled" ? "text-rose-600 hover:underline" : "text-emerald-600 hover:underline"}
                      onClick={() => setToggling(p)}
                    >{p.status === "enabled" ? "停用" : "启用"}</button>
                    <button className="text-rose-600 hover:underline" onClick={() => requestDelete(p)}>删除</button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {pageItems.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-10">暂无数据</TableCell></TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-end gap-4 border-t px-4 py-3 text-sm">
          <span className="text-muted-foreground">共 {total} 条</span>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
            <SelectTrigger className="w-[100px] h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((n) => <SelectItem key={n} value={String(n)}>{n}条/页</SelectItem>)}
            </SelectContent>
          </Select>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink isActive={page === i + 1} onClick={(e) => { e.preventDefault(); setPage(i + 1); }}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      <ProductEditDialog
        open={!!editing || creating}
        product={editing}
        onClose={() => { setEditing(null); setCreating(false); }}
        onSave={saveProduct}
      />
      <CommitmentDialog
        product={commitmentOf}
        onClose={() => setCommitmentOf(null)}
        onSave={saveCommitment}
      />
      <LinkedCompaniesDialog
        product={linkingOf}
        onClose={() => setLinkingOf(null)}
        onSave={saveLinks}
      />

      <AlertDialog open={!!toggling} onOpenChange={(o) => !o && setToggling(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>操作确认</AlertDialogTitle>
            <AlertDialogDescription>
              确认{toggling?.status === "enabled" ? "停用" : "启用"}产品「{toggling?.name}」吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (toggling) { toggleStatus(toggling.id); toast.success("操作成功"); }
              setToggling(null);
            }}>确定</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除确认</AlertDialogTitle>
            <AlertDialogDescription>
              确认删除产品「{deleting?.name}」吗？该操作不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => { if (deleting) doDelete(deleting.id); setDeleting(null); }}
            >确定删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!deleteBlocked} onOpenChange={(o) => !o && setDeleteBlocked(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>无法删除</DialogTitle></DialogHeader>
          <Alert className="border-amber-300 bg-amber-50">
            <AlertTriangle className="h-4 w-4 !text-amber-600" />
            <AlertDescription className="text-amber-900">
              该产品下仍有启用的关联公司，请先取消授权后再删除。
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteBlocked(null)}>知道了</Button>
            <Button onClick={() => { const p = deleteBlocked; setDeleteBlocked(null); if (p) setLinkingOf(p); }}>
              去管理关联公司
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

// ---------- 编辑产品对话框 ----------
function ProductEditDialog({
  open, product, onClose, onSave,
}: { open: boolean; product: Product | null; onClose: () => void; onSave: (p: Product) => void }) {
  const isEdit = !!product;
  const [form, setForm] = useState<Partial<Product>>({});

  useMemo(() => {
    if (open) {
      setForm(product ?? {
        name: "", code: "", oauthClientCode: "", status: "enabled",
        owner: "", email: "", description: "",
      });
    }
  }, [open, product]);

  const submit = () => {
    if (!form.name?.trim()) return toast.error("产品名称不能为空");
    if (!form.code?.trim()) return toast.error("产品编码不能为空");
    const client = ALL_OAUTH_CLIENTS.find((c) => c.code === form.oauthClientCode);
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const merged: Product = {
      id: product?.id ?? `new-${Date.now()}`,
      code: form.code!, name: form.name!,
      status: (form.status as ProductStatus) ?? "enabled",
      oauthClientCode: form.oauthClientCode ?? "",
      oauthClientName: client?.name ?? "",
      owner: form.owner, email: form.email,
      description: form.description,
      updatedAt: now,
      commitment: product?.commitment ?? { enabled: false, name: "", content: "" },
      linkedCompanyIds: product?.linkedCompanyIds ?? [],
    };
    onSave(merged); onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{isEdit ? "编辑产品/App" : "新增产品/App"}</DialogTitle></DialogHeader>
        <Alert className="border-sky-200 bg-sky-50">
          <Info className="h-4 w-4 !text-sky-600" />
          <AlertDescription className="text-sky-900">
            产品/App 用于公司维度授权；OAuth Client 凭证请到 OAuth Client 管理中维护。
          </AlertDescription>
        </Alert>
        <div className="space-y-3">
          <FormRow label="产品名称" required max={64} placeholder="例如：采集平台" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <FormRow label="产品编码" required max={64} placeholder="例如：gather" value={form.code} onChange={(v) => setForm((f) => ({ ...f, code: v }))} />
          <div className="grid grid-cols-[90px_1fr] items-center gap-3">
            <Label className="text-sm text-right text-muted-foreground">OAuth Client</Label>
            <Select value={form.oauthClientCode ?? ""} onValueChange={(v) => setForm((f) => ({ ...f, oauthClientCode: v }))}>
              <SelectTrigger><SelectValue placeholder="选择 OAuth Client" /></SelectTrigger>
              <SelectContent>
                {ALL_OAUTH_CLIENTS.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.name}（{c.code}）</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-[90px_1fr] items-center gap-3">
            <Label className="text-sm text-right text-muted-foreground">
              <span className="text-rose-500 mr-0.5">*</span>状态
            </Label>
            <div className="inline-flex rounded-md border p-0.5 w-fit">
              {(["enabled", "disabled"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={`px-4 py-1.5 text-sm rounded ${form.status === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                >{s === "enabled" ? "启用" : "停用"}</button>
              ))}
            </div>
          </div>
          <FormRow label="负责人" value={form.owner} onChange={(v) => setForm((f) => ({ ...f, owner: v }))} />
          <FormRow label="联系邮箱" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
          <div className="grid grid-cols-[90px_1fr] items-start gap-3">
            <Label className="pt-2 text-sm text-right text-muted-foreground">说明</Label>
            <div className="relative">
              <Textarea
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value.slice(0, 255) }))}
                placeholder="记录产品用途、接入说明或授权注意事项"
                rows={3}
              />
              <span className="absolute bottom-1 right-2 text-xs text-muted-foreground">
                {(form.description ?? "").length} / 255
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={submit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormRow({
  label, required, max, value, onChange, placeholder,
}: { label: string; required?: boolean; max?: number; value?: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="grid grid-cols-[90px_1fr] items-center gap-3">
      <Label className="text-sm text-right text-muted-foreground">
        {required && <span className="text-rose-500 mr-0.5">*</span>}{label}
      </Label>
      <div className="relative">
        <Input placeholder={placeholder} value={value ?? ""} onChange={(e) => onChange(max ? e.target.value.slice(0, max) : e.target.value)} />

        {max && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            {(value ?? "").length} / {max}
          </span>
        )}
      </div>
    </div>
  );
}

// ---------- 编辑承诺函 ----------
function CommitmentDialog({
  product, onClose, onSave,
}: { product: Product | null; onClose: () => void; onSave: (id: string, c: Product["commitment"]) => void }) {
  const [enabled, setEnabled] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  useMemo(() => {
    if (product) {
      setEnabled(product.commitment.enabled);
      setName(product.commitment.name);
      setContent(product.commitment.content);
    }
  }, [product]);

  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle>编辑承诺函 - {product.name}</DialogTitle></DialogHeader>

        <div className="rounded-lg border bg-muted/30 px-4 py-3 flex items-center justify-between">
          <div>
            <div className="font-semibold">{product.name}</div>
            <div className="text-xs font-mono text-muted-foreground mt-0.5">{product.code}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{enabled ? "已启用" : "暂不启用"}</span>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </div>

        {!enabled && (
          <Alert className="border-sky-200 bg-sky-50">
            <Info className="h-4 w-4 !text-sky-600" />
            <AlertDescription className="text-sky-900">
              关闭开关时承诺函仅作为草稿保存，不会在授权页展示，也不会拦截用户进入应用。
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Label className="text-sm text-right text-muted-foreground">承诺函名称</Label>
          <div className="relative">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 128))}
              placeholder="例如：产品使用承诺函"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
              {name.length} / 128
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[90px_1fr] items-start gap-3">
          <Label className="text-sm text-right text-muted-foreground pt-2">承诺函内容</Label>
          <div className="rounded-md border overflow-hidden">
            <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-1.5 text-muted-foreground">
              {[Bold, Italic, Underline, List, ListOrdered, Link2, ImageIcon, Undo2, Redo2].map((Icon, i) => (
                <button key={i} className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center" type="button">
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder="请输入产品使用承诺函内容，支持加粗、标题、列表等文本样式。"
              className="border-0 rounded-none focus-visible:ring-0"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={() => { onSave(product.id, { enabled, name, content }); onClose(); }}>
            保存承诺函
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- 关联公司（穿梭框） ----------
function LinkedCompaniesDialog({
  product, onClose, onSave,
}: { product: Product | null; onClose: () => void; onSave: (id: string, ids: string[]) => void }) {
  const [linked, setLinked] = useState<string[]>([]);
  const [leftSel, setLeftSel] = useState<string[]>([]);
  const [rightSel, setRightSel] = useState<string[]>([]);
  const [leftSearch, setLeftSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");
  const [clearAllOpen, setClearAllOpen] = useState(false);

  useMemo(() => {
    if (product) {
      setLinked(product.linkedCompanyIds);
      setLeftSel([]); setRightSel([]); setLeftSearch(""); setRightSearch("");
    }
  }, [product]);

  if (!product) return null;

  const linkable = ALL_COMPANIES.filter((c) => !linked.includes(c.id) &&
    (leftSearch === "" || c.name.includes(leftSearch) || c.code.includes(leftSearch))
  );
  const linkedList = ALL_COMPANIES.filter((c) => linked.includes(c.id) &&
    (rightSearch === "" || c.name.includes(rightSearch) || c.code.includes(rightSearch))
  );
  const linkedDetail = ALL_COMPANIES.filter((c) => linked.includes(c.id));
  const activeCount = linkedDetail.filter((c) => c.enabled).length;
  const operable = ALL_COMPANIES.length;

  const linkSelected = () => {
    if (leftSel.length === 0) return;
    setLinked((prev) => [...prev, ...leftSel]);
    setLeftSel([]);
  };
  const removeSelected = () => {
    if (rightSel.length === 0) return;
    setLinked((prev) => prev.filter((id) => !rightSel.includes(id)));
    setRightSel([]);
  };

  const toggleLeftAll = () => {
    const ids = linkable.map((c) => c.id);
    setLeftSel(leftSel.length === ids.length ? [] : ids);
  };
  const toggleRightAll = () => {
    const ids = linkedList.map((c) => c.id);
    setRightSel(rightSel.length === ids.length ? [] : ids);
  };

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>关联公司 - {product.name}</DialogTitle></DialogHeader>

        {/* 顶部统计 */}
        <div className="rounded-xl border bg-muted/20 p-4 flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">当前产品</div>
            <div className="font-semibold text-base mt-0.5">{product.name}</div>
            <div className="text-xs font-mono text-muted-foreground">{product.code}</div>
          </div>
          <StatCard label="当前启用" value={activeCount} />
          <StatCard label="右侧已选" value={linked.length} />
          <StatCard label="可操作公司" value={operable} />
          <Button variant="outline" size="sm" onClick={() => toast.success("已刷新")}>
            <RefreshCw className="mr-1 h-3.5 w-3.5" />刷新
          </Button>
        </div>

        <Alert className="border-sky-200 bg-sky-50">
          <Info className="h-4 w-4 !text-sky-600" />
          <AlertDescription className="text-sky-900">
            从左侧选择公司加入右侧后保存，即可为这些公司开通当前产品。
          </AlertDescription>
        </Alert>

        {/* 穿梭框 */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
          <TransferColumn
            title="可关联公司"
            total={linkable.length}
            selectedCount={leftSel.length}
            search={leftSearch}
            onSearch={setLeftSearch}
            onToggleAll={toggleLeftAll}
            items={linkable}
            selected={leftSel}
            onToggle={(id) => setLeftSel((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id])}
          />

          <div className="flex flex-col justify-center gap-2">
            <Button size="sm" variant="outline" onClick={removeSelected} disabled={rightSel.length === 0}>
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />移除
            </Button>
            <Button size="sm" onClick={linkSelected} disabled={leftSel.length === 0}>
              关联<ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>

          <TransferColumn
            title="已关联公司"
            total={linked.length}
            selectedCount={rightSel.length}
            search={rightSearch}
            onSearch={setRightSearch}
            onToggleAll={toggleRightAll}
            items={linkedList}
            selected={rightSel}
            onToggle={(id) => setRightSel((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id])}
          />
        </div>

        <Alert className="border-amber-300 bg-amber-50">
          <AlertTriangle className="h-4 w-4 !text-amber-600" />
          <AlertDescription className="text-amber-900">
            当前已启用关联的公司会阻止产品删除；如需删除产品，请先移除右侧公司并保存，或一键解除全部关联。
          </AlertDescription>
        </Alert>

        {/* 已选公司明细表 */}
        <div className="rounded-xl border">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="font-semibold text-sm">右侧已选公司明细</div>
            <div className="text-xs text-muted-foreground">{linkedDetail.length} 家公司</div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>公司名称</TableHead>
                <TableHead>公司编码</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>开通时间</TableHead>
                <TableHead>到期时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linkedDetail.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell className="font-mono text-xs">{c.code}</TableCell>
                  <TableCell>
                    {c.enabled
                      ? <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">已启用</Badge>
                      : <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200">已停用</Badge>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.openedAt}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.expiresAt}</TableCell>
                </TableRow>
              ))}
              {linkedDetail.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">暂无已关联公司</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div />
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>取消</Button>
            <Button
              variant="outline"
              className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              onClick={() => setClearAllOpen(true)}
              disabled={linked.length === 0}
            >
              一键解除全部关联
            </Button>
            <Button onClick={() => { onSave(product.id, linked); onClose(); }}>保存关联公司</Button>
          </div>
        </DialogFooter>

        <AlertDialog open={clearAllOpen} onOpenChange={setClearAllOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>解除全部关联</AlertDialogTitle>
              <AlertDialogDescription>
                确认解除产品「{product.name}」与 {linked.length} 家公司的授权关系吗？解除后这些公司将无法访问该产品。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => { setLinked([]); setRightSel([]); setClearAllOpen(false); toast.success("已解除全部关联"); }}>
                确定
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-background px-4 py-2 text-center min-w-[80px]">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function TransferColumn({
  title, total, selectedCount, search, onSearch, onToggleAll, items, selected, onToggle,
}: {
  title: string;
  total: number;
  selectedCount: number;
  search: string;
  onSearch: (v: string) => void;
  onToggleAll: () => void;
  items: LinkedCompany[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const allChecked = items.length > 0 && selectedCount === items.length;
  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-2">
        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
          <Checkbox checked={allChecked} onCheckedChange={onToggleAll} />
          {title}
        </label>
        <span className="text-xs text-muted-foreground">{selectedCount}/{total}</span>
      </div>
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search} onChange={(e) => onSearch(e.target.value)}
            placeholder="搜索公司名称或编码"
            className="pl-8 h-8"
          />
        </div>
      </div>
      <Separator className="hidden" />
      <div className="max-h-[280px] overflow-y-auto">
        {items.map((c) => (
          <label
            key={c.id}
            className="flex items-start gap-2 px-3 py-2 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
          >
            <Checkbox
              checked={selected.includes(c.id)}
              onCheckedChange={() => onToggle(c.id)}
              className="mt-0.5"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{c.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono text-muted-foreground truncate">{c.code}</span>
                {c.enabled && (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 text-[10px] px-1.5 py-0">
                    已启用
                  </Badge>
                )}
              </div>
            </div>
          </label>
        ))}
        {items.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">暂无数据</div>
        )}
      </div>
    </div>
  );
}
