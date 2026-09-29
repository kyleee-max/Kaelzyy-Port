"use client";

import { Mail, Github } from "lucide-react";
import { contacts } from "@/lib/data";
import DotFrame from "./DotFrame";

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.63 1.44 5.15L2 22l5.09-1.53a9.87 9.87 0 0 0 4.95 1.33c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.06c-1.6 0-3.14-.43-4.47-1.24l-.32-.19-3.02.91.9-2.95-.21-.33a8.06 8.06 0 0 1-1.27-4.35c0-4.47 3.64-8.11 8.11-8.11 4.47 0 8.11 3.64 8.11 8.11.01 4.47-3.63 8.15-7.83 8.15Zm4.46-6.08c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.6 5.82c-.9-.86-1.45-2.07-1.45-3.42h-3.07v13.35a2.68 2.68 0 1 1-2.68-2.68c.23 0 .46.03.68.09V9.98a5.73 5.73 0 0 0-.68-.04A5.75 5.75 0 1 0 15.13 15.7V9.31a7.4 7.4 0 0 0 4.24 1.34V7.6a4.83 4.83 0 0 1-2.77-1.78Z" />
    </svg>
  );
}

const ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  whatsapp: WhatsAppIcon,
  email: Mail,
  tiktok: TikTokIcon,
  github: Github,
};

export default function Contact() {
  return (
    <section id="contact" className="px-6 md:px-16 py-24">
      <div className="mx-auto max-w-5xl flex flex-col items-center text-center">
        <h2 className="font-display text-2xl md:text-3xl mb-10">Contact</h2>
        <DotFrame icon="send" label="contact" padding="px-10 py-8" className="w-full max-w-md">
        <div className="flex items-center justify-center gap-8">
          {contacts.map((c) => {
            const Icon = ICONS[c.id];
            return (
              <a
                key={c.id}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                aria-label={c.label}
                className="text-ink/60 hover:text-accent transition-colors duration-200"
              >
                <Icon width={22} height={22} />
              </a>
            );
          })}
        </div>
        </DotFrame>
      </div>
    </section>
  );
}
