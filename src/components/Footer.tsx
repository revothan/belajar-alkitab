import { Github, Mail, Facebook, Instagram } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function Footer() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Mail,
      label: "Email",
      href: "mailto:contact@example.com",
      variant: "ghost" as const // Fixed type by adding 'as const'
    },
    {
      icon: Facebook,
      label: "Facebook",
      href: "https://facebook.com/belajaralkitab",
      variant: "ghost" as const
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://instagram.com/belajaralkitab",
      variant: "ghost" as const
    }
  ];

  const quickLinks = [
    {
      label: "Learning Modules",
      path: "/modules",
    },
    {
      label: "My Notes",
      path: "/my-notes",
    },
    {
      label: "Profile",
      path: "/profile",
    }
  ];

  return (
    <footer className="w-full border-t bg-background mt-auto">
      <div className="container py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-semibold mb-4">About Us</h3>
            <p className="text-sm text-muted-foreground">
              Belajar Alkitab adalah Platform untuk Bertumbuh dalam Iman melalui Pembelajaran Alkitab yang Mudah dan Interaktif.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {session && quickLinks.map((link, index) => (
                <li key={index}>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
                    onClick={() => navigate(link.path)}
                  >
                    {link.label}
                  </Button>
                </li>
              ))}
              {!session && (
                <li>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                </li>
              )}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-2 flex-wrap">
              {socialLinks.map((link, index) => (
                <Button
                  key={index}
                  variant={link.variant}
                  size="sm"
                  className="gap-1.5 h-8"
                  onClick={() => window.open(link.href, '_blank')}
                >
                  <link.icon className="h-3 w-3" />
                  <span className="text-xs">{link.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Belajar Alkitab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}