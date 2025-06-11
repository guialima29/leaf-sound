import Image from "next/image"

export default function CardBeneficio({alt, title, description, imagem}:{
    alt: string,
    title: string,
    description: string,
    imagem: string
}) {
    return(
        <div className="grid grid-cols-[100px_1fr] items-center ">
            <div className="flex justify-center items-center w-[75px]">
                <Image 
                    className="w-[75px] h-[75px]" 
                    src={imagem} 
                    alt={alt} 
                    width={100} 
                    height={100}
                />
            </div>
            <div className="">
                <h1 className="text-start font-bold text-[26px] m-0 p-0">{title}</h1>
            </div>
            <p className="text-base text-justify col-span-2 mt-4">{description}</p>
        </div>
    )
}