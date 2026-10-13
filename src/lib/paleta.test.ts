import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CONTRASTE_AA_TEXTO,
  hexParaRgb,
  lerCoresDoCss,
  luminanciaRelativa,
  razaoDeContraste,
} from "./paleta";

// A fonte da verdade da paleta é o CSS; o teste a lê de lá para ninguém piorar um token sem perceber.
const css = readFileSync(path.resolve(process.cwd(), "src/app/globals.css"), "utf-8");
const cor = lerCoresDoCss(css);
const BRANCO = "#ffffff";

describe("contraste WCAG", () => {
  it("branco sobre preto é 21:1 e a ordem das cores não importa", () => {
    expect(razaoDeContraste("#ffffff", "#000000")).toBeCloseTo(21, 5);
    expect(razaoDeContraste("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(razaoDeContraste("#777777", "#777777")).toBeCloseTo(1, 5);
  });
  it("valores conhecidos da paleta do IDE-SP", () => {
    expect(razaoDeContraste(BRANCO, "#183747")).toBeCloseTo(12.53, 1);
    expect(razaoDeContraste(BRANCO, "#2d6986")).toBeCloseTo(6.04, 1);
    expect(razaoDeContraste(BRANCO, "#98a2b3")).toBeCloseTo(2.58, 1);
  });
  it("hexParaRgb aceita 3 e 6 dígitos e recusa lixo", () => {
    expect(hexParaRgb("#fff")).toEqual([255, 255, 255]);
    expect(hexParaRgb("#2D6986")).toEqual([45, 105, 134]);
    expect(() => hexParaRgb("azul")).toThrow();
  });
  it("luminância fica entre 0 e 1", () => {
    expect(luminanciaRelativa("#000000")).toBe(0);
    expect(luminanciaRelativa("#ffffff")).toBeCloseTo(1, 5);
  });
});

describe("tokens declarados em globals.css", () => {
  const ESCALA = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

  it.each(["brand", "gray", "red"])("a escala %s tem os 11 passos, todos em hexadecimal", (familia) => {
    for (const passo of ESCALA) expect(cor[`${familia}-${passo}`], `${familia}-${passo}`).toMatch(/^#[0-9a-f]{6}$/);
  });
  it("areia e marca estão declaradas", () => {
    for (const t of ["areia-100", "areia-600", "areia-700", "marca-100", "marca-500"]) {
      expect(cor[t], t).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
  it.each(["brand", "gray", "red"])("a escala %s escurece a cada passo", (familia) => {
    const luminancias = ESCALA.map((p) => luminanciaRelativa(cor[`${familia}-${p}`]));
    for (let i = 1; i < luminancias.length; i++) {
      expect(luminancias[i], `${familia}-${ESCALA[i]} deveria ser mais escuro que o passo anterior`).toBeLessThan(
        luminancias[i - 1]
      );
    }
  });
  it("a paleta aprovada: valores da proposta de identidade visual", () => {
    expect(cor["brand-800"]).toBe("#183747");
    expect(cor["brand-600"]).toBe("#2d6986");
    expect(cor["brand-50"]).toBe("#e6eff4");
    expect(cor["gray-500"]).toBe("#5f6c85");
    expect(cor["gray-900"]).toBe("#020817");
    expect(cor["areia-100"]).toBe("#e9e6dd");
    expect(cor["red-700"]).toBe("#b42318");
  });
});

/** [texto, fundo, o que representa]: cada par tem de passar em AA para texto comum (4,5:1). */
const PARES_AA: [string, string, string][] = [
  // Texto neutro sobre as superfícies da aplicação
  ["gray-500", "white", "texto de apoio sobre a página"],
  ["gray-500", "gray-50", "texto de apoio sobre o fundo da página"],
  ["gray-500", "gray-100", "texto de apoio sobre fundos suaves"],
  ["gray-600", "white", "texto secundário"],
  ["gray-600", "gray-100", "texto secundário sobre fundos suaves"],
  ["gray-700", "white", "menu e rótulos"],
  ["gray-700", "gray-100", "menu sobre fundos suaves"],
  ["gray-800", "gray-100", "texto forte sobre fundos suaves"],
  ["gray-900", "white", "texto principal"],
  ["gray-900", "gray-50", "texto principal sobre o fundo da página"],
  ["gray-900", "brand-50", "texto principal sobre o destaque da marca"],
  // Marca
  ["brand-600", "white", "links e foco"],
  ["brand-600", "gray-50", "links sobre o fundo da página"],
  ["brand-600", "brand-50", "link sobre o destaque da marca"],
  ["brand-700", "white", "ênfase"],
  ["brand-700", "brand-50", "item ativo da barra lateral"],
  ["brand-800", "brand-50", "chip e item ativo"],
  ["brand-800", "brand-100", "chip da marca"],
  ["white", "brand-600", "botão e balão da marca"],
  ["white", "brand-700", "botão da marca"],
  ["white", "brand-800", "botão primário"],
  ["white", "brand-900", "botão primário em hover"],
  // Faixa de navegação do portal
  ["gray-700", "areia-100", "links da faixa bege"],
  ["brand-800", "areia-100", "destaque na faixa bege"],
  ["white", "areia-700", "botão de areia"],
  // Erro e ação destrutiva
  ["red-600", "white", "mensagem de erro"],
  ["red-600", "red-50", "mensagem de erro sobre fundo de erro"],
  ["red-700", "white", "erro e ação destrutiva"],
  ["red-700", "red-50", "caixa de erro"],
  ["red-800", "red-100", "chip de erro"],
  ["white", "red-600", "botão de erro"],
  ["white", "red-700", "botão destrutivo"],
];

describe("contraste dos pares texto e fundo (AA)", () => {
  const valor = (nome: string) => (nome === "white" ? BRANCO : cor[nome]);

  it.each(PARES_AA)("%s sobre %s passa em AA (%s)", (texto, fundo) => {
    const razao = razaoDeContraste(valor(texto), valor(fundo));
    expect(razao, `${texto} (${valor(texto)}) sobre ${fundo} (${valor(fundo)}) = ${razao.toFixed(2)}:1`).toBeGreaterThanOrEqual(
      CONTRASTE_AA_TEXTO
    );
  });

  it("as cores só de decoração realmente NÃO passam: ninguém deve usá-las em texto", () => {
    for (const t of ["gray-400", "areia-600", "marca-500"]) {
      expect(razaoDeContraste(cor[t], BRANCO), t).toBeLessThan(CONTRASTE_AA_TEXTO);
    }
  });
});
