
interface LogoProps {
  className?: string;
}

export default function Logo({ className = 'h-5 w-5' }: LogoProps) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="8" />
      <path 
        d="M50 15L54.5 35L75 39.5L54.5 44L50 67L45.5 44L25 39.5L45.5 35Z" 
        fill="currentColor" 
      />
      <circle cx="50" cy="39.5" r="4" fill="currentColor" />
    </svg>
  );
}
