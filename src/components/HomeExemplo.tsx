import Image from "next/image"
import CardHomeTemplate from "./CardHomeTemplate"

export default function HomeExemplo() {
    return (
        // Container principal: usa flex para centralizar o conteúdo na tela
        <div className="flex items-center flex-col justify-center min-h-screen w-full">
            <h1 className="font-bold text-4xl text-[#0E2E1F] mb-15">Explore a sua criatividade musical 🧠🎵</h1>
            <div className="relative">
                <div>
                     <Image src={"/home/song-bg.png"} alt="Background" width={1025} height={571} className="block max-w-full h-auto"/>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 translate-x-[60px] z-10">
                    {/* 
                       Explicação do Posicionamento:
                       - absolute: Tira o card do fluxo normal e o posiciona em relação ao pai mais próximo com `position: relative` (o div acima).
                       - top-1/2 left-1/2: Move o canto superior esquerdo do card para o centro exato do container pai.
                       - transform: Aplica transformações.
                       - -translate-y-1/2: Move o card para cima em 50% da sua própria altura, centralizando-o verticalmente.
                       - translate-x-[60px]: Move o card para a direita a partir do centro. Ajuste `60px` (ou use %, ex: `translate-x-[10%]`) para obter o deslocamento desejado para a direita.
                       - z-10: Garante que o card fique na frente (sobre) a imagem (que tem z-index padrão 0).
                    */}
                    <CardHomeTemplate />
                </div>
            </div>
        </div>
    );
}