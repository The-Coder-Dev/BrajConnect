export function SectionHeader({ 
  title, 
  subtitle, 
  align = "left" 
}: { 
  title: string; 
  subtitle?: string; 
  align?: "left" | "center" | "right";
}) {
  return (
    <div className={`flex flex-col mb-12 ${align === "center" ? "items-center text-center" : align === "right" ? "items-end text-right" : "items-start text-left"}`}>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">{title}</h2>
      {subtitle && (
        <p className="text-lg text-slate-600 max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
