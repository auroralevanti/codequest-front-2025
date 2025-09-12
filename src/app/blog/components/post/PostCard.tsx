import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";


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
    author: 'Rob',
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
              <h5 className="text-gray-400">Marcar como favorito, editar, eliminar</h5>
            </CardFooter>
          </Card>
        ))
      }

    </div>
  )
}
