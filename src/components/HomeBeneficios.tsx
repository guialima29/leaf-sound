import CardBeneficio from "./CardBeneficio";

export default function HomeBeneficios() {

    const componentes:{key:string;title:string;description:string;photo:string}[] = [
        {
            key: "Organização",
            title: "Notas organizadas por projeto" ,
            description: "Organize suas ideias com facilidade",
            photo: '/home/organize-icon.png'
        },
        {
            key: "Cifras",
            title: "Crie suas próprias cifras" ,
            description: "Explore a sua criatividade com interatividade e inovação",
            photo: '/home/cifra-icon.png'
        },
        {
            key: "Importação",
            title: "Importe diversos arquivos" ,
            description: "Adicione um tempero a mais à suas anotações",
            photo: '/home/import-icon.png'
        },
        {
            key: "Nuvem",
            title: "Anotações salvas na nuvem" ,
            description: "Deixe que a gente guarde as suas ideias",
            photo: '/home/cloud-icon.png'
        }
    ]

    return(
        <div className="flex justify-center flex-col gap-20 mt-10 items-center">
            <h1 className="font-bold text-4xl text-[#0E2E1F]">Benefícios do LeafSound</h1>
        <div className="grid grid-cols-2 gap-15 justify-center max-w-5xl">
            {componentes.map((componente) => (
                <CardBeneficio
                key={componente.key}
                title={componente.title}
                description={componente.description}
                imagem={componente.photo}/>
            ))}
        </div>
        </div>
    )
}