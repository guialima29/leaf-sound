import Image from "next/image"

export default function CardBeneficio({alt, title, description, imagem}:{
    alt: string,
    title: string,
    description: string,
    imagem: string
}) {
    return(
        <div className="grid grid-cols-2 items-center">
            <div className="bg-red-600 p-10"></div>
            <div className="bg-blue-600 p-10"></div>
            <div className="bg-green-600 p-10 col-span-full"></div>
            {/* <Image className="" src={imagem} alt={alt} width={75} height={75}/> */}
            {/* <h1 className=" text-start font-bold text-[28px]">{title}</h1> */}
            {/* <p className="text-[18px] text-justify col-span-2 row-start-2">{description}</p> */}
        </div>
    )
}