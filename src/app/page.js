import { LoginForm } from "app/components/login-form"

export default function Page() {
  return (
    <div className="max-w-4xl  mt-20  mx-auto bg-white text-black rounded-lg shadow-md">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
