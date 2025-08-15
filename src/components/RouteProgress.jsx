import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// Hafif bir üst progress bar: route değişiminde kısa süre gösterilir
export default function RouteProgress() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    setVisible(true);                // yeni sayfaya geçiliyor
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 350); // 350ms sonra gizle
    return () => clearTimeout(timeoutRef.current);
  }, [location.pathname, location.search]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className={`h-1 bg-black transition-all duration-300 ${visible ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
    </div>
  );
}