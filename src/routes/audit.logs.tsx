import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/audit/logs")({
  head: () => ({
    meta: [
      { title: "日志管理 — Boo Identity Cloud" },
      { name: "description", content: "认证与操作审计日志查询。" },
    ],
  }),
  component: AuditLogsPage,
});

type LogAction = "LOGIN" | "LOGOUT";
type LogStatus = "success" | "fail";

interface AuditLog {
  id: number;
  time: string;
  userPhone: string;
  userId: number;
  app: string;
  action: LogAction;
  ip: string;
  status: LogStatus;
}

const APPS = ["业务运营自动驾驶-测试", "统一身份认证中心", "gts采集-101"];
const USER_IDS = [57, 80, 79, 53, 61, 42, 88, 91];
const PHONE = "15900998899";

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function seedLogs(): AuditLog[] {
  const list: AuditLog[] = [];
  let t = new Date("2026-07-22T10:10:59");
  for (let i = 0; i < 2401; i++) {
    const uid = USER_IDS[i % USER_IDS.length];
    const action: LogAction = i % 3 === 2 ? "LOGOUT" : "LOGIN";
    const status: LogStatus = i % 17 === 5 ? "fail" : "success";
    const app = APPS[i % APPS.length];
    const time = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(
      t.getDate()
    )} ${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
    list.push({
      id: i + 1,
      time,
      userPhone: PHONE,
      userId: uid,
      app,
      action,
      ip: "172.30.11.151",
      status,
    });
    t = new Date(t.getTime() - (30 + (i % 300)) * 1000);
  }
  return list;
}

const ALL_LOGS = seedLogs();

function AuditLogsPage() {
  const [expanded, setExpanded] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [action, setAction] = useState<"all" | LogAction>("all");
  const [status, setStatus] = useState<"all" | LogStatus>("all");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [applied, setApplied] = useState({
    userQuery: "",
    action: "all" as "all" | LogAction,
    status: "all" as "all" | LogStatus,
    start: "",
    end: "",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [gotoPage, setGotoPage] = useState("");

  const filtered = useMemo(() => {
    return ALL_LOGS.filter((l) => {
      if (
        applied.userQuery &&
        !l.userPhone.includes(applied.userQuery) &&
        !String(l.userId).includes(applied.userQuery)
      )
        return false;
      if (applied.action !== "all" && l.action !== applied.action) return false;
      if (applied.status !== "all" && l.status !== applied.status) return false;
      if (applied.start && l.time < applied.start) return false;
      if (applied.end && l.time > applied.end) return false;
      return true;
    });
  }, [applied]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = () => {
    setApplied({ userQuery, action, status, start, end });
    setPage(1);
  };
  const handleReset = () => {
    setUserQuery("");
    setAction("all");
    setStatus("all");
    setStart("");
    setEnd("");
    setApplied({ userQuery: "", action: "all", status: "all", start: "", end: "" });
    setPage(1);
  };

  const pageNumbers = useMemo(() => {
    const nums: (number | "...")[] = [];
    const push = (n: number | "...") => nums.push(n);
    const last = totalPages;
    if (last <= 7) {
      for (let i = 1; i <= last; i++) push(i);
    } else {
      push(1);
      push(2);
      push(3);
      push(4);
      push(5);
      push(6);
      push("...");
      push(last);
    }
    return nums;
  }, [totalPages]);

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Tab-like heading */}
        <div className="rounded-lg border bg-card">
          <div className="border-b px-6 pt-4">
            <div className="inline-block border-b-2 border-primary pb-2 text-sm font-medium text-primary">
              认证日志
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
              <FilterField label="用户">
                <Input
                  placeholder="搜索用户名"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                />
              </FilterField>

              <FilterField label="动作">
                <Select
                  value={action}
                  onValueChange={(v) => setAction(v as "all" | LogAction)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="全部动作" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部动作</SelectItem>
                    <SelectItem value="LOGIN">LOGIN</SelectItem>
                    <SelectItem value="LOGOUT">LOGOUT</SelectItem>
                  </SelectContent>
                </Select>
              </FilterField>

              <FilterField label="时间">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-8"
                      placeholder="开始时间"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">至</span>
                  <Input
                    className="flex-1"
                    placeholder="结束时间"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </div>
              </FilterField>

              {expanded && (
                <FilterField label="状态">
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as "all" | LogStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="全部状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="success">成功</SelectItem>
                      <SelectItem value="fail">失败</SelectItem>
                    </SelectContent>
                  </Select>
                </FilterField>
              )}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
                <Search className="mr-1.5 h-4 w-4" />
                搜索
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-1.5 h-4 w-4" />
                重置
              </Button>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "合并" : "展开"}
                {expanded ? (
                  <ChevronUp className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-center">时间</TableHead>
                <TableHead className="text-center">用户</TableHead>
                <TableHead className="text-center">应用</TableHead>
                <TableHead className="text-center">动作</TableHead>
                <TableHead className="text-center">IP地址</TableHead>
                <TableHead className="text-center">状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-center text-sm">{l.time}</TableCell>
                  <TableCell className="text-center">
                    <div className="text-sm font-semibold">{l.userPhone}</div>
                    <div className="text-xs text-muted-foreground">ID: {l.userId}</div>
                  </TableCell>
                  <TableCell className="text-center text-sm">{l.app}</TableCell>
                  <TableCell className="text-center">
                    <ActionBadge action={l.action} />
                  </TableCell>
                  <TableCell className="text-center text-sm">{l.ip}</TableCell>
                  <TableCell className="text-center">
                    <StatusText status={l.status} />
                  </TableCell>
                </TableRow>
              ))}
              {pageData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-end gap-3 border-t px-4 py-3 text-sm">
            <span className="text-muted-foreground">共 {total} 条</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}条/页
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {pageNumbers.map((n, idx) =>
              n === "..." ? (
                <span key={`e${idx}`} className="px-1 text-muted-foreground">
                  …
                </span>
              ) : (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-8 min-w-8 rounded px-2 text-sm ${
                    n === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {n}
                </button>
              )
            )}
            {totalPages > 7 && (
              <button
                onClick={() => setPage(totalPages)}
                className={`h-8 min-w-8 rounded px-2 text-sm ${
                  currentPage === totalPages
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {totalPages}
              </button>
            )}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1 text-muted-foreground">
              <span>前往</span>
              <Input
                className="h-8 w-14 text-center"
                value={gotoPage}
                onChange={(e) => setGotoPage(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const n = Number(gotoPage);
                    if (n >= 1 && n <= totalPages) setPage(n);
                  }
                }}
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-right text-sm text-muted-foreground">
        {label}：
      </span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function ActionBadge({ action }: { action: LogAction }) {
  if (action === "LOGIN") {
    return (
      <span className="inline-flex items-center rounded bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-emerald-600">
        LOGIN
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded bg-muted px-2.5 py-0.5 text-xs font-semibold tracking-wide text-muted-foreground">
      LOGOUT
    </span>
  );
}

function StatusText({ status }: { status: LogStatus }) {
  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
        成功
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-sm text-rose-600">
      <XCircle className="h-4 w-4" />
      失败
    </span>
  );
}
