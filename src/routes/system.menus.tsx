import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Pencil,
  Trash2,
  LayoutGrid,
  UserSquare2,
  Home,
  FileText,
  Link2,
  Settings,
  Building2,
  Users as UsersIcon,
  BookMarked,
  HelpCircle,
  Minus,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Route = createFileRoute("/system/menus")({
  head: () => ({
    meta: [
      { title: "后台系统菜单管理 — Boo Identity Cloud" },
      { name: "description", content: "配置后台菜单树与角色可见性。" },
    ],
  }),
  component: MenusPage,
});

type MenuType = "catalog" | "menu" | "button";
type OnOff = "on" | "off";
type ShowState = "show" | "hide";
type MenuStatus = "normal" | "disabled";

interface MenuItem {
  id: string;
  parentId: string | null;
  name: string;
  icon?: string;
  routeName: string;
  type: MenuType;
  perm: string;
  path: string;
  component: string;
  order: number;
  external: OnOff;
  redirect: string;
  highlight: string;
  show: ShowState;
  status: MenuStatus;
  fullscreen: OnOff;
  affix: OnOff;
  cache: OnOff;
  hideTab: OnOff;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutGrid,
  UserSquare2,
  Home,
  FileText,
  Link2,
  Settings,
  Building2,
  Users: UsersIcon,
  BookMarked,
};

