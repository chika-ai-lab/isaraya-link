import ProfileSettings from "@/views/ProfileSettings";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ProfileSettingsPage() {
  return (
    <ProtectedRoute>
      <ProfileSettings />
    </ProtectedRoute>
  );
}
