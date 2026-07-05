import { Logo } from "./logo";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="flex flex-col space-y-2 text-center sm:text-left mb-8">
      <div className="mb-4 flex justify-center sm:justify-start">
        <Logo />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
