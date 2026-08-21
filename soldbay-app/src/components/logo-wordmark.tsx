import { Image } from "expo-image";

interface LogoWordmarkProps {
  height?: number;
}

const LOGO_ASPECT = 1536 / 1024;

export function LogoWordmark({ height = 78 }: LogoWordmarkProps) {
  return (
    <Image
      source={require("../../assets/logo.png")}
      style={{ width: height * LOGO_ASPECT, height }}
      resizeMode="contain"
    />
  );
}
