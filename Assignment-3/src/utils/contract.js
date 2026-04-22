import { ethers } from "ethers";
import { PRODUCT_LEDGER_ABI } from "./abi";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export function getReadContract(provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, PRODUCT_LEDGER_ABI, provider);
}

export function getWriteContract(signer) {
  return new ethers.Contract(CONTRACT_ADDRESS, PRODUCT_LEDGER_ABI, signer);
}