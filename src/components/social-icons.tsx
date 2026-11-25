import type { SVGProps } from "react";
import type { SocialNetwork } from "@/lib/site-links";

type IconProps = SVGProps<SVGSVGElement>;

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12.04 2c-5.46 0-9.91 4.44-9.91 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38A9.9 9.9 0 0 0 12.04 21.8c5.46 0 9.9-4.44 9.9-9.9C21.94 6.44 17.5 2 12.04 2Zm5.79 14.13c-.24.68-1.4 1.25-1.93 1.33-.5.07-1.12.1-1.81-.11-.42-.13-.95-.31-1.64-.6-2.89-1.25-4.77-4.16-4.92-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36h.56c.18 0 .42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.32.02.51-.1.2-.14.32-.29.5-.14.17-.3.39-.43.52-.14.14-.29.3-.12.58.16.29.73 1.2 1.57 1.94 1.08.96 1.99 1.25 2.27 1.4.29.14.45.12.62-.07.16-.2.7-.81.89-1.09.18-.27.37-.23.62-.14.25.1 1.58.75 1.85.88.27.14.45.2.51.31.07.12.07.68-.17 1.36Z"
      />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm8.2 1.6a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 8.2A3.8 3.8 0 1 1 12 15.8 3.8 3.8 0 0 1 12 8.2Zm0 2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Z"
      />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M14.5 8.5V6.8c0-.7.5-1.1 1.2-1.1h1.3V3h-2.3C12.3 3 11 4.4 11 6.6v1.9H9v2.8h2V21h3.5v-9.7h2.3l.4-2.8h-2.7Z"
      />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M14.6 3c.4 2.6 1.8 4.3 4.4 4.6v2.6c-1.5 0-2.9-.5-4.1-1.4v6.5c0 3.4-2.6 6.1-6.2 6.1A6.1 6.1 0 0 1 8.3 9.6v2.8c.5-.2 1-.3 1.6-.3 1.5 0 2.7 1.2 2.7 2.7 0 1.5-1.2 2.7-2.7 2.7s-2.6-1.2-2.6-2.7V3h3.2c.1 1.1.4 2.1.9 3.1 1.1-.7 2.3-1.1 3.2-1.1Z"
      />
    </svg>
  );
}

export function SocialNetworkIcon({
  network,
  ...props
}: IconProps & { network: SocialNetwork }) {
  if (network === "instagram") return <InstagramIcon {...props} />;
  if (network === "facebook") return <FacebookIcon {...props} />;
  return <TikTokIcon {...props} />;
}
