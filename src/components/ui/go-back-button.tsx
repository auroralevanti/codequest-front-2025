'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

interface GoBackButtonProps {
  className?: string;
}

export function GoBackButton({ className }: GoBackButtonProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleGoBack}
      className={`bg-white text-black border-white hover:bg-gray-100 ${className}`}
      aria-label="Volver atrás"
    >
      <IoArrowBack className="h-5 w-5" />
    </Button>
  );
}