"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-800 text-white rounded-md text-sm font-medium hover:bg-brand-900 print:hidden"
    >
      <Printer className="h-4 w-4" />
      Imprimir / Salvar PDF
    </button>
  );
}
