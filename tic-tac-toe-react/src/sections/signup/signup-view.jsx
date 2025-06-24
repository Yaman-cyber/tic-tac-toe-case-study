import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Joi from "joi-browser";

import { setCredentials } from "../../store/features/authSlice";
import authApi from "../../utils/api/v1/auth";

import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import Card from "../../components/Card";
import PageContainer from "../../components/PageContainer";
import Heading from "../../components/Heading";

const schema = {
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label("Email"),
  password: Joi.string().min(6).required().label("Password"),
};

export default function SignupView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const { error } = Joi.validate(formData, schema, { abortEarly: false });
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
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
      const { data } = await authApi.signup(formData.email, formData.password);

      dispatch(setCredentials({ user: data.data }));

      navigate("/verify");
    } catch (err) {
      setErrors({
        form: err.response?.data?.message || "An error occurred during signup",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <PageContainer>
      <Card className="space-y-8">
        <Heading>Create an account</Heading>

        {errors.form && <div className="text-red-600 text-sm text-center">{errors.form}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <TextInput id="email" name="email" type="email" autoComplete="email" placeholder="Email address" value={formData.email} onChange={handleChange} rounded="top" error={errors.email} />
            <TextInput
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              rounded="bottom"
              error={errors.password}
            />
          </div>

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">have an account?</span>
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Login
            </Link>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}
