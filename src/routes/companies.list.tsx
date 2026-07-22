import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, RotateCcw, X } from "lucide-react";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

export const Route = createFileRoute("/companies/list")({
  head: () => ({
    meta: [
      { title: "公司列表 — Boo Identity Cloud" },
      { name: "description", content: "查看和管理已接入认证中心的公司主体。" },
    ],
  }),
  component: CompaniesListPage,
});

// ---------- 数据模型 ----------
type CompanyStatus = "enabled" | "disabled";
type CertStatus = "certified" | "uncertified" | "failed";

type Member = {
  name: string;
  account: string;
  role: "admin" | "member";
  subtitle?: string;
};
type ProductGrant = {
  name: string;
  code: string;
  active: boolean;
};

type Company = {
  id: string;
  code: string;
  name: string;
  shortName?: string;
  creditCode?: string;
  status: CompanyStatus;
  certStatus: CertStatus;
  memberCount: number;
  productCount: number;
  contact?: string;
  phone?: string;
  email?: string;
  remark?: string;
  createdAt: string;
  members: Member[];
  products: ProductGrant[];
};

const ALL_PRODUCTS: { code: string; name: string }[] = [
  { code: "gts-prod-101", name: "gts采集-101" },
  { code: "overseas_pad_svc", name: "出海神器pad服务" },
  { code: "atlas-dev02", name: "atlas-dev02" },
  { code: "atlas-test", name: "atlas-test" },
  { code: "boo-points", name: "积分系统" },
  { code: "mtxdevice", name: "矩阵平台" },
  { code: "BooPilot", name: "业务运营自动驾驶" },
  { code: "atlas-dev", name: "atlas-dev" },
  { code: "gts", name: "gts" },
  { code: "boo-hub", name: "数据中台" },
  { code: "iam-login-app", name: "统一身份认证中心" },
];

