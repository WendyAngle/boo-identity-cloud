import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  RotateCcw,
  Copy,
  Settings,
  KeyRound,
  Power,
  Trash2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Route = createFileRoute("/apps/oauth-clients")({
  head: () => ({
    meta: [
      { title: "OAuth Client管理 — Boo Identity Cloud" },
      { name: "description", content: "维护 OAuth Client 凭据、回调地址与授权范围。" },
    ],
  }),
  component: OAuthClientsPage,
});

type ClientStatus = "enabled" | "disabled";
type GrantType = "authorization_code" | "refresh_token" | "client_credentials" | "password" | "implicit";

interface OAuthClient {
  id: number;
  name: string;
  description: string;
  icon?: string;
  clientId: string;
  audience: string;
  callback: string;
  grants: GrantType[];
  accessTtl: number;
  refreshTtl: number;
  status: ClientStatus;
}

const GRANT_OPTIONS: { value: GrantType; label: string }[] = [
  { value: "authorization_code", label: "authorization_code" },
  { value: "refresh_token", label: "refresh_token" },
  { value: "client_credentials", label: "client_credentials" },
  { value: "password", label: "password" },
  { value: "implicit", label: "implicit" },
];

const INITIAL: OAuthClient[] = [
  { id: 25, name: "出海神器pad服务", description: "出海神器pad服务", icon: "🪄", clientId: "overseas_pad_svc", audience: "overseas_pad_svc", callback: "https://overseas.boohigh.com/auth/callback", grants: ["authorization_code", "refresh_token"], accessTtl: 7200, refreshTtl: 604800, status: "enabled" },
  { id: 24, name: "atlas-dev02", description: "atlas-dev02", icon: "🗺️", clientId: "atlas-dev02", audience: "atlas-dev02", callback: "http://192.168.200.253:8080/auth/callback", grants: ["authorization_code", "refresh_token"], accessTtl: 7200, refreshTtl: 604800, status: "enabled" },
  { id: 23, name: "atlas-test", description: "atlas-test", icon: "🗺️", clientId: "atlas-test", audience: "atlas-test", callback: "http://172.31.11.122:18080/auth/callback", grants: ["authorization_code", "refresh_token"], accessTtl: 7200, refreshTtl: 604800, status: "enabled" },
  { id: 22, name: "积分系统", description: "积分系统", icon: "🪙", clientId: "boo-points-test", audience: "api-gateway-dev", callback: "https://172.30.11.152", grants: ["authorization_code", "refresh_token"], accessTtl: 7200, refreshTtl: 604800, status: "enabled" },
  { id: 21, name: "业务运营自动驾驶-测试", description: "业务运营自动驾驶-测试", icon: "🚗", clientId: "boopilot-bff-test", audience: "api-gateway-dev", callback: "https://172.30.11.187:8443/bff/bff/callback", grants: ["authorization_code", "refresh_token"], accessTtl: 7200, refreshTtl: 604800, status: "enabled" },
  { id: 20, name: "认证中心后台", description: "151认证中心测试环境后台BFF, client_secret", clientId: "sso-admin-bff", audience: "iam-login-app", callback: "http://172.30.11.151:9000/bff/bff/callback", grants: ["authorization_code", "refresh_token"], accessTtl: 7200, refreshTtl: 604800, status: "enabled" },
  { id: 19, name: "业务运营自动驾驶", description: "业务运营自动驾驶", icon: "🚗", clientId: "boopilot-bff-dev", audience: "api-gateway-dev", callback: "https://192.168.110.37:8090/bff/bff/callback", grants: ["authorization_code", "refresh_token"], accessTtl: 7200, refreshTtl: 604800, status: "enabled" },
  { id: 16, name: "atlas-dev", description: "企业数据hub", icon: "🧊", clientId: "atlas-dev", audience: "atlas-dev", callback: "http://192.168.110.23:8080/auth/callback", grants: ["authorization_code", "refresh_token"], accessTtl: 7200, refreshTtl: 604800, status: "enabled" },
  { id: 15, name: "GTS业务系统", description: "GTS-prod第三方业务系统开发环境", icon: "🧰", clientId: "gts-prod-bff", audience: "gts-prod-bff", callback: "http://172.31.11.101/gts/bff/callback", grants: ["authorization_code", "refresh_token"], accessTtl: 7200, refreshTtl: 604800, status: "enabled" },
  { id: 14, name: "统一身份认证管理端", description: "认证中心管理端 BFF Client, client_secret", clientId: "iam-login-bff-test", audience: "iam-login-app", callback: "http://172.30.11.178/sso/bff/callback", grants: ["authorization_code", "refresh_token"], accessTtl: 7200, refreshTtl: 604800, status: "enabled" },
  { id: 13, name: "移动办公门户", description: "员工移动端统一入口", icon: "📱", clientId: "mobile-portal", audience: "api-gateway-dev", callback: "https://mobile.example.com/auth/callback", grants: ["authorization_code", "refresh_token"], accessTtl: 7200, refreshTtl: 604800, status: "disabled" },
  { id: 12, name: "数据分析平台", description: "BI 分析工具集成", icon: "📊", clientId: "bi-platform", audience: "bi-gateway", callback: "https://bi.example.com/oauth/callback", grants: ["authorization_code"], accessTtl: 7200, refreshTtl: 604800, status: "enabled" },
];

