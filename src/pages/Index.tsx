import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
        <Shield className="w-6 h-6 text-primary-foreground" />
      </div>
      <h1 className="font-display text-2xl font-bold mb-2">VaultLink</h1>
      <p className="text-muted-foreground mb-6">Redirecionando...</p>
      <Link to="/">
        <Button className="gradient-bg text-primary-foreground border-0">Ir para Landing Page</Button>
      </Link>
    </div>
  );
};

export default Index;
