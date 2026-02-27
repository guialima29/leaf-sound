import {
  Music,
  FileText,
  Timer,
  Cloud,
  Users,
  Layers,
} from "lucide-react"

const features = [
  {
    icon: Music,
    title: "Acordes & Cifras",
    description:
      "Insira e visualize acordes diretamente sobre a letra. Suporte para cifras populares, tabs e diagramas de instrumentos.",
  },
  {
    icon: FileText,
    title: "Partituras",
    description:
      "Crie e edite partituras com uma interface intuitiva. Adicione notas, pausas, dinâmicas e articulações sem complicação.",
  },
  {
    icon: Timer,
    title: "Metrônomo Integrado",
    description:
      "Pratique no ritmo certo com o metrônomo embutido. Ajuste BPM, compasso e acentos direto no seu workspace.",
  },
  {
    icon: Cloud,
    title: "Salva na Nuvem",
    description:
      "Todas as suas anotações sincronizadas automaticamente. Acesse de qualquer dispositivo, a qualquer momento.",
  },
  {
    icon: Users,
    title: "Colaboração",
    description:
      "Convide outros músicos para editar e comentar em tempo real. Perfeito para bandas e compositores parceiros.",
  },
  {
    icon: Layers,
    title: "Organização Flexível",
    description:
      "Páginas, subpáginas, tags e filtros. Organize composições, rascunhos e ideias do seu jeito, como no Notion.",
  },
]

export function HomeFeatures() {
  return (
    <section id="features" className=" py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Benefícios
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Tudo que o música precisa em apenas um lugar
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-[#aaf789] hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#cef5bd] transition-colors group-hover:bg-[#aaf789]">
                <Icon className="h-6 w-6 text-[#5DAA3B]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
