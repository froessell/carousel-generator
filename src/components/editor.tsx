"use client";

import { SidebarPanel } from "@/components/settings-panel";
import { SlidesEditor } from "@/components/slides-editor";
import { RefProvider } from "@/lib/providers/reference-context";

interface EditorProps {
  componentRef: React.RefObject<HTMLDivElement>;
}

export default function Editor({ componentRef }: EditorProps) {
  return (
    <RefProvider myRef={componentRef}>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-start md:grid md:grid-cols-[320px_minmax(0,1fr)]">
          <SidebarPanel />
          <SlidesEditor />
        </div>
      </div>
    </RefProvider>
  );
}
