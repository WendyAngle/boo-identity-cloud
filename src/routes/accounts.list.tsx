import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  RotateCcw,
  Smartphone,
  User,
  KeyRound,
  Link2,
  Pencil,
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Sparkles,
  Lock,
  AlertTriangle,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

export const Route = createFileRoute("/accounts/list")({
  head: () => ({
    meta: [
      { title: "认证账号列表 — Boo Identity Cloud" },
      { name: "description", content: "认证账号列表与公司绑定关系。" },
    ],
  }),
  component: AccountsListPage,
});

type Gender = "male" | "female" | "unknown";
type AccountStatus = "normal" | "disabled";
type Role = "admin" | "member";

interface CompanyBinding {
  name: string;
  role: Role;
  active: boolean;
}

interface Account {
  id: string;
  phone: string;
  email: string;
  nickname: string;
  gender: Gender;
  note: string;
  companies: CompanyBinding[];
  firstLoginMobile: boolean;
  firstLoginPc: boolean;
  status: AccountStatus;
  lastApp?: string;
  lastLoginAt?: string;
  loginCount?: number;
  registeredAt: string;
  highlight?: boolean;
}

const INITIAL_ACCOUNTS: Account[] = [
  { id: "1", phone: "18482244767", email: "1@qq.com", nickname: "", gender: "unknown", note: "", companies: [{ name: "博海悦意科技有限公司", role: "member", active: true }, { name: "成都云帆科技有限公司", role: "member", active: true }], firstLoginMobile: true, firstLoginPc: true, status: "normal", lastApp: "矩阵平台测试环境", lastLoginAt: "2026-07-21 14:55:46", loginCount: 2, registeredAt: "Invalid Date", highlight: true },
  { id: "2", phone: "13333333333", email: "", nickname: "", gender: "unknown", note: "", companies: [{ name: "成都青鹿数据科技有限公司", role: "member", active: true }], firstLoginMobile: true, firstLoginPc: true, status: "normal", lastApp: "atlas-dev", lastLoginAt: "2026-07-08 17:04:15", loginCount: 3, registeredAt: "Invalid Date" },
  { id: "3", phone: "18788888888", email: "ts@qq.com", nickname: "test", gender: "unknown", note: "", companies: [{ name: "成都云帆科技有限公司", role: "member", active: true }], firstLoginMobile: true, firstLoginPc: true, status: "normal", lastApp: "atlas-dev", lastLoginAt: "2026-07-07 17:38:48", loginCount: 2, registeredAt: "Invalid Date" },
  { id: "4", phone: "13800001111", email: "", nickname: "", gender: "unknown", note: "", companies: [{ name: "成都云帆科技有限公司", role: "member", active: true }], firstLoginMobile: true, firstLoginPc: true, status: "normal", registeredAt: "Invalid Date" },
  { id: "5", phone: "test-gts", email: "", nickname: "", gender: "unknown", note: "", companies: [{ name: "成都青鹿数据科技有限公司", role: "member", active: true }], firstLoginMobile: true, firstLoginPc: true, status: "normal", lastApp: "GTS业务系统BFF", lastLoginAt: "2026-07-21 18:09:52", loginCount: 11, registeredAt: "Invalid Date" },
  { id: "6", phone: "13988884444", email: "12@qq.com", nickname: "", gender: "male", note: "tetst", companies: [{ name: "未关联公司", role: "member", active: false }], firstLoginMobile: true, firstLoginPc: true, status: "normal", lastApp: "atlas-test", lastLoginAt: "2026-07-04 13:37:16", loginCount: 1, registeredAt: "Invalid Date" },
  { id: "7", phone: "13888888888", email: "", nickname: "", gender: "male", note: "", companies: [{ name: "博海悦意科技有限公司", role: "member", active: true }, { name: "成都青鹿数据科技有限公司", role: "member", active: true }], firstLoginMobile: true, firstLoginPc: true, status: "normal", lastApp: "atlas-test", lastLoginAt: "2026-07-06 09:42:55", loginCount: 65, registeredAt: "Invalid Date" },
  { id: "8", phone: "18602805152", email: "yf@qq.com", nickname: "", gender: "male", note: "", companies: [{ name: "自动化测试公司", role: "admin", active: true }, { name: "成都云帆科技有限公司", role: "member", active: true }, { name: "成都朗瀚智途科技有限公司", role: "member", active: true }, { name: "博海悦意科技有限公司", role: "member", active: true }], firstLoginMobile: true, firstLoginPc: true, status: "normal", lastApp: "业务运营自动驾驶-测试", lastLoginAt: "2026-07-22 09:42:28", loginCount: 273, registeredAt: "Invalid Date" },
  { id: "9", phone: "force_pwd_20260622170347", email: "force_pwd_20260622170347@example", nickname: "", gender: "unknown", note: "", companies: [{ name: "强制改密公司20260622170347", role: "member", active: true }], firstLoginMobile: true, firstLoginPc: true, status: "normal", registeredAt: "Invalid Date" },
  { id: "10", phone: "third_party_auth_20260622165047", email: "third_party_auth_202606221643248", nickname: "", gender: "unknown", note: "", companies: [{ name: "三方认证公司20260622165047", role: "member", active: true }], firstLoginMobile: true, firstLoginPc: true, status: "normal", registeredAt: "Invalid Date" },
];

