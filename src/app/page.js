import { LoginForm } from "app/components/login-form"

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black-100">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
