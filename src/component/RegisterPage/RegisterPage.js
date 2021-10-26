import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <div className="auth-wrapper">
      <h3>Register</h3>

      <form>
        <label>Email</label>
        <input name="email" type="email" />

        <label>Name</label>
        <input name="name" />

        <label>Password</label>
        <input name="password" type="password" />

        <label>Password Confirm</label>
        <input name="passwordConfirm" type="password" />

        <input type="submit" />

        <Link style={{ color: "gray", textDecoration: "none" }} to="/login">
          이미 아이디가 있다면...
        </Link>
      </form>
    </div>
  );
}

export default RegisterPage;
