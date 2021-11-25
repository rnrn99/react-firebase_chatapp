import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import md5 from "md5";

function RegisterPage() {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [SubmitError, setSubmitError] = useState("");
  const [Loading, setLoading] = useState(false);

  const password = useRef();
  password.current = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const auth = getAuth();

      let createUser = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(data.email)}?d=identicon`,
      });

      const database = getDatabase();
      set(ref(database, `users/${createUser.user.uid}`), {
        name: createUser.user.displayName,
        image: createUser.user.photoURL,
      });

      setLoading(false);
    } catch (error) {
      setSubmitError(error.message);
      setLoading(false);
      setTimeout(() => setSubmitError(""), 5000);
    }
  };

  return (
    <div className="auth-wrapper">
      <h3>Register</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
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

        {SubmitError && <p>{SubmitError}</p>}
        <input type="submit" disabled={Loading} />

        <Link style={{ color: "gray", textDecoration: "none" }} to="/login">
          이미 아이디가 있다면...
        </Link>
      </form>
    </div>
  );
}

export default RegisterPage;
