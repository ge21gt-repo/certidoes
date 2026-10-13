import Link from "next/link";
import { getSolicitanteLogado } from "@/lib/portal-auth";
import { LogoutButton } from "@/components/portal-logout";
import { LogoIgc } from "@/components/marca/logo-igc";

export const metadata = {
  title: "Portal do Solicitante — Certidões",
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const solicitante = await getSolicitanteLogado();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/portal" className="flex items-center gap-3 min-w-0">
            <LogoIgc altura={52} prioridade />
            <span className="min-w-0 leading-tight">
              <span className="block font-bold text-gray-900">Portal de Certidões</span>
              <span className="block text-xs text-gray-500">Certidão de Jurisdição Territorial</span>
            </span>
          </Link>
          {solicitante && (
            <span className="hidden sm:inline text-sm text-gray-700 [overflow-wrap:anywhere]">
              {solicitante.nome}
            </span>
          )}
        </div>
      </header>
      {solicitante && (
        <nav aria-label="Áreas do portal" className="bg-areia-100 text-sm">
          <div className="max-w-5xl mx-auto px-4 py-2 flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link href="/portal" className="font-medium text-gray-700 hover:text-brand-800 hover:underline underline-offset-4">
              Minhas Requisições
            </Link>
            <Link
              href="/portal/nova-solicitacao"
              className="font-medium text-gray-700 hover:text-brand-800 hover:underline underline-offset-4"
            >
              Nova Requisição
            </Link>
            <Link
              href="/portal/cadastro"
              className="font-medium text-gray-700 hover:text-brand-800 hover:underline underline-offset-4"
            >
              Cadastro
            </Link>
            <span className="ml-auto">
              <LogoutButton />
            </span>
          </div>
        </nav>
      )}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">{children}</main>
      <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-xs text-gray-600">
        Serviço de emissão de certidões — identidade validada pela plataforma gov.br
      </footer>
    </div>
  );
}
