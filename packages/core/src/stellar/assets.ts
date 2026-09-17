import { Asset } from "@stellar/stellar-sdk";

export const KNOWN_ASSETS: Record<string, Record<string, Asset>> = {
  testnet: {
    USDC: new Asset("USDC", "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"),
    BTC: new Asset("BTC", "GATOLX4X4ZA2TEWVB2AM6N55J3JNVXMPIVO6VFLGVU2DDTCO5TM4U6KU"),
    ETH: new Asset("ETH", "GCUBBYV3THU45DY472OHY2JBUQXSS4FAWJMFEHC4H7YJY6SPJTT4DYZI"),
    NGNT: new Asset("NGNT", "GBTSZFJT5VZBG54YH5AILJBPX3TYUX5NVPPJR6B4RPLL2GF5H54EGY4Y"),
  },
  mainnet: {
    USDC: new Asset("USDC", "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"),
  },
};

export function getAsset(code: string, issuer: string): Asset {
  return new Asset(code, issuer);
}

export function getNativeAsset(): Asset {
  return Asset.native();
}
