import { ethers } from "ethers";
import { provider, signer } from "./provider";
import { config, CONTRACT_ABI } from "../config/init";

//  contract initialization
export const contract = new ethers.Contract(
  config.contractAddress,
  CONTRACT_ABI,
  signer
);
