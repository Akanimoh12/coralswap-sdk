
export interface QuorumStatus {
  quorumRequired: bigint;
  currentParticipation: bigint;
  isQuorumReached: boolean;
  remainingVotes: bigint;
  participationPercent: number;
}
