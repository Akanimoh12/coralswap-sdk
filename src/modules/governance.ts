
import { QuorumStatus } from '../types/governance';
import { ValidationError } from '../errors';

// Mock proposal data store
const MOCK_PROPOSALS: Record<string, { currentParticipation: bigint }> = {
  'proposal-1': {
    currentParticipation: 500000n,
  },
  'proposal-2': {
    currentParticipation: 1000000n,
  },
  'proposal-3': {
    currentParticipation: 250000n,
  },
};

// Mock governance settings
const MOCK_QUORUM_REQUIRED = 1000000n;

/**
 * Throws if a proposal with the given ID does not exist.
 * @param proposalId - The ID of the proposal to check.
 */
function ensureProposalExists(proposalId: string) {
  if (!MOCK_PROPOSALS[proposalId]) {
    throw new ValidationError(`Proposal with ID "${proposalId}" not found.`);
  }
}

/**
 * Calculates the quorum status for a given proposal.
 * @param proposalId - The ID of the proposal.
 * @returns A promise that resolves to the quorum status.
 */
export async function getQuorumStatus(proposalId: string): Promise<QuorumStatus> {
  ensureProposalExists(proposalId);

  const proposal = MOCK_PROPOSALS[proposalId];
  const { currentParticipation } = proposal;
  const quorumRequired = MOCK_QUORUM_REQUIRED;

  const isQuorumReached = currentParticipation >= quorumRequired;
  const remainingVotes = isQuorumReached ? 0n : quorumRequired - currentParticipation;
  const participationPercent = quorumRequired > 0n
    ? Math.min(100, Number((currentParticipation * 10000n) / quorumRequired) / 100)
    : 100;

  return {
    quorumRequired,
    currentParticipation,
    isQuorumReached,
    remainingVotes,
    participationPercent,
  };
}
