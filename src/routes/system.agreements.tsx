import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  Plus,
  AlertTriangle,
  X,
  Bold,
  Italic,
  Underline,
  Quote,
  List,
  ListOrdered,
  ListChecks,
  AlignLeft,
  Smile,
  Link2,
  Image as ImageIcon,
  Video,
  Table as TableIcon,
  Code,
  Undo2,
  Redo2,
  Maximize2,
  Palette,
  Highlighter,
  MoreHorizontal,
  Indent,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/system/agreements")({
  head: () => ({
    meta: [
      { title: "协议与声明配置 — Boo Identity Cloud" },
      { name: "description", content: "统一维护认证中心协议、免责声明、承诺书等全局文案。" },
    ],
  }),
  component: AgreementsPage,
});

type Scope = "全局" | "企业认证" | "登录";
type Status = "启用" | "停用";

interface Statement {
  id: string;
  name: string;
  code: string;
  dialogTitle: string;
  scope: Scope;
  status: Status;
  version: number;
  updatedAt: string;
  content: string;
  remark: string;
}

const initial: Statement[] = [
  {
    id: "1",
    name: "企业认证免责声明",
    code: "enterprise_certification_disclaimer",
    dialogTitle: "悦意出海产品使用承诺函",
    scope: "全局",
    status: "启用",
    version: 2,
    updatedAt: "2026-07-07 09:01:14",
    content:
      "PAD跨境商务终端服务免责声明、使用人合规承诺及点数充值规则\n\n重要提示：\n\n本声明、承诺及规则适用于成都博海悦意科技有限公司及/或其关联运营主体、合作服务主体、技术支持主体提供的PAD跨境商务终端、系统软件、客户线索点数服务、海外客户开发辅助服务、海外社媒商务建联辅助服务、跨境营销内容辅助服务、客户关系管理服务及其他相关配套服务。\n\n本PAD跨境商务终端仅限用于合法、合规、真实、正当的跨境商务获客、海外客户建联、企业出海运营、客户关系管理、海外市场信息查询、商务内容辅助生成及相关业务管理用途。使用人不得将本PAD用于任何非法网络访问、非约定商务用途、私人娱乐用途、违法违规营销、侵犯第三方权益、规避监管、非法数据采集、虚假宣传、骚扰营销、欺诈交易或其他违法违规行为。",
    remark: "企业认证页全局免责声明",
  },
];

