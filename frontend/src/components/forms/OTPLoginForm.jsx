import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";
import FormError from "../common/FormError";
import { validateMobile, validateOTP } from "../../utils/validators";

const OTPLoginForm = ({ onVerified }) => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmResult, setConfirmResult] = useState(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState("mobile");

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
  };

  const sendOtp = async () => {
    const err = validateMobile(mobile);
    if (err) {
      setError(err);
      return;
    }

    setError("");
    setupRecaptcha();

    try {
      const result = await signInWithPhoneNumber(
        auth,
        `+91${mobile}`,
        window.recaptchaVerifier
      );
      setConfirmResult(result);
      setStep("otp");
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    const err = validateOTP(otp);
    if (err) {
      setError(err);
      return;
    }

    try {
      const result = await confirmResult.confirm(otp);
      const token = await result.user.getIdToken();
      onVerified(token);
    } catch (err) {
      console.error(err);
      setError("Invalid OTP");
    }
  };

  return (
    <div className="glass w-full max-w-md rounded-2xl p-6">
      <h2 className="mb-4 text-xl font-semibold">Login with OTP</h2>

      {step === "mobile" && (
        <>
          <input
            type="text"
            placeholder="Enter mobile number"
            className="w-full rounded-lg p-3 text-black"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <button
            onClick={sendOtp}
            className="glow-btn mt-4 w-full rounded-lg bg-cyan-500 py-3 font-semibold text-black"
          >
            Send OTP
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full rounded-lg p-3 text-black"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={verifyOtp}
            className="glow-btn mt-4 w-full rounded-lg bg-cyan-500 py-3 font-semibold text-black"
          >
            Verify OTP
          </button>
        </>
      )}

      <FormError error={error} />
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default OTPLoginForm;