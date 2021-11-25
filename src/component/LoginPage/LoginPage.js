import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function LoginPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [SubmitError, setSubmitError] = useState("");
  const [Loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, data.email, data.password);

      setLoading(false);
    } catch (error) {
      setSubmitError(error.message);
      setLoading(false);
      setTimeout(() => setSubmitError(""), 5000);
    }
  };

  return (
    <div className="auth-wrapper">
      <h3>Login</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>이메일을 입력해 주세요</p>}

        <label>Password</label>
        <input
          name="password"
          type="password"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === "required" && (
          <p>비밀번호를 입력해 주세요</p>
        )}
        {errors.password && errors.password.type === "minLength" && (
          <p>비밀번호는 6자 이상만 가능합니다</p>
        )}

        {SubmitError && <p>{SubmitError}</p>}
        <input type="submit" disabled={Loading} />

        <Link style={{ color: "gray", textDecoration: "none" }} to="/register">
          아직 아이디가 없다면...
        </Link>
      </form>
    </div>
  );
}

export default LoginPage;
