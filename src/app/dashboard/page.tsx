import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return (
        <DashboardClient
          session={{ user: { name: '', role: 'WORKER' } }}
          dynamicStats={null}
          dynamicActivities={[]}
        />
      );
    }

    const userId = session.user.id;
    const isEmployer = session.user.role === 'EMPLOYER';

    if (isEmployer) {
      const [activeJobs, incomingApps, screeningApps, placedWorkers, recentApps] = await Promise.all([
        prisma.jobPost.count({
          where: { employerId: userId, status: 'PUBLISHED' },
        }),
        prisma.jobApplication.count({
          where: { job: { employerId: userId } },
        }),
        prisma.jobApplication.count({
          where: {
            job: { employerId: userId },
            status: { in: ['SCREENING', 'INTERVIEW'] },
          },
        }),
        prisma.jobApplication.count({
          where: { job: { employerId: userId }, status: 'ACCEPTED' },
        }),
        prisma.jobApplication.findMany({
          where: { job: { employerId: userId } },
          take: 4,
          orderBy: { appliedAt: 'desc' },
          include: {
            user: { select: { name: true } },
            job: { select: { title: true } },
          },
        }),
      ]);

      const dynamicStats = [
        { label: 'Lowongan Aktif', value: String(activeJobs), key: 'jobs' },
        { label: 'Lamaran Masuk', value: String(incomingApps), key: 'apps' },
        { label: 'Tahap Seleksi', value: String(screeningApps), key: 'screening' },
        { label: 'Kandidat Diterima', value: String(placedWorkers), key: 'placed' },
      ];

      const dynamicActivities = recentApps.map((app) => ({
        type: 'job',
        title: `Lamaran: ${app.user.name}`,
        desc: `Posisi: ${app.job.title} • Status: ${app.status}`,
        time: new Date(app.appliedAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
        }),
      }));

      return (
        <DashboardClient
          session={session}
          dynamicStats={dynamicStats}
          dynamicActivities={dynamicActivities}
        />
      );
    } else {
      // Worker stats & dynamic data
      const [
        verifiedSkills,
        totalApps,
        completedAssessments,
        certsCount,
        recentAttempts,
        recentApps,
        userSkillsList,
        openJobs,
        availableAssessments,
      ] = await Promise.all([
        prisma.userSkill.count({
          where: { userId, verified: true },
        }),
        prisma.jobApplication.count({
          where: { userId },
        }),
        prisma.assessmentAttempt.count({
          where: { userId, completedAt: { not: null }, passed: true },
        }),
        prisma.certification.count({
          where: { userId },
        }),
        prisma.assessmentAttempt.findMany({
          where: { userId },
          take: 2,
          orderBy: { startedAt: 'desc' },
          include: { assessment: { select: { title: true } } },
        }),
        prisma.jobApplication.findMany({
          where: { userId },
          take: 2,
          orderBy: { appliedAt: 'desc' },
          include: { job: { select: { title: true, country: true } } },
        }),
        prisma.userSkill.findMany({
          where: { userId },
          take: 5,
          include: { skill: { select: { name: true } } },
        }),
        prisma.jobPost.findMany({
          where: { status: 'PUBLISHED' },
          take: 2,
          orderBy: { publishedAt: 'desc' },
          select: { id: true, title: true, country: true },
        }),
        prisma.assessment.findMany({
          take: 2,
          select: { id: true, title: true },
        }),
      ]);

      const dynamicStats = [
        { label: 'Skill Terverifikasi', value: String(verifiedSkills), key: 'skills' },
        { label: 'Lamaran Terkirim', value: String(totalApps), key: 'apps' },
        { label: 'Asesmen Lulus', value: String(completedAssessments), key: 'assessments' },
        { label: 'Sertifikat Digital (VC)', value: String(certsCount), key: 'certs' },
      ];

      const dynamicActivities: Array<{
        type: string;
        title: string;
        desc: string;
        time: string;
      }> = [];

      for (const att of recentAttempts) {
        dynamicActivities.push({
          type: 'assessment',
          title: att.assessment.title,
          desc: `Skor: ${att.score}% • ${att.passed ? 'LULUS' : 'BELUM LULUS'}`,
          time: new Date(att.completedAt || att.startedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
          }),
        });
      }

      for (const app of recentApps) {
        dynamicActivities.push({
          type: 'job',
          title: `Lamaran: ${app.job.title}`,
          desc: `Negara: ${app.job.country} • Status: ${app.status}`,
          time: new Date(app.appliedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
          }),
        });
      }

      // Convert userSkills to progress items
      const levelPercentMap: Record<string, number> = {
        BEGINNER: 40,
        INTERMEDIATE: 70,
        ADVANCED: 88,
        EXPERT: 96,
      };

      const dynamicSkills = userSkillsList.length > 0
        ? userSkillsList.map((us) => ({
            skill: us.skill.name,
            level: levelPercentMap[us.level] || 50,
            target: 90,
            levelName: us.level,
            verified: us.verified,
          }))
        : null;

      // Build real recommendations
      const dynamicRecommendations: Array<{
        title: string;
        match: number;
        type: string;
        href: string;
      }> = [];

      for (const job of openJobs) {
        dynamicRecommendations.push({
          title: `Lowongan: ${job.title} (${job.country})`,
          match: 88,
          type: 'Lowongan',
          href: `/dashboard/jobs?id=${job.id}`,
        });
      }

      for (const ass of availableAssessments) {
        dynamicRecommendations.push({
          title: `Asesmen: ${ass.title}`,
          match: 92,
          type: 'Sertifikasi',
          href: `/dashboard/upskilling`,
        });
      }

      return (
        <DashboardClient
          session={session}
          dynamicStats={dynamicStats}
          dynamicActivities={dynamicActivities}
          dynamicSkills={dynamicSkills}
          dynamicRecommendations={dynamicRecommendations.length > 0 ? dynamicRecommendations : null}
        />
      );
    }
  } catch (error) {
    console.error('DashboardPage SSR error:', error);
    return (
      <DashboardClient
        session={{ user: { name: '', role: 'WORKER' } }}
        dynamicStats={null}
        dynamicActivities={[]}
      />
    );
  }
}