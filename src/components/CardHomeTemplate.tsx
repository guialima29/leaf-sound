import React from "react"
import Image from "next/image"
import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { componenteCardHome } from "@/constants/constCardHome"

export default function CardHomeTemplate() {
  return (
    <>
      {componenteCardHome.map((componente) =>{
        const descriptionParts = componente.description.split('|');
        return (
        <Card className="w-[350px] h-[400px]" key={componente.title}>
          <CardHeader className="inline-flex items-center">
            <Image className="w-10 h-10" src={componente.logo} alt={componente.alt} width={50} height={50}/>
            <CardTitle>{componente.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Image src={componente.imagem} alt="Cifra" width={396} height={136}/>
          </CardContent>
          <CardFooter>
            <p className="italic text-[15px]">
              {descriptionParts.map((part,index) => (
                <React.Fragment key={index}>
                    {part.trim()}
                    {index < descriptionParts.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          </CardFooter>
        </Card>
        )
      })}
    </>
  )
}