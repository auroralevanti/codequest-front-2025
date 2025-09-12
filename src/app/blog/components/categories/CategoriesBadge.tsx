import { Badge } from "@/components/ui/badge"

const categories = [
  { name: 'React', href: '' },
  { name: 'React Native', href: '' },
  { name: 'NEXTJS', href: '' },
  { name: 'VUE', href: '' },
  { name: 'Angular', href: '' },
  { name: 'Astro', href: '' },
  { name: 'Node', href: '' },
  { name: 'NestJs', href: '' },
  { name: 'Flutter', href: '' },

];


export const CategoriesBadge = () => {
  return (

    <div className="flex flex-row text-white mb-4 items-center justify-center gap-2 overflow-x-auto">
      <div className="flex-1 flex flex-row pt-5 pb-4 justify-center">
        <div className="flex flex-row flex-wrap gap-2 pb-2">
          {categories.map((category) => (
            <Badge key={category.name} variant="outline" className="text-md">
              {category.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>


  )
}
