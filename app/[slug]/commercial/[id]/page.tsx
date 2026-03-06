"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Phone, Mail, MapPin, Globe, Building2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import NotFound from "@/views/NotFound";

export default function CommercialPublicPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["commercial-public", id],
    queryFn: async () => {
      const res = await fetch(`/api/commercials/${id}`);
      if (!res.ok) throw new Error("Introuvable");
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) return <NotFound />;

  const commercial = data;
  const profile = data.profile;
  const fullName = `${commercial.first_name} ${commercial.last_name}`;
  const initials = `${commercial.first_name?.[0] ?? ""}${commercial.last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95 font-['Inter',sans-serif]">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />

      <main className="max-w-lg mx-auto px-4 py-10 space-y-6">
        {/* Company card */}
        {profile && (
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                {profile.logo_url ? (
                  <img
                    src={profile.logo_url}
                    alt={profile.company_name}
                    className="h-16 w-16 rounded-xl object-contain border"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">{profile.company_name}</h2>
                  {profile.slogan && (
                    <p className="text-sm text-muted-foreground">{profile.slogan}</p>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid gap-2 text-sm">
                {profile.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0 text-primary" />
                    <a href={`tel:${profile.phone}`} className="hover:text-foreground transition-colors">
                      {profile.phone}
                    </a>
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                    <a href={`mailto:${profile.email}`} className="hover:text-foreground transition-colors">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.address && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span>{profile.address}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-4 w-4 shrink-0 text-primary" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors truncate"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Commercial card */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col items-center text-center gap-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={commercial.photo_url ?? undefined} alt={fullName} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{fullName}</h1>
                {commercial.position && (
                  <Badge variant="secondary" className="mt-1">
                    {commercial.position}
                  </Badge>
                )}
              </div>
              {commercial.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed">{commercial.bio}</p>
              )}
            </div>

            <Separator />

            <div className="grid gap-3">
              {commercial.phone && (
                <Button asChild variant="outline" className="w-full justify-start gap-3">
                  <a href={`tel:${commercial.phone}`}>
                    <Phone className="h-4 w-4 text-primary" />
                    {commercial.phone}
                  </a>
                </Button>
              )}
              {commercial.email && (
                <Button asChild variant="outline" className="w-full justify-start gap-3">
                  <a href={`mailto:${commercial.email}`}>
                    <Mail className="h-4 w-4 text-primary" />
                    {commercial.email}
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer link to company profile */}
        {profile && (
          <p className="text-center text-xs text-muted-foreground">
            Voir le profil complet de{" "}
            <a href={`/${profile.slug}`} className="text-primary hover:underline font-medium">
              {profile.company_name}
            </a>
          </p>
        )}
      </main>
    </div>
  );
}