const seedMenus: MenuItem[] = [
  // buttons
  { id: "b1", parentId: "m-dict", name: "字典新增", routeName: "--", type: "button", perm: "system:dict:add", path: "--", component: "--", order: 1, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "m-company-list", parentId: "c-company", name: "公司列表", icon: "LayoutGrid", routeName: "companyList", type: "menu", perm: "company:list", path: "/company/list", component: "/company/list/index", order: 1, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "m-account-list", parentId: "c-account", name: "认证账号列表", icon: "LayoutGrid", routeName: "authAccountManage", type: "menu", perm: "account:list", path: "/accountManage", component: "/accountManage/index", order: 1, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "m-app-list", parentId: "c-app", name: "产品/App管理", icon: "LayoutGrid", routeName: "appList", type: "menu", perm: "app:list", path: "/app/list", component: "/app/list/index", order: 1, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "b2", parentId: "m-policy", name: "协议与声明查看", routeName: "PolicyDocumentView", type: "button", perm: "system:policy-document:view", path: "--", component: "--", order: 3, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "m-user", parentId: "c-system", name: "后台系统用户管理", icon: "UserSquare2", routeName: "accountManage", type: "menu", perm: "system:user:list", path: "/system/accountManage", component: "/system/accountManage/index", order: 1, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "m-home", parentId: null, name: "工作台", icon: "Home", routeName: "home", type: "menu", perm: "home", path: "/home/index", component: "/home/index", order: 0, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "on", cache: "on", hideTab: "off" },
  { id: "m-log", parentId: "c-log", name: "日志管理", icon: "FileText", routeName: "logManage", type: "menu", perm: "log:list", path: "/logManage", component: "/logManage/index", order: 1, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "b3", parentId: "m-user", name: "后台用户新增", routeName: "--", type: "button", perm: "system:user:add", path: "--", component: "--", order: 1, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "b4", parentId: "m-menu", name: "菜单新增", routeName: "--", type: "button", perm: "system:menu:add", path: "--", component: "--", order: 1, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "b5", parentId: "m-dict", name: "字典编辑", routeName: "--", type: "button", perm: "system:dict:edit", path: "--", component: "--", order: 2, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "b6", parentId: "m-menu", name: "菜单编辑", routeName: "--", type: "button", perm: "system:menu:edit", path: "--", component: "--", order: 2, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "b7", parentId: "m-policy", name: "协议与声明新增", routeName: "PolicyDocumentAdd", type: "button", perm: "system:policy-document:add", path: "--", component: "--", order: 1, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "b8", parentId: "m-user", name: "后台用户编辑", routeName: "--", type: "button", perm: "system:user:edit", path: "--", component: "--", order: 2, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "m-oauth", parentId: "c-app", name: "OAuth Client管理", icon: "Link2", routeName: "applicationManage", type: "menu", perm: "client:list", path: "/applicationManage", component: "/applicationManage/index", order: 2, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "b9", parentId: "m-dict", name: "字典数据", routeName: "--", type: "button", perm: "system:dict:list", path: "--", component: "--", order: 3, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "m-menu", parentId: "c-system", name: "后台系统菜单管理", icon: "LayoutGrid", routeName: "menuMange", type: "menu", perm: "system:menu:list", path: "/system/menuMange", component: "/system/menuMange/index", order: 2, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "b10", parentId: "m-menu", name: "菜单删除", routeName: "--", type: "button", perm: "system:menu:remove", path: "--", component: "--", order: 3, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "b11", parentId: "m-user", name: "后台用户重置密码", routeName: "--", type: "button", perm: "system:user:reset-password", path: "--", component: "--", order: 3, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "b12", parentId: "m-policy", name: "协议与声明启停", routeName: "PolicyDocumentStatus", type: "button", perm: "system:policy-document:status", path: "--", component: "--", order: 2, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "m-dict", parentId: "c-system", name: "后台系统字典管理", icon: "BookMarked", routeName: "dictManage", type: "menu", perm: "system:dict:list", path: "/system/dictManage", component: "/system/dictManage/index", order: 4, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "on", hideTab: "off" },
  { id: "b13", parentId: "m-user", name: "后台用户启停", routeName: "--", type: "button", perm: "system:user:status", path: "--", component: "--", order: 4, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "b14", parentId: "m-dict", name: "字典删除", routeName: "--", type: "button", perm: "system:dict:remove", path: "--", component: "--", order: 4, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  // catalogs
  { id: "c-company", parentId: null, name: "公司管理", icon: "Building2", routeName: "company", type: "catalog", perm: "companyManage", path: "/company", component: "Layout", order: 1, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "m-policy", parentId: "c-system", name: "协议与声明配置", icon: "UserSquare2", routeName: "PolicyDocument", type: "menu", perm: "system:policy-document:list", path: "/system/policy-document", component: "/system/policy-document/index", order: 5, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "c-app", parentId: null, name: "应用管理", icon: "LayoutGrid", routeName: "app", type: "catalog", perm: "appManage", path: "/app", component: "Layout", order: 2, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "c-account", parentId: null, name: "账号管理", icon: "UserSquare2", routeName: "account", type: "catalog", perm: "accountManage", path: "/account", component: "Layout", order: 3, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "c-log", parentId: null, name: "审计日志", icon: "FileText", routeName: "log", type: "catalog", perm: "logManage", path: "/log", component: "Layout", order: 4, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
  { id: "c-system", parentId: null, name: "系统管理", icon: "Settings", routeName: "system", type: "catalog", perm: "systemManage", path: "/system", component: "Layout", order: 5, external: "off", redirect: "", highlight: "", show: "show", status: "normal", fullscreen: "off", affix: "off", cache: "off", hideTab: "off" },
];

const typeLabels: Record<MenuType, string> = {
  catalog: "目录",
  menu: "菜单",
  button: "按钮",
};

function MenusPage() {
  const [items, setItems] = useState<MenuItem[]>(seedMenus);
  const [nameQuery, setNameQuery] = useState("");
  const [typeQuery, setTypeQuery] = useState<"all" | MenuType>("all");
  const [applied, setApplied] = useState({ name: "", type: "all" as "all" | MenuType });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MenuItem | null>(null);

  const filtered = useMemo(() => {
    return items.filter((m) => {
      if (applied.name && !m.name.toLowerCase().includes(applied.name.toLowerCase()))
        return false;
      if (applied.type !== "all" && m.type !== applied.type) return false;
      return true;
    });
  }, [items, applied]);

  const parentOptions = useMemo(
    () =>
      [{ id: "__root", name: "主目录" }].concat(
        items
          .filter((m) => m.type !== "button")
          .map((m) => ({ id: m.id, name: m.name }))
      ),
    [items]
  );

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (m: MenuItem) => {
    setEditing(m);
    setDialogOpen(true);
  };

  const handleSave = (data: MenuItem) => {
    if (editing) {
      setItems((prev) => prev.map((x) => (x.id === editing.id ? { ...data, id: editing.id } : x)));
      toast.success("菜单已更新");
    } else {
      setItems((prev) => [...prev, { ...data, id: `n-${Date.now()}` }]);
      toast.success("菜单已创建");
    }
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setItems((prev) => prev.filter((x) => x.id !== pendingDelete.id));
    toast.success(`已删除“${pendingDelete.name}”`);
    setPendingDelete(null);
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="rounded-lg border bg-card px-6 py-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-right text-sm text-muted-foreground">菜单名称：</span>
              <Input
                className="w-64"
                placeholder="请输入"
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-right text-sm text-muted-foreground">菜单类型：</span>
              <Select
                value={typeQuery}
                onValueChange={(v) => setTypeQuery(v as "all" | MenuType)}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="catalog">目录</SelectItem>
                  <SelectItem value="menu">菜单</SelectItem>
                  <SelectItem value="button">按钮</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  setApplied({ name: nameQuery, type: typeQuery });
                }}
              >
                <Search className="mr-1.5 h-4 w-4" />
                搜索
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setNameQuery("");
                  setTypeQuery("all");
                  setApplied({ name: "", type: "all" });
                }}
              >
                <RotateCcw className="mr-1.5 h-4 w-4" />
                重置
              </Button>
            </div>
          </div>
        </div>

        {/* Table card */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              onClick={openCreate}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              新增菜单
            </Button>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-center">菜单名称</TableHead>
                <TableHead className="text-center">菜单图标</TableHead>
                <TableHead className="text-center">路由名称</TableHead>
                <TableHead className="text-center">菜单类型</TableHead>
                <TableHead className="text-center">权限标识</TableHead>
                <TableHead className="text-center">菜单路径</TableHead>
                <TableHead className="text-center">组件路径</TableHead>
                <TableHead className="text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m, idx) => {
                const Icon = m.icon ? iconMap[m.icon] : null;
                return (
                  <TableRow
                    key={m.id}
                    className={idx === 0 ? "bg-primary/5 hover:bg-primary/10" : undefined}
                  >
                    <TableCell className="text-center text-sm">{m.name}</TableCell>
                    <TableCell className="text-center">
                      {Icon ? (
                        <Icon className="mx-auto h-4 w-4 text-muted-foreground" />
                      ) : null}
                    </TableCell>
                    <TableCell className="text-center font-mono text-sm">{m.routeName}</TableCell>
                    <TableCell className="text-center text-sm">{typeLabels[m.type]}</TableCell>
                    <TableCell className="text-center font-mono text-xs">{m.perm}</TableCell>
                    <TableCell className="text-center font-mono text-xs">{m.path}</TableCell>
                    <TableCell className="text-center font-mono text-xs">{m.component}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          onClick={() => openEdit(m)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          编辑
                        </button>
                        <button
                          className="inline-flex items-center gap-1 text-sm text-rose-600 hover:underline"
                          onClick={() => setPendingDelete(m)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          删除
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-sm text-muted-foreground">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <MenuFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        parentOptions={parentOptions}
        onSave={handleSave}
      />

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              温馨提示
            </AlertDialogTitle>
            <AlertDialogDescription>
              是否确认删除菜单名称为“{pendingDelete?.name}”的数据？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-primary hover:bg-primary/90"
            >
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

// ============ Menu Form Dialog ============

const emptyMenu: MenuItem = {
  id: "",
  parentId: null,
  name: "",
  icon: "",
  routeName: "",
  type: "catalog",
  perm: "",
  path: "",
  component: "",
  order: 0,
  external: "off",
  redirect: "",
  highlight: "",
  show: "show",
  status: "normal",
  fullscreen: "off",
  affix: "off",
  cache: "off",
  hideTab: "off",
};

function MenuFormDialog({
  open,
  onOpenChange,
  editing,
  parentOptions,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: MenuItem | null;
  parentOptions: { id: string; name: string }[];
  onSave: (data: MenuItem) => void;
}) {
  const [form, setForm] = useState<MenuItem>(emptyMenu);

  // reset when open toggles
  useMemo(() => {
    if (open) {
      setForm(editing ? { ...editing } : { ...emptyMenu });
    }
  }, [open, editing]);

  const set = <K extends keyof MenuItem>(k: K, v: MenuItem[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name.trim()) {
      toast.error("请填写菜单名称");
      return;
    }
    if (form.type !== "button" && !form.routeName.trim()) {
      toast.error("请填写路由名称");
      return;
    }
    onSave(form);
  };

  const isButton = form.type === "button";
  const isMenu = form.type === "menu";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{editing ? "编辑菜单" : "新增菜单"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-2">
          {/* 上级菜单 */}
          <FormRow required label="上级菜单" span={2}>
            <Select
              value={form.parentId ?? "__root"}
              onValueChange={(v) => set("parentId", v === "__root" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="主目录" />
              </SelectTrigger>
              <SelectContent>
                {parentOptions
                  .filter((o) => o.id !== editing?.id)
                  .map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </FormRow>

          {/* 菜单类型 */}
          <FormRow required label="菜单类型" span={2}>
            <RadioGroup
              value={form.type}
              onChange={(v) => set("type", v as MenuType)}
              options={[
                { value: "catalog", label: "目录" },
                { value: "menu", label: "菜单" },
                { value: "button", label: "按钮" },
              ]}
            />
          </FormRow>

          {/* 菜单图标 & 菜单名称 */}
          {!isButton && (
            <FormRow required label="菜单图标">
              <Input
                value={form.icon ?? ""}
                onChange={(e) => set("icon", e.target.value)}
                placeholder="LayoutGrid / Home / Settings ..."
              />
            </FormRow>
          )}
          <FormRow required label="菜单名称" span={isButton ? 2 : 1}>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </FormRow>

          {/* 路由名称 & 显示排序 */}
          <FormRow required={!isButton} label="路由名称">
            <Input
              value={form.routeName}
              onChange={(e) => set("routeName", e.target.value)}
              disabled={isButton}
            />
          </FormRow>
          <FormRow required label="显示排序">
            <NumberStepper
              value={form.order}
              onChange={(v) => set("order", v)}
            />
          </FormRow>

          {/* 是否外链 & 路由地址 */}
          {!isButton && (
            <>
              <FormRow label="是否外链">
                <RadioGroup
                  value={form.external}
                  onChange={(v) => set("external", v as OnOff)}
                  options={[
                    { value: "on", label: "是" },
                    { value: "off", label: "否" },
                  ]}
                />
              </FormRow>
              <FormRow required label="路由地址" hint="访问该菜单的路由，如 /system/menuMange">
                <Input
                  value={form.path}
                  onChange={(e) => set("path", e.target.value)}
                />
              </FormRow>
            </>
          )}

          {/* 重定向地址 & 详情页高亮菜单 */}
          {!isButton && (
            <>
              <FormRow label="重定向地址">
                <Input
                  value={form.redirect}
                  onChange={(e) => set("redirect", e.target.value)}
                />
              </FormRow>
              <FormRow label="详情页高亮菜单">
                <Input
                  value={form.highlight}
                  onChange={(e) => set("highlight", e.target.value)}
                />
              </FormRow>
            </>
          )}

          {/* 组件路径 & 权限字符 (菜单/按钮) */}
          {isMenu && (
            <FormRow required label="组件路径" hint="组件文件位置，如 /system/menuMange/index">
              <Input
                value={form.component}
                onChange={(e) => set("component", e.target.value)}
              />
            </FormRow>
          )}
          {(isMenu || isButton) && (
            <FormRow required={isMenu || isButton} label="权限字符">
              <Input
                value={form.perm}
                onChange={(e) => set("perm", e.target.value)}
                placeholder="如 system:menu:list"
              />
            </FormRow>
          )}

          {/* 显示状态 & 菜单状态 */}
          {!isButton && (
            <FormRow label="显示状态" hint="隐藏后该菜单不在侧边栏出现">
              <RadioGroup
                value={form.show}
                onChange={(v) => set("show", v as ShowState)}
                options={[
                  { value: "show", label: "显示" },
                  { value: "hide", label: "隐藏" },
                ]}
              />
            </FormRow>
          )}
          <FormRow label="菜单状态" hint="停用后不可访问">
            <RadioGroup
              value={form.status}
              onChange={(v) => set("status", v as MenuStatus)}
              options={[
                { value: "normal", label: "正常" },
                { value: "disabled", label: "停用" },
              ]}
            />
          </FormRow>

          {/* 是否全屏 & 是否固定标签页 */}
          {!isButton && (
            <>
              <FormRow label="是否全屏">
                <RadioGroup
                  value={form.fullscreen}
                  onChange={(v) => set("fullscreen", v as OnOff)}
                  options={[
                    { value: "on", label: "是" },
                    { value: "off", label: "否" },
                  ]}
                />
              </FormRow>
              <FormRow label="是否固定标签页">
                <RadioGroup
                  value={form.affix}
                  onChange={(v) => set("affix", v as OnOff)}
                  options={[
                    { value: "on", label: "是" },
                    { value: "off", label: "否" },
                  ]}
                />
              </FormRow>

              <FormRow label="是否缓存路由">
                <RadioGroup
                  value={form.cache}
                  onChange={(v) => set("cache", v as OnOff)}
                  options={[
                    { value: "on", label: "是" },
                    { value: "off", label: "否" },
                  ]}
                />
              </FormRow>
              <FormRow label="是否隐藏标签">
                <RadioGroup
                  value={form.hideTab}
                  onChange={(v) => set("hideTab", v as OnOff)}
                  options={[
                    { value: "on", label: "是" },
                    { value: "off", label: "否" },
                  ]}
                />
              </FormRow>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={submit}
            className="bg-primary hover:bg-primary/90"
          >
            确定
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============ Small form helpers ============

function FormRow({
  label,
  required,
  hint,
  span = 1,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  span?: 1 | 2;
  children: React.ReactNode;
}) {
  return (
    <div className={span === 2 ? "col-span-2" : undefined}>
      <div className="mb-1.5 flex items-center gap-1">
        {required && <span className="text-rose-500">*</span>}
        {hint && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">{hint}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Label className="text-sm text-muted-foreground">{label}</Label>
      </div>
      {children}
    </div>
  );
}

function RadioGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-6 py-2">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className="flex items-center gap-2 text-sm"
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                active ? "border-primary" : "border-muted-foreground/40"
              }`}
            >
              {active && <span className="h-2 w-2 rounded-full bg-primary" />}
            </span>
            <span className={active ? "text-primary" : "text-foreground"}>
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function NumberStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center rounded-md border">
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center border-r text-muted-foreground hover:bg-muted"
        onClick={() => onChange(Math.max(0, value - 1))}
      >
        <Minus className="h-4 w-4" />
      </button>
      <Input
        className="h-9 flex-1 border-0 text-center focus-visible:ring-0"
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value.replace(/\D/g, ""));
          onChange(Number.isFinite(n) ? n : 0);
        }}
      />
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center border-l text-muted-foreground hover:bg-muted"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
