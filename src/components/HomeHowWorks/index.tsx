import { UserPlus, PenTool, Share2 } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Crie sua conta",
    description:
      "Entre com Google ou e-mail em segundos. Sem fricção, sem espera. Seu workspace já estará pronto para usar.",
  },
  {
    number: "02",
    icon: PenTool,
    title: "Comece a criar",
    description:
      "Adicione páginas de composição, insira acordes, partituras e letras. Use blocos como no Notion para organizar tudo.",
  },
  {
    number: "03",
    icon: Share2,
    title: "Compartilhe e colabore",
    description:
      "Convide parceiros musicais, exporte em PDF, ou simplesmente pratique com o metrônomo. Tudo salvo na nuvem.",
  },
]

export function HomeHowWorks() {
  return (
    <section id="how-it-works" className="bg-[#fafafa] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Como Funciona
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Do registro ao primeiro acorde em minutos
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map(({ number, icon: Icon, title, description }) => (
            <div key={title} className="relative text-center">

              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#5DAA3B]/10">
                <Icon className="h-8 w-8 text-[#5DAA3B]" />
              </div>
              <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
                Passo {number}
              </span>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {title}
              </h3>
              <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
