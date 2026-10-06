import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main>
      <section>
        <h1>Sign in</h1>
        <p>Enter your credentials to access your account.</p>

        <LoginForm />
      </section>
    </main>
  );
}
