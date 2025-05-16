"use client"
import * as React from "react"
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "./ui/navigation-menu";

const components: {title: string; description: string; href: string}[] = [
    {
        title: "Home",
        href: "/",
        description: "Página inicial."
    },
    {
        title: "Sobre Nós",
        href: "/about-us",
        description: "Descubra o que é, como funciona, de onde e como surgiu o LeafSound."
    },
    {
        title: "Feedback",
        href: "/feedback",
        description: "Nós gostariamos muito de saber em que podemos melhorar!"
    },
]

export default function NavButton({title}:{title: string}) {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="16-px align-middle text-[24px]">{title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <Image src={'/bgsound.png'} alt="LeafSound" width={619} height={401}/>
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            LeafSound
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            O serviço que explora a criatividade dos amantes de música.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            {components.map((component) => (
                                <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>

                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"