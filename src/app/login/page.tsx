"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { LogoIgc } from "@/components/marca/logo-igc";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || "Não foi possível entrar.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="mb-6 grid justify-items-center gap-2 text-center">
          <LogoIgc altura={64} prioridade />
          <h1 className="text-xl font-bold text-gray-900">Sistema de Certidões</h1>
          <p className="text-sm text-gray-500">
            Acesso restrito aos servidores do IGC.
          </p>
        </div>

        <form onSubmit={entrar} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              E-mail institucional
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="senha"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Senha
            </label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          {erro && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-800 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-brand-900 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Entrar
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-6 text-center">
          É solicitante?{" "}
          <a href="/portal/login" className="text-brand-600 hover:underline">
            Acesse o portal com gov.br
          </a>
        </p>
      </div>
    </div>
  );
}
