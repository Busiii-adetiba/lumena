import { Asset } from "@stellar/stellar-sdk";

export const KNOWN_ASSETS: Record<string, Record<string, Asset>> = {
  testnet: {
    USDC: new Asset("USDC", "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"),
    BTC: new Asset("BTC", "GDLG3LO3ILCROFOFASXRWYNO2RHSGHA2BHK3M4PGELIL33WM63HCR7UA"),
    ETH: new Asset("ETH", "GBEIOZR3L4ITBRBE6E3V3CKWXX4CSF6R6J53YDKO3IIBSPULZYJPFLBD"),
    NGNT: new Asset("NGNT", "GD5YO3NKOR25EVPZELPRGDQEUZ42J44INT3AFLFTWVIVYMHKAXXNRQVH"),
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
