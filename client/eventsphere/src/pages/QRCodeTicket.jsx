import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import StudentNav from "../components/StudentNav";

function QRCodeTicket() {
  const { regId } = useParams();
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await api.get(`/registrations/${regId}/qrcode`);
        setQr(res.data.dataUrl);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load QR code");
      } finally {
        setLoading(false);
      }
    };

    fetchQR();
  }, [regId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
        <StudentNav />
        <div className="max-w-md mx-auto p-6 text-zinc-400">
          Loading QR ticket…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
        <StudentNav />
        <div className="max-w-md mx-auto p-6 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <StudentNav />

      <div className="max-w-md mx-auto p-6">
        <h1 className="text-xl font-semibold text-white mb-4 text-center">
          Your Event QR Ticket
        </h1>

        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 flex flex-col items-center space-y-4">
          <img
            src={qr}
            alt="Event QR Code"
            className="w-56 h-56 bg-white p-2 rounded"
          />

          <p className="text-sm text-zinc-400 text-center">
            Show this QR code at the event entrance for verification.
          </p>

          <p className="text-xs text-zinc-500 text-center">
            This QR can be scanned only once.
          </p>
        </div>
      </div>
    </div>
  );
}

export default QRCodeTicket;
