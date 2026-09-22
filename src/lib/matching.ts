import { prisma } from './prisma';

export interface UserSkill {
  skillId: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsExp: number;
  verified: boolean;
}

export interface JobSkill {
  skillId: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  mandatory: boolean;
  weight: number;
}

export interface MatchResult {
  jobId: string;
  overallScore: number;
  breakdown: {
    skillMatch: number;
    salaryMatch: number;
    locationMatch: number;
    languageMatch: number;
    certificationBonus: number;
    availabilityMatch: number;
  };
  matchedSkills: MatchedSkill[];
  gaps: SkillGap[];
  recommendation: 'STRONG_MATCH' | 'GOOD_MATCH' | 'POTENTIAL_MATCH' | 'LOW_MATCH';
}

export interface MatchedSkill {
  skillId: string;
  skillName: string;
  userLevel: string;
  requiredLevel: string;
  match: number;
  [key: string]: unknown;
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  requiredLevel: string;
  userLevel: string | null;
}

const LEVEL_SCORES = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
} as const;

const LEVEL_LABELS = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Mahir',
  EXPERT: 'Ahli',
} as const;

function getLevelScore(level: keyof typeof LEVEL_SCORES): number {
  return LEVEL_SCORES[level];
}

export async function calculateMatch(
  userId: string,
  jobId: string
): Promise<MatchResult> {
  const [user, job] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: { include: { skill: true } },
        certifications: { where: { status: 'VERIFIED' }, include: { skill: true } },
      },
    }),
    prisma.jobPost.findUnique({
      where: { id: jobId },
      include: { skills: { include: { skill: true } } },
    }),
  ]);

  if (!user || !job) {
    throw new Error('User or Job not found');
  }

  const userSkills: UserSkill[] = user.skills.map((s) => ({
    skillId: s.skillId,
    level: s.level,
    yearsExp: s.yearsExp,
    verified: s.verified,
  }));

  const jobSkills: JobSkill[] = job.skills.map((s) => ({
    skillId: s.skillId,
    level: s.level,
    mandatory: s.mandatory,
    weight: s.weight,
  }));

  const userCertifications = user.certifications.map((c) => c.skillId);

  const skillMatch = calculateSkillMatch(userSkills, jobSkills, userCertifications);
  const salaryMatch = calculateSalaryMatch(
    user.expectedSalaryMin,
    user.expectedSalaryMax,
    job.salaryMin,
    job.salaryMax,
    job.salaryCurrency
  );
  const locationMatch = calculateLocationMatch(user.preferredCountries, job.country);
  const languageMatch = calculateLanguageMatch(
    user.language,
    job.languageReq as { language: string; level: string }[] | null
  );
  const certificationBonus = calculateCertificationBonus(userCertifications, jobSkills);
  const availabilityMatch = calculateAvailabilityMatch(user.availabilityDate);

  const overallScore = Math.min(
    100,
    skillMatch + salaryMatch + locationMatch + languageMatch + certificationBonus + availabilityMatch
  );

  return {
    jobId: job.id,
    overallScore,
    breakdown: {
      skillMatch,
      salaryMatch,
      locationMatch,
      languageMatch,
      certificationBonus,
      availabilityMatch,
    },
    matchedSkills: getMatchedSkills(userSkills, jobSkills),
    gaps: getSkillGaps(userSkills, jobSkills),
    recommendation: getRecommendation(overallScore),
  };
}

function calculateSkillMatch(
  userSkills: UserSkill[],
  jobSkills: JobSkill[],
  userCertifications: string[]
): number {
  if (jobSkills.length === 0) return 20;

  let totalWeight = 0;
  let matchedWeight = 0;

  for (const jobSkill of jobSkills) {
    totalWeight += jobSkill.weight;

    const userSkill = userSkills.find((us) => us.skillId === jobSkill.skillId);
    if (!userSkill) continue;

    const userLevelScore = getLevelScore(userSkill.level);
    const requiredLevelScore = getLevelScore(jobSkill.level);
    const levelScore = userLevelScore / requiredLevelScore;
    const cappedScore = Math.min(1, levelScore);

    let skillWeight = jobSkill.weight * cappedScore;

    if (userCertifications.includes(jobSkill.skillId)) {
      skillWeight = Math.min(jobSkill.weight, skillWeight * 1.2);
    }

    if (userSkill.verified) {
      skillWeight = Math.min(jobSkill.weight, skillWeight * 1.1);
    }

    matchedWeight += skillWeight;
  }

  return (matchedWeight / totalWeight) * 40;
}

function calculateSalaryMatch(
  userMin: number | null,
  userMax: number | null,
  jobMin: number,
  jobMax: number,
  currency: string
): number {
  if (!userMin || !userMax) return 10;

  const rate = getExchangeRate(currency, 'USD');
  const userMinUSD = userMin * rate;
  const userMaxUSD = userMax * rate;
  const jobMinUSD = jobMin * rate;
  const jobMaxUSD = jobMax * rate;

  const overlapMin = Math.max(userMinUSD, jobMinUSD);
  const overlapMax = Math.min(userMaxUSD, jobMaxUSD);

  if (overlapMin > overlapMax) return 0;

  const userRange = userMaxUSD - userMinUSD;
  const jobRange = jobMaxUSD - jobMinUSD;
  const overlapRange = overlapMax - overlapMin;

  const overlapRatio = overlapRange / Math.max(userRange, jobRange, 1);
  return overlapRatio * 20;
}

