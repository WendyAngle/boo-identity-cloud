import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
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
  KeyRound,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { toast } from "sonner";

type RoleKey = "super_admin" | "user";
type SysUser = {
  id: number;
  account: string;
  nickname: string;
  phone: string;
  email: string;
  role: RoleKey;
  status: "enabled" | "disabled";
  remark: string;
  createdAt: string;
};

const mock: SysUser[] = [
  { id: 1, account: "iam_manage_test", nickname: "IAM管理测试员", phone: "13800009999", email: "iam_manage_test@example.com", role: "super_admin", status: "enabled", remark: "", createdAt: "2026-06-18 13:36:20" },
  { id: 2, account: "iam_login_admin", nickname: "认证中心管理员", phone: "13800000001", email: "iam-login-admin@example.com", role: "user", status: "enabled", remark: "", createdAt: "2026-06-18 02:16:09" },
  { id: 3, account: "testYY", nickname: "", phone: "", email: "testYY@123.com", role: "user", status: "enabled", remark: "", createdAt: "2026-06-16 17:58:50" },
  { id: 4, account: "testW", nickname: "", phone: "", email: "testW@123.com", role: "user", status: "enabled", remark: "", createdAt: "2026-06-04 10:14:11" },
  { id: 5, account: "zdw", nickname: "", phone: "", email: "zdw@zdw.com", role: "user", status: "enabled", remark: "", createdAt: "2026-05-29 12:47:56" },
  { id: 6, account: "sml", nickname: "", phone: "", email: "minglanshi03@gmail.com", role: "user", status: "enabled", remark: "", createdAt: "2026-05-28 14:28:10" },
  { id: 7, account: "test1111", nickname: "", phone: "", email: "344@qq.com", role: "user", status: "enabled", remark: "", createdAt: "2026-05-26 14:06:58" },
  { id: 8, account: "test333", nickname: "", phone: "", email: "test333@qq.com", role: "user", status: "enabled", remark: "", createdAt: "2026-05-25 14:22:07" },
  { id: 9, account: "yftest223", nickname: "", phone: "", email: "445@qq.com", role: "user", status: "enabled", remark: "", createdAt: "2026-05-22 16:09:26" },
  { id: 10, account: "yftest222", nickname: "", phone: "", email: "121ge@qq.com", role: "user", status: "enabled", remark: "", createdAt: "2026-05-22 16:06:19" },
  { id: 11, account: "opsuser01", nickname: "运维小李", phone: "13500001111", email: "ops01@example.com", role: "user", status: "disabled", remark: "临时账号", createdAt: "2026-05-20 09:12:00" },
  { id: 12, account: "opsuser02", nickname: "运维小王", phone: "13500002222", email: "ops02@example.com", role: "user", status: "enabled", remark: "", createdAt: "2026-05-19 09:12:00" },
];

export const Route = createFileRoute("/system/users")({
  head: () => ({ meta: [{ title: "系统用户管理 — Boo Identity Cloud" }] }),
  component: SystemUsersPage,
});

