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
    AssessmentResult: 'https://skillmatch.id/terms/AssessmentResult',
    assessmentId: 'https://skillmatch.id/terms/assessmentId',
    attemptId: 'https://skillmatch.id/terms/attemptId',
    answersHash: 'https://skillmatch.id/terms/answersHash',
  },
};

const DID_DOCUMENT = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/suites/ed25519-2020/v1'
  ],
  id: 'did:web:skillmatch.id',
  verificationMethod: [
    {
      id: 'did:web:skillmatch.id#key-1',
      type: 'Ed25519VerificationKey2020',
      controller: 'did:web:skillmatch.id',
      publicKeyMultibase: process.env.VC_ISSUER_PUBLIC_KEY_MULTIBASE || 'z6MkiZ5TciFcbLfJn2cKpHQTvq3TFGuyc7J8ARg2jGHx4Lwb',
    }
  ],
  authentication: ['did:web:skillmatch.id#key-1'],
  assertionMethod: ['did:web:skillmatch.id#key-1'],
};

CONTEXTS['https://skillmatch.id/contexts/skill-v1.jsonld'] = SKILL_CONTEXT;
CONTEXTS['did:web:skillmatch.id'] = DID_DOCUMENT;
CONTEXTS['did:web:skillmatch.id#key-1'] = DID_DOCUMENT.verificationMethod[0];
CONTEXTS['https://skillmatch.id/.well-known/did.json'] = DID_DOCUMENT;
CONTEXTS['https://www.w3.org/ns/did/v1'] = {
  '@context': {
    '@version': 1.1,
    '@protected': true,
    id: '@id',
    type: '@type',
    verificationMethod: { '@id': 'https://w3id.org/security#verificationMethod', '@type': '@id' },
    authentication: { '@id': 'https://w3id.org/security#authenticationMethod', '@type': '@id' },
    assertionMethod: { '@id': 'https://w3id.org/security#assertionMethod', '@type': '@id' },
  }
};

export async function documentLoader(url: string): Promise<{ document: any; contextUrl: any }> {
  if (CONTEXTS[url]) {
    return { contextUrl: null, document: CONTEXTS[url] };
  }
  if (url.startsWith('did:web:skillmatch.id')) {
    if (url.includes('#key-1')) {
      return { contextUrl: null, document: DID_DOCUMENT.verificationMethod[0] };
    }
    return { contextUrl: null, document: DID_DOCUMENT };
  }
  // For any other URLs, we'll fail gracefully in development
  throw new Error(`Context not found: ${url}. Add to CONTEXTS in vc-document-loader.ts`);
}

export function registerContext(url: string, context: any): void {
  CONTEXTS[url] = context;
}

export function getRegisteredContexts(): string[] {
  return Object.keys(CONTEXTS);
}