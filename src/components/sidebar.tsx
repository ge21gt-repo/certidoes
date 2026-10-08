"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Columns3,
  Map as MapIcon,
  Bell,
  PlusCircle,
  Users,
  Settings,
  Inbox,
  PenLine,
  UserPlus,
} from "lucide-react";
import { StaffLogoutButton } from "@/components/staff-logout";
import { LogoIgc } from "@/components/marca/logo-igc";

interface ItemNav {
  name: string;
  href: string;
  icon: typeof Users;
  /** Gerenciamento de usuarios aparece somente para o administrador. */
  somenteAdmin?: boolean;
  /** Restringe o item a alguns papeis (ex.: geometria so para ADMIN e TECNICO). */
  papeis?: string[];
}

const navigation: ItemNav[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Requisicoes", href: "/requisicoes", icon: Inbox },
  { name: "Assinaturas Pendentes", href: "/assinaturas", icon: PenLine },
  { name: "Cadastro de Cliente", href: "/clientes", icon: UserPlus },
  { name: "Processos", href: "/processos", icon: FileText },
  { name: "Quadro", href: "/quadro", icon: Columns3 },
  { name: "Corte de Divisas", href: "/geometria", icon: MapIcon, papeis: ["ADMIN", "TECNICO"] },
  { name: "Novo Processo", href: "/processos/novo", icon: PlusCircle },
  { name: "Notificacoes", href: "/notificacoes", icon: Bell },
  { name: "Usuarios", href: "/usuarios", icon: Users, somenteAdmin: true },
  { name: "Configuracoes", href: "/configuracoes", icon: Settings },
];

interface SidebarProps {
  usuario: { name: string; email: string; role: string };
}

export function Sidebar({ usuario }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <LogoIgc altura={44} prioridade />
        <div className="min-w-0 leading-tight">
          <h1 className="text-sm font-bold text-gray-900">Sistema de Certidões</h1>
          <p className="text-[11px] text-gray-600 mt-0.5">Instituto Geográfico e Cartográfico</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation
          .filter((item) => !item.somenteAdmin || usuario.role === "ADMIN")
          .filter((item) => !item.papeis || item.papeis.includes(usuario.role))
          .map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-brand-600" : ""}`} />
                {item.name}
              </Link>
            );
          })}
      </nav>
      <div className="p-4 border-t border-gray-200 space-y-1">
        <p className="text-sm font-medium text-gray-900">{usuario.name}</p>
        <p className="text-xs text-gray-500">{usuario.email}</p>
        <p className="text-xs text-gray-500">
          As ações disponíveis seguem o papel {usuario.role}.
        </p>
        <div className="pt-2">
          <StaffLogoutButton />
        </div>
      </div>
    </div>
  );
}
