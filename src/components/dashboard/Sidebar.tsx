import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Palette,
  Phone,
  Share2,
  Package,
  Briefcase,
  Tag,
  QrCode,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export interface SidebarItem {
  value: string;
  label: string;
  icon: React.ElementType;
}

interface SidebarProps {
  items: SidebarItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function Sidebar({ items, activeTab, onTabChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 md:hidden h-12 w-12 rounded-full shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r transition-transform md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Navigation</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez votre profil
            </p>
          </div>

          {/* Menu Items */}
          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.value;

                return (
                  <Button
                    key={item.value}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-11",
                      isActive && "bg-primary text-primary-foreground shadow-md"
                    )}
                    onClick={() => {
                      onTabChange(item.value);
                      setMobileOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                Isaraya Link
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Default menu items
export const defaultSidebarItems: SidebarItem[] = [
  { value: "profile", label: "Profil", icon: User },
  { value: "appearance", label: "Apparence", icon: Palette },
  { value: "contact", label: "Contact", icon: Phone },
  { value: "social", label: "Réseaux sociaux", icon: Share2 },
  { value: "products", label: "Produits", icon: Package },
  { value: "services", label: "Services", icon: Briefcase },
  { value: "promotions", label: "Promotions", icon: Tag },
  { value: "qrcode", label: "QR Code", icon: QrCode },
];
