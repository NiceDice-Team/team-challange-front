"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { signup } from "../../actions/auth";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined);
  // useEffect(() => {

  //   action()
  // }, []);
  console.log("state", state);
  return (
    <div className="mx-auto mt-20">
      <h1 className="text-title font-normal text-center mb-9 uppercase">
        Create account{" "}
      </h1>
      <div className="text-center text-base mb-12">
        <p>Join our community of board game enthusiasts! 🎲</p>
        <p>Fill in the details below to get started</p>
      </div>

      <div className="flex flex-col items-center justify-center mb-28">
        <form className="flex flex-col gap-4 w-[500px] mb-12" action={action}>
          <input
            defaultValue="User"
            placeholder="Name"
            id="firstname"
            name="firstname"
            className="w-full md:flex-1 p-4 bg-white text-black outline-none"
          />
          {state?.errors?.firstname && <p>{state.errors.firstname}</p>}
          <input
            defaultValue="User"
            placeholder="Last Name"
            id="lastname"
            name="lastname"
            className="w-full md:flex-1 p-4 bg-white text-black outline-none"
          />
          {state?.errors?.lastname && <p>{state.errors.lastname}</p>}
          <input
            defaultValue="user@example.com"
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            className="w-full md:flex-1 p-4 bg-white text-black outline-none"
          />
          {state?.errors?.email && <p>{state.errors.email}</p>}
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="w-full md:flex-1 p-4 bg-white text-black outline-none"
          />
          {state?.errors?.password && <p>{state.errors.password}</p>}
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="w-full md:flex-1 p-4 bg-white text-black outline-none"
          />
          {state?.errors?.confirmPassword && (
            <p>{state.errors.confirmPassword}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-purple text-white p-4 px-8 text-base uppercase hover:bg-gray-100 transition-all duration-150"
          >
            REGISTER
          </button>
        </form>

        <p className="text-purple">Already have an account?</p>
        <Link href="/login" className="underline text-purple">
          Log in here<span className="inline-block ml-1">→</span>
        </Link>
      </div>
    </div>
  );
}
