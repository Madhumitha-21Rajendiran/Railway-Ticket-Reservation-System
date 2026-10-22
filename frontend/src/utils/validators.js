export const validateMobile = (mobile) => {
  if (!mobile) return "Mobile number is required";
  if (!/^[6-9]\d{9}$/.test(mobile)) return "Enter valid 10-digit mobile number";
  return "";
};

export const validateOTP = (otp) => {
  if (!otp) return "OTP is required";
  if (!/^\d{6}$/.test(otp)) return "OTP must be 6 digits";
  return "";
};