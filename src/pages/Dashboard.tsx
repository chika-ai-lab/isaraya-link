import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useProfiles } from "@/hooks/useProfiles";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, LogOut, Settings } from "lucide-react";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { CreateProfileDialog } from "@/components/dashboard/CreateProfileDialog";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { currentProfile } = useProfile();
  const { data: profiles = [], isLoading } = useProfiles();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Isaraya Link</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            {currentProfile && (
              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/dashboard/profile/${currentProfile.id}`)
                }
                className="text-sm"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">
                  Gérer {currentProfile.company_name}
                </span>
                <span className="sm:hidden">Gérer</span>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="text-sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">
                Mes Profils d'Entreprise
              </h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                {profiles.length === 0
                  ? "Créez votre premier profil d'entreprise pour commencer"
                  : `Vous gérez ${profiles.length} profil${
                      profiles.length > 1 ? "s" : ""
                    }. Cliquez sur "Gérer" pour modifier un profil.`}
              </p>
            </div>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              {profiles.length === 0
                ? "Créer mon premier profil"
                : "Nouveau profil"}
            </Button>
          </div>

          {/* Profiles Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : profiles.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Aucun profil pour le moment</CardTitle>
                <CardDescription>
                  Créez votre premier profil d'entreprise pour commencer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Créer mon premier profil
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Profile Dialog */}
      <CreateProfileDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
