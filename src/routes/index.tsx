import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  Building2,
  Monitor,
  AlertCircle,
  ArrowRight,
  FileWarning,
  PowerOff,
  UserX,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "工作台 — Boo Identity Cloud" },
      { name: "description", content: "认证中心工作台：公司主体认证、OAuth 接入、登录流量与系统健康状态。" },
      { property: "og:title", content: "工作台 — Boo Identity Cloud" },
      { property: "og:description", content: "统一查看公司主体认证、OAuth 接入、登录流量和系统健康状态。" },
    ],
  }),
  component: Workbench,
});

const trafficData = [
  { day: "07-16", login: 68, refresh: 2, fail: 0 },
  { day: "07-17", login: 32, refresh: 3, fail: 5 },
  { day: "07-18", login: 4, refresh: 1, fail: 0 },
  { day: "07-19", login: 3, refresh: 2, fail: 0 },
  { day: "07-20", login: 16, refresh: 3, fail: 0 },
  { day: "07-21", login: 104, refresh: 34, fail: 6 },
  { day: "07-22", login: 8, refresh: 32, fail: 0 },
];

const stats = [
  { label: "认证中心用户", value: "37", sub: "已绑定公司 33 人", icon: Users, color: "var(--brand-blue)" },
  { label: "认证企业", value: "10", sub: "3 家待完善资料", icon: Building2, color: "var(--brand-green)", subClass: "text-[color:var(--brand-orange)]" },
  { label: "接入产品", value: "11", sub: "全部产品已启用", icon: Monitor, color: "var(--brand-purple)" },
  { label: "失败认证率", value: "8.4%", sub: "26 次失败 / 近 7 日", icon: AlertCircle, color: "var(--brand-orange)", subClass: "text-[color:var(--brand-red)]" },
];

const todos = [
  { title: "3 家公司待处理", desc: "企业实名资料未完成、认证中或认证失败", icon: FileWarning, color: "var(--brand-orange)" },
  { title: "0 个产品已停用", desc: "建议确认是否需要恢复产品授权或清理配置", icon: PowerOff, color: "var(--brand-blue)" },
  { title: "4 个账号未绑定公司", desc: "基于当前账号样本统计，建议补齐公司关系", icon: UserX, color: "var(--brand-red)" },
];

const funnel = [
  { label: "公司已创建", value: 10, total: 10, sub: "管理员已录入公司主体" },
  { label: "企业已认证", value: 7, total: 10, sub: "可进入业务产品" },
  { label: "已授权产品", value: 7, total: 10, sub: "公司已分配可访问应用" },
  { label: "已绑定成员", value: 10, total: 10, sub: "公司已关联至少一个账号" },
];

const apps = [
  { code: "GTS", name: "gts采集-101", key: "gts-prod-101" },
  { code: "PAD", name: "出海神器pad服务", key: "overseas_pad_svc" },
  { code: "ATL", name: "atlas-dev02", key: "atlas-dev02" },
  { code: "ATL", name: "atlas-test", key: "atlas-test" },
  { code: "积分", name: "积分系统", key: "boo-points" },
];

