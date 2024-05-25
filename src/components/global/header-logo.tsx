import Link from "next/link";
import { FC } from "react"
import {Image} from "@nextui-org/image";

const HeaderLogo: FC = () => {
   return (
      <Link href="/">
         <div className="items-center hidden lg:flex">
            <Image src="/logo.svg" alt="" height={28} width={28} />
            <h1 className="font-semibold text-white text-2xl ml-2.5">
               Fionance
            </h1>
         </div>
      </Link>
   )
}

export default HeaderLogo
