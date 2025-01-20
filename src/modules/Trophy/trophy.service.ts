import { contract } from "../../utils/provider/contract";
import { Trophy, VerificationStatus } from "../../utils/types/trophy";

// service class
export class TrophyService {
  // function to request a trophy --- sending a transaction to small contract
  async requestTrophy(name: string, description: string): Promise<number> {
    try {
      const transaction = await contract.requestTrophy(name, description);
      const receipt = await transaction.wait();

      const event = receipt.logs
        .map((log: any) => contract.interface.parseLog(log))
        .find((event: any) => event?.name === "TrophyRequested");

      if (!event) throw new Error("Trophy request event not found");

      return Number(event.args[0]);
    } catch (error) {
      console.error("Error requesting trophy:", error);
      throw error;
    }
  }

  // function to verify a trophy
  async verifyTrophy(trophyId: number, approved: boolean): Promise<void> {
    try {
      const transaction = await contract.verifyTrophy(trophyId, approved);
      await transaction.wait();
    } catch (error) {
      console.error("Error verifying trophy:", error);
      throw error;
    }
  }

  // function to get a trophy by ID
  async getTrophyById(trophyId: number): Promise<Trophy | null> {
    try {
      const trophy = await contract.trophies(trophyId);

      if (
        Number(trophy.id) === 0 &&
        trophy.name === "" &&
        trophy.requester === "0x0000000000000000000000000000000000000000"
      ) {
        return null;
      }

      return {
        id: Number(trophy.id),
        name: trophy.name,
        description: trophy.description,
        status: trophy.status as VerificationStatus,
        requester: trophy.requester,
        timestamp: new Date(Number(trophy.timestamp) * 1000),
      };
    } catch (error) {
      console.error("Error getting trophy:", error);
      throw error;
    }
  }

  // function to get all trophies owned by an address
  async getTrophiesByOwner(ownerAddress: string): Promise<Trophy[]> {
    try {
      const trophyIds = await contract.getTrophiesByOwner(ownerAddress);

      if (!trophyIds) {
        return [];
      }

      const ids = Array.isArray(trophyIds) ? trophyIds : [];

      if (ids.length === 0) {
        return [];
      }

      const trophies = await Promise.all(
        ids.map((id: bigint) => this.getTrophyById(Number(id)))
      );

      return trophies.filter((trophy) => trophy != null);
    } catch (error: any) {
      console.error("Error getting trophies by owner:", error);
      if (
        error.message?.includes("no trophies found") ||
        error.message?.includes("not found")
      ) {
        return [];
      }
      throw error;
    }
  }
}
