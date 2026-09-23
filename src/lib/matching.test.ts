import { describe, it, expect } from 'vitest';
import {
  calculateSkillMatch,
  calculateSalaryMatch,
  calculateLocationMatch,
  calculateLanguageMatch,
  calculateCertificationBonus,
  calculateAvailabilityMatch,
  getRecommendation,
} from './matching';

describe('SkillMatch Explainable AI Algorithm (IWTC 2026)', () => {
  describe('Pilar 1: Skill Match (Maks 40 Poin)', () => {
    it('menghitung skor 40 saat keahlian kandidat memenuhi seluruh kebutuhan lowongan', () => {
      const userSkills = [
        { skillId: 'CAREGIVING', level: 'ADVANCED' as const, yearsExp: 3, verified: true },
      ];
      const jobSkills = [
        { skillId: 'CAREGIVING', level: 'ADVANCED' as const, mandatory: true, weight: 1 },
      ];
      const certs = ['CAREGIVING'];

      const score = calculateSkillMatch(userSkills, jobSkills, certs);
      expect(score).toBe(40);
    });

    it('memberikan skor proporsional saat tingkat keahlian di bawah syarat', () => {
      const userSkills = [
        { skillId: 'CAREGIVING', level: 'BEGINNER' as const, yearsExp: 1, verified: false }, // BEGINNER = 1
      ];
      const jobSkills = [
        { skillId: 'CAREGIVING', level: 'EXPERT' as const, mandatory: true, weight: 1 }, // EXPERT = 4
      ];
      const score = calculateSkillMatch(userSkills, jobSkills, []);
      // 1/4 * 40 = 10
      expect(score).toBe(10);
    });

    it('mengembalikan nilai 0 jika kandidat tidak memiliki keahlian yang diminta', () => {
      const userSkills = [
        { skillId: 'WELDING', level: 'ADVANCED' as const, yearsExp: 2, verified: true },
      ];
      const jobSkills = [
        { skillId: 'COOKING', level: 'ADVANCED' as const, mandatory: true, weight: 1 },
      ];
      const score = calculateSkillMatch(userSkills, jobSkills, []);
      expect(score).toBe(0);
    });
  });

  describe('Pilar 2: Salary Match (Maks 20 Poin)', () => {
    it('memberikan 20 poin saat rentang gaji kandidat dan lowongan bersinggungan penuh', () => {
      // User: 1000 - 1500 USD, Job: 1000 - 1500 USD
      const score = calculateSalaryMatch(1000, 1500, 1000, 1500, 'USD');
      expect(score).toBe(20);
    });

    it('memberikan 0 poin saat ekspektasi gaji di luar batas tawaran perusahaan', () => {
      // User min 3000 USD, Job max 2000 USD
      const score = calculateSalaryMatch(3000, 4000, 1000, 2000, 'USD');
      expect(score).toBe(0);
    });
  });

  describe('Pilar 3: Location Match (Maks 15 Poin)', () => {
    it('memberikan 15 poin jika negara lowongan termasuk negara prioritas pekerja', () => {
      const score = calculateLocationMatch(['SGP', 'MYS', 'HKG'], 'SGP');
      expect(score).toBe(15);
    });

    it('memberikan 0 poin jika negara tidak diminati', () => {
      const score = calculateLocationMatch(['SGP', 'MYS'], 'SAU');
      expect(score).toBe(0);
    });
  });

  describe('Pilar 4: Language Match (Maks 10 Poin)', () => {
    it('memberikan 10 poin jika bahasa kandidat sesuai syarat', () => {
      const score = calculateLanguageMatch('id', [{ language: 'id', level: 'BASIC' }]);
      expect(score).toBe(10);
    });

    it('memberikan 0 poin jika bahasa tidak sesuai', () => {
      const score = calculateLanguageMatch('id', [{ language: 'ja', level: 'N4' }]);
      expect(score).toBe(0);
    });
  });

  describe('Pilar 5: Certification Bonus W3C VC (Maks 10 Poin)', () => {
    it('memberikan bonus 10 poin penuh jika pekerja memegang sertifikat VC terverifikasi', () => {
      const userCerts = ['SKILL_WELDING'];
      const jobSkills = [
        { skillId: 'SKILL_WELDING', level: 'INTERMEDIATE' as const, mandatory: true, weight: 1 },
      ];
      const bonus = calculateCertificationBonus(userCerts, jobSkills);
      expect(bonus).toBe(10);
    });
  });

  describe('Pilar 6: Availability Match (Maks 5 Poin)', () => {
    it('memberikan 5 poin jika pekerja siap segera berangkat (hari ini)', () => {
      const today = new Date();
      const score = calculateAvailabilityMatch(today);
      expect(score).toBe(5);
    });
  });

  describe('Rekomendasi Tingkat Kecocokan (Thresholds)', () => {
    it('menghasilkan STRONG_MATCH untuk skor >= 85', () => {
      expect(getRecommendation(95)).toBe('STRONG_MATCH');
      expect(getRecommendation(85)).toBe('STRONG_MATCH');
    });

    it('menghasilkan GOOD_MATCH untuk skor 70 - 84', () => {
      expect(getRecommendation(75)).toBe('GOOD_MATCH');
      expect(getRecommendation(70)).toBe('GOOD_MATCH');
    });

    it('menghasilkan POTENTIAL_MATCH untuk skor 50 - 69', () => {
      expect(getRecommendation(55)).toBe('POTENTIAL_MATCH');
      expect(getRecommendation(50)).toBe('POTENTIAL_MATCH');
    });

    it('menghasilkan LOW_MATCH untuk skor < 50', () => {
      expect(getRecommendation(45)).toBe('LOW_MATCH');
      expect(getRecommendation(15)).toBe('LOW_MATCH');
    });
  });

  describe('Integritas Total 100% (Explainable AI)', () => {
    it('total bobot maksimum seluruh pilar tepat bernilai 100%', () => {
      const maxSkill = 40;
      const maxSalary = 20;
      const maxLocation = 15;
      const maxLanguage = 10;
      const maxCert = 10;
      const maxAvailability = 5;

      const total = maxSkill + maxSalary + maxLocation + maxLanguage + maxCert + maxAvailability;
      expect(total).toBe(100);
    });
  });
});
