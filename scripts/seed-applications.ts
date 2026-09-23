import { PrismaClient, ApplicationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding demo job applications...');

  const users = await prisma.user.findMany({
    where: { role: 'WORKER' },
  });

  const caregiverJob = await prisma.jobPost.findUnique({
    where: { id: 'job-caregiver-taiwan' },
  });

  const housekeepingJob = await prisma.jobPost.findUnique({
    where: { id: 'job-housekeeping-singapore' },
  });

  if (!caregiverJob || !housekeepingJob) {
    console.log('Jobs not found, skipping applications seed');
    return;
  }

  for (const user of users) {
    // 1. Application: Caregiver Taiwan (SCREENING)
    await prisma.jobApplication.upsert({
      where: {
        jobId_userId: {
          jobId: caregiverJob.id,
          userId: user.id,
        },
      },
      update: {
        status: ApplicationStatus.SCREENING,
        matchScore: 88,
        expectedSalary: 24000,
        coverLetter: 'Saya memiliki pengalaman merawat lansia dengan penuh dedikasi dan telah menyelesaikan sertifikasi kompetensi W3C Verifiable Credential di SkillMatch.',
        notes: 'Verifikasi berkas & sertifikat digital lolos seleksi awal. Sedang dijadwalkan briefing visa MOL Taiwan.',
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      create: {
        jobId: caregiverJob.id,
        userId: user.id,
        status: ApplicationStatus.SCREENING,
        matchScore: 88,
        expectedSalary: 24000,
        coverLetter: 'Saya memiliki pengalaman merawat lansia dengan penuh dedikasi dan telah menyelesaikan sertifikasi kompetensi W3C Verifiable Credential di SkillMatch.',
        notes: 'Verifikasi berkas & sertifikat digital lolos seleksi awal. Sedang dijadwalkan briefing visa MOL Taiwan.',
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    });

    // 2. Application: Housekeeping Singapore (INTERVIEW)
    await prisma.jobApplication.upsert({
      where: {
        jobId_userId: {
          jobId: housekeepingJob.id,
          userId: user.id,
        },
      },
      update: {
        status: ApplicationStatus.INTERVIEW,
        matchScore: 92,
        expectedSalary: 2000,
        coverLetter: 'Saya menguasai standar sanitasi perhotelan internasional dan bahasa Inggris percakapan aktif. Siap ditempatkan segera.',
        notes: 'Wawancara daring terjadwal via Zoom dengan HRD Marina Hospitality Group.',
        appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      create: {
        jobId: housekeepingJob.id,
        userId: user.id,
        status: ApplicationStatus.INTERVIEW,
        matchScore: 92,
        expectedSalary: 2000,
        coverLetter: 'Saya menguasai standar sanitasi perhotelan internasional dan bahasa Inggris percakapan aktif. Siap ditempatkan segera.',
        notes: 'Wawancara daring terjadwal via Zoom dengan HRD Marina Hospitality Group.',
        appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('✅ Demo applications successfully seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding applications:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
