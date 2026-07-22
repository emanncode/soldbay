import { Image } from "react-native";

interface LogoWordmarkProps {
  height?: number;
}

const LOGO_ASPECT = 707 / 353;

export function LogoWordmark({ height = 34 }: LogoWordmarkProps) {
  return (
    <Image
      source={require("../../assets/logo.png")}
      style={{ width: height * LOGO_ASPECT, height }}
      resizeMode="contain"
    />
  );
}
