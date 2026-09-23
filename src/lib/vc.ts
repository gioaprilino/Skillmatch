import { documentLoader } from './vc-document-loader';
import { prisma } from './prisma';

export interface SkillCredentialSubject {
  id: string;
  skill: {
    id: string;
    name: string;
    category: string;
    level: string;
  };
  assessment: {
    id: string;
    score: number;
    passingScore: number;
    completedAt: string;
  };
  evidence: {
    id?: string;
    type: 'AssessmentResult';
    assessmentId: string;
    attemptId: string;
    answersHash: string;
  }[];
}

export interface SkillCredential {
  '@context': string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: SkillCredentialSubject;
  proof?: any;
  [key: string]: unknown;
}

export async function generateKeyPair(): Promise<{
  privateKeyMultibase: string;
  publicKeyMultibase: string;
  privateKeyBase58: string;
  publicKeyBase58: string;
}> {
  const { Ed25519VerificationKey2020 } = await import('@digitalbazaar/ed25519-verification-key-2020');
  const keyPair = await Ed25519VerificationKey2020.generate();
  const privateKeyMultibase = keyPair.privateKeyMultibase;
  const publicKeyMultibase = keyPair.publicKeyMultibase;
  const privateKeyBase58 = privateKeyMultibase.slice(1);
  const publicKeyBase58 = publicKeyMultibase.slice(1);
  return { privateKeyMultibase, publicKeyMultibase, privateKeyBase58, publicKeyBase58 };
}

export async function loadIssuerKeyFromEnv(): Promise<any> {
  const privateKeyMultibase = process.env.VC_ISSUER_PRIVATE_KEY_MULTIBASE;
  const publicKeyMultibase = process.env.VC_ISSUER_PUBLIC_KEY_MULTIBASE;
  const issuerDid = process.env.VC_ISSUER_DID || 'did:web:skillmatch.id';

  if (!privateKeyMultibase) {
    throw new Error('VC_ISSUER_PRIVATE_KEY_MULTIBASE not set in environment');
  }
  const { Ed25519VerificationKey2020 } = await import('@digitalbazaar/ed25519-verification-key-2020');
  return Ed25519VerificationKey2020.from({
    id: `${issuerDid}#key-1`,
    type: 'Ed25519VerificationKey2020',
    controller: issuerDid,
    publicKeyMultibase,
    privateKeyMultibase,
  } as any);
}

export async function issueSkillCredential(
  userDid: string,
  skill: {
    id: string;
    code: string;
    name: string;
    category: string;
  },
  assessment: {
    id: string;
    title: string;
    passingScore: number;
  },
  attempt: {
    id: string;
    score: number;
    completedAt: Date;
    answers: Record<string, any>;
  },
  issuerKey: any
): Promise<SkillCredential> {
  const { Ed25519Signature2020 } = await import('@digitalbazaar/ed25519-signature-2020');
  const { issue } = await import('@digitalbazaar/vc');

  const credential: SkillCredential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/ed25519-2020/v1',
      'https://skillmatch.id/contexts/skill-v1.jsonld',
    ],
    id: `urn:uuid:${crypto.randomUUID()}`,
    type: ['VerifiableCredential', 'SkillCertificate'],
    issuer: 'did:web:skillmatch.id',
    issuanceDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    credentialSubject: {
      id: userDid,
      skill: {
        id: `urn:skill:${skill.code}`,
        name: skill.name,
        category: skill.category,
        level: mapScoreToLevel(attempt.score),
      },
      assessment: {
        id: `urn:assessment:${assessment.id}`,
        score: attempt.score,
        passingScore: assessment.passingScore,
        completedAt: attempt.completedAt.toISOString(),
      },
      evidence: [
        {
          id: `urn:attempt:${attempt.id}`,
          type: 'AssessmentResult',
          assessmentId: `urn:assessment:${assessment.id}`,
          attemptId: `urn:attempt:${attempt.id}`,
          answersHash: await hashAnswers(attempt.answers),
        },
      ],
    },
  };

  const suite = new Ed25519Signature2020({ key: issuerKey });
  const result = await issue({
    credential,
    suite,
    documentLoader,
  });
  return ((result as any).credential || result) as SkillCredential;
}

