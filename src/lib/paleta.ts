/**
 * Utilitários da paleta (#PEND-38): contraste WCAG entre duas cores e leitura dos tokens de cor
 * declarados em `src/app/globals.css`. Funções puras, usadas por `paleta.test.ts` para garantir
 * que nenhuma combinação de texto e fundo da identidade visual caia abaixo de AA.
 */

/** Contraste mínimo para texto comum (WCAG 2.1 AA). */
export const CONTRASTE_AA_TEXTO = 4.5;
/** Contraste mínimo para texto grande (24 px, ou 18,66 px em negrito) e componentes de interface. */
export const CONTRASTE_AA_GRANDE = 3;

/** Converte `#rgb` ou `#rrggbb` em [r, g, b] (0 a 255). */
export function hexParaRgb(hex: string): [number, number, number] {
  const limpo = hex.trim().replace(/^#/, "");
  const cheio =
    limpo.length === 3
      ? limpo
          .split("")
          .map((c) => c + c)
          .join("")
      : limpo;
  if (!/^[0-9a-fA-F]{6}$/.test(cheio)) throw new Error(`Cor inválida: ${hex}`);
  return [
    parseInt(cheio.slice(0, 2), 16),
    parseInt(cheio.slice(2, 4), 16),
    parseInt(cheio.slice(4, 6), 16),
  ];
}

/** Luminância relativa (0 a 1) da fórmula WCAG. */
export function luminanciaRelativa(hex: string): number {
  const [r, g, b] = hexParaRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste entre duas cores (1 a 21), na ordem que for. */
export function razaoDeContraste(a: string, b: string): number {
  const la = luminanciaRelativa(a);
  const lb = luminanciaRelativa(b);
  const [claro, escuro] = la >= lb ? [la, lb] : [lb, la];
  return (claro + 0.05) / (escuro + 0.05);
}

/**
 * Tokens de cor declarados em CSS (`--color-<nome>: #rrggbb;`), por nome (`brand-600`).
 * Só entende cores em hexadecimal, que é como a paleta é escrita.
 */
export function lerCoresDoCss(css: string): Record<string, string> {
  const cores: Record<string, string> = {};
  for (const m of css.matchAll(/--color-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\s*;/g)) {
    cores[m[1]] = m[2].toLowerCase();
  }
  return cores;
}
