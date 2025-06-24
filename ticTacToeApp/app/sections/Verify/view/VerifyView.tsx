import React, { useState } from "react";
import { View, Dimensions, StyleSheet, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import AppText from "../../../components/common/AppText";
import AppButton from "../../../components/common/AppButton";
import AppTextLnk from "../../../components/common/AppTextLnk";
import AppOTPInput from "../../../components/common/AppOTPInput";

import routes from "../../../navigation/routes";
import { RootStackParamList } from "../../../types/navigation";
import { RootState } from "../../../store";
import authApi from "../../../utils/api/v1/auth";
import { setCredentials } from "../../../store/slices/authSlice";

import colors from "../../../config/colors";

const { width, height } = Dimensions.get("window");

export default function VerifyView({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, typeof routes.VERIFY> }) {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendError, setResendError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const { t } = useTranslation();
  const email = useSelector((state: RootState) => state.auth.user?.email);
  const dispatch = useDispatch();

  const handleVerify = async () => {
    if (otp.length !== 5) {
      setOtpError("Please enter the 5-digit code.");
      return;
    }
    if (!email) {
      setOtpError("No email found. Please login again.");
      return;
    }
    setOtpError("");
    setResendError("");
    setLoading(true);
    try {
      const response = await authApi.verifyOtp({ email, otp });
      const userData = response.data.data;
      dispatch(setCredentials({ user: { id: userData._id, ...userData }, token: userData.token }));
      navigation.navigate(routes.PLAY);
    } catch (error: any) {
      setOtpError(error?.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setResendError("No email found. Please login again.");
      return;
    }
    setResendLoading(true);
    setResendError("");
    setResendSuccess(false);
    try {
      await authApi.resendOtp({ email, type: "verify" });
      setResendError(""); // clear error on success
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 2000);
    } catch (error: any) {
      setResendError(error?.response?.data?.message || "Failed to resend code.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <AppText style={styles.title}>{t("verify.title") || "Verify OTP"}</AppText>
        <AppOTPInput value={otp} onChange={setOtp} digits={5} error={otpError} />
        {resendError && !otpError && <AppText style={styles.error}>{resendError}</AppText>}
        <AppButton text={t("Verify")} onPress={handleVerify} textStyle={styles.signupButtonText} buttonStyle={styles.signupButton} disabled={loading} />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <AppTextLnk text={t("Did'nt receive code? resend")} onPress={handleResend} />
          {resendLoading && <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 8 }} />}
          {resendSuccess && !resendLoading && <AppText style={{ color: colors.primary, marginLeft: 8 }}>{t("Code sent!")}</AppText>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.white },
  formContainer: { width: "85%", padding: 24, borderRadius: 16 },
  topInput: { top: 4, borderWidth: 0, borderRadius: 0, backgroundColor: "transparent" },
  bottomInput: { borderWidth: 0, borderRadius: 0, backgroundColor: "transparent" },
  inputContainer: { marginBottom: 4 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24, textAlign: "center", color: colors.black },
  error: { color: colors.danger, marginBottom: 8, textAlign: "center" },
  signupButton: { backgroundColor: colors.primary },
  signupButtonText: { color: colors.white, fontSize: width * 0.04, fontWeight: "bold" },
});
