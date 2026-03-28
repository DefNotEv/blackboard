import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="bb-grain flex min-h-full flex-1 items-center justify-center bg-bb-bg p-6">
      <SignUp fallbackRedirectUrl="/onboarding" forceRedirectUrl="/onboarding" />
    </div>
  );
}
