export default function VideoComponent() {
  const src = "https://www.youtube.com/embed/T3sax7PB0vw?si=eGeFo0EE2J3aIPrQ";
 
  return ( 
    <div className="flex align-middle items-center justify-center">
      <iframe width={1280} height={720} src={src} title="Apresentation Video" allowFullScreen suppressHydrationWarning />
    </div>
  )
}