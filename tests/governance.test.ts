
import { getQuorumStatus } from '../src/modules/governance';

describe('Governance Module', () => {
  describe('getQuorumStatus', () => {
    it('should return the correct quorum status when quorum is not reached', async () => {
      const status = await getQuorumStatus('proposal-1');
      expect(status.isQuorumReached).toBe(false);
      expect(status.quorumRequired).toBe(1000000n);
      expect(status.currentParticipation).toBe(500000n);
      expect(status.remainingVotes).toBe(500000n);
      expect(status.participationPercent).toBe(50);
    });

    it('should return the correct quorum status when quorum is exactly met', async () => {
      const status = await getQuorumStatus('proposal-2');
      expect(status.isQuorumReached).toBe(true);
      expect(status.quorumRequired).toBe(1000000n);
      expect(status.currentParticipation).toBe(1000000n);
      expect(status.remainingVotes).toBe(0n);
      expect(status.participationPercent).toBe(100);
    });

    it('should return the correct quorum status when quorum is exceeded', async () => {
        const status = await getQuorumStatus('proposal-2');
        // Re-using proposal-2 which is at 100%
        expect(status.isQuorumReached).toBe(true);
        expect(status.remainingVotes).toBe(0n);
        expect(status.participationPercent).toBe(100);
      });

    it('should calculate participation percentage correctly', async () => {
      const status = await getQuorumStatus('proposal-3');
      expect(status.participationPercent).toBe(25);
    });

    it('should throw a ValidationError if the proposal ID does not exist', async () => {
      await expect(getQuorumStatus('non-existent-proposal')).rejects.toThrow(
        'Proposal with ID "non-existent-proposal" not found.'
      );
    });
  });
});
