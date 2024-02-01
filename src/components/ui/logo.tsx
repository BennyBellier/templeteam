import Image from "next/image";
import LogoLightPng from "@/../public/img/logo-light.png";
import LogoDarkPng from "@/../public/img/logo-dark.png";

export function LogoLight({...props}) {
  return <Image src={LogoLightPng} alt="⛩️" {...props} />;
}

export function LogoDark({...props}) {
  return <Image src={LogoDarkPng} alt="⛩️" {...props} />;
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