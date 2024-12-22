import { contract } from "../../provider/contract";

// service class
export class TrophyService {
  // function to request a trophy --- sending a transaction to small contract
  async requestTrophy(name: string, description: string): Promise<number> {
    try {
      const tx = await contract.requestTrophy(name, description);
      const receipt = await tx.wait();

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
}
