import { Mail, Facebook, Instagram } from "lucide-react";
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
    },
    {
      icon: Facebook,
      label: "Facebook",
      href: "https://facebook.com/belajaralkitab",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://instagram.com/belajaralkitab",
    },
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
    },
  ];

  return (
    <footer className="w-full border-t bg-white mt-auto">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo and About */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-2">Belajar Alkitab</h3>
            <p className="text-sm text-gray-600 max-w-sm">
              Platform untuk Bertumbuh dalam Iman melalui Pembelajaran Alkitab
              yang Mudah dan Interaktif.
            </p>
          </div>

          {/* Quick Links */}
          {session && (
            <div className="flex gap-6">
              {quickLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="text-sm text-gray-600 hover:text-black"
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          )}
          {!session && (
            <Button
              variant="ghost"
              className="text-sm text-gray-600 hover:text-black"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((link, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-gray-600 hover:text-black"
                onClick={() => window.open(link.href, "_blank")}
              >
                <link.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>

        {/* Copyright - Minimal Version */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Belajar Alkitab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

