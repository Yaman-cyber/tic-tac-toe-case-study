import React, { useState } from "react";
import { View, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

import { setCredentials } from "../../../store/slices/authSlice";
import authApi from "../../../utils/api/v1/auth";
import type { AppDispatch } from "../../../store";

import AppText from "../../../components/common/AppText";
import AppButton from "../../../components/common/AppButton";
import AppInput from "../../../components/common/AppInput";
import AppTextLnk from "../../../components/common/AppTextLnk";

import routes from "../../../navigation/routes";
import { RootStackParamList } from "../../../types/navigation";

import colors from "../../../config/colors";

const { width, height } = Dimensions.get("window");

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function SignupView({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, typeof routes.SIGNUP> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const handleSignup = async () => {
    try {
      await validationSchema.validate({ email, password }, { abortEarly: false });
      setFieldErrors({});
      setError("");
      const response = await authApi.signup(email, password);
      const { data } = response.data;
      dispatch(setCredentials({ user: { ...data, id: data._id }, token: "" }));
      navigation.replace(routes.VERIFY);

      return;
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const errors: { email?: string; password?: string } = {};
        err.inner.forEach((validationError: Yup.ValidationError) => {
          if (validationError.path) {
            errors[validationError.path as "email" | "password"] = validationError.message;
          }
        });
        setFieldErrors(errors);
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <AppText style={styles.title}>{t("signin.title")}</AppText>
        <AppInput
          placeholder={t("signin.email")}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          inputStyle={styles.topInput}
          containerStyle={styles.inputContainer}
          error={fieldErrors.email}
        />
        <AppInput
          placeholder={t("signin.password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={styles.bottomInput}
          containerStyle={styles.inputContainer}
          error={fieldErrors.password}
        />
        {error && !fieldErrors.email && !fieldErrors.password && <AppText style={styles.error}>{error}</AppText>}

        <AppButton text={t("signin.button")} onPress={handleSignup} textStyle={styles.signupButtonText} buttonStyle={styles.signupButton} />

        <AppTextLnk onPress={() => navigation.replace(routes.LOGIN)} text={t("signin.login")} />
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
