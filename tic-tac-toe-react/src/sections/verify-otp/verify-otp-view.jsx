import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";

import { setCredentials } from "../../store/features/authSlice";
import { selectCurrentUser } from "../../store/features/authSlice";
import authApi from "../../utils/api/v1/auth";

import Button from "../../components/Button";
import Card from "../../components/Card";
import PageContainer from "../../components/PageContainer";
import Heading from "../../components/Heading";

const schema = {
  otp: Joi.string().length(5).required().label("OTP"),
};

export default function VerifyOtpView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }

    inputRefs.current = inputRefs.current.slice(0, 5);
  }, [user, navigate]);

  const validate = () => {
    const otpString = otp.join("");
    const { error } = Joi.validate({ otp: otpString }, schema);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  const handleChange = (index, value) => {
    //  allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }

    if (value && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const otpString = otp.join("");
      const { data } = await authApi.verifyOtp({
        email: user.email,
        otp: otpString,
      });

      dispatch(setCredentials({ user: data.data, token: data.data.token }));

      navigate("/");
    } catch (err) {
      setErrors({
        form: err.response?.data?.message || "An error occurred during verification",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);

    try {
      await authApi.resendOtp({ email: user.email, type: "verify" });
      setOtp(["", "", "", "", ""]);
      inputRefs.current[0].focus();
    } catch (err) {
      setErrors({
        form: err.response?.data?.message || "Failed to resend OTP",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <PageContainer>
      <Card className="space-y-8">
        <Heading>Verify your email</Heading>
        <p className="text-center text-gray-600">Enter the 5-digit code sent to {user?.email}</p>

        {errors.form && <div className="text-red-600 text-sm text-center">{errors.form}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`
                  w-12 h-12 text-center text-2xl font-semibold
                  border rounded-md
                  ${errors.otp ? "border-red-300" : "border-gray-300"}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                `}
              />
            ))}
          </div>
          {errors.otp && <p className="text-center text-sm text-red-600">{errors.otp}</p>}

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Didn't receive the code? </span>
            <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500" onClick={handleResendOtp} disabled={resendLoading}>
              {resendLoading ? "Sending..." : "Resend"}
            </button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}
