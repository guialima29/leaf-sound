import CardBeneficio from "./CardBeneficio";
import { componentesBeneficios } from "@/constants/constBeneficios";

export default function HomeBeneficios() {  
    return(
        <div className="flex justify-center flex-col gap-20 mt-10 items-center justify-items-center">
            <h1 className="font-bold text-4xl text-[#2B3328] font-libre-caslon">Benefícios do LeafSound</h1>
        <div className="grid grid-cols-2 gap-15 justify-center max-w-5xl">
            {componentesBeneficios.map((componente) => (
                <CardBeneficio
                key={componente.alt}
                alt={componente.alt}
                title={componente.title}
                description={componente.description}
                imagem={componente.photo}/>
            ))}
        </div>
        </div>
    )
}