// Extra rows for pagination realism
for (let i = 11; i <= 37; i++) {
  INITIAL_ACCOUNTS.push({
    id: String(i),
    phone: `1390000${String(1000 + i).padStart(4, "0")}`,
    email: i % 2 === 0 ? `user${i}@example.com` : "",
    nickname: i % 3 === 0 ? `user_${i}` : "",
    gender: i % 3 === 0 ? "female" : i % 3 === 1 ? "male" : "unknown",
    note: "",
    companies: [{ name: "成都云帆科技有限公司", role: "member", active: true }],
    firstLoginMobile: i % 2 === 0,
    firstLoginPc: i % 3 !== 0,
    status: i % 7 === 0 ? "disabled" : "normal",
    lastApp: "atlas-dev",
    lastLoginAt: "2026-07-10 10:00:00",
    loginCount: i,
    registeredAt: "Invalid Date",
  });
}

const PAGE_SIZE = 10;

function AccountsListPage() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [phoneQ, setPhoneQ] = useState("");
  const [companyQ, setCompanyQ] = useState("");
  const [statusQ, setStatusQ] = useState<"all" | AccountStatus>("all");
  const [expanded, setExpanded] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [applied, setApplied] = useState({ phone: "", company: "", status: "all" as "all" | AccountStatus, dateFrom: "", dateTo: "" });
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [resetPwdTarget, setResetPwdTarget] = useState<Account | null>(null);
  const [bindTarget, setBindTarget] = useState<Account | null>(null);
  const [disableTarget, setDisableTarget] = useState<Account | null>(null);

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      if (applied.phone) {
        const q = applied.phone.toLowerCase();
        if (!a.phone.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q)) return false;
      }
      if (applied.company && !a.companies.some((c) => c.name.toLowerCase().includes(applied.company.toLowerCase()))) return false;
      if (applied.status !== "all" && a.status !== applied.status) return false;
      return true;
    });
  }, [accounts, applied]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const doSearch = () => { setApplied({ phone: phoneQ, company: companyQ, status: statusQ, dateFrom, dateTo }); setPage(1); };
  const doReset = () => {
    setPhoneQ(""); setCompanyQ(""); setStatusQ("all"); setDateFrom(""); setDateTo("");
    setApplied({ phone: "", company: "", status: "all", dateFrom: "", dateTo: "" });
    setPage(1);
  };

  const handleCreate = (data: Partial<Account>) => {
    const id = String(Math.max(...accounts.map((a) => Number(a.id) || 0), 0) + 1);
    setAccounts([{
      id,
      phone: data.phone ?? "",
      email: data.email ?? "",
      nickname: data.nickname ?? "",
      gender: data.gender ?? "unknown",
      note: data.note ?? "",
      companies: [],
      firstLoginMobile: false,
      firstLoginPc: false,
      status: data.status ?? "normal",
      registeredAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      highlight: true,
    }, ...accounts]);
    toast.success("认证账号已创建");
    setCreateOpen(false);
  };

  const handleSaveEdit = (data: Account) => {
    setAccounts(accounts.map((a) => (a.id === data.id ? data : a)));
    toast.success("账号资料已更新");
    setEditing(null);
  };

  const handleDisable = () => {
    if (!disableTarget) return;
    setAccounts(accounts.map((a) => a.id === disableTarget.id ? { ...a, status: a.status === "normal" ? "disabled" : "normal" } : a));
    toast.success(disableTarget.status === "normal" ? `${disableTarget.phone} 已停用` : `${disableTarget.phone} 已启用`);
    setDisableTarget(null);
  };

  const handleBindSave = (companies: CompanyBinding[]) => {
    if (!bindTarget) return;
    setAccounts(accounts.map((a) => a.id === bindTarget.id ? { ...a, companies } : a));
    toast.success("绑定关系已保存");
    setBindTarget(null);
  };

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Filters */}
        <div className="rounded-xl border bg-card p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FilterCol label="登录手机号">
              <Input placeholder="搜索手机号/邮箱..." value={phoneQ} onChange={(e) => setPhoneQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doSearch()} />
            </FilterCol>
            <FilterCol label="所属公司">
              <Input placeholder="搜索公司名称/编码" value={companyQ} onChange={(e) => setCompanyQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doSearch()} />
            </FilterCol>
            <FilterCol label="状态">
              <Select value={statusQ} onValueChange={(v) => setStatusQ(v as typeof statusQ)}>
                <SelectTrigger><SelectValue placeholder="全部状态" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="normal">正常</SelectItem>
                  <SelectItem value="disabled">停用</SelectItem>
                </SelectContent>
              </Select>
            </FilterCol>
            {expanded && (
              <FilterCol label="注册时间">
                <div className="flex items-center gap-2">
                  <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="开始时间" />
                  <span className="text-muted-foreground text-sm">至</span>
                  <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="结束时间" />
                </div>
              </FilterCol>
            )}
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button onClick={doSearch} className="bg-teal-600 hover:bg-teal-700 text-white"><Search className="h-4 w-4 mr-1" />搜索</Button>
            <Button variant="outline" onClick={doReset}><RotateCcw className="h-4 w-4 mr-1" />重置</Button>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="text-teal-600 hover:text-teal-700">
              {expanded ? <>合并 <ChevronUp className="h-3.5 w-3.5 ml-1" /></> : <>展开 <ChevronDown className="h-3.5 w-3.5 ml-1" /></>}
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <Button onClick={() => setCreateOpen(true)} className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-sm">
            <Plus className="h-4 w-4 mr-1" />创建认证账号
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9" title="刷新" onClick={() => toast.success("列表已刷新")}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9" title="列设置">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="min-w-[160px]">登录手机号</TableHead>
                  <TableHead className="min-w-[220px]">所属公司</TableHead>
                  <TableHead className="w-16">性别</TableHead>
                  <TableHead className="min-w-[120px]">备注</TableHead>
                  <TableHead className="w-28">首次登录</TableHead>
                  <TableHead className="w-20">状态</TableHead>
                  <TableHead className="min-w-[200px]">最近活动</TableHead>
                  <TableHead className="w-32">注册时间</TableHead>
                  <TableHead className="min-w-[240px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-12 text-muted-foreground">暂无数据</TableCell></TableRow>
                ) : paged.map((a) => (
                  <TableRow key={a.id} className={a.highlight ? "bg-teal-50/60 dark:bg-teal-950/20" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar text={a.nickname || a.phone} />
                        <div className="min-w-0">
                          <div className="font-medium">{a.phone}</div>
                          <div className="text-xs text-muted-foreground truncate">{a.email || "--"}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {a.companies.map((c, i) => (
                          <Badge key={i} variant="outline" className={`gap-1 ${c.active ? "bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-300" : "text-muted-foreground"}`}>
                            {c.name}
                            <button className="hover:text-foreground opacity-60">×</button>
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{a.gender === "male" ? "男" : a.gender === "female" ? "女" : "--"}</TableCell>
                    <TableCell className="text-sm">{a.note || "--"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <IconBadge active={a.firstLoginMobile} icon={<Smartphone className="h-3.5 w-3.5" />} title="移动端首次登录" />
                        <IconBadge active={a.firstLoginPc} icon={<User className="h-3.5 w-3.5" />} title="PC端首次登录" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {a.status === "normal" ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300">正常</Badge>
                      ) : (
                        <Badge variant="outline" className="text-rose-500 border-rose-200">停用</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {a.lastLoginAt ? (
                        <div className="text-xs space-y-0.5">
                          <div className="text-foreground">{a.lastLoginAt}</div>
                          <div className="text-muted-foreground">应用: {a.lastApp}</div>
                          <div className="text-muted-foreground">累计登录: {a.loginCount} 次</div>
                        </div>
                      ) : <span className="text-muted-foreground text-sm">-</span>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.registeredAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-xs">
                        <button onClick={() => setResetPwdTarget(a)} className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700"><KeyRound className="h-3.5 w-3.5" />重置密码</button>
                        <button onClick={() => setBindTarget(a)} className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700"><Link2 className="h-3.5 w-3.5" />绑定公司</button>
                        <button onClick={() => setEditing(a)} className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700"><Pencil className="h-3.5 w-3.5" />编辑</button>
                        <button onClick={() => setDisableTarget(a)} className={`inline-flex items-center gap-1 ${a.status === "normal" ? "text-rose-500 hover:text-rose-600" : "text-emerald-600 hover:text-emerald-700"}`}>
                          {a.status === "normal" ? <><Ban className="h-3.5 w-3.5" />停用</> : <><CheckCircle2 className="h-3.5 w-3.5" />启用</>}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-3 px-4 py-3 border-t text-sm text-muted-foreground">
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
                <Button key={p} size="sm" variant={p === currentPage ? "default" : "outline"} className={`h-8 w-8 p-0 ${p === currentPage ? "bg-teal-600 hover:bg-teal-700" : ""}`} onClick={() => setPage(p)}>{p}</Button>
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

      {/* Create dialog */}
      <CreateAccountDialog key={createOpen ? "create-open" : "create-closed"} open={createOpen} onOpenChange={setCreateOpen} onSubmit={handleCreate} />

      {/* Edit dialog */}
      <EditAccountDialog key={editing?.id ?? "edit-closed"} account={editing} onClose={() => setEditing(null)} onSave={handleSaveEdit} />

      {/* Reset password dialog */}
      <ResetPasswordDialog key={resetPwdTarget?.id ?? "rp-closed"} account={resetPwdTarget} onClose={() => setResetPwdTarget(null)} />

      {/* Bind company dialog */}
      <BindCompanyDialog key={bindTarget?.id ?? "bind-closed"} account={bindTarget} onClose={() => setBindTarget(null)} onSave={handleBindSave} />

      {/* Disable confirm */}
      <AlertDialog open={!!disableTarget} onOpenChange={(v) => !v && setDisableTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" />提示</AlertDialogTitle>
            <AlertDialogDescription>
              {disableTarget?.status === "normal" ? `是否确认停用用户 ${disableTarget?.phone}？` : `是否确认启用用户 ${disableTarget?.phone}？`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDisable} className="bg-teal-600 hover:bg-teal-700">确定</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function FilterCol({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Label className="text-sm text-muted-foreground w-20 text-right shrink-0">{label}：</Label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Avatar({ text }: { text: string }) {
  const letter = (text?.trim()?.[0] || "?").toUpperCase();
  return (
    <div className="h-9 w-9 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center text-sm font-medium shrink-0 border border-teal-200 dark:border-teal-800">
      {letter}
    </div>
  );
}

function IconBadge({ active, icon, title }: { active: boolean; icon: React.ReactNode; title: string }) {
  return (
    <div title={title} className={`h-6 w-6 rounded flex items-center justify-center border ${active ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800" : "bg-muted text-muted-foreground border-muted-foreground/20"}`}>
      {icon}
    </div>
  );
}

/* ---------------- Create Dialog ---------------- */

function CreateAccountDialog({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (v: boolean) => void; onSubmit: (d: Partial<Account>) => void }) {
  const [form, setForm] = useState({
    phone: "", password: "", nickname: "", email: "", gender: "unknown" as Gender, note: "", status: "normal" as AccountStatus,
  });
  const setF = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const pwdOk = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,14}$/.test(form.password);
  const canSubmit = form.phone.trim() && pwdOk;

  const submit = () => {
    if (!form.phone.trim()) return toast.error("请输入登录手机号");
    if (!pwdOk) return toast.error("密码需 8-14 位并包含大小写字母、数字和特殊符号");
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>创建认证账号</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <Row label="登录手机号" required>
            <Input placeholder="请输入手机号" value={form.phone} onChange={(e) => setF("phone", e.target.value.replace(/[^\d]/g, "").slice(0, 11))} />
            <Hint>后续登录和身份确认都使用这个手机号。</Hint>
          </Row>
          <Row label="密码" required>
            <Input type="password" placeholder="请输入密码" value={form.password} onChange={(e) => setF("password", e.target.value)} />
            <Hint>密码规则：8-14 位，需包含大小写字母、数字和特殊符号。</Hint>
          </Row>
          <Row label="昵称">
            <CountInput value={form.nickname} onChange={(v) => setF("nickname", v)} max={128} placeholder="请输入昵称" />
            <Hint>最多 128 个字符。</Hint>
          </Row>
          <Row label="邮箱地址">
            <CountInput value={form.email} onChange={(v) => setF("email", v)} max={128} placeholder="例如: zhangsan@example.com" />
            <Hint>最多 128 个字符，请填写有效邮箱地址。</Hint>
          </Row>
          <Row label="性别">
            <Select value={form.gender} onValueChange={(v) => setF("gender", v as Gender)}>
              <SelectTrigger><SelectValue placeholder="请选择性别" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unknown">未知</SelectItem>
                <SelectItem value="male">男</SelectItem>
                <SelectItem value="female">女</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row label="备注">
            <div className="relative">
              <Textarea value={form.note} maxLength={255} onChange={(e) => setF("note", e.target.value)} placeholder="可选，填写账号用途、人员说明等" rows={3} />
              <span className="absolute right-2 bottom-2 text-xs text-muted-foreground">{form.note.length} / 255</span>
            </div>
          </Row>
          <Row label="账号状态" required>
            <Select value={form.status} onValueChange={(v) => setF("status", v as AccountStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">正常</SelectItem>
                <SelectItem value="disabled">停用</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button disabled={!canSubmit} onClick={submit} className="bg-teal-600 hover:bg-teal-700 text-white">确认创建</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Edit Dialog ---------------- */

function EditAccountDialog({ account, onClose, onSave }: { account: Account | null; onClose: () => void; onSave: (a: Account) => void }) {
  const [form, setForm] = useState<Account | null>(account);
  if (form?.id !== account?.id) setForm(account);
  if (!account || !form) return (
    <Dialog open={false} onOpenChange={onClose}><DialogContent /></Dialog>
  );

  return (
    <Dialog open={!!account} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>编辑账号资料</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <Row label="登录手机号" required>
            <Input disabled value={form.phone} />
            <Hint>后续登录和身份确认都使用这个手机号。</Hint>
          </Row>
          <Row label="昵称">
            <CountInput value={form.nickname} onChange={(v) => setForm({ ...form, nickname: v })} max={128} />
            <Hint>最多 128 个字符。</Hint>
          </Row>
          <Row label="邮箱地址">
            <CountInput value={form.email} onChange={(v) => setForm({ ...form, email: v })} max={128} />
            <Hint>最多 128 个字符，请填写有效邮箱地址。</Hint>
          </Row>
          <Row label="性别">
            <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v as Gender })}>
              <SelectTrigger><SelectValue placeholder="请选择性别" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unknown">未知</SelectItem>
                <SelectItem value="male">男</SelectItem>
                <SelectItem value="female">女</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row label="备注">
            <div className="relative">
              <Textarea value={form.note} maxLength={255} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="可选，填写账号用途、人员说明等" rows={3} />
              <span className="absolute right-2 bottom-2 text-xs text-muted-foreground">{form.note.length} / 255</span>
            </div>
          </Row>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={() => onSave(form)} className="bg-teal-600 hover:bg-teal-700 text-white">保存修改</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Reset Password Dialog ---------------- */

function ResetPasswordDialog({ account, onClose }: { account: Account | null; onClose: () => void }) {
  const [pwd, setPwd] = useState("");
  const generate = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const specials = "!@#$%^&*";
    let out = "";
    for (let i = 0; i < 12; i++) out += chars[Math.floor(Math.random() * chars.length)];
    out += specials[Math.floor(Math.random() * specials.length)];
    setPwd(out.split("").sort(() => Math.random() - 0.5).join(""));
  };
  const copy = () => { navigator.clipboard.writeText(pwd).catch(() => {}); toast.success("密码已复制"); };
  const confirm = () => {
    if (!pwd) return toast.error("请先生成新密码");
    toast.success(`${account?.phone} 的密码已重置`);
    setPwd(""); onClose();
  };

  return (
    <Dialog open={!!account} onOpenChange={(v) => !v && (setPwd(""), onClose())}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>重置密码</DialogTitle></DialogHeader>
        <div className="rounded-lg bg-muted/40 border p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-600">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">安全重置</div>
              <div className="text-xs text-muted-foreground">正在为用户 <span className="text-teal-600 font-medium">{account?.nickname || account?.phone}</span> 生成新的安全密码</div>
            </div>
          </div>
          <div className="rounded-md bg-card border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">新密码</div>
              {pwd && <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">高强度</Badge>}
            </div>
            <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
              <span className="flex-1 font-mono text-sm truncate">{pwd || <span className="text-muted-foreground font-sans">点击生成按钮获取新密码</span>}</span>
              {pwd && (
                <>
                  <button onClick={copy} className="text-muted-foreground hover:text-foreground"><Copy className="h-4 w-4" /></button>
                  <button onClick={generate} className="text-amber-500 hover:text-amber-600"><RefreshCw className="h-4 w-4" /></button>
                </>
              )}
            </div>
            {!pwd && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
                <AlertTriangle className="h-3.5 w-3.5" />建议生成后立即复制并妥善保存
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setPwd(""); onClose(); }}>取消</Button>
          {pwd ? (
            <Button onClick={confirm} className="bg-emerald-500 hover:bg-emerald-600 text-white"><CheckCircle2 className="h-4 w-4 mr-1" />确认重置</Button>
          ) : (
            <Button onClick={generate} className="bg-teal-600 hover:bg-teal-700 text-white"><Sparkles className="h-4 w-4 mr-1" />生成密码</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Bind Company Dialog ---------------- */

const AVAILABLE_COMPANIES = [
  "成都青鹿数据科技有限公司", "成都云帆科技有限公司", "博海悦意科技有限公司", "自动化测试公司",
  "成都朗瀚智途科技有限公司", "GTS业务测试公司", "矩阵平台测试公司", "认证中心测试公司",
];

function BindCompanyDialog({ account, onClose, onSave }: { account: Account | null; onClose: () => void; onSave: (list: CompanyBinding[]) => void }) {
  const [selected, setSelected] = useState("");
  const [role, setRole] = useState<Role>("admin");
  const [enabled, setEnabled] = useState(true);
  const [search, setSearch] = useState("");

  if (!account) return <Dialog open={false} onOpenChange={onClose}><DialogContent /></Dialog>;

  const matches = AVAILABLE_COMPANIES.filter((c) => c.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    if (!selected) return toast.error("请选择公司");
    if (account.companies.some((c) => c.name === selected)) return toast.error("该账号已绑定此公司");
    onSave([...account.companies, { name: selected, role, active: enabled }]);
    setSelected(""); setSearch(""); setRole("admin"); setEnabled(true);
  };

  return (
    <Dialog open={!!account} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>绑定公司</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
            <Avatar text={account.nickname || account.phone} />
            <div>
              <div className="font-medium">{account.phone}</div>
              <div className="text-xs text-muted-foreground">{account.nickname || account.email || "--"}</div>
            </div>
          </div>

          <Row label="选择公司" required>
            <div className="relative">
              <Input placeholder="输入公司名称或编码搜索" value={search} onChange={(e) => { setSearch(e.target.value); setSelected(""); }} />
              {search && !selected && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md max-h-52 overflow-auto">
                  {matches.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">无匹配公司</div>
                  ) : matches.map((c) => (
                    <button key={c} className="w-full text-left px-3 py-2 text-sm hover:bg-muted" onClick={() => { setSelected(c); setSearch(c); }}>
                      <Users className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />{c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Hint>绑定后，该账号可作为公司成员访问已授权产品。</Hint>
          </Row>

          <Row label="公司角色">
            <div className="inline-flex rounded-md border overflow-hidden">
              <button onClick={() => setRole("admin")} className={`px-4 py-1.5 text-sm ${role === "admin" ? "bg-teal-600 text-white" : "bg-card hover:bg-muted"}`}>管理员</button>
              <button onClick={() => setRole("member")} className={`px-4 py-1.5 text-sm ${role === "member" ? "bg-teal-600 text-white" : "bg-card hover:bg-muted"}`}>成员</button>
            </div>
          </Row>

          <Row label="成员状态">
            <div className="inline-flex rounded-md border overflow-hidden">
              <button onClick={() => setEnabled(true)} className={`px-4 py-1.5 text-sm ${enabled ? "bg-teal-600 text-white" : "bg-card hover:bg-muted"}`}>启用</button>
              <button onClick={() => setEnabled(false)} className={`px-4 py-1.5 text-sm ${!enabled ? "bg-teal-600 text-white" : "bg-card hover:bg-muted"}`}>停用</button>
            </div>
          </Row>

          {account.companies.length > 0 && (
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="text-xs text-muted-foreground mb-2">已绑定公司</div>
              <div className="flex flex-wrap gap-1.5">
                {account.companies.map((c, i) => (
                  <Badge key={i} variant="outline" className="bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-300">
                    {c.name} · {c.role === "admin" ? "管理员" : "成员"}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={save} className="bg-teal-600 hover:bg-teal-700 text-white">保存绑定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Shared form components ---------------- */

function Row({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[90px_1fr] items-start gap-3">
      <Label className="pt-2 text-sm text-right text-muted-foreground">
        {required && <span className="text-rose-500 mr-0.5">*</span>}{label}：
      </Label>
      <div>{children}</div>
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 text-xs text-muted-foreground">{children}</div>;
}

function CountInput({ value, onChange, max, placeholder }: { value: string; onChange: (v: string) => void; max: number; placeholder?: string }) {
  return (
    <div className="relative">
      <Input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value.slice(0, max))} />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{value.length} / {max}</span>
    </div>
  );
}
