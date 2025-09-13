import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import Link from "next/link";

const posts = [
  {
    id: 1,
    author: 'Aurora',
    date: '19/09/2025',
    title: 'Titulo de Prueba',
    text: ' Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, '
  },
  {
    id: 2,
    author: 'Rodolfo',
    date: '19/09/2025',
    title: 'Titulo de Prueba',
    text: ' Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, '
  },
  {
    id: 3,
    author: 'Josa',
    date: '19/09/2025',
    title: 'Titulo de Prueba',
    text: ' Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, '
  },
]


export const PostCard = () => {
  return (
    <div>
      {
        posts.map((post) => (
          <Card key={post.id} className="flex bg-white mb-2 border-white p-4">
            <CardHeader className="flex justify-between">
              <h4>{post.author}</h4>
              <h4>{post.date}</h4>
            </CardHeader>
            <Separator className="border-background border-1" />
            <CardTitle>
              {post.title}
            </CardTitle>
            <CardContent>
              {post.text}
            </CardContent>
            <Separator className=" border-gray-200 border-1" />
            <CardFooter>
              {/* <h5 className="text-gray-400">Marcar como favorito, editar, eliminar</h5> */}
              <div className="flex fle-row mr-2 text-gray-400">
                <AiOutlineHeart />
              </div>
              <div className="flex fle-row mr-2 text-gray-400">
                {/* Agregar link de post especifico */}
                {/* Hacer esto dinamico solo el susuario puede borrar su propio post, si es admin puede hacerlo */}
                <Link href='/' passHref>
                  <AiOutlineDelete />
                </Link>
              </div>
              <div className="flex fle-row mr-2 text-gray-400">
                {/* Agregar link de post especifico */}
                {/* Hacer esto dinamico solo post de usuarios pueden editar, si es usuario admin no tiene esta opcion */}
                <Link href='/' passHref>
                  <FiEdit2 />
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))
      }

    </div>
  )
}
