"use client"
import * as React from "react"
import Image from "next/image";
import Link from "next/link";
import { componentesNavBar } from "@/constants/constNavBar";
import { cn } from "@/lib/utils";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "./ui/navigation-menu";

import type { LinkProps } from "next/link";
// ...existing code...

type ListItemProps = {
    className: string;
    title: string;
    children: React.ReactNode;
} & LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
    ({ className, title, children, href, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <Link
                        href={href}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </Link>
                </NavigationMenuLink>
            </li>
        )
    }
);
ListItem.displayName = "ListItem";

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
                                    <Link
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
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            {componentesNavBar.map((component) => (
                                <ListItem
                                className=""
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