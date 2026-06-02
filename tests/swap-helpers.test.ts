import {
  calcMinAmountOut,
  calcMaxAmountIn,
  SlippageError,
  ValidationError,
  PRECISION,
} from '../src';

describe('Swap Slippage Protection Helpers', () => {
  const PRICE_SCALE = PRECISION.PRICE_SCALE; // 1e14
  const PRICE_1_TO_1 = PRICE_SCALE; // 1.0
  const PRICE_2_TO_1 = PRICE_SCALE * 2n; // 2.0
  const PRICE_1_TO_2 = PRICE_SCALE / 2n; // 0.5

  describe('calcMinAmountOut', () => {
    it('calculates min amount out with 0 bps slippage (1:1 price)', () => {
      const amountIn = 1_000_000n;
      const slippageBps = 0;
      const minOut = calcMinAmountOut(amountIn, slippageBps, PRICE_1_TO_1);
      expect(minOut).toBe(1_000_000n);
    });

    it('calculates min amount out with 0 bps slippage (2:1 price)', () => {
      const amountIn = 1_000_000n;
      const slippageBps = 0;
      const minOut = calcMinAmountOut(amountIn, slippageBps, PRICE_2_TO_1);
      expect(minOut).toBe(2_000_000n);
    });

    it('calculates min amount out with 50 bps (0.5%) slippage', () => {
      const amountIn = 1_000_000n;
      const slippageBps = 50; // 0.5%
      // expected amount out: 1_000_000 * 2 = 2_000_000
      // slippage: 2_000_000 * 0.005 = 10_000
      // min amount out: 1_990_000
      const minOut = calcMinAmountOut(amountIn, slippageBps, PRICE_2_TO_1);
      expect(minOut).toBe(1_990_000n);
    });

    it('calculates min amount out with 500 bps (5%) slippage', () => {
      const amountIn = 1_000_000n;
      const slippageBps = 500; // 5%
      // expected amount out: 1_000_000 * 0.5 = 500_000
      // slippage: 500_000 * 0.05 = 25_000
      // min amount out: 475_000
      const minOut = calcMinAmountOut(amountIn, slippageBps, PRICE_1_TO_2);
      expect(minOut).toBe(475_000n);
    });

    it('throws SlippageError for out-of-range slippageBps (< 0)', () => {
      expect(() => {
        calcMinAmountOut(1_000_000n, -1, PRICE_1_TO_1);
      }).toThrow(SlippageError);
    });

    it('throws SlippageError for out-of-range slippageBps (> 5000)', () => {
      expect(() => {
        calcMinAmountOut(1_000_000n, 5001, PRICE_1_TO_1);
      }).toThrow(SlippageError);
    });

    it('throws ValidationError for non-positive price', () => {
      expect(() => {
        calcMinAmountOut(1_000_000n, 50, 0n);
      }).toThrow(ValidationError);

      expect(() => {
        calcMinAmountOut(1_000_000n, 50, -100n);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError for negative amountIn', () => {
      expect(() => {
        calcMinAmountOut(-100n, 50, PRICE_1_TO_1);
      }).toThrow(ValidationError);
    });
  });

  describe('calcMaxAmountIn', () => {
    it('calculates max amount in with 0 bps slippage (1:1 price)', () => {
      const amountOut = 1_000_000n;
      const slippageBps = 0;
      const maxIn = calcMaxAmountIn(amountOut, slippageBps, PRICE_1_TO_1);
      expect(maxIn).toBe(1_000_000n);
    });

    it('calculates max amount in with 0 bps slippage (2:1 price)', () => {
      const amountOut = 2_000_000n;
      const slippageBps = 0;
      const maxIn = calcMaxAmountIn(amountOut, slippageBps, PRICE_2_TO_1);
      expect(maxIn).toBe(1_000_000n);
    });

    it('calculates max amount in with 50 bps (0.5%) slippage', () => {
      const amountOut = 2_000_000n;
      const slippageBps = 50; // 0.5%
      // expected amount in: 2_000_000 / 2 = 1_000_000
      // slippage: 1_000_000 * 0.005 = 5_000
      // max amount in: 1_005_000
      const maxIn = calcMaxAmountIn(amountOut, slippageBps, PRICE_2_TO_1);
      expect(maxIn).toBe(1_005_000n);
    });

    it('calculates max amount in with 500 bps (5%) slippage', () => {
      const amountOut = 500_000n;
      const slippageBps = 500; // 5%
      // expected amount in: 500_000 / 0.5 = 1_000_000
      // slippage: 1_000_000 * 0.05 = 50_000
      // max amount in: 1_050_000
      const maxIn = calcMaxAmountIn(amountOut, slippageBps, PRICE_1_TO_2);
      expect(maxIn).toBe(1_050_000n);
    });

    it('throws SlippageError for out-of-range slippageBps (< 0)', () => {
      expect(() => {
        calcMaxAmountIn(1_000_000n, -1, PRICE_1_TO_1);
      }).toThrow(SlippageError);
    });

    it('throws SlippageError for out-of-range slippageBps (> 5000)', () => {
      expect(() => {
        calcMaxAmountIn(1_000_000n, 5001, PRICE_1_TO_1);
      }).toThrow(SlippageError);
    });

    it('throws ValidationError for non-positive price', () => {
      expect(() => {
        calcMaxAmountIn(1_000_000n, 50, 0n);
      }).toThrow(ValidationError);

      expect(() => {
        calcMaxAmountIn(1_000_000n, 50, -100n);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError for negative amountOut', () => {
      expect(() => {
        calcMaxAmountIn(-100n, 50, PRICE_1_TO_1);
      }).toThrow(ValidationError);
    });
  });
});
