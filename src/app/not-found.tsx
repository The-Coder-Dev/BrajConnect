import Image from "next/image"

import { Button } from "@/components/ui/button"
import Link from "next/link"


const notFound = () => {
  return (
    <section className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-7 p-4 text-center">
            <h1 className="text-white mt-90 text-2xl md:text-3xl lg:text-3xl uppercase font-bold drop-shadow-lg">Looks like this page flew above the clouds.</h1>
            <Button render={<Link href="/"/>}>
                Back to Home
            </Button>
        </div>
        <Image src="/error.png" fill className="object-cover object-center -z-10" alt="notfound" priority />
    </section>
  )
}

export default notFound