import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

export const init = (app: Express) => {
  app.use(cors());
};

export const config = {
  rpcUrl: process.env.RPC_URL!,
  privateKey: process.env.PRIVATE_KEY!,
  contractAddress: process.env.CONTRACT_ADDRESS!,
  port: process.env.PORT!,
};

export const CONTRACT_ABI = [
  "function requestTrophy(string name, string description) external returns (uint256)",
  "function verifyTrophy(uint256 trophyId, bool approved) external",
  "function getTrophiesByOwner(address owner) external view returns (uint256[])",
  "function getTotalTrophies() external view returns (uint256)",
  "function trophies(uint256) external view returns (uint256 id, string name, string description, uint8 status, address requester, uint256 timestamp)",
  "event TrophyRequested(uint256 indexed id, string name, address indexed requester, uint256 timestamp)",
  "event TrophyVerified(uint256 indexed id, uint8 status, uint256 timestamp)",
];
