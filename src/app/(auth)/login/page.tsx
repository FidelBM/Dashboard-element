import { LoginForm } from "@/components/login-form";
import { Card, CardContent } from "@/components/ui/card";

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const callbackUrl = resolvedSearchParams?.callbackUrl ?? "/dashboard";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,108,223,0.35),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(22,183,217,0.25),transparent_22%),linear-gradient(180deg,#08111f_0%,#0d1f42_100%)]" />
      <div className="relative grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_420px] lg:items-center">
        <div className="hidden lg:block">
          <div className="max-w-2xl text-white">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">
              Element Loyalty+
            </p>
            <h1 className="mt-6 font-display text-6xl font-bold leading-none">
              Element Elite Fleet
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Plataforma SaaS premium para transformar la relación con clientes
              de flotillas desde un modelo transaccional hacia una alianza
              estratégica.
            </p>
          </div>
          <div className="mt-10 grid max-w-2xl gap-4 md:grid-cols-3">
            {[
              ["4 niveles", "Base, Socio, Élite y Estratégico"],
              ["Mundial 2026", "Campañas temáticas e incentivos premium"],
              ["B2B Fleet", "Score, compras, beneficios y trazabilidad"],
            ].map(([title, description]) => (
              <Card
                key={title}
                className="border-white/10 bg-white/10 shadow-none"
              >
                <CardContent className="p-5">
                  <p className="font-display text-2xl font-bold text-black">
                    {title}
                  </p>
                  <p className="mt-2 text-sm text-slate-800">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </main>
  );
}