function AgreementsPage() {
  const [rows, setRows] = useState<Statement[]>(initial);
  const [qName, setQName] = useState("");
  const [qCode, setQCode] = useState("");
  const [qStatus, setQStatus] = useState<"全部" | Status>("全部");
  const [filters, setFilters] = useState({ name: "", code: "", status: "全部" as "全部" | Status });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Statement | null>(null);
  const [preview, setPreview] = useState<Statement | null>(null);
  const [toggleTarget, setToggleTarget] = useState<Statement | null>(null);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (!filters.name || r.name.includes(filters.name)) &&
          (!filters.code || r.code.includes(filters.code)) &&
          (filters.status === "全部" || r.status === filters.status),
      ),
    [rows, filters],
  );

  const handleSearch = () => setFilters({ name: qName, code: qCode, status: qStatus });
  const handleReset = () => {
    setQName(""); setQCode(""); setQStatus("全部");
    setFilters({ name: "", code: "", status: "全部" });
  };

  const handleSave = (data: Statement) => {
    setRows((prev) => {
      const exists = prev.some((r) => r.id === data.id);
      if (exists) return prev.map((r) => (r.id === data.id ? { ...data, version: r.version + 1, updatedAt: nowStr() } : r));
      return [{ ...data, id: String(Date.now()), version: 1, updatedAt: nowStr() }, ...prev];
    });
    toast.success(editing ? "已保存" : "已新增声明");
    setFormOpen(false);
    setEditing(null);
  };

  const handleToggle = () => {
    if (!toggleTarget) return;
    setRows((prev) => prev.map((r) => (r.id === toggleTarget.id ? { ...r, status: r.status === "启用" ? "停用" : "启用", updatedAt: nowStr() } : r)));
    toast.success(toggleTarget.status === "启用" ? "已停用" : "已启用");
    setToggleTarget(null);
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="rounded-2xl bg-white shadow-sm border border-border/60">
          <div className="flex items-start justify-between p-6 pb-4">
            <div>
              <h1 className="text-lg font-semibold text-foreground">协议与声明配置</h1>
              <p className="text-sm text-muted-foreground mt-1">统一维护认证中心协议、免责声明、承诺书等全局文案。</p>
            </div>
            <Button
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-sm"
              onClick={() => { setEditing(null); setFormOpen(true); }}
            >
              <Plus className="w-4 h-4 mr-1" /> 新增声明
            </Button>
          </div>

          <div className="px-6 pb-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground w-16 text-right">声明名称</Label>
              <Input value={qName} onChange={(e) => setQName(e.target.value)} placeholder="请输入声明名称" className="w-56" />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground w-16 text-right">声明编码</Label>
              <Input value={qCode} onChange={(e) => setQCode(e.target.value)} placeholder="请输入声明编码" className="w-56" />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground w-10 text-right">状态</Label>
              <Select value={qStatus} onValueChange={(v) => setQStatus(v as any)}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  <SelectItem value="启用">启用</SelectItem>
                  <SelectItem value="停用">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} className="bg-teal-500 hover:bg-teal-600 text-white">
              <Search className="w-4 h-4 mr-1" /> 搜索
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" /> 重置
            </Button>
          </div>

          <div className="px-6 pb-6">
            <div className="border border-border/60 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>声明名称</TableHead>
                    <TableHead>声明编码</TableHead>
                    <TableHead>作用范围</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>版本</TableHead>
                    <TableHead>更新时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.name}</TableCell>
                      <TableCell className="font-mono text-xs">{r.code}</TableCell>
                      <TableCell>{r.scope}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "font-normal",
                          r.status === "启用"
                            ? "bg-green-50 text-green-600 hover:bg-green-50 border-green-200"
                            : "bg-muted text-muted-foreground hover:bg-muted border-border"
                        )}>
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{r.version}</TableCell>
                      <TableCell className="text-muted-foreground">{r.updatedAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 text-sm">
                          <button className="text-teal-600 hover:underline" onClick={() => setPreview(r)}>预览</button>
                          <button className="text-teal-600 hover:underline" onClick={() => { setEditing(r); setFormOpen(true); }}>编辑</button>
                          <button
                            className={r.status === "启用" ? "text-orange-500 hover:underline" : "text-green-600 hover:underline"}
                            onClick={() => setToggleTarget(r)}
                          >
                            {r.status === "启用" ? "停用" : "启用"}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">暂无数据</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4 text-sm text-muted-foreground">
              <span>共 {filtered.length} 条</span>
              <Select defaultValue="10"><SelectTrigger className="w-24 h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10条/页</SelectItem>
                  <SelectItem value="20">20条/页</SelectItem>
                  <SelectItem value="50">50条/页</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>‹</Button>
              <Button size="sm" className="h-8 w-8 p-0 bg-teal-500 hover:bg-teal-600 text-white">1</Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>›</Button>
              <span>前往</span>
              <Input defaultValue="1" className="w-14 h-8" />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>

      <StatementFormDialog
        open={formOpen}
        onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null); }}
        initial={editing}
        onSave={handleSave}
      />

      <PreviewDialog statement={preview} onClose={() => setPreview(null)} />

      <AlertDialog open={!!toggleTarget} onOpenChange={(o) => !o && setToggleTarget(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">状态变更确认</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex items-start gap-3 py-2">
            <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <p className="text-sm">
              确认{toggleTarget?.status === "启用" ? "停用" : "启用"}"{toggleTarget?.name}"吗？
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggle} className="bg-teal-500 hover:bg-teal-600">
              {toggleTarget?.status === "启用" ? "停用" : "启用"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function nowStr() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function CountedInput({ value, onChange, max, placeholder }: { value: string; onChange: (v: string) => void; max: number; placeholder?: string }) {
  return (
    <div className="relative">
      <Input value={value} onChange={(e) => onChange(e.target.value.slice(0, max))} placeholder={placeholder} className="pr-16" />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{value.length} / {max}</span>
    </div>
  );
}

function StatementFormDialog({
  open, onOpenChange, initial, onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: Statement | null;
  onSave: (s: Statement) => void;
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [scope, setScope] = useState<Scope>("全局");
  const [enabled, setEnabled] = useState(true);
  const [content, setContent] = useState("");
  const [remark, setRemark] = useState("");

  useMemo(() => {
    if (open) {
      setName(initial?.name ?? "");
      setCode(initial?.code ?? "");
      setDialogTitle(initial?.dialogTitle ?? "");
      setScope(initial?.scope ?? "全局");
      setEnabled(initial ? initial.status === "启用" : true);
      setContent(initial?.content ?? "");
      setRemark(initial?.remark ?? "");
    }
  }, [open, initial]);

  const submit = () => {
    if (!name.trim() || !code.trim() || !dialogTitle.trim()) {
      toast.error("请填写必填项"); return;
    }
    onSave({
      id: initial?.id ?? "",
      name, code, dialogTitle, scope,
      status: enabled ? "启用" : "停用",
      version: initial?.version ?? 1,
      updatedAt: initial?.updatedAt ?? nowStr(),
      content, remark,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-base">{initial ? "编辑协议与声明" : "新增协议与声明"}</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <FormRow label="声明名称" required>
            <CountedInput value={name} onChange={setName} max={128} placeholder="例如：企业认证免责声明" />
          </FormRow>
          <FormRow label="声明编码" required>
            <CountedInput value={code} onChange={setCode} max={64} placeholder="例如：enterprise_certification_disclaimer" />
          </FormRow>
          <FormRow label="弹窗标题" required>
            <CountedInput value={dialogTitle} onChange={setDialogTitle} max={128} placeholder="例如：企业实名认证免责声明" />
          </FormRow>
          <FormRow label="作用范围" required>
            <Select value={scope} onValueChange={(v) => setScope(v as Scope)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="全局">全局</SelectItem>
                <SelectItem value="企业认证">企业认证</SelectItem>
                <SelectItem value="登录">登录</SelectItem>
              </SelectContent>
            </Select>
          </FormRow>
          <FormRow label="是否启用">
            <div className="flex items-center gap-2">
              <Switch checked={enabled} onCheckedChange={setEnabled} className="data-[state=checked]:bg-teal-500" />
              <span className="text-sm text-muted-foreground">{enabled ? "启用" : "停用"}</span>
            </div>
          </FormRow>
          <FormRow label="声明内容">
            <div className="border rounded-md overflow-hidden">
              <RichToolbar />
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请输入需要用户阅读的协议或免责声明内容"
                className="min-h-[240px] border-0 rounded-none resize-none focus-visible:ring-0"
              />
            </div>
          </FormRow>
          <FormRow label="备注">
            <div className="relative">
              <Textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value.slice(0, 255))}
                placeholder="可填写内部维护说明"
                className="min-h-[70px] pr-16"
              />
              <span className="absolute right-3 bottom-2 text-xs text-muted-foreground">{remark.length} / 255</span>
            </div>
          </FormRow>
        </div>
        <DialogFooter className="px-6 py-3 border-t bg-muted/30">
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={submit} className="bg-teal-500 hover:bg-teal-600 text-white">保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
      <Label className="text-sm text-foreground pt-2 text-right">
        {required && <span className="text-red-500 mr-0.5">*</span>}{label}
      </Label>
      <div>{children}</div>
    </div>
  );
}

function RichToolbar() {
  const IconBtn = ({ children }: { children: React.ReactNode }) => (
    <button type="button" className="h-7 w-7 inline-flex items-center justify-center text-muted-foreground hover:bg-muted rounded">
      {children}
    </button>
  );
  const Sep = () => <span className="w-px h-4 bg-border mx-1" />;
  const Dropdown = ({ label }: { label: string }) => (
    <button type="button" className="h-7 px-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:bg-muted rounded">
      {label} <span className="text-[10px]">▾</span>
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b bg-muted/30">
      <Dropdown label="正文" />
      <IconBtn><Quote className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><Bold className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><Underline className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><Italic className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><MoreHorizontal className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><Palette className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><Highlighter className="w-3.5 h-3.5" /></IconBtn>
      <Sep />
      <Dropdown label="默认字号" />
      <Dropdown label="默认字体" />
      <Dropdown label="默认行高" />
      <div className="w-full" />
      <IconBtn><List className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><ListOrdered className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><ListChecks className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><AlignLeft className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><Indent className="w-3.5 h-3.5" /></IconBtn>
      <Sep />
      <IconBtn><Smile className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><Link2 className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><ImageIcon className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><Video className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><TableIcon className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><Code className="w-3.5 h-3.5" /></IconBtn>
      <Sep />
      <IconBtn><Undo2 className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><Redo2 className="w-3.5 h-3.5" /></IconBtn>
      <IconBtn><Maximize2 className="w-3.5 h-3.5" /></IconBtn>
    </div>
  );
}

function PreviewDialog({ statement, onClose }: { statement: Statement | null; onClose: () => void }) {
  return (
    <Dialog open={!!statement} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-base">{statement?.dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-muted-foreground">{statement?.name}</span>
            <Badge className="bg-teal-50 text-teal-600 hover:bg-teal-50 border-teal-200 font-normal">v{statement?.version}</Badge>
          </div>
          <div className="border rounded-md p-5 max-h-[55vh] overflow-y-auto">
            <div className="text-center text-lg font-semibold mb-4 whitespace-pre-wrap">
              {statement?.content.split("\n")[0]}
            </div>
            <div className="text-sm leading-7 text-foreground whitespace-pre-wrap">
              {statement?.content.split("\n").slice(1).join("\n")}
            </div>
          </div>
        </div>
        <DialogFooter className="px-6 py-3 border-t bg-muted/30">
          <Button onClick={onClose} className="bg-teal-500 hover:bg-teal-600 text-white">关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
