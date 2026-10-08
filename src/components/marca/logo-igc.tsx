import Image from "next/image";

/** Proporção do arquivo `public/marca/igc-logo.png` (176 × 141 px). */
const LARGURA_ARQUIVO = 176;
const ALTURA_ARQUIVO = 141;

/**
 * Logo do IGC (identidade visual, #PEND-38). É a única logo institucional da aplicação: a do
 * Governo do Estado de SP não é usada. O arquivo é provisório (pequeno e sobre fundo branco), por
 * isso só se usa sobre fundo claro e em até ~64 px de altura; trocar por SVG ou PNG de alta
 * resolução mantém este componente como está. `unoptimized`: o arquivo é leve (15 KB) e assim
 * a imagem não depende do otimizador de imagens do Next em produção.
 */
export function LogoIgc({
  altura = 48,
  className = "",
  prioridade = false,
}: {
  /** Altura de exibição, em pixels. */
  altura?: number;
  className?: string;
  /** Carrega antes das demais imagens (logo do topo da página). */
  prioridade?: boolean;
}) {
  const largura = Math.round((altura * LARGURA_ARQUIVO) / ALTURA_ARQUIVO);
  return (
    <Image
      src="/marca/igc-logo.png"
      alt="IGC — Instituto Geográfico e Cartográfico"
      width={largura}
      height={altura}
      priority={prioridade}
      unoptimized
      className={`shrink-0 ${className}`}
    />
  );
}
