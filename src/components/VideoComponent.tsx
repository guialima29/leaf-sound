'use client';

import dynamic from 'next/dynamic';

const DynamicVideoPlayer = dynamic(() => Promise.resolve(VideoPlayer), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-4xl aspect-video bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        <span>Carregando vídeo...</span>
      </div>
    </div>
  )
});

function VideoPlayer() {
  const src = "https://www.youtube-nocookie.com/embed/T3sax7PB0vw?si=eGeFo0EE2J3aIPrQ";
  
  return ( 
    <div className="flex justify-center items-center w-full">
      <div className="relative w-full max-w-4xl aspect-video">
        <iframe 
          className="absolute inset-0 w-full h-full rounded-lg"
          src={src} 
          title="Apresentation Video" 
          allowFullScreen 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="no-referrer-when-downgrade"
          loading='lazy'
        />
      </div>
    </div>
  );
}

export default function VideoComponent() {
  return <DynamicVideoPlayer />;
}




/* old method

'use client';
export default function VideoComponent() {
  const src = "https://www.youtube.com/embed/T3sax7PB0vw?si=eGeFo0EE2J3aIPrQ";
 
  return ( 
    <div className="flex align-middle items-center justify-center">
      <iframe width={1280} height={720} src={src} title="Apresentation Video" allowFullScreen suppressHydrationWarning />
    </div>
  )
}*/