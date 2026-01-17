import React, { useState } from "react";
import api from "../api/axios";
import ClubNav from "../components/ClubNav";

function QRScanner() {
  const [qrToken, setQrToken] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    try {
      const res = await api.post("/registrations/verify-qr", {
        qrToken,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Verification failed"
      );
    }
  };

  return (
    <div>
      <ClubNav />
      <h2>QR Attendance Scanner</h2>

      <textarea
        placeholder="Paste QR token here"
        rows={4}
        cols={50}
        value={qrToken}
        onChange={(e) => setQrToken(e.target.value)}
      />

      <br /><br />

      <button onClick={handleVerify}>
        Verify & Mark Attendance
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default QRScanner;
