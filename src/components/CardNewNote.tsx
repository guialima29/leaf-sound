import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import TextareaAutosize from "react-textarea-autosize"

interface CardNewNoteProp {
    onClick: () => void;
}

export function CardNewNote({ onClick }: CardNewNoteProp) {
    return (
        <Card className="w-full max-w-sm ">
            <CardHeader className="flex flex-row items-start justify-between">
                <CardTitle className="text-lg font-semibold">Criar Anotação</CardTitle>
                <CardAction className="-mt-1">
                    <Button
                        onClick={onClick}
                        variant="link"
                        className="p-0 text-sm text-black hover:text-gray-800"
                    >
                        Exit
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Nome</Label>
                            <Input
                                id="nome-nota"
                                type="text"
                                required
                                maxLength={30}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Descrição</Label>
                            </div>
                            <InputGroup>
                                <TextareaAutosize
                                    data-slot="input-description-control"
                                    className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
                                    placeholder="Breve descrição..."
                                    maxLength={100}
                                />
                            </InputGroup>
                            {/* <Input id="descricao" type="text" maxLength={100} className="h-20" /> */}
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full">
                    Criar
                </Button>
            </CardFooter>
        </Card>
    )
}
