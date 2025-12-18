import { useSearchParams, useNavigate } from "react-router";
import { useEffect } from "react";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      toast.success("Payment successful! You are registered.");
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-3xl font-bold text-green-600">
        🎉 Payment Successful
      </h1>
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
