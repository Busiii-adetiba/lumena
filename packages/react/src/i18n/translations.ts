/**
 * Lumen i18n translation dictionaries.
 *
 * Covers all user-visible strings from prebuilt @lumen/react UI components:
 * LumenBalance, LumenWalletCard, and error/status messages from hooks.
 *
 * Supported locales: en, es, pt, fr, ja
 */

export type LumenLocale = "en" | "es" | "pt" | "fr" | "ja";

export interface LumenTranslations {
  // LumenBalance
  balance: {
    loading: string;
    error: string;
    refreshLabel: string;
    assetLabel: (assetCode: string) => string;
  };
  // LumenWalletCard
  walletCard: {
    cardLabel: (address: string) => string;
    addressLabel: (address: string) => string;
    copyButton: string;
    copiedButton: string;
    qrCodeLabel: string;
  };
  // useMultiSigApproval
  multiSig: {
    sessionCreating: string;
    sessionPending: string;
    sessionApproved: string;
    sessionRejected: string;
    sessionExpired: string;
    sessionError: string;
    merging: string;
  };
  // General errors
  errors: {
    generic: string;
    network: string;
    unauthorized: string;
    walletNotFound: string;
    policyViolation: string;
  };
}

const en: LumenTranslations = {
  balance: {
    loading: "Loading balance…",
    error: "Failed to load balance",
    refreshLabel: "Refresh balance",
    assetLabel: (assetCode) => assetCode,
  },
  walletCard: {
    cardLabel: (address) => `Wallet card for ${address}`,
    addressLabel: (address) => `Wallet address: ${address}`,
    copyButton: "Copy wallet address",
    copiedButton: "Address copied",
    qrCodeLabel: "Wallet QR code",
  },
  multiSig: {
    sessionCreating: "Creating co-signing session…",
    sessionPending: "Waiting for secondary device approval…",
    sessionApproved: "Session approved",
    sessionRejected: "Session rejected",
    sessionExpired: "Session expired",
    sessionError: "Co-signing session error",
    merging: "Merging signatures…",
  },
  errors: {
    generic: "An unexpected error occurred",
    network: "Network error — please check your connection",
    unauthorized: "Unauthorized",
    walletNotFound: "Wallet not found",
    policyViolation: "Transaction rejected by policy",
  },
};

const es: LumenTranslations = {
  balance: {
    loading: "Cargando saldo…",
    error: "Error al cargar el saldo",
    refreshLabel: "Actualizar saldo",
    assetLabel: (assetCode) => assetCode,
  },
  walletCard: {
    cardLabel: (address) => `Tarjeta de billetera para ${address}`,
    addressLabel: (address) => `Dirección de billetera: ${address}`,
    copyButton: "Copiar dirección de billetera",
    copiedButton: "Dirección copiada",
    qrCodeLabel: "Código QR de billetera",
  },
  multiSig: {
    sessionCreating: "Creando sesión de co-firma…",
    sessionPending: "Esperando aprobación del dispositivo secundario…",
    sessionApproved: "Sesión aprobada",
    sessionRejected: "Sesión rechazada",
    sessionExpired: "Sesión expirada",
    sessionError: "Error en la sesión de co-firma",
    merging: "Combinando firmas…",
  },
  errors: {
    generic: "Ocurrió un error inesperado",
    network: "Error de red — verifica tu conexión",
    unauthorized: "No autorizado",
    walletNotFound: "Billetera no encontrada",
    policyViolation: "Transacción rechazada por política",
  },
};

const pt: LumenTranslations = {
  balance: {
    loading: "Carregando saldo…",
    error: "Falha ao carregar saldo",
    refreshLabel: "Atualizar saldo",
    assetLabel: (assetCode) => assetCode,
  },
  walletCard: {
    cardLabel: (address) => `Cartão da carteira para ${address}`,
    addressLabel: (address) => `Endereço da carteira: ${address}`,
    copyButton: "Copiar endereço da carteira",
    copiedButton: "Endereço copiado",
    qrCodeLabel: "QR code da carteira",
  },
  multiSig: {
    sessionCreating: "Criando sessão de co-assinatura…",
    sessionPending: "Aguardando aprovação do dispositivo secundário…",
    sessionApproved: "Sessão aprovada",
    sessionRejected: "Sessão rejeitada",
    sessionExpired: "Sessão expirada",
    sessionError: "Erro na sessão de co-assinatura",
    merging: "Mesclando assinaturas…",
  },
  errors: {
    generic: "Ocorreu um erro inesperado",
    network: "Erro de rede — verifique sua conexão",
    unauthorized: "Não autorizado",
    walletNotFound: "Carteira não encontrada",
    policyViolation: "Transação rejeitada pela política",
  },
};

const fr: LumenTranslations = {
  balance: {
    loading: "Chargement du solde…",
    error: "Impossible de charger le solde",
    refreshLabel: "Actualiser le solde",
    assetLabel: (assetCode) => assetCode,
  },
  walletCard: {
    cardLabel: (address) => `Carte de portefeuille pour ${address}`,
    addressLabel: (address) => `Adresse du portefeuille : ${address}`,
    copyButton: "Copier l'adresse du portefeuille",
    copiedButton: "Adresse copiée",
    qrCodeLabel: "QR code du portefeuille",
  },
  multiSig: {
    sessionCreating: "Création de la session de co-signature…",
    sessionPending: "En attente de l'approbation de l'appareil secondaire…",
    sessionApproved: "Session approuvée",
    sessionRejected: "Session rejetée",
    sessionExpired: "Session expirée",
    sessionError: "Erreur de session de co-signature",
    merging: "Fusion des signatures…",
  },
  errors: {
    generic: "Une erreur inattendue s'est produite",
    network: "Erreur réseau — vérifiez votre connexion",
    unauthorized: "Non autorisé",
    walletNotFound: "Portefeuille introuvable",
    policyViolation: "Transaction rejetée par la politique",
  },
};

const ja: LumenTranslations = {
  balance: {
    loading: "残高を読み込み中…",
    error: "残高の読み込みに失敗しました",
    refreshLabel: "残高を更新",
    assetLabel: (assetCode) => assetCode,
  },
  walletCard: {
    cardLabel: (address) => `${address} のウォレットカード`,
    addressLabel: (address) => `ウォレットアドレス: ${address}`,
    copyButton: "ウォレットアドレスをコピー",
    copiedButton: "アドレスをコピーしました",
    qrCodeLabel: "ウォレットの QR コード",
  },
  multiSig: {
    sessionCreating: "共同署名セッションを作成中…",
    sessionPending: "セカンダリデバイスの承認を待っています…",
    sessionApproved: "セッションが承認されました",
    sessionRejected: "セッションが拒否されました",
    sessionExpired: "セッションが期限切れです",
    sessionError: "共同署名セッションエラー",
    merging: "署名をマージ中…",
  },
  errors: {
    generic: "予期しないエラーが発生しました",
    network: "ネットワークエラー — 接続を確認してください",
    unauthorized: "認証されていません",
    walletNotFound: "ウォレットが見つかりません",
    policyViolation: "ポリシーによってトランザクションが拒否されました",
  },
};

/** All bundled translation dictionaries keyed by locale code. */
export const translations: Record<LumenLocale, LumenTranslations> = {
  en,
  es,
  pt,
  fr,
  ja,
};
