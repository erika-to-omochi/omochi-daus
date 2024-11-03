import Image from "next/image";
import Link from 'next/link';
import Button from "@/app/components/ui/button";

export default function Component() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <Image
            src="/omochi1.png"
            alt="Cute brown rabbit"
            width={300}
            height={500}
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col items-center md:items-start gap-8 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            おもちの1日
          </h1>
          <div className="flex flex-col sm:flex-row gap-8">
              <Button variant="secondary" className="px-4 py-2 text-lg shadow-sm">
                絵本を見る
              </Button>
            <Link href="/create">
              <Button variant="secondary" className="px-4 py-2 text-lg shadow-sm">
                絵本を作る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