const seedCompanies: Company[] = [
  {
    id: "1",
    code: "COMP202607030002",
    name: "成都朗瀚智途科技有限公司",
    status: "enabled",
    certStatus: "certified",
    memberCount: 2,
    productCount: 1,
    contact: "薛太",
    phone: "1888888998",
    createdAt: "2026-07-03 18:20:07",
    members: [{ name: "薛太", account: "1888888998", role: "admin" }],

    products: [{ code: "gts-prod-101", name: "gts采集-101", active: true }],
  },
  {
    id: "2",
    code: "COMP202607030001",
    name: "运营公司test",
    status: "enabled",
    certStatus: "certified",
    memberCount: 1,
    productCount: 1,
    createdAt: "2026-07-03 14:15:39",
    members: [{ name: "admin", account: "admin", role: "admin" }],
    products: [{ code: "atlas-dev", name: "atlas-dev", active: true }],
  },
  {
    id: "3",
    code: "COMP202607020001",
    name: "自动化测试公司",
    status: "enabled",
    certStatus: "certified",
    memberCount: 3,
    productCount: 1,
    createdAt: "2026-07-02 13:42:40",
    members: [
      { name: "auto_test", account: "19666666666", role: "admin" },
      { name: "tester", account: "13000000000", role: "member" },
    ],
    products: [{ code: "atlas-test", name: "atlas-test", active: true }],
  },
  {
    id: "4",
    code: "COMP202606250001",
    name: "成都朗瀚智途科技有限公司",
    status: "enabled",
    certStatus: "certified",
    memberCount: 6,
    productCount: 3,
    contact: "王五",
    phone: "18645681235",
    email: "22@qq.com",
    createdAt: "2026-06-25 17:35:26",
    members: [{ name: "王五", account: "18645681235", role: "admin" }],
    products: [
      { code: "gts-prod-101", name: "gts采集-101", active: true },
      { code: "atlas-dev02", name: "atlas-dev02", active: true },
    ],
  },
  {
    id: "5",
    code: "COMP202606240001",
    name: "博海悦意科技有限公司",
    status: "enabled",
    certStatus: "certified",
    memberCount: 17,
    productCount: 6,
    createdAt: "2026-06-24 21:51:24",
    members: [],
    products: [],
  },
  {
    id: "6",
    code: "COMP_FP_20260622170347",
    name: "强制改密公司20260622170347",
    status: "enabled",
    certStatus: "failed",
    memberCount: 2,
    productCount: 0,
    createdAt: "2026-06-22 17:03:47",
    members: [],
    products: [],
  },
  {
    id: "7",
    code: "COMP_TP_20260622165047",
    name: "第三方认证公司20260622165047",
    status: "enabled",
    certStatus: "uncertified",
    memberCount: 1,
    productCount: 0,
    createdAt: "2026-06-22 16:50:47",
    members: [],
    products: [],
  },
  {
    id: "8",
    code: "COMP_TP_20260622164324",
    name: "第三方认证公司20260622164324",
    status: "enabled",
    certStatus: "uncertified",
    memberCount: 1,
    productCount: 0,
    createdAt: "2026-06-22 16:43:26",
    members: [],
    products: [],
  },
  {
    id: "9",
    code: "COMP202606180002",
    name: "成都青鹿数据科技有限公司",
    shortName: "青鹿数据",
    creditCode: "91510100MA6TEST002",
    status: "enabled",
    certStatus: "certified",
    memberCount: 14,
    productCount: 10,
    contact: "李四",
    phone: "13800001002",
    email: "cert-company-b@example.com",
    remark: "开发环境已认证测试企业",
    createdAt: "2026-06-18 10:16:09",
    members: [
      { name: "13333333335", account: "1", role: "admin" },
      { name: "13333333334", account: "test1", role: "admin" },
      { name: "19888888888", account: "19888888888", role: "admin" },
      { name: "auto_test", account: "19666666666", role: "admin" },
      { name: "17340124677", account: "1", role: "admin" },
      { name: "13333333333", account: "小花", role: "member" },
      { name: "test-gts", account: "大张伟", role: "member" },
      { name: "18228156409", account: "18228156409", role: "admin" },
      { name: "13888888888", account: "13888888888", role: "member" },
      { name: "pilot-dev", account: "pilot-dev", role: "admin" },
      { name: "gts-admin", account: "gts-admin", role: "admin" },
      { name: "test001", account: "test001@example.com", role: "admin" },
      { name: "iam_manage_test", account: "IAM管理测试员", role: "admin" },
      { name: "iam_login_admin", account: "iam_login_admin", role: "member" },
    ],
    products: [
      { code: "gts-prod-101", name: "gts采集-101", active: true },
      { code: "mtxdevice", name: "矩阵平台", active: true },
      { code: "overseas_pad_svc", name: "出海神器pad服务", active: true },
      { code: "atlas-dev02", name: "atlas-dev02", active: true },
      { code: "atlas-test", name: "atlas-test", active: true },
      { code: "boo-points", name: "积分系统", active: true },
      { code: "BooPilot", name: "业务运营自动驾驶", active: true },
      { code: "atlas-dev", name: "atlas-dev", active: true },
      { code: "gts", name: "gts", active: false },
      { code: "boo-hub", name: "数据中台", active: true },
      { code: "iam-login-app", name: "统一身份认证中心", active: true },
    ],
  },
  {
    id: "10",
    code: "COMP202606180001",
    name: "成都云帆科技有限公司",
    contact: "张三",
    phone: "13800001001",
    email: "cert-company-a@example.com",
    status: "enabled",
    certStatus: "certified",
    memberCount: 9,
    productCount: 8,
    createdAt: "2026-06-18 10:16:09",
    members: [{ name: "张三", account: "13800001001", role: "admin" }],
    products: [{ code: "atlas-dev", name: "atlas-dev", active: true }],
  },
];

