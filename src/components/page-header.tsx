export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-blue-600">{eyebrow}</p>
        <h1 className="max-w-4xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl xl:text-5xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{description}</p>
      </div>
      {action}
    </div>
  );
}
