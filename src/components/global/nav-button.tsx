import Link from 'next/link';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

type Props = {
   href: string;
   label: string;
   isActive?: boolean
}

const NavButton = ({href, label, isActive}: Props) => {
  return (
    <Link href={href}>
      <Button className={cn("w-full lg:w-auto justify-between font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition rounded-md shadow-none", isActive ? "bg-white/10 text-white" : "bg-transparent")}>
        {label}
      </Button>
    </Link>
  )
}

export default NavButton