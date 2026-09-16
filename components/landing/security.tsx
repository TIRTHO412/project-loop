import { Shield, Lock, Users, Server, Check } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "Secure Authentication",
    description: "Industry-standard authentication with role-based permissions, session encryption, and single sign-on support.",
  },
  {
    icon: Users,
    title: "Role-Based Access Control (RBAC)",
    description: "Granular permission scopes for Admins, Analysts, and Viewers to ensure internal data privacy.",
  },
  {
    icon: Server,
    title: "Multi-Tenant Architecture",
    description: "Isolated database schemas and workspace boundaries guaranteeing organizational data segregation.",
  },
  {
    icon: Shield,
    title: "Protected Customer Data",
    description: "End-to-end encryption in transit (TLS 1.3) and at rest (AES-256) for all user feedback records.",
  },
];

export function LandingSecurity() {
  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
              Enterprise Security
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Built With Enterprise Security & Multi-Tenancy At Its Core
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              LOOP is engineered to protect sensitive customer conversations and internal product feedback with robust architecture and compliance standards.
            </p>
            
            <ul className="space-y-3 font-medium text-sm text-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Isolated multi-tenant tenant keying
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Strict role-based workspace permissions
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Zero third-party LLM data retention policies
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {securityFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3 text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
