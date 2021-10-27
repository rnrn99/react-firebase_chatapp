import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function RegisterPage() {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const password = useRef();
  password.current = watch("password");

  console.log(watch("email"));

  return (
    <div className="auth-wrapper">
      <h3>Register</h3>

      <form>
        <label>Email</label>
        <input
          name="email"
          type="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>이메일을 입력해 주세요</p>}

        <label>Name</label>
        <input
          name="name"
          {...register("name", { required: true, maxLength: 10 })}
        />
        {errors.name && errors.name.type === "required" && (
          <p>이름을 입력해 주세요</p>
        )}
        {errors.name && errors.name.type === "maxLength" && (
          <p>이름은 10자 이하만 가능합니다</p>
        )}

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

        <label>Password Confirm</label>
        <input
          name="passwordConfirm"
          type="password"
          {...register("passwordConfirm", {
            required: true,
            validate: (value) => value === password.current,
          })}
        />
        {errors.passwordConfirm &&
          errors.passwordConfirm.type === "required" && <p>필수 항목입니다</p>}
        {errors.passwordConfirm &&
          errors.passwordConfirm.type === "validate" && (
            <p>비밀번호가 일치하지 않습니다</p>
          )}

        <input type="submit" />

        <Link style={{ color: "gray", textDecoration: "none" }} to="/login">
          이미 아이디가 있다면...
        </Link>
      </form>
    </div>
  );
}

export default RegisterPage;
