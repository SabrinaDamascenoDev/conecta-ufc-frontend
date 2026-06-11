
import { loginService } from "@/services/loginServise"


const handleSubmit = () => {
    loginService.logout()
    window.location.reload()
}
export function Vagas(){
    return(
        <div>
            <button onClick={handleSubmit} className="border-1 cursor-pointer">logout</button>
        </div>
    )
}