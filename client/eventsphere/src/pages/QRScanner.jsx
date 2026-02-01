import React, { useState } from "react";
import api from "../api/axios";
import ClubNav from "../components/ClubNav";

const QRScanner = () => {
  const [qrToken, setQrToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!qrToken.trim()) {
      setMessage("Please paste a valid QR token");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/registrations/verify-qr", {
        qrToken,
      });
      setMessage(res.data.message);
      setQrToken("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <ClubNav />

      <div className="max-w-md mx-auto p-6">
        <h1 className="text-xl font-semibold text-white mb-2">
          Scan QR Code
        </h1>
        <p className="text-zinc-400 mb-6">
          Scan or paste student QR codes to mark attendance
        </p>

        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 space-y-4">
          {/* Placeholder for future camera scan */}
          <div className="h-40 flex items-center justify-center text-zinc-500 border border-dashed border-zinc-600 rounded-lg">
            Camera Preview (coming soon)
          </div>

          <textarea
            placeholder="Paste QR token here"
            rows={4}
            value={qrToken}
            onChange={(e) => setQrToken(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleVerify}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-md text-sm text-white transition ${
              loading
                ? "bg-zinc-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Verifying..." : "Verify & Mark Attendance"}
          </button>

          {message && (
            <p className="text-sm text-center text-zinc-300">
              {message}
            </p>
          )}
        </div>

        <p className="text-xs text-zinc-500 mt-4 text-center">
          Tip: You can paste QR data if camera scanning is unavailable.
        </p>
      </div>
    </div>
  );
};

export default QRScanner;
