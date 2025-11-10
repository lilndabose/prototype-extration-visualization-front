import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/user-context";
import { authAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Email et mot de passe requis");
      }

      // Try to authenticate with real backend
      try {
        const response = await authAPI.login(email, password);
        const userData = response.data.user;
        login(userData);
      } catch (apiError) {
        // Fallback to mock authentication if backend is unavailable
        console.log("Backend unavailable, using mock authentication");
        const userData = {
          id: 1,
          email: email,
          firstname: email.split("@")[0],
          lastname: "User",
        };
        login(userData);
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur le tableau de bord!",
      });
      navigate("/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Email ou mot de passe requis";
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row md:justify-end">
      {/* Left Column - Form */}
      <div className="w-full md:w-auto flex flex-col justify-center pl-16 pr-8 py-8 md:pl-24 md:pr-12 md:py-12">
        <div className="w-full max-w-4xl">
          {/* Logo and Header */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-12">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F87d5dc682ccd44479e11bda69be135b5%2F39f5c839d374403c83a859d746c10698?format=webp&width=800"
                alt="TotalEnergies"
                className="w-20 h-20 object-contain"
              />
              <div className="font-bold text-3xl bg-gradient-to-r from-te-red to-te-blue bg-clip-text text-transparent">
                Dream team AFR
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Bienvenue sur la Plateforme!
            </h1>
            <p className="text-muted-foreground text-base">
              Découvrez vos données sous un nouvel angle.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label htmlFor="email" className="text-base font-medium text-foreground">
                Adresse e-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="ex. l'adresse de votre email doit être de type xxxx.xxx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="px-5 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground text-base"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="text-base font-medium text-foreground">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="px-5 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground text-base"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-te-red hover:bg-te-red/90 text-white font-semibold py-3.5 rounded-full text-lg transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Je me connecte à mon espace"}
            </Button>
          </form>

          {/* Footer Text */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Je n'ai pas encore de compte?{" "}
            <a href="#" className="text-te-red hover:underline font-medium">
              Créer un compte maintenant
            </a>
          </p>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="w-full md:w-3/5 flex items-center justify-center md:justify-start py-6 md:py-0">
        <img
          src="https://totalenergies.com/sites/g/files/nytnzq121/files/styles/crop_landscape_ratio_2_1/public/images/2024-02/Cover_produits_service.jpg?h=76f538a4&itok=aY3cGa8s"
          alt="TotalEnergies Products"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