function SystemUsersPage() {
  const [data, setData] = useState<SysUser[]>(mock);
  const [qAccount, setQAccount] = useState("");
  const [qPhone, setQPhone] = useState("");
  const [qStatus, setQStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SysUser | null>(null);
  const [pwdTarget, setPwdTarget] = useState<SysUser | null>(null);
  const [toggleTarget, setToggleTarget] = useState<SysUser | null>(null);

  const filtered = useMemo(() => {
    return data.filter((u) => {
      if (qAccount && !u.account.toLowerCase().includes(qAccount.toLowerCase())) return false;
      if (qPhone && !u.phone.includes(qPhone)) return false;
      if (qStatus !== "all" && u.status !== qStatus) return false;
      return true;
    });
  }, [data, qAccount, qPhone, qStatus]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const reset = () => {
    setQAccount("");
    setQPhone("");
    setQStatus("all");
    setPage(1);
  };

  const handleSave = (payload: Omit<SysUser, "id" | "createdAt"> & { password?: string }) => {
    if (editing) {
      setData((prev) => prev.map((u) => (u.id === editing.id ? { ...u, ...payload } : u)));
      toast.success("账号已更新");
    } else {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const id = Math.max(0, ...data.map((d) => d.id)) + 1;
      const { password: _pwd, ...rest } = payload;
      void _pwd;
      setData((prev) => [{ id, createdAt, ...rest }, ...prev]);
      toast.success("账号已创建");
    }
    setFormOpen(false);
  };

  const toggleStatus = () => {
    if (!toggleTarget) return;
    const next = toggleTarget.status === "enabled" ? "disabled" : "enabled";
    setData((prev) => prev.map((u) => (u.id === toggleTarget.id ? { ...u, status: next } : u)));
    toast.success(`已${next === "enabled" ? "启用" : "停用"}账号「${toggleTarget.account}」`);
    setToggleTarget(null);
  };

  const allChecked = paged.length > 0 && paged.every((r) => selected.includes(r.id));
  const toggleAll = () => {
    if (allChecked) setSelected((prev) => prev.filter((id) => !paged.some((r) => r.id === id)));
    else setSelected((prev) => Array.from(new Set([...prev, ...paged.map((r) => r.id)])));
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Label className="w-20 shrink-0 text-right text-sm">登录账号：</Label>
              <Input placeholder="请输入" value={qAccount} onChange={(e) => setQAccount(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Label className="w-20 shrink-0 text-right text-sm">手机号：</Label>
              <Input placeholder="请输入" value={qPhone} onChange={(e) => setQPhone(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Label className="w-20 shrink-0 text-right text-sm">状态：</Label>
              <Select value={qStatus} onValueChange={setQStatus}>
                <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
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

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b p-3">
            <Button
              onClick={() => { setEditing(null); setFormOpen(true); }}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-1 h-4 w-4" /> 新增账号
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
                <TableHead>登录账号</TableHead>
                <TableHead>昵称</TableHead>
                <TableHead>手机号</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>系统角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="w-64">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((u, idx) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(u.id)}
                      onCheckedChange={() =>
                        setSelected((prev) => prev.includes(u.id) ? prev.filter((i) => i !== u.id) : [...prev, u.id])
                      }
                    />
                  </TableCell>
                  <TableCell>{(page - 1) * pageSize + idx + 1}</TableCell>
                  <TableCell className="font-medium">{u.account}</TableCell>
                  <TableCell>{u.nickname || <span className="text-muted-foreground">--</span>}</TableCell>
                  <TableCell>{u.phone || <span className="text-muted-foreground">--</span>}</TableCell>
                  <TableCell>{u.email || <span className="text-muted-foreground">--</span>}</TableCell>
                  <TableCell>
                    {u.role === "super_admin" ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Super Admin</Badge>
                    ) : (
                      <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50">User</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {u.status === "enabled" ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">启用</Badge>
                    ) : (
                      <Badge variant="secondary">停用</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setEditing(u); setFormOpen(true); }}>
                        <Pencil className="mr-1 h-3.5 w-3.5" /> 编辑
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setPwdTarget(u)}>
                        <KeyRound className="mr-1 h-3.5 w-3.5" /> 重置密码
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={u.status === "enabled" ? "text-destructive hover:text-destructive" : "text-emerald-600 hover:text-emerald-600"}
                        onClick={() => setToggleTarget(u)}
                      >
                        {u.status === "enabled" ? (<><Ban className="mr-1 h-3.5 w-3.5" /> 停用</>) : (<><CheckCircle2 className="mr-1 h-3.5 w-3.5" /> 启用</>)}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-end gap-4 border-t px-4 py-3 text-sm">
            <span className="text-muted-foreground">共 {total} 条</span>
            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((n) => (<SelectItem key={n} value={String(n)}>{n}条/页</SelectItem>))}
              </SelectContent>
            </Select>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink href="#" isActive={p === page} onClick={(e) => { e.preventDefault(); setPage(p); }}>{p}</PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} />
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

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        onSave={handleSave}
      />

      <ResetPasswordDialog
        target={pwdTarget}
        onOpenChange={(o) => !o && setPwdTarget(null)}
        onConfirm={() => { toast.success(`已重置「${pwdTarget?.account}」的密码`); setPwdTarget(null); }}
      />

      <AlertDialog open={!!toggleTarget} onOpenChange={(o) => !o && setToggleTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              操作确认
            </AlertDialogTitle>
            <AlertDialogDescription>
              确认{toggleTarget?.status === "enabled" ? "停用" : "启用"}账号「{toggleTarget?.account}」吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={toggleStatus} className="bg-primary hover:bg-primary/90">确定</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[90px_1fr] items-center gap-2">
      <Label className="text-right text-sm">
        {required && <span className="text-destructive">* </span>}
        {label}：
      </Label>
      <div>{children}</div>
    </div>
  );
}

function UserFormDialog({
  open,
  onOpenChange,
  editing,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: SysUser | null;
  onSave: (payload: Omit<SysUser, "id" | "createdAt"> & { password?: string }) => void;
}) {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"enabled" | "disabled">("enabled");
  const [role, setRole] = useState<RoleKey | "">("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    if (open) {
      setAccount(editing?.account ?? "");
      setPassword("");
      setNickname(editing?.nickname ?? "");
      setPhone(editing?.phone ?? "");
      setEmail(editing?.email ?? "");
      setStatus(editing?.status ?? "enabled");
      setRole(editing?.role ?? "");
      setRemark(editing?.remark ?? "");
    }
  }, [open, editing]);

  const submit = () => {
    if (!account.trim()) return toast.error("请输入用户名");
    if (!editing && !password.trim()) return toast.error("请输入密码");
    if (!phone.trim()) return toast.error("请输入手机号");
    if (!/^\d{11}$/.test(phone)) return toast.error("手机号格式不正确");
    if (!role) return toast.error("请选择系统角色");
    onSave({
      account: account.trim(),
      nickname: nickname.trim(),
      phone: phone.trim(),
      email: email.trim(),
      status,
      role: role as RoleKey,
      remark: remark.trim(),
      password: password || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "编辑账号" : "新增账号"}</DialogTitle>
        </DialogHeader>
        <div className="flex items-start gap-2 rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>用于管理认证中心后台自身登录账号。公司、产品访问权限请在公司与应用授权页面维护。</span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 py-2">
          <Field required label="用户名">
            <Input
              placeholder="请输入用户名"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              disabled={!!editing}
              maxLength={64}
            />
          </Field>
          {!editing ? (
            <Field label="密码">
              <Input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={64}
              />
            </Field>
          ) : (
            <Field label="昵称">
              <Input placeholder="请输入昵称" value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={64} />
            </Field>
          )}
          {!editing && (
            <Field label="昵称">
              <Input placeholder="请输入昵称" value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={64} />
            </Field>
          )}
          <Field required label="手机号">
            <Input placeholder="请输入手机号" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} />
          </Field>
          <Field label="邮箱">
            <Input placeholder="请输入邮箱" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={128} />
          </Field>
          <Field required label="状态">
            <div className="flex items-center gap-6 pt-1.5">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" className="h-4 w-4 accent-primary" checked={status === "enabled"} onChange={() => setStatus("enabled")} />
                启用
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" className="h-4 w-4 accent-primary" checked={status === "disabled"} onChange={() => setStatus("disabled")} />
                停用
              </label>
            </div>
          </Field>
          <div className="col-span-2">
            <Field required label="系统角色">
              <Select value={role} onValueChange={(v) => setRole(v as RoleKey)}>
                <SelectTrigger><SelectValue placeholder="请选择系统角色" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="备注">
              <div className="relative">
                <Textarea
                  placeholder="可选，填写账号用途或管理范围"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value.slice(0, 200))}
                  rows={3}
                />
                <span className="absolute bottom-1 right-2 text-xs text-muted-foreground">{remark.length} / 200</span>
              </div>
            </Field>
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

function ResetPasswordDialog({
  target,
  onOpenChange,
  onConfirm,
}: {
  target: SysUser | null;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
}) {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  useEffect(() => {
    if (target) { setP1(""); setP2(""); }
  }, [target]);

  const submit = () => {
    if (!p1) return toast.error("请输入新密码");
    if (p1 !== p2) return toast.error("两次输入的密码不一致");
    onConfirm();
  };

  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>重置密码</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Field required label="新密码">
            <Input type="password" placeholder="请输入新密码" value={p1} onChange={(e) => setP1(e.target.value)} />
          </Field>
          <Field required label="确认密码">
            <Input type="password" placeholder="请再次输入新密码" value={p2} onChange={(e) => setP2(e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={submit} className="bg-primary hover:bg-primary/90">确定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
