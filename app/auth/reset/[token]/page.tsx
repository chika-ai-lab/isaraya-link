import { Suspense } from "react";
import NewPasswordForm from "@/views/NewPasswordView";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <NewPasswordForm />
    </Suspense>
  );
}
