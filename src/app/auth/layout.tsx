import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-sm:flex-col flex flex-row">
      {/* Imagem de fundo - Somente no desktop */}
      <div className="relative flex w-2/3 max-sm:hidden">
        <Image
          src="/images/imagem3.jpg"
          alt="Background image"
          layout="fill"
          objectFit="cover"
          className="absolute"
        />
      </div>

      {/* Formulário responsivo e centralizado */}
      <div className="flex min-h-screen w-full items-center justify-center bg-background md:w-1/3">
        <div className="max-w-md: w-full px-12">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/logo.png"
              alt="Codifica logo"
              width={280}
              height={90}
              className="rounded-3xl"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