function Workbench() {
  return (
    <AppShell>
      <div className="space-y-4">
        {/* Hero */}
        <Card className="overflow-hidden border-0" style={{ background: "var(--gradient-hero)" }}>
          <CardContent className="grid gap-6 p-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="text-xs font-medium tracking-[0.2em] text-[color:var(--brand-teal)]">
                IDENTITY OPERATIONS
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                认证中心工作台
              </h1>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                统一查看公司主体认证、OAuth 接入、登录流量和系统健康状态，把每天需要处理的事项收拢在一个页面。
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button className="gap-1">
                  处理公司认证 <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="secondary">查看产品授权</Button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-[color:var(--brand-teal)]/25">
                <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-[color:var(--brand-teal)] border-r-[color:var(--brand-teal)]" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">100%</div>
                  <div className="text-[10px] text-muted-foreground">认证服务可用性</div>
                </div>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  ["SSO Auth", "认证日志接口可用"],
                  ["IAM Admin", "公司与用户接口可用"],
                  ["应用主数据", "产品/App 接口可用"],
                  ["账号中心", "账号列表接口可用"],
                ].map(([name, desc]) => (
                  <li key={name} className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[color:var(--brand-green)]" />
                    <div>
                      <div className="font-medium text-foreground">{name}</div>
                      <div className="text-xs text-muted-foreground">{desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: `color-mix(in oklab, ${s.color} 15%, transparent)`, color: s.color }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="text-2xl font-bold text-foreground">{s.value}</div>
                    <div className={`text-xs ${s.subClass ?? "text-muted-foreground"}`}>{s.sub}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Traffic + Todos */}
        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="text-base font-semibold text-foreground">认证流量</div>
                  <div className="text-xs text-muted-foreground">近 7 日登录、Token 刷新和失败认证趋势</div>
                </div>
                <Badge className="bg-[color:var(--brand-green)]/15 text-[color:var(--brand-green)] hover:bg-[color:var(--brand-green)]/15">
                  实时正常
                </Badge>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData}>
                    <defs>
                      <linearGradient id="gLogin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.65 0.15 230)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="oklch(0.65 0.15 230)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.01 250)" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend iconType="circle" />
                    <Area type="monotone" dataKey="login" name="登录成功" stroke="oklch(0.65 0.15 230)" fill="url(#gLogin)" strokeWidth={2} />
                    <Area type="monotone" dataKey="refresh" name="Token 刷新" stroke="oklch(0.72 0.17 155)" fill="transparent" strokeWidth={2} />
                    <Area type="monotone" dataKey="fail" name="失败认证" stroke="oklch(0.75 0.16 55)" fill="transparent" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="mb-4">
                <div className="text-base font-semibold text-foreground">今日待办</div>
                <div className="text-xs text-muted-foreground">建议优先处理的认证中心事项</div>
              </div>
              <ul className="space-y-3">
                {todos.map((t) => {
                  const Icon = t.icon;
                  return (
                    <li key={t.title} className="flex items-center gap-3 rounded-lg border p-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ background: `color-mix(in oklab, ${t.color} 15%, transparent)`, color: t.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground">{t.title}</div>
                        <div className="text-xs text-muted-foreground">{t.desc}</div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-primary">
                        处理
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Funnel + Apps */}
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="text-base font-semibold text-foreground">公司认证漏斗</div>
                  <div className="text-xs text-muted-foreground">企业从创建到可访问产品的关键节点</div>
                </div>
                <Button variant="link" className="h-auto p-0 text-primary">查看公司列表</Button>
              </div>
              <ul className="space-y-4">
                {funnel.map((f) => (
                  <li key={f.label}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium text-foreground">{f.label}</span>
                      <span className="text-lg font-bold text-foreground">{f.value}</span>
                    </div>
                    <Progress value={(f.value / f.total) * 100} className="mt-1.5 h-2" />
                    <div className="mt-1 text-xs text-muted-foreground">{f.sub}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="text-base font-semibold text-foreground">接入应用健康度</div>
                  <div className="text-xs text-muted-foreground">OAuth Client 和业务应用的近期运行状态</div>
                </div>
                <Button variant="link" className="h-auto p-0 text-primary">管理 OAuth Client</Button>
              </div>
              <ul className="divide-y">
                {apps.map((a) => (
                  <li key={a.key} className="flex items-center gap-3 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-[10px] font-semibold text-muted-foreground">
                      {a.code}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{a.name}</div>
                      <div className="truncate font-mono text-xs text-muted-foreground">{a.key}</div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-[color:var(--brand-green)]/15 text-[color:var(--brand-green)] hover:bg-[color:var(--brand-green)]/15">
                        可用
                      </Badge>
                      <div className="mt-1 text-[10px] text-muted-foreground">已启用</div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