function calculateLocationMatch(preferredCountries: string[], jobCountry: string): number {
  if (preferredCountries.includes(jobCountry)) return 15;
  if (jobCountry === 'IDN') return 10;
  return 0;
}

function calculateLanguageMatch(
  userLanguage: string,
  languageReq: { language: string; level: string }[] | null
): number {
  if (!languageReq || languageReq.length === 0) return 10;

  const userLang = userLanguage.toLowerCase();
  for (const req of languageReq) {
    if (req.language.toLowerCase() === userLang) return 10;
  }
  return 0;
}

function calculateCertificationBonus(
  userCertifications: string[],
  jobSkills: JobSkill[]
): number {
  if (jobSkills.length === 0) return 0;

  const requiredSkillIds = jobSkills.map((s) => s.skillId);
  const matchedCerts = userCertifications.filter((c) => requiredSkillIds.includes(c));
  const ratio = matchedCerts.length / requiredSkillIds.length;
  return ratio * 10;
}

function calculateAvailabilityMatch(availabilityDate: Date | null): number {
  if (!availabilityDate) return 3;
  const daysUntil = Math.ceil(
    (new Date(availabilityDate).getTime() - Date.now()) / 86400000
  );
  if (daysUntil <= 0) return 5;
  if (daysUntil <= 30) return 4;
  if (daysUntil <= 60) return 3;
  if (daysUntil <= 90) return 2;
  return 1;
}

function getMatchedSkills(
  userSkills: UserSkill[],
  jobSkills: JobSkill[]
): MatchedSkill[] {
  const skillMap = new Map(userSkills.map((s) => [s.skillId, s]));

  return jobSkills.map((jobSkill) => {
    const userSkill = skillMap.get(jobSkill.skillId);
    const userLevelScore = userSkill ? getLevelScore(userSkill.level) : 0;
    const requiredLevelScore = getLevelScore(jobSkill.level);
    const match = requiredLevelScore > 0 ? userLevelScore / requiredLevelScore : 0;

    return {
      skillId: jobSkill.skillId,
      skillName: jobSkill.skillId,
      userLevel: userSkill ? LEVEL_LABELS[userSkill.level] : 'Tidak ada',
      requiredLevel: LEVEL_LABELS[jobSkill.level],
      match: Math.min(100, Math.round(match * 100)),
    };
  });
}

function getSkillGaps(
  userSkills: UserSkill[],
  jobSkills: JobSkill[]
): SkillGap[] {
  const skillMap = new Map(userSkills.map((s) => [s.skillId, s]));

  return jobSkills
    .filter((jobSkill) => {
      const userSkill = skillMap.get(jobSkill.skillId);
      if (!userSkill) return true;
      return getLevelScore(userSkill.level) < getLevelScore(jobSkill.level);
    })
    .map((jobSkill) => ({
      skillId: jobSkill.skillId,
      skillName: jobSkill.skillId,
      requiredLevel: LEVEL_LABELS[jobSkill.level],
      userLevel: skillMap.get(jobSkill.skillId)
        ? LEVEL_LABELS[skillMap.get(jobSkill.skillId)!.level]
        : null,
    }));
}

function getRecommendation(score: number): MatchResult['recommendation'] {
  if (score >= 85) return 'STRONG_MATCH';
  if (score >= 70) return 'GOOD_MATCH';
  if (score >= 50) return 'POTENTIAL_MATCH';
  return 'LOW_MATCH';
}

function getExchangeRate(from: string, to: string): number {
  const rates: Record<string, number> = {
    IDR: 0.000063,
    USD: 1,
    SGD: 0.74,
    MYR: 0.21,
    HKD: 0.13,
    TWD: 0.031,
    KRW: 0.00075,
    JPY: 0.0067,
    SAR: 0.27,
    AED: 0.27,
    QAR: 0.27,
    KWD: 3.25,
    OMR: 2.6,
    BHD: 2.65,
  };
  return (rates[from] || 1) / (rates[to] || 1);
}

export async function getTopMatches(
  userId: string,
  limit = 10
): Promise<MatchResult[]> {
  const jobs = await prisma.jobPost.findMany({
    where: {
      status: 'PUBLISHED',
      expiresAt: { gt: new Date() },
    },
    take: 50,
    include: { skills: { include: { skill: true } } },
  });

  const matches = await Promise.all(
    jobs.map((job) => calculateMatch(userId, job.id))
  );

  return matches
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, limit);
}

export async function updateJobMatchScores(jobId: string): Promise<void> {
  const applications = await prisma.jobApplication.findMany({
    where: { jobId, status: { in: ['APPLIED', 'SCREENING'] } },
    include: { user: { include: { skills: true, certifications: true } } },
  });

  for (const app of applications) {
    const match = await calculateMatch(app.userId, jobId);
    await prisma.jobApplication.update({
      where: { id: app.id },
      data: {
        matchScore: match.overallScore,
        matchedSkills: JSON.parse(JSON.stringify({ items: match.matchedSkills })),
      },
    });
  }
}