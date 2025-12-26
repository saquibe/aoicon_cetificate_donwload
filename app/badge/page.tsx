'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Download, Share2, Award, QrCode } from 'lucide-react';
import QRCodeLib from 'qrcode';
import html2canvas from 'html2canvas';

export default function BadgePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      const registrationNumber = (session.user as any).registrationNumber;
      if (registrationNumber) {
        QRCodeLib.toDataURL(registrationNumber, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
          .then(setQrCodeUrl)
          .catch(console.error);
      }
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user as any;

  const handleDownload = async () => {
    if (!badgeRef.current) return;

    setLoading(true);
    try {
      const canvas = await html2canvas(badgeRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });

      const link = document.createElement('a');
      link.download = `AOICON-2026-Badge-${user.registrationNumber}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!badgeRef.current) return;

    setLoading(true);
    try {
      const canvas = await html2canvas(badgeRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `AOICON-2026-Badge-${user.registrationNumber}.png`, {
            type: 'image/png'
          });

          if (navigator.share && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: 'AOICON 2026 KOLKATA Badge',
                text: `My AOICON 2026 KOLKATA Badge - ${user.registrationNumber}`
              });
            } catch (err) {
              console.error('Share error:', err);
            }
          } else {
            alert('Sharing is not supported on this device. Please use the download button.');
          }
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Share error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 mb-4 shadow-lg">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Digital Badge</h1>
          <p className="text-gray-600">AOICON 2026 KOLKATA</p>
        </div>

        <Card className="overflow-hidden shadow-2xl border-0 mb-6">
          <div ref={badgeRef} className="bg-white">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-8 py-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 border-4 border-white rounded-full"></div>
              </div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 shadow-xl">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">AOICON 2026</h2>
                <p className="text-xl text-blue-100 font-medium">KOLKATA</p>
              </div>
            </div>

            <div className="px-8 py-10 space-y-6">
              <div className="text-center border-b pb-6">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Participant Name</p>
                <h3 className="text-3xl font-bold text-gray-900">{user.name}</h3>
              </div>

              <div className="text-center border-b pb-6">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Registration Number</p>
                <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg shadow-md">
                  <p className="text-2xl font-bold tracking-wider">{user.registrationNumber}</p>
                </div>
              </div>

              {qrCodeUrl && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
                    <QrCode className="w-4 h-4" />
                    QR Code
                  </p>
                  <div className="inline-block p-4 bg-white rounded-lg shadow-lg border-4 border-gray-100">
                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Scan to view registration details</p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  <p className="font-semibold">Date</p>
                  <p>2026</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">Venue</p>
                  <p>Kolkata</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Event</p>
                  <p>AOICON</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleDownload}
            disabled={loading}
            className="h-14 text-base bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Download Badge
              </>
            )}
          </Button>

          <Button
            onClick={handleShare}
            disabled={loading}
            variant="outline"
            className="h-14 text-base border-2 shadow-lg hover:bg-blue-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-5 w-5" />
                Share Badge
              </>
            )}
          </Button>
        </div>

        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/login')}
            className="text-gray-600 hover:text-gray-900"
          >
            Return to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
