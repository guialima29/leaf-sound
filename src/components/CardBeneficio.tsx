import Image from "next/image"

export default function CardBeneficio({key, title, description, imagem}:{
    key: string,
    title: string,
    description: string,
    imagem: string
}) {
    return(
        <div className="flex flex-row gap-2 align-middle ">
            <Image src={imagem} alt={key} width={75} height={75}/>
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p>{description}</p>
            </div>
        </div>
    )
}