import { NextRequest, NextResponse } from 'next/server';
import { verifyCredential, getCredentialById } from '@/lib/vc';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credentialId, credentialJson } = body;

    // Option 1: Verification by JSON object
    if (credentialJson) {
      const parsedCred = typeof credentialJson === 'string' ? JSON.parse(credentialJson) : credentialJson;
      const verifyResult = await verifyCredential(parsedCred);

      return NextResponse.json({
        valid: verifyResult.verified,
        credential: parsedCred,
        reason: verifyResult.error || (verifyResult.verified ? undefined : 'Tanda tangan digital tidak valid'),
      });
    }

    // Option 2: Verification by Credential ID
    if (credentialId) {
      const cert = await getCredentialById(credentialId);

      if (!cert) {
        // If not in database, attempt fallback to check if it's a known format
        return NextResponse.json(
          { valid: false, reason: 'Kredensial dengan ID tersebut tidak ditemukan di registry.' },
          { status: 404 }
        );
      }

      const verifyResult = await verifyCredential(cert.vcData as any);

      if (!verifyResult.verified) {
        return NextResponse.json({
          valid: false,
          reason: 'Tanda tangan kriptografi Ed25519 tidak valid atau telah dimodifikasi.',
          cert,
        });
      }

      if (cert.revokedAt) {
        return NextResponse.json({
          valid: false,
          reason: 'Kredensial ini telah dicabut (Revoked) oleh penerbit.',
          cert,
        });
      }

      if (cert.expiresAt && new Date(cert.expiresAt) < new Date()) {
        return NextResponse.json({
          valid: false,
          reason: 'Masa berlaku sertifikat telah kedaluwarsa.',
          cert,
        });
      }

      return NextResponse.json({
        valid: true,
        credential: cert.vcData,
        details: {
          userName: cert.user?.name,
          skillName: cert.skill?.name,
          level: cert.level,
          issuer: cert.issuer,
          issuedAt: cert.issuedAt,
          expiresAt: cert.expiresAt,
          ipfsHash: cert.ipfsHash,
        },
      });
    }

    return NextResponse.json(
      { valid: false, reason: 'Harap sediakan credentialId atau data JSON kredensial.' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error verifying VC:', error);
    return NextResponse.json(
      { valid: false, reason: error.message || 'Terjadi kesalahan sistem saat memverifikasi kredensial.' },
      { status: 500 }
    );
  }
}
