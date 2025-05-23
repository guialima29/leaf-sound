import Image from "next/image"

export default function CardBeneficio({alt, title, description, imagem}:{
    alt: string,
    title: string,
    description: string,
    imagem: string
}) {
    return(
        <div className="flex flex-row items-center gap-4">
                <Image src={imagem} alt={alt} width={75} height={75}/>
                <div className="flex flex-col ">
                    <h1 className="text-[28px] font-bold w-70 ">{title}</h1>
                    <p className="text-[18px]">{description}</p>
                </div>    
                {/* <p className="text-[18px]">{description}</p> */}
        </div>
    )
}