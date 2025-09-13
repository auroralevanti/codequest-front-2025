import { Card, CardHeader } from "@/components/ui/card"
import { useState } from "react"


export const NewPost = () => {

  const [open, setOpen] = useState(true);

  /* Enviar id usuario, titulo, mensaje */

  return (
    <div>
      <Card className="bg-white">
        <CardHeader>
          <h3>Nuevo Post</h3>
        </CardHeader>

        <form>
          Titulo, mensaje
        </form>

      </Card>
    </div>
  )
}
