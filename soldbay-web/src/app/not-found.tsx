import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4 text-center">
      <h1 className="text-[120px] font-bold leading-none tracking-tighter text-neutral-800">
        404
      </h1>
      <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-4 mb-2">
        Page not found
      </h2>
      <p className="text-neutral-500 mb-8 max-w-sm">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      
      <Button asChild size="lg" className="h-12 px-6 rounded-full font-medium">
        <Link href="/">
          <MoveLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