const PAGE_SIZE = 10;

function OAuthClientsPage() {
  const [clients, setClients] = useState<OAuthClient[]>(INITIAL);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"all" | ClientStatus>("all");
  const [applied, setApplied] = useState({ keyword: "", status: "all" as "all" | ClientStatus });
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<OAuthClient | null>(null);
  const [resetTarget, setResetTarget] = useState<OAuthClient | null>(null);
  const [toggleTarget, setToggleTarget] = useState<OAuthClient | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OAuthClient | null>(null);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (applied.keyword && !c.name.toLowerCase().includes(applied.keyword.toLowerCase()) && !c.clientId.toLowerCase().includes(applied.keyword.toLowerCase())) return false;
      if (applied.status !== "all" && c.status !== applied.status) return false;
      return true;
    });
  }, [clients, applied]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const doSearch = () => { setApplied({ keyword, status }); setPage(1); };
  const doReset = () => { setKeyword(""); setStatus("all"); setApplied({ keyword: "", status: "all" }); setPage(1); };

  const handleCopy = (val: string, field: string) => {
    navigator.clipboard.writeText(val).catch(() => {});
    toast.success(`${field} 已复制`);
  };

  const handleCreate = (data: OAuthClient) => {
    const nextId = Math.max(...clients.map((c) => c.id), 0) + 1;
    setClients([{ ...data, id: nextId }, ...clients]);
    toast.success("应用接入成功，密钥已生成并展示一次，请及时保存");
    setCreateOpen(false);
  };

  const handleSaveEdit = (data: OAuthClient) => {
    setClients(clients.map((c) => (c.id === data.id ? data : c)));
    toast.success("配置已保存");
    setEditing(null);
  };

  const handleReset = () => {
    if (!resetTarget) return;
    toast.success(`${resetTarget.name} 的 CLIENT SECRET 已重置`);
    setResetTarget(null);
  };

  const handleToggle = () => {
    if (!toggleTarget) return;
    setClients(clients.map((c) => (c.id === toggleTarget.id ? { ...c, status: c.status === "enabled" ? "disabled" : "enabled" } : c)));
    toast.success(toggleTarget.status === "enabled" ? "应用已禁用" : "应用已启用");
    setToggleTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setClients(clients.filter((c) => c.id !== deleteTarget.id));
    toast.success("应用已删除");
    setDeleteTarget(null);
  };

  return (
    <AppShell>
      <TooltipProvider delayDuration={200}>
        <div className="space-y-5">
          {/* Hero */}
          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-teal-500/10 p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-sky-600" />
                  <h1 className="text-xl font-semibold">OAuth Client 管理</h1>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">管理接入认证中心的 OAuth 客户端凭据、回调地址与授权范围，重置密钥后旧密钥立即失效。</p>
              </div>
              <div className="flex gap-6 text-sm">
                <Stat label="已接入应用" value={clients.length} tone="sky" />
                <Stat label="已启用" value={clients.filter((c) => c.status === "enabled").length} tone="emerald" />
                <Stat label="已停用" value={clients.filter((c) => c.status === "disabled").length} tone="slate" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground w-16 text-right">应用名称：</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜索应用名称..." className="pl-8 w-72" onKeyDown={(e) => e.key === "Enter" && doSearch()} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground w-16 text-right">状态：</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                  <SelectTrigger className="w-56"><SelectValue placeholder="全部状态" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="enabled">已启用</SelectItem>
                    <SelectItem value="disabled">已停用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="ml-auto flex gap-2">
                <Button onClick={doSearch} className="bg-sky-600 hover:bg-sky-700 text-white"><Search className="h-4 w-4 mr-1" />搜索</Button>
                <Button variant="outline" onClick={doReset}><RotateCcw className="h-4 w-4 mr-1" />重置</Button>
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">应用管理</h2>
              <Button onClick={() => setCreateOpen(true)} className="bg-sky-600 hover:bg-sky-700 text-white"><Plus className="h-4 w-4 mr-1" />接入新应用</Button>
            </div>

            {paged.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">暂无符合条件的应用</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {paged.map((c) => (
                  <ClientCard
                    key={c.id}
                    client={c}
                    onCopy={handleCopy}
                    onConfig={() => setEditing(c)}
                    onReset={() => setResetTarget(c)}
                    onToggle={() => setToggleTarget(c)}
                    onDelete={() => setDeleteTarget(c)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-5 flex items-center justify-end gap-3 text-sm text-muted-foreground">
              <span>共 {filtered.length} 条</span>
              <Select value="10" onValueChange={() => {}}>
                <SelectTrigger className="h-8 w-24"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10条/页</SelectItem>
                  <SelectItem value="20">20条/页</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="outline" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                  <Button key={p} size="sm" variant={p === currentPage ? "default" : "outline"} className={`h-8 w-8 p-0 ${p === currentPage ? "bg-sky-600 hover:bg-sky-700" : ""}`} onClick={() => setPage(p)}>{p}</Button>
                ))}
                <Button size="icon" variant="outline" className="h-8 w-8" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
              <span>前往</span>
              <Input className="h-8 w-14 text-center" defaultValue={currentPage} onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = Number((e.target as HTMLInputElement).value);
                  if (v >= 1 && v <= pageCount) setPage(v);
                }
              }} />
              <span>页</span>
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <ClientFormDialog
          key={createOpen ? "create" : "closed-create"}
          mode="create"
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={handleCreate}
        />
        <ClientFormDialog
          key={editing?.id ?? "closed-edit"}
          mode="edit"
          open={!!editing}
          initial={editing ?? undefined}
          onOpenChange={(v) => !v && setEditing(null)}
          onSubmit={handleSaveEdit}
        />

        <AlertDialog open={!!resetTarget} onOpenChange={(v) => !v && setResetTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" />重置密钥</AlertDialogTitle>
              <AlertDialogDescription>
                确认重置 <span className="font-medium text-foreground">{resetTarget?.name}</span> 的 CLIENT SECRET 吗？重置后旧密钥会立即失效，需要同步更新对接方配置。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset} className="bg-sky-600 hover:bg-sky-700">确认重置</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!toggleTarget} onOpenChange={(v) => !v && setToggleTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" />提示</AlertDialogTitle>
              <AlertDialogDescription>
                {toggleTarget?.status === "enabled" ? "确认禁用该应用吗？" : "确认启用该应用吗？"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleToggle} className="bg-sky-600 hover:bg-sky-700">确定</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" />提示</AlertDialogTitle>
              <AlertDialogDescription>确认删除该应用吗？</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-sky-600 hover:bg-sky-700">确定</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TooltipProvider>
    </AppShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "sky" | "emerald" | "slate" }) {
  const color = tone === "sky" ? "text-sky-600" : tone === "emerald" ? "text-emerald-600" : "text-slate-600";
  return (
    <div className="flex flex-col items-end">
      <span className={`text-2xl font-semibold ${color}`}>{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function ClientCard({
  client, onCopy, onConfig, onReset, onToggle, onDelete,
}: {
  client: OAuthClient;
  onCopy: (val: string, field: string) => void;
  onConfig: () => void;
  onReset: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const disabled = client.status === "disabled";
  return (
    <div className={`rounded-xl border bg-card p-4 flex flex-col gap-3 transition ${disabled ? "opacity-70" : "hover:shadow-md"}`}>
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
          {client.icon ?? "🔐"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <div className="font-medium truncate">{client.name}</div>
            {disabled && <Badge variant="outline" className="text-xs">已停用</Badge>}
          </div>
          <div className="text-xs text-muted-foreground truncate">{client.description}</div>
        </div>
        <button className="text-muted-foreground hover:text-foreground shrink-0" title="打开详情">
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <ReadonlyRow label="CLIENT ID (客户端ID)" value={client.clientId} onCopy={() => onCopy(client.clientId, "Client ID")} />
      <ReadonlyRow label="TOKEN AUDIENCE (资源服务标识)" value={client.audience} onCopy={() => onCopy(client.audience, "Token Audience")} />
      <ReadonlyRow label="CLIENT SECRET (密钥)" value="已设置，不可查看" muted />
      <ReadonlyRow label="CALLBACK URL (回调地址)" value={client.callback} onCopy={() => onCopy(client.callback, "回调地址")} />

      <div className="mt-1 pt-3 border-t flex items-center justify-between text-xs">
        <span className="text-muted-foreground">ID: {client.id}</span>
        <div className="flex items-center gap-2">
          <button onClick={onConfig} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <Settings className="h-3.5 w-3.5" />配置
          </button>
          <button onClick={onReset} className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700">
            <RotateCcw className="h-3.5 w-3.5" />重置密钥
          </button>
          <button onClick={onToggle} className={`inline-flex items-center gap-1 ${disabled ? "text-emerald-600 hover:text-emerald-700" : "text-rose-500 hover:text-rose-600"}`} title={disabled ? "启用" : "停用"}>
            <Power className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} className="inline-flex items-center text-rose-500 hover:text-rose-600" title="删除">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReadonlyRow({ label, value, onCopy, muted }: { label: string; value: string; onCopy?: () => void; muted?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase mb-1">{label}</div>
      <div className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1.5">
        <span className={`text-xs truncate flex-1 ${muted ? "text-muted-foreground" : ""}`}>{value}</span>
        {onCopy && (
          <button onClick={onCopy} className="text-muted-foreground hover:text-foreground shrink-0" title="复制">
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function emptyClient(): OAuthClient {
  return {
    id: 0, name: "", description: "", icon: "",
    clientId: "", audience: "", callback: "",
    grants: ["authorization_code", "refresh_token"],
    accessTtl: 7200, refreshTtl: 604800, status: "enabled",
  };
}

function ClientFormDialog({
  mode, open, onOpenChange, onSubmit, initial,
}: {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: OAuthClient) => void;
  initial?: OAuthClient;
}) {
  const [form, setForm] = useState<OAuthClient>(initial ?? emptyClient());
  const isCreate = mode === "create";

  const setField = <K extends keyof OAuthClient>(k: K, v: OAuthClient[K]) => setForm((f) => ({ ...f, [k]: v }));

  const toggleGrant = (g: GrantType) => {
    setForm((f) => ({
      ...f,
      grants: f.grants.includes(g) ? f.grants.filter((x) => x !== g) : [...f.grants, g],
    }));
  };

  const canSubmit = form.name.trim() && form.description.trim() && form.callback.trim() && (isCreate ? form.clientId.trim() : true) && form.grants.length > 0;

  const submit = () => {
    if (!canSubmit) { toast.error("请完善必填字段"); return; }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isCreate ? "接入新应用" : "配置应用"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Left */}
          <div className="space-y-4">
            <Field label="应用 ID">
              <Input disabled value={isCreate ? "" : String(form.id)} placeholder="自动生成" />
            </Field>
            <Field label="应用名称" required>
              <div className="relative">
                <Input value={form.name} maxLength={50} onChange={(e) => setField("name", e.target.value)} placeholder="最长 50 个字符" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{form.name.length} / 50</span>
              </div>
            </Field>
            <Field label="应用图标" required>
              <div className="flex items-start gap-3">
                <button type="button" className="h-20 w-20 rounded-md border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-muted-foreground hover:border-sky-500 hover:text-sky-600 text-2xl">
                  {form.icon ? <span>{form.icon}</span> : <ImagePlus className="h-5 w-5" />}
                  {!form.icon && <span className="text-[10px] mt-1">请上传图标</span>}
                </button>
                <div className="text-xs text-muted-foreground pt-1">支持 .jpg, .png 格式，最大 2M</div>
              </div>
            </Field>
            <Field label="应用描述" required>
              <div className="relative">
                <Textarea value={form.description} maxLength={200} onChange={(e) => setField("description", e.target.value)} placeholder="最长 200 个字符" rows={5} />
                <span className="absolute right-2 bottom-2 text-xs text-muted-foreground">{form.description.length} / 200</span>
              </div>
            </Field>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <Field label="CLIENT ID" required>
              <div className="relative">
                <Input value={form.clientId} disabled={!isCreate} maxLength={100} onChange={(e) => setField("clientId", e.target.value)} placeholder="请输入CLIENT ID" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{form.clientId.length} / 100</span>
              </div>
            </Field>
            <Field label="TOKEN AUDIENCE / 资源服务标识" hint="供资源服务器校验 JWT aud claim">
              <div className="relative">
                <Input value={form.audience} maxLength={255} onChange={(e) => setField("audience", e.target.value)} placeholder="例如 atlas-test 或 api-gateway-dev" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{form.audience.length} / 255</span>
              </div>
            </Field>
            <div className="rounded-md bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 px-3 py-2 text-xs text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              {isCreate ? "密钥将自动生成，并只展示一次。" : "密钥不可查看；忘记时在列表中重置。"}
            </div>
            <Field label="CALLBACK URL" required>
              <div className="relative">
                <Input value={form.callback} maxLength={500} onChange={(e) => setField("callback", e.target.value)} placeholder="https://example.com/callback1, https://example.com/callback2" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{form.callback.length} / 500</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">支持多个回调地址，用英文逗号分隔。</p>
            </Field>
            <Field label="授权模式" required hint="OAuth 2.0 支持的授权流程">
              <Select value="__multi" onValueChange={(v) => v !== "__multi" && toggleGrant(v as GrantType)}>
                <SelectTrigger className="h-auto min-h-10 py-1.5">
                  <div className="flex flex-wrap gap-1">
                    {form.grants.length === 0 ? <span className="text-muted-foreground text-sm">请选择授权模式</span> : form.grants.map((g) => (
                      <Badge key={g} variant="secondary" className="gap-1">
                        {g}
                        <button type="button" onClick={(e) => { e.stopPropagation(); toggleGrant(g); }} className="hover:text-foreground">×</button>
                      </Badge>
                    ))}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {GRANT_OPTIONS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      <span className={form.grants.includes(g.value) ? "font-medium text-sky-600" : ""}>{g.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="ACCESS TOKEN 过期时间" required hint="单位：秒">
              <Input type="number" value={form.accessTtl} onChange={(e) => setField("accessTtl", Number(e.target.value))} />
            </Field>
            <Field label="REFRESH TOKEN 过期时间" required hint="单位：秒">
              <Input type="number" value={form.refreshTtl} onChange={(e) => setField("refreshTtl", Number(e.target.value))} />
            </Field>
            <Field label="启用状态">
              <div className="flex items-center gap-2">
                <Switch checked={form.status === "enabled"} onCheckedChange={(v) => setField("status", v ? "enabled" : "disabled")} />
                <span className="text-sm">{form.status === "enabled" ? "已启用" : "已停用"}</span>
              </div>
            </Field>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={submit} className="bg-sky-600 hover:bg-sky-700 text-white">{isCreate ? "确认接入" : "保存配置"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm mb-1.5 flex items-center gap-1">
        {required && <span className="text-rose-500">*</span>}
        {label}
        {hint && (
          <Tooltip>
            <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
            <TooltipContent>{hint}</TooltipContent>
          </Tooltip>
        )}
      </Label>
      {children}
    </div>
  );
}
