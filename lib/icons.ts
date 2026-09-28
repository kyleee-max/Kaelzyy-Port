import { IconType } from "react-icons";
import {
  SiJavascript,
  SiTypescript,
  SiKotlin,
  SiPython,
  SiRust,
  SiPhp,
  SiNextdotjs,
  SiReact,
  SiMongodb,
  SiSupabase,
  SiSqlite,
  SiMariadb,
  SiGit,
  SiDocker,
  SiVercel,
  SiGreensock,
  SiFramer,
  SiNodedotjs,
  SiNpm,
} from "react-icons/si";

// Maps a tech name (as used in lib/data.ts) to its brand icon. If a name is
// ever added without a matching entry here, callers should just render the
// label without an icon rather than crash — see usage in Stack.tsx / Projects.tsx.
export const TECH_ICONS: Record<string, IconType> = {
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Kotlin: SiKotlin,
  Python: SiPython,
  Rust: SiRust,
  PHP: SiPhp,
  "Next.js": SiNextdotjs,
  React: SiReact,
  MongoDB: SiMongodb,
  Supabase: SiSupabase,
  SQLite: SiSqlite,
  MariaDB: SiMariadb,
  Git: SiGit,
  Docker: SiDocker,
  Vercel: SiVercel,
  GSAP: SiGreensock,
  "Framer Motion": SiFramer,
  "Node.js": SiNodedotjs,
  npm: SiNpm,
};
