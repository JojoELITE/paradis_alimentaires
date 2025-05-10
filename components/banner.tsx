import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface BannerProps {
  title: string
  description: string
  buttonText: string
  buttonLink: string
  image: string
  bgColor?: string
  textColor?: string
  position?: "left" | "right"
}

export default function Banner({
  title,
  description,
  buttonText,
  buttonLink,
  image,
  bgColor = "bg-primary",
  textColor = "text-white",
  position = "left",
}: BannerProps) {
  return (
    <div className={`${bgColor} rounded-lg shadow-md overflow-hidden`}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {position === "left" ? (
          <>
            <div className={`p-8 md:p-12 flex flex-col justify-center ${textColor}`}>
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              <p className={`${textColor}/90 mb-6`}>{description}</p>
              <div>
                <Link href={buttonLink}>
                  <Button className="bg-white text-primary hover:bg-white/90">{buttonText}</Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] md:h-auto">
              <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
            </div>
          </>
        ) : (
          <>
            <div className="relative h-[300px] md:h-auto">
              <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
            </div>
            <div className={`p-8 md:p-12 flex flex-col justify-center ${textColor}`}>
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              <p className={`${textColor}/90 mb-6`}>{description}</p>
              <div>
                <Link href={buttonLink}>
                  <Button className="bg-white text-primary hover:bg-white/90">{buttonText}</Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