// ---------- 徽章 ----------
function StatusBadge({ status }: { status: CompanyStatus }) {
  if (status === "enabled")
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
        启用
      </Badge>
    );
  return (
    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200">
      停用
    </Badge>
  );
}

function CertBadge({ status }: { status: CertStatus }) {
  if (status === "certified")
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
        已认证
      </Badge>
    );
  if (status === "uncertified")
    return (
      <Badge variant="outline" className="text-muted-foreground">
        未认证
      </Badge>
    );
  return (
    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200">
      认证失败
    </Badge>
  );
}

// ---------- 主页面 ----------
function CompaniesListPage() {
  const [companies, setCompanies] = useState<Company[]>(seedCompanies);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [certFilter, setCertFilter] = useState<string>("all");
  const [applied, setApplied] = useState({ keyword: "", status: "all", cert: "all" });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 弹窗状态
  const [detail, setDetail] = useState<Company | null>(null);
  const [editing, setEditing] = useState<Company | null>(null);
  const [creating, setCreating] = useState(false);
  const [granting, setGranting] = useState<Company | null>(null);
  const [reauth, setReauth] = useState<Company | null>(null);
  const [toggling, setToggling] = useState<Company | null>(null);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (applied.status !== "all" && c.status !== applied.status) return false;
      if (applied.cert !== "all" && c.certStatus !== applied.cert) return false;
      if (applied.keyword) {
        const k = applied.keyword.toLowerCase();
        const hit =
          c.name.toLowerCase().includes(k) ||
          c.code.toLowerCase().includes(k) ||
          (c.contact ?? "").toLowerCase().includes(k);
        if (!hit) return false;
      }
      return true;
    });
  }, [companies, applied]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = () => {
    setApplied({ keyword, status: statusFilter, cert: certFilter });
    setPage(1);
  };
  const handleReset = () => {
    setKeyword("");
    setStatusFilter("all");
    setCertFilter("all");
    setApplied({ keyword: "", status: "all", cert: "all" });
    setPage(1);
  };

  const saveCompany = (data: Company) => {
    setCompanies((prev) => {
      const exists = prev.some((c) => c.id === data.id);
      return exists ? prev.map((c) => (c.id === data.id ? data : c)) : [data, ...prev];
    });
    toast.success("已保存");
  };

  const saveGrants = (companyId: string, codes: string[]) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id !== companyId) return c;
        const products: ProductGrant[] = codes.map((code) => {
          const meta = ALL_PRODUCTS.find((p) => p.code === code)!;
          const existing = c.products.find((p) => p.code === code);
          return { code, name: meta.name, active: existing?.active ?? true };
        });
        return { ...c, products, productCount: products.length };
      })
    );
    toast.success("授权已保存");
  };

  const requireReauth = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, certStatus: "uncertified" as CertStatus } : c))
    );
    toast.success("已通知该公司重新认证");
  };

  const toggleStatus = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "enabled" ? "disabled" : "enabled" }
          : c
      )
    );
  };

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-6 mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="text-xs font-semibold tracking-[0.2em] text-primary mb-2">
              COMPANY ACCESS
            </div>
            <h1 className="text-2xl font-bold mb-2">公司主体管理</h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              公司是产品购买、企业认证和业务准入的主体。管理员在这里创建甲方公司，并给公司开通产品。
            </p>
          </div>
          <Button
            onClick={() => setCreating(true)}
            className="shrink-0 bg-primary hover:bg-primary/90 shadow-md"
          >
            <Plus className="mr-1 h-4 w-4" />
            创建公司
          </Button>
        </div>
      </section>

      {/* 过滤条 */}
      <section className="rounded-xl border bg-card p-4 mb-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground shrink-0">关键词</Label>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="公司名称 / 编码 / 联系人"
              className="w-[220px]"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground shrink-0">公司状态</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="enabled">启用</SelectItem>
                <SelectItem value="disabled">停用</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground shrink-0">认证状态</Label>
            <Select value={certFilter} onValueChange={setCertFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="certified">已认证</SelectItem>
                <SelectItem value="uncertified">未认证</SelectItem>
                <SelectItem value="failed">认证失败</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch}>
              <Search className="mr-1 h-4 w-4" />
              查询
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-1 h-4 w-4" />
              重置
            </Button>
          </div>
        </div>
      </section>

      {/* 表格 */}
      <section className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>公司编码</TableHead>
              <TableHead>公司名称</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>认证状态</TableHead>
              <TableHead>成员/产品</TableHead>
              <TableHead>联系人</TableHead>
              <TableHead>联系电话</TableHead>
              <TableHead>联系邮箱</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((c) => (
              <TableRow
                key={c.id}
                className={c.certStatus === "failed" ? "bg-rose-50/40" : undefined}
              >
                <TableCell className="font-mono text-xs">{c.code}</TableCell>
                <TableCell className="max-w-[220px] truncate">{c.name}</TableCell>
                <TableCell><StatusBadge status={c.status} /></TableCell>
                <TableCell><CertBadge status={c.certStatus} /></TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {c.memberCount} 人 / {c.productCount} 个
                </TableCell>
                <TableCell>{c.contact ?? "-"}</TableCell>
                <TableCell>{c.phone ?? "-"}</TableCell>
                <TableCell className="text-muted-foreground">{c.email ?? "-"}</TableCell>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {c.createdAt}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-sm">
                    <button className="text-primary hover:underline" onClick={() => setDetail(c)}>
                      详情
                    </button>
                    <button className="text-primary hover:underline" onClick={() => setEditing(c)}>
                      编辑
                    </button>
                    <button className="text-primary hover:underline" onClick={() => setGranting(c)}>
                      产品授权
                    </button>
                    {c.status === "enabled" && c.certStatus === "certified" && (
                      <button
                        className="text-primary hover:underline"
                        onClick={() => setReauth(c)}
                      >
                        要求重认证
                      </button>
                    )}
                    <button
                      className={
                        c.status === "enabled"
                          ? "text-rose-600 hover:underline"
                          : "text-emerald-600 hover:underline"
                      }
                      onClick={() => setToggling(c)}
                    >
                      {c.status === "enabled" ? "停用" : "启用"}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-10">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-end gap-4 border-t px-4 py-3 text-sm">
          <span className="text-muted-foreground">共 {total} 条</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}
          >
            <SelectTrigger className="w-[100px] h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>{n}条/页</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                  aria-disabled={page === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
                  aria-disabled={page === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      {/* 详情 Drawer */}
      <CompanyDetailSheet company={detail} onClose={() => setDetail(null)} />

      {/* 编辑 / 新建 */}
      <CompanyEditDialog
        open={!!editing || creating}
        company={editing}
        onClose={() => { setEditing(null); setCreating(false); }}
        onSave={saveCompany}
      />

      {/* 产品授权 */}
      <GrantProductDialog
        company={granting}
        onClose={() => setGranting(null)}
        onSave={saveGrants}
      />

      {/* 要求重新认证 */}
      <ReauthDialog
        company={reauth}
        onClose={() => setReauth(null)}
        onConfirm={(id) => { requireReauth(id); setReauth(null); }}
      />

      {/* 停用/启用 */}
      <AlertDialog open={!!toggling} onOpenChange={(o) => !o && setToggling(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>操作确认</AlertDialogTitle>
            <AlertDialogDescription>
              确认{toggling?.status === "enabled" ? "停用" : "启用"}公司「{toggling?.name}」吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toggling) {
                  toggleStatus(toggling.id);
                  toast.success(toggling.status === "enabled" ? "已停用" : "已启用");
                }
                setToggling(null);
              }}
            >
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

// ---------- 详情侧滑 ----------
function CompanyDetailSheet({
  company,
  onClose,
}: {
  company: Company | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={!!company} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-[520px] sm:max-w-[520px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>公司详情</SheetTitle>
        </SheetHeader>
        {company && (
          <div className="mt-4 space-y-6">
            <div>
              <h2 className="text-xl font-bold">{company.name}</h2>
              <p className="text-sm font-mono text-muted-foreground mt-1">{company.code}</p>
              <div className="flex gap-2 mt-3">
                <StatusBadge status={company.status} />
                <CertBadge status={company.certStatus} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">基本信息</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="公司简称" value={company.shortName} />
                <Field label="联系人" value={company.contact} />
                <Field label="联系电话" value={company.phone} />
                <Field label="联系邮箱" value={company.email} />
                <Field label="统一社会信用代码" value={company.creditCode} full />
                <Field label="备注" value={company.remark} full />
                <Field label="创建时间" value={company.createdAt} full />
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">公司成员 ({company.members.length})</h3>
                <Button size="sm" variant="outline">添加成员</Button>
              </div>
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {company.members.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4 text-center">暂无成员</p>
                )}
                {company.members.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{m.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{m.account}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={
                          m.role === "admin"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-sky-50 text-sky-700 border-sky-200"
                        }
                      >
                        {m.role === "admin" ? "管理员" : "成员"}
                      </Badge>
                      <button className="text-xs text-primary hover:underline">调整</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold mb-3">
                已开通产品 ({company.products.length})
              </h3>
              <div className="space-y-2">
                {company.products.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4 text-center">暂未开通产品</p>
                )}
                {company.products.map((p) => (
                  <div
                    key={p.code}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground font-mono truncate">
                        {p.code}
                      </div>
                    </div>
                    {p.active ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                        启用
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200">
                        停用
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value, full }: { label: string; value?: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-sm rounded-md border bg-muted/30 px-3 py-2 min-h-9">
        {value || <span className="text-muted-foreground">-</span>}
      </div>
    </div>
  );
}

// ---------- 编辑 / 新建 ----------
function CompanyEditDialog({
  open,
  company,
  onClose,
  onSave,
}: {
  open: boolean;
  company: Company | null;
  onClose: () => void;
  onSave: (c: Company) => void;
}) {
  const isEdit = !!company;
  const [form, setForm] = useState<Partial<Company>>({});

  // 每次打开重置
  useMemo(() => {
    if (open) {
      setForm(
        company ?? {
          name: "",
          shortName: "",
          creditCode: "",
          contact: "",
          phone: "",
          email: "",
          remark: "",
        }
      );
    }
  }, [open, company]);

  const submit = () => {
    if (!form.name?.trim()) {
      toast.error("公司名称不能为空");
      return;
    }
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const merged: Company = {
      id: company?.id ?? `new-${Date.now()}`,
      code: company?.code ?? `COMP${Date.now()}`,
      status: company?.status ?? "enabled",
      certStatus: company?.certStatus ?? "uncertified",
      memberCount: company?.memberCount ?? 0,
      productCount: company?.productCount ?? 0,
      createdAt: company?.createdAt ?? now,
      members: company?.members ?? [],
      products: company?.products ?? [],
      name: form.name!,
      shortName: form.shortName,
      creditCode: form.creditCode,
      contact: form.contact,
      phone: form.phone,
      email: form.email,
      remark: form.remark,
    };
    onSave(merged);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑公司" : "创建公司"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <FormRow label="公司名称" required max={128} value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <FormRow label="公司简称" max={64} value={form.shortName} onChange={(v) => setForm((f) => ({ ...f, shortName: v }))} />
          <FormRow label="统一社会信用代码" value={form.creditCode} onChange={(v) => setForm((f) => ({ ...f, creditCode: v }))} />
          <FormRow label="联系人" max={64} value={form.contact} onChange={(v) => setForm((f) => ({ ...f, contact: v }))} />
          <FormRow label="联系电话" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
          <FormRow label="联系邮箱" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
          <div className="grid grid-cols-[80px_1fr] items-start gap-3">
            <Label className="pt-2 text-sm text-right text-muted-foreground">备注</Label>
            <div className="relative">
              <Textarea
                value={form.remark ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, remark: e.target.value.slice(0, 255) }))}
                rows={3}
              />
              <span className="absolute bottom-1 right-2 text-xs text-muted-foreground">
                {(form.remark ?? "").length} / 255
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
  label, required, max, value, onChange,
}: {
  label: string;
  required?: boolean;
  max?: number;
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-[80px_1fr] items-center gap-3">
      <Label className="text-sm text-right text-muted-foreground">
        {required && <span className="text-rose-500 mr-0.5">*</span>}
        {label}
      </Label>
      <div className="relative">
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(max ? e.target.value.slice(0, max) : e.target.value)}
        />
        {max && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            {(value ?? "").length} / {max}
          </span>
        )}
      </div>
    </div>
  );
}

// ---------- 产品授权 ----------
function GrantProductDialog({
  company, onClose, onSave,
}: {
  company: Company | null;
  onClose: () => void;
  onSave: (id: string, codes: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  useMemo(() => {
    if (company) setSelected(company.products.map((p) => p.code));
  }, [company]);

  const toggle = (code: string) =>
    setSelected((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));

  const available = ALL_PRODUCTS.filter((p) => !selected.includes(p.code));

  return (
    <Dialog open={!!company} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>公司产品授权</DialogTitle>
        </DialogHeader>
        <div className="rounded-lg border bg-sky-50/70 border-sky-200 p-3 text-sm text-sky-900 flex gap-2">
          <span className="mt-0.5">ⓘ</span>
          <span>产品访问权挂在公司主体下，公司成员默认继承公司已开通产品。</span>
        </div>
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-[80px_1fr] items-center gap-3">
            <Label className="text-sm text-right text-muted-foreground">当前公司</Label>
            <div className="text-sm">{company?.name}</div>
          </div>
          <div className="grid grid-cols-[80px_1fr] items-start gap-3">
            <Label className="text-sm text-right text-muted-foreground pt-2">开通产品</Label>
            <div>
              <div className="min-h-10 rounded-md border px-2 py-1.5 flex flex-wrap gap-1.5">
                {selected.length === 0 && (
                  <span className="text-sm text-muted-foreground py-1 px-1">选择产品</span>
                )}
                {selected.map((code) => {
                  const meta = ALL_PRODUCTS.find((p) => p.code === code)!;
                  return (
                    <Badge key={code} variant="secondary" className="gap-1">
                      {meta.name}
                      <button onClick={() => toggle(code)} aria-label="移除">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
              {available.length > 0 && (
                <div className="mt-2 rounded-md border max-h-[200px] overflow-y-auto">
                  {available.map((p) => (
                    <button
                      key={p.code}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex justify-between"
                      onClick={() => toggle(p.code)}
                    >
                      <span>{p.name}</span>
                      <span className="text-muted-foreground font-mono text-xs">({p.code})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button
            onClick={() => {
              if (company) onSave(company.id, selected);
              onClose();
            }}
          >
            保存授权
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- 要求重认证 ----------
function ReauthDialog({
  company, onClose, onConfirm,
}: {
  company: Company | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}) {
  const [reason, setReason] = useState("");
  useMemo(() => { if (company) setReason(""); }, [company]);

  return (
    <Dialog open={!!company} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>要求重新认证</DialogTitle>
        </DialogHeader>
        <div className="flex gap-3 text-sm">
          <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">!</div>
          <p className="text-muted-foreground leading-relaxed">
            确认要求公司「{company?.name}」重新进行企业实名认证吗？该公司在重新认证通过前将不能进入业务系统。
          </p>
        </div>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value.slice(0, 255))}
          placeholder="可填写原因，最多255字"
          rows={3}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={() => company && onConfirm(company.id)}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
