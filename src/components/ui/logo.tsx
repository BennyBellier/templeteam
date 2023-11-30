import Image from "next/image";

export function LogoLight({...props}) {
  return <Image src="/img/logo-light.png" alt="⛩️" {...props} />;
}

export function LogoDark({...props}) {
  return <Image src="/img/logo-dark.png" alt="⛩️" {...props} />;
}

export function ThemedLogo({
  sizes,
  className,
}: {
  sizes?: string;
  className?: string;
}) {
  return (
    <>
      <LogoDark width={70} height={70} sizes={sizes} className={"hidden dark:block " + className} />
      <LogoLight width={70} height={70} sizes={sizes} className={"dark:hidden " + className} />
    </>
  );
}