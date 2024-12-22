import { ethers } from "ethers";
import { config } from "../config/init";

//  ethereum connection setup

export const provider = new ethers.JsonRpcProvider(config.rpcUrl);
export const signer = new ethers.Wallet(config.privateKey, provider);
