import React, { useState, useEffect } from "react";
import { View, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import AppText from "../../../components/common/AppText";
import AppButton from "../../../components/common/AppButton";
import AppInput from "../../../components/common/AppInput";
import AppTextLnk from "../../../components/common/AppTextLnk";

import routes from "../../../navigation/routes";
import { RootStackParamList } from "../../../types/navigation";
import { login, clearError, setCredentials } from "../../../store/slices/authSlice";
import { RootState } from "../../../store";
import type { AppDispatch } from "../../../store";

import colors from "../../../config/colors";
import authApi from "../../../utils/api/v1/auth";

const { width } = Dimensions.get("window");

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function LoginView({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, typeof routes.LOGIN> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState("");

  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLogin = async () => {
    try {
      await validationSchema.validate({ email, password }, { abortEarly: false });
      setFieldErrors({});

      const response = await authApi.login(email, password);
      const userData = { user: response?.data?.data, token: response?.data?.data?.token };
      dispatch(setCredentials({ user: { id: userData.user._id, ...userData.user }, token: null }));

      if (!userData?.user?.verifiedAt) {
        navigation.replace(routes.VERIFY);
        return;
      }
      // else, proceed as normal (stay on screen or navigate elsewhere if needed)
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
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <AppText style={styles.title}>{t("login.title")}</AppText>

        <AppInput
          placeholder={t("login.email")}
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
          placeholder={t("login.password")}
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

        <AppButton text={t("login.button")} textStyle={styles.loginButtonText} buttonStyle={styles.loginButton} onPress={handleLogin} />

        <AppTextLnk onPress={() => navigation.replace(routes.SIGNUP)} text={t("login.signup")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.white },
  formContainer: { padding: 5 },
  topInput: { top: 4, borderWidth: 0, borderRadius: 0, backgroundColor: "transparent" },
  bottomInput: { borderWidth: 0, borderRadius: 0, backgroundColor: "transparent" },
  inputContainer: { marginBottom: 4 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24, textAlign: "center", color: colors.black },
  error: { color: colors.danger, marginBottom: 8, textAlign: "center" },
  loginButton: { backgroundColor: colors.primary },
  loginButtonText: { color: colors.white, fontSize: width * 0.04, fontWeight: "bold" },
});
