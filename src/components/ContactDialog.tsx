import { Button } from "@/components/ui/button"
import { infoContato } from "@/constants/constInfoContato"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DialogDemo({title}:{title:string}) {
  return (  
    <Dialog>
        <DialogTrigger asChild>
          <h1 className="hover:scale-110 cursor-pointer text-[20px]">{title}</h1>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="mb-5">Contato</DialogTitle>
            {infoContato.map((info) => (
              <DialogDescription key={info.type}>
                {info.type}: {info.description}
              </DialogDescription>
            ))}
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
            </div>
            <div className="grid gap-3">
            </div>
          </div>
        </DialogContent>
    </Dialog>
  )
}
