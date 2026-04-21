import AuthGate from "@/components/AuthGate";
import ProfileShell from "@/components/ProfileShell";

export default function ProfilePage() {
  return (
    <AuthGate>
      <ProfileShell />
    </AuthGate>
  );
}
