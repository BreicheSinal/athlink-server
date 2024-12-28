export enum VerificationStatus {
  Pending,
  Verified,
  Rejected,
}

export interface Trophy {
  id: number;
  name: string;
  description: string;
  status: VerificationStatus;
  requester: string;
  timestamp: Date;
}

export interface TrophyRequest {
  name: string;
  description: string;
}

export interface VerificationRequest {
  approved: boolean;
}
