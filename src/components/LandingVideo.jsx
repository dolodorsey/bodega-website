'use client';

import { useEffect, useRef } from 'react';

const VIDEO_URL = 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/bodega/BODEGA_VID.mp4';

export default function LandingVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const play = () => {
      if (video.paused) video.play().catch(() => {});
    };

    play();
    video.addEventListener('canplay', play);
    document.addEventListener('visibilitychange', play);

    return () => {
      video.removeEventListener('canplay', play);
      document.removeEventListener('visibilitychange', play);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="hero__bg"
      src={VIDEO_URL}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}
