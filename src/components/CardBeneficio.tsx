import Image from "next/image"

export default function CardBeneficio({alt, title, description, imagem}:{
    alt: string,
    title: string,
    description: string,
    imagem: string
}) {
    return(
        <div className="flex flex-row gap-2 ">
            <div>
            <Image src={imagem} alt={alt} width={75} height={75}/>
            </div>
            <div className="flex flex-col ">
                <h1 className="text-[27px] font-bold mb-10">{title}</h1>
                <p className="text-[20px]">{description}</p>
            </div>
        </div>
    )
}