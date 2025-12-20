import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function QRCodePage() {
  const { registrationId } = useParams();
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await api.get(
          `/registrations/${registrationId}/qrcode`
        );

        // backend sends { dataUrl }
        setQrDataUrl(res.data.dataUrl);
      } catch (err) {
        console.error(err);
        setError("Failed to load QR code");
      } finally {
        setLoading(false);
      }
    };

    fetchQR();
  }, [registrationId]);

  if (loading) return <p>Loading QR code...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Your QR Ticket</h2>

      {qrDataUrl ? (
        <img
          src={qrDataUrl}
          alt="Event QR Code"
          style={{ width: "250px", height: "250px" }}
        />
      ) : (
        <p>QR not available</p>
      )}

      <p>Show this QR at the event entrance.</p>
      <button onClick={()=>{navigate("/dashboard")}}>Back To DashBoard. </button>
    </div>
  );
}

export default QRCodePage;
