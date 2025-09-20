
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserCookie } from "@/lib/cookies";
import avatarnegro from "../../../../../public/isologo-n.png";

const userData = getUserCookie();
console.log('data:', userData);
const avatar = userData?.avatar;
const username = userData?.username;

export const AvatarComponent = () => {
  return (
    
      <>
      <Avatar>
        <AvatarImage
        src={ avatar || avatarnegro.src }
         alt={ username || 'DevTalles' }
          />
        <AvatarFallback>DT</AvatarFallback>
      </Avatar>
      
      </>
      
      )
}



