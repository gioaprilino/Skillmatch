const CONTEXTS: Record<string, any> = {
  'https://www.w3.org/2018/credentials/v1': {
    '@context': {
      '@version': 1.1,
      '@protected': true,
      id: '@id',
      type: '@type',
      VerifiableCredential: { '@id': 'https://www.w3.org/2018/credentials#VerifiableCredential', '@context': { '@version': 1.1, '@protected': true, id: '@id', type: '@type' } },
      VerifiablePresentation: { '@id': 'https://www.w3.org/2018/credentials#VerifiablePresentation', '@context': { '@version': 1.1, '@protected': true, id: '@id', type: '@type' } },
      credentialSchema: { '@id': 'https://www.w3.org/2018/credentials#credentialSchema', '@type': '@id' },
      credentialStatus: { '@id': 'https://www.w3.org/2018/credentials#credentialStatus', '@type': '@id' },
      credentialSubject: { '@id': 'https://www.w3.org/2018/credentials#credentialSubject', '@type': '@id' },
      evidence: { '@id': 'https://www.w3.org/2018/credentials#evidence', '@type': '@id' },
      expirationDate: { '@id': 'https://www.w3.org/2018/credentials#expirationDate', '@type': 'xsd:dateTime' },
      holder: { '@id': 'https://www.w3.org/2018/credentials#holder', '@type': '@id' },
      issuer: { '@id': 'https://www.w3.org/2018/credentials#issuer', '@type': '@id' },
      issuanceDate: { '@id': 'https://www.w3.org/2018/credentials#issuanceDate', '@type': 'xsd:dateTime' },
      proof: { '@id': 'https://www.w3.org/2018/credentials#proof', '@type': '@id', '@container': '@graph' },
      refreshService: { '@id': 'https://www.w3.org/2018/credentials#refreshService', '@type': '@id' },
      termsOfUse: { '@id': 'https://www.w3.org/2018/credentials#termsOfUse', '@type': '@id' },
      validFrom: { '@id': 'https://www.w3.org/2018/credentials#validFrom', '@type': 'xsd:dateTime' },
      validator: { '@id': 'https://www.w3.org/2018/credentials#validator', '@type': '@id' },
    },
  },
  'https://w3id.org/security/suites/ed25519-2020/v1': {
    '@context': {
      '@version': 1.1,
      '@protected': true,
      Ed25519Signature2020: { '@id': 'https://w3id.org/security#Ed25519Signature2020', '@context': { '@version': 1.1, '@protected': true, challenge: 'https://w3id.org/security#challenge', created: 'https://w3id.org/security#created', domain: 'https://w3id.org/security#domain', expires: 'https://w3id.org/security#expires', jws: 'https://w3id.org/security#jws', nonce: 'https://w3id.org/security#nonce', proofPurpose: 'https://w3id.org/security#proofPurpose', proofValue: 'https://w3id.org/security#proofValue', verificationMethod: 'https://w3id.org/security#verificationMethod' } },
      Ed25519VerificationKey2020: { '@id': 'https://w3id.org/security#Ed25519VerificationKey2020', '@context': { '@version': 1.1, '@protected': true, controller: 'https://w3id.org/security#controller', publicKeyMultibase: 'https://w3id.org/security#publicKeyMultibase' } },
    },
  },
};

const SKILL_CONTEXT = {
  '@context': {
    '@version': 1.1,
    '@protected': true,
    SkillCertificate: 'https://skillmatch.id/terms/SkillCertificate',
    skill: 'https://skillmatch.id/terms/skill',
    name: 'https://schema.org/name',
    category: 'https://skillmatch.id/terms/category',
    level: 'https://skillmatch.id/terms/level',
    assessment: 'https://skillmatch.id/terms/assessment',
    score: 'https://skillmatch.id/terms/score',
    passingScore: 'https://skillmatch.id/terms/passingScore',
    completedAt: 'https://skillmatch.id/terms/completedAt',
    evidence: 'https://skillmatch.id/terms/evidence',
    AssessmentResult: 'https://skillmatch.id/terms/AssessmentResult',
    assessmentId: 'https://skillmatch.id/terms/assessmentId',
    attemptId: 'https://skillmatch.id/terms/attemptId',
    answersHash: 'https://skillmatch.id/terms/answersHash',
  },
};

CONTEXTS['https://skillmatch.id/contexts/skill-v1.jsonld'] = SKILL_CONTEXT;

export async function documentLoader(url: string): Promise<{ document: any; contextUrl: any }> {
  if (CONTEXTS[url]) {
    return { contextUrl: null, document: CONTEXTS[url] };
  }
  // For any other URLs, we'll fail gracefully in development
  // In production, you might want to fetch from a caching service
  throw new Error(`Context not found: ${url}. Add to CONTEXTS in vc-document-loader.ts`);
}

export function registerContext(url: string, context: any): void {
  CONTEXTS[url] = context;
}

export function getRegisteredContexts(): string[] {
  return Object.keys(CONTEXTS);
}