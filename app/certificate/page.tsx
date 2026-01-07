// app/certificate/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  Download,
  ArrowLeft,
  FileText,
  Award,
  AlertCircle,
} from "lucide-react";

export default function CertificatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      const user = session.user as any;
      // console.log("Session user object:", user);
      // console.log("All user properties:", Object.keys(user));

      // Try both property names
      const url = user.certUrl || user.cert_url || "";
      // console.log("Found certificate URL:", url);

      setCertificateUrl(url);

      // Debug info
      // setDebugInfo(`
      //   certUrl: ${user.certUrl || "NOT FOUND"}
      //   cert_url: ${user.cert_url || "NOT FOUND"}
      //   Full session: ${JSON.stringify(user, null, 2)}
      // `);
    }
  }, [session]);

  const handleDownloadCertificate = async () => {
    if (!certificateUrl) {
      alert("Certificate URL not available. Please contact support.");
      // console.log("Debug info:", debugInfo);
      return;
    }

    setLoading(true);
    try {
      // Open certificate in new tab
      window.open(certificateUrl, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to open certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mt-10 mb-1">
            Download Certificate
          </h1>
          <p className="text-gray-600">AOICON 2026 • KOLKATA</p>
        </div> */}

        <Card className="overflow-hidden shadow-xl border border-gray-300">
          <div className="bg-gradient-to-br  from-blue-600 to-blue-800 px-6 py-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              Download Certificate
            </h2>
            <p className="text-green-100 text-sm">AOICON 2026 • KOLKATA</p>
          </div>

          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {user.name}
              </h3>
              <div className="inline-block bg-gray-100 px-4 py-2 rounded-md mt-2">
                <p className="text-sm font-medium text-gray-700">
                  Registration:{" "}
                  <span className="font-bold">{user.registrationNumber}</span>
                </p>
              </div>
            </div>

            {/* Certificate Status */}
            {/* <div className="space-y-4">
              <div
                className={`flex items-center justify-center p-4 rounded-lg border ${
                  certificateUrl
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <FileText
                  className={`w-6 h-6 mr-3 ${
                    certificateUrl ? "text-blue-600" : "text-red-600"
                  }`}
                />
                <div className="text-left">
                  <p
                    className={`font-medium ${
                      certificateUrl ? "text-blue-900" : "text-red-900"
                    }`}
                  >
                    {certificateUrl
                      ? "Certificate Available"
                      : "Certificate Not Available"}
                  </p>
                  <p
                    className={`text-sm ${
                      certificateUrl ? "text-blue-700" : "text-red-700"
                    }`}
                  >
                    {certificateUrl
                      ? "Click download to view your certificate"
                      : "Please contact support for assistance"}
                  </p>
                </div>
              </div>

              {!certificateUrl && (
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="font-medium text-blue-800 mb-1">
                    Certificate Not Found?
                  </p>
                  <p>
                    Your certificate URL might not be associated with your
                    registration. Please contact the registration team for
                    assistance.
                  </p>
                </div>
              )}
            </div> */}

            {/* Download Button */}
            <Button
              onClick={handleDownloadCertificate}
              disabled={loading || !certificateUrl}
              className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Opening Certificate...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  {certificateUrl
                    ? "Download Certificate"
                    : "Certificate Not Available"}
                </>
              )}
            </Button>

            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="w-full h-12 text-base"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Login
            </Button>

            {/* Contact Support */}
            {/* <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">
                Need help with your certificate?
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => {
                  window.location.href = "mailto:support@registrationteam.in";
                }}
              >
                Contact Support
              </Button>
            </div> */}
          </div>
        </Card>
      </div>
    </div>
  );
}
