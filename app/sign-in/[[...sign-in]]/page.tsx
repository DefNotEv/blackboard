import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="bb-grain flex min-h-full flex-1 items-center justify-center bg-bb-bg p-6">
      <SignIn />
    </div>
  );
}
