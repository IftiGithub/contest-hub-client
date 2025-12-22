import { useSearchParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");
  const contestId = searchParams.get("contestId");

  useEffect(() => {
    if (!sessionId || !contestId) {
      toast.error("Invalid payment session");
      setLoading(false);
      return;
    }

    const confirmPayment = async () => {
      try {
        const res = await fetch("https://contest-hub-server-ashen-two.vercel.app/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message || "Payment verification failed");
        }
      } catch (err) {
        console.error(err);
        toast.error("Payment verification failed");
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId, contestId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Verifying payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-3xl font-bold text-green-600">🎉 Payment Successful</h1>
      <p className="mt-4 text-gray-600">
        You have successfully joined the contest.
      </p>

      <button
        className="btn btn-primary mt-6"
        onClick={() => navigate("/dashboard/participated")}
      >
        Go to My Contests
      </button>
    </div>
  );
};

export default PaymentSuccess;
