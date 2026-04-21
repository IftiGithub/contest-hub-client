import { useSearchParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card-gamified p-8 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg"
          >
            <span className="text-2xl">⏳</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[var(--text-primary)] text-lg mt-4 font-semibold"
          >
            Verifying payment...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center items-center text-center px-4 py-16"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="card-gamified p-10 max-w-md"
      >
        <motion.div className="text-7xl mb-6">🎉</motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4"
        >
          Payment Successful!
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[var(--text-secondary)] text-base mb-8"
        >
          You have successfully joined the contest and your entry is now confirmed.
        </motion.p>

        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="btn-gamified w-full"
          onClick={() => navigate("/dashboard/participated")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Go to My Contests
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentSuccess;
