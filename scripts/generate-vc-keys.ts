import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';

async function generateKeys() {
  console.log('🔐 Generating Ed25519 Verification Key Pair for Verifiable Credentials...\n');

  const keyPair = await Ed25519VerificationKey2020.generate();

  // The library returns multibase encoded keys (z + base58btc)
  const privateKeyMultibase = keyPair.privateKeyMultibase;
  const publicKeyMultibase = keyPair.publicKeyMultibase;

  // Also get the raw base58 (without multibase prefix 'z')
  const privateKeyBase58 = privateKeyMultibase.slice(1); // Remove 'z' prefix
  const publicKeyBase58 = publicKeyMultibase.slice(1); // Remove 'z' prefix

  // Generate DID document
  const didDocument = {
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
        publicKeyMultibase,
      }
    ],
    authentication: ['did:web:skillmatch.id#key-1'],
    assertionMethod: ['did:web:skillmatch.id#key-1'],
  };

  console.log('='.repeat(60));
  console.log('📋 ADD TO YOUR .env FILE:');
  console.log('='.repeat(60));
  console.log(`VC_ISSUER_DID="did:web:skillmatch.id"`);
  console.log(`VC_ISSUER_PRIVATE_KEY_MULTIBASE="${privateKeyMultibase}"`);
  console.log(`VC_ISSUER_PUBLIC_KEY_MULTIBASE="${publicKeyMultibase}"`);
  console.log(`# Or use base58 (without 'z' prefix):`);
  console.log(`VC_ISSUER_PRIVATE_KEY="${privateKeyBase58}"`);
  console.log(`VC_ISSUER_PUBLIC_KEY="${publicKeyBase58}"`);
  console.log('='.repeat(60));

  console.log('\n📄 DID Document (host at https://skillmatch.id/.well-known/did.json):');
  console.log(JSON.stringify(didDocument, null, 2));

  console.log('\n⚠️  IMPORTANT:');
  console.log('1. Store VC_ISSUER_PRIVATE_KEY_MULTIBASE securely (never commit to git)');
  console.log('2. Host DID document at https://skillmatch.id/.well-known/did.json');
  console.log('3. Ensure domain has valid HTTPS & proper CORS headers');
  console.log('4. For production, use hardware security module (HSM)');
  console.log('5. The multibase format (z...) is required by @digitalbazaar libraries');
}

generateKeys().catch(console.error);