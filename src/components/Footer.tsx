import ContactDialog from './ContactDialog';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    return(
        <div className='flex justify-center items-center gap-128 mb-[12px]'>
            <div className='flex flex-row items-center gap-4'>
                <ContactDialog title="Contato"/>
                <p>|</p>
                <Link href="/terms"><h1 className='hover:scale-110 cursor-pointer text-[20px]'>Políticas</h1></Link>
            </div>
            <div className='flex flex-row items-center gap-3 justify-center'>
                <Image src={'./lf-logo.svg'} alt="LeafSound" width={64} height={64} className="ml-2 mt-2" style={{ width: "auto", height: "auto" }}/>  
                <h1 className="16-px align-middle text-[24px]">LeafSound</h1>
            </div>
        </div>
    )
}