export async function hashAnswers(answers: Record<string, any>): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(answers));
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function mapScoreToLevel(score: number): string {
  if (score >= 90) return 'EXPERT';
  if (score >= 75) return 'ADVANCED';
  if (score >= 60) return 'INTERMEDIATE';
  return 'BEGINNER';
}

export async function verifyCredential(credential: SkillCredential): Promise<{
  verified: boolean;
  error?: string;
}> {
  try {
    const { verifyCredential: verifyVc } = await import('@digitalbazaar/vc');
    const { Ed25519Signature2020 } = await import('@digitalbazaar/ed25519-signature-2020');
    const suite = new Ed25519Signature2020();
    const result = await verifyVc({
      credential,
      suite,
      documentLoader,
      checkStatus: async (cred: { issuer: string }) => {
        const issuerDid = cred.issuer;
        return issuerDid === 'did:web:skillmatch.id' || (await isTrustedIssuer(issuerDid));
      },
    });
    return { verified: result.verified };
  } catch (error) {
    return { verified: false, error: getErrorMessage(error) };
  }
}

async function isTrustedIssuer(issuerDid: string): Promise<boolean> {
  const trustedIssuers = [
    'did:web:bnsp.go.id',
    'did:web:kemenaker.go.id',
    'did:web:blk.go.id',
  ];
  return trustedIssuers.includes(issuerDid);
}

export async function saveCredentialToDb(
  userId: string,
  skillId: string,
  credential: SkillCredential,
  ipfsHash?: string | null
): Promise<void> {
  const hash = ipfsHash && ipfsHash.trim() ? ipfsHash.trim() : null;
  await prisma.certification.create({
    data: {
      userId,
      skillId,
      issuer: 'SkillMatch & Standar BNSP RI',
      credentialId: credential.id,
      credentialType: 'VerifiableCredential',
      level: credential.credentialSubject.skill.level as any,
      issuedAt: new Date(credential.issuanceDate),
      expiresAt: credential.expirationDate ? new Date(credential.expirationDate) : null,
      status: 'VERIFIED',
      vcData: JSON.parse(JSON.stringify(credential)),
      ipfsHash: hash,
    },
  });

  await prisma.verifiableCredential.create({
    data: {
      userId,
      vcType: 'SkillCertificate',
      vcJson: JSON.parse(JSON.stringify(credential)),
      ipfsHash: hash,
      issuedAt: new Date(),
      expiresAt: credential.expirationDate ? new Date(credential.expirationDate) : null,
    },
  });
}

export async function getCredentialById(credentialId: string) {
  return prisma.certification.findUnique({
    where: { credentialId },
    include: { user: true, skill: true },
  });
}

export async function verifyCredentialByEmployer(
  credentialId: string,
  employerId: string
): Promise<{
  valid: boolean;
  credential?: SkillCredential;
  reason?: string;
}> {
  const cert = await getCredentialById(credentialId);
  if (!cert) return { valid: false, reason: 'Credential not found' };

  const verified = await verifyCredential(cert.vcData as SkillCredential);
  if (!verified.verified) return { valid: false, reason: 'Invalid signature' };

  if (cert.revokedAt) {
    return { valid: false, reason: 'Credential revoked', credential: cert.vcData as SkillCredential };
  }

  if (cert.expiresAt && new Date(cert.expiresAt) < new Date()) {
    return { valid: false, reason: 'Credential expired', credential: cert.vcData as SkillCredential };
  }

  await prisma.credentialVerification.create({
    data: {
      credentialId,
      verifierId: employerId,
      verifiedAt: new Date(),
      result: 'VALID',
    },
  });

  return { valid: true, credential: cert.vcData as SkillCredential };
}

export async function revokeCredential(
  credentialId: string,
  reason: string
): Promise<void> {
  await prisma.certification.update({
    where: { credentialId },
    data: {
      status: 'REJECTED',
      revokedAt: new Date(),
      revokedReason: reason,
    },
  });

  const vcRecord = await prisma.verifiableCredential.findFirst({
    where: { ipfsHash: { not: null } },
  });
  if (vcRecord) {
    await prisma.verifiableCredential.update({
      where: { id: vcRecord.id },
      data: { revoked: true },
    });
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unknown error';
}