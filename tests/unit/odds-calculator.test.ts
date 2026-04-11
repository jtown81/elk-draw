/**
 * Unit Tests for Odds Calculator
 *
 * Verifies core calculation functions for preference points,
 * pool determination, and odds approximation.
 */

import { describe, it, expect } from 'vitest';
import {
  calcEntries,
  getQualifyingPool,
  calcAvgEntriesForPool,
  calcOdds,
  couldUserDraw,
} from '@modules/odds-calculator';

describe('calcEntries', () => {
  it('calculates entries using (points + 1)³ formula', () => {
    expect(calcEntries(0)).toBe(1);      // (0+1)³ = 1
    expect(calcEntries(1)).toBe(8);      // (1+1)³ = 8
    expect(calcEntries(11)).toBe(1728);  // (11+1)³ = 1,728
    expect(calcEntries(25)).toBe(17576); // (25+1)³ = 17,576
  });

  it('throws error for invalid points', () => {
    expect(() => calcEntries(-1)).toThrow();
    expect(() => calcEntries(26)).toThrow();
  });
});

describe('getQualifyingPool', () => {
  // Pool ranges per GFP: https://gfp.sd.gov/preference-points/
  // Black Hills elk: 10+ (30% tags), 2+ (15% tags), 0+ (5% tags)
  // CSP elk: 15+ (34%), 10+ (33%), 0+ (33%)

  it('returns 15plus for 15+ points (CSP pool)', () => {
    expect(getQualifyingPool(15)).toBe('15plus');
    expect(getQualifyingPool(20)).toBe('15plus');
    expect(getQualifyingPool(25)).toBe('15plus');
  });

  it('returns 10plus for 10–14 points', () => {
    expect(getQualifyingPool(10)).toBe('10plus');
    expect(getQualifyingPool(12)).toBe('10plus');
    expect(getQualifyingPool(14)).toBe('10plus');
  });

  it('returns 2plus for 2–9 points (GFP-defined pool boundary)', () => {
    expect(getQualifyingPool(2)).toBe('2plus');
    expect(getQualifyingPool(5)).toBe('2plus');
    expect(getQualifyingPool(9)).toBe('2plus');
  });

  it('returns 0plus for 0–1 points', () => {
    expect(getQualifyingPool(0)).toBe('0plus');
    expect(getQualifyingPool(1)).toBe('0plus');
  });
});

describe('calcAvgEntriesForPool', () => {
  // Midpoints based on GFP pool ranges: 15+ (15–25), 10+ (10–14), 2+ (2–9), 0+ (0–1)
  it('returns pool midpoint average entries', () => {
    const avg15plus = calcAvgEntriesForPool('15plus');
    expect(avg15plus).toBe(calcEntries(17)); // midpoint of 15–25: (17+1)³ = 5,832

    const avg10plus = calcAvgEntriesForPool('10plus');
    expect(avg10plus).toBe(calcEntries(12)); // midpoint of 10–14: (12+1)³ = 2,197

    const avg2plus = calcAvgEntriesForPool('2plus');
    expect(avg2plus).toBe(calcEntries(5)); // midpoint of 2–9: (5+1)³ = 216

    const avg0plus = calcAvgEntriesForPool('0plus');
    expect(avg0plus).toBe(calcEntries(0)); // midpoint of 0–1: (0+1)³ = 1
  });
});

describe('calcOdds', () => {
  it('calculates odds for 11 points in 10+ pool', () => {
    // 11 pts → (12)³ = 1,728 user entries
    // 10+ pool avg ≈ 2,197 entries per applicant
    // For 4,320 applicants: 4,320 × 2,197 = 9,489,840 total entries
    // 30 tags available
    // Odds: (1,728 × 30 / 9,489,840) × 100 ≈ 0.5462%
    const odds = calcOdds(11, '10plus', 4320, 30);
    expect(odds).toBeCloseTo(0.5462, 3);
  });

  it('returns 100% for no applicants', () => {
    expect(calcOdds(11, '10plus', 0, 30)).toBe(100);
  });

  it('caps odds at 100%', () => {
    const odds = calcOdds(25, '15plus', 1, 20);
    expect(odds).toBeLessThanOrEqual(100);
  });

  it('scales with fewer applicants (better odds)', () => {
    const oddsHighApplicants = calcOdds(11, '10plus', 4320, 30);
    const oddsLowApplicants = calcOdds(11, '10plus', 1000, 30);
    expect(oddsLowApplicants).toBeGreaterThan(oddsHighApplicants);
  });

  it('increases with more user points (same pool)', () => {
    const odds10pts = calcOdds(10, '10plus', 4320, 30);
    const odds11pts = calcOdds(11, '10plus', 4320, 30);
    const odds14pts = calcOdds(14, '10plus', 4320, 30);
    expect(odds11pts).toBeGreaterThan(odds10pts);
    expect(odds14pts).toBeGreaterThan(odds11pts);
  });
});

describe('couldUserDraw', () => {
  it('returns true if user points >= lowest point drawn', () => {
    expect(couldUserDraw(11, 10)).toBe(true);
    expect(couldUserDraw(11, 11)).toBe(true);
    expect(couldUserDraw(15, 10)).toBe(true);
  });

  it('returns false if user points < lowest point drawn', () => {
    expect(couldUserDraw(10, 11)).toBe(false);
    expect(couldUserDraw(9, 10)).toBe(false);
  });

  it('returns true if lowest point drawn is unknown (null)', () => {
    expect(couldUserDraw(11, null)).toBe(true);
    expect(couldUserDraw(0, null)).toBe(true);
  });
});
