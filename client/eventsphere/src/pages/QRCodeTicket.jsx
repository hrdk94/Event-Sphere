import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

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
        setError(
          err.response?.data?.message || "Failed to load QR code"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQR();
  }, [regId]);

  if (loading) return <p>Loading QR ticket...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Your Event QR Ticket</h2>

      <p>Please show this QR code at the event entrance.</p>

      <img src={qr} alt="Event QR Code" />

      <p><strong>Note:</strong> QR can be scanned only once.</p>
    </div>
  );
}

export default QRCodeTicket;
