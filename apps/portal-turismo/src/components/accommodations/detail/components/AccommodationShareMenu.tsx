import React, { useState, useRef, useEffect } from 'react';
import { Share2, MessageCircle, Copy, Check } from 'lucide-react';
import type { AccommodationDetailData } from '../types';

interface AccommodationShareMenuProps {
  data: AccommodationDetailData;
}

export const AccommodationShareMenu: React.FC<AccommodationShareMenuProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = data.title;
  const shareText = `¡Mirá este alojamiento en Capilla del Monte! ${data.title} - ${shareUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: `¡Mirá este alojamiento en Capilla del Monte! ${data.title}`,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or share failed, open fallback dropdown
      }
    }
    setIsOpen((prev) => !prev);
  };

  const handleCopyLink = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={handleNativeShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 active:bg-stone-100 text-xs font-bold text-stone-800 transition-colors cursor-pointer shadow-xs select-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Compartir ficha de alojamiento"
      >
        <Share2 className="w-3.5 h-3.5 text-stone-600" />
        <span>Compartir</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 border-b border-stone-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Compartir Alojamiento
            </span>
            <span className="text-xs font-bold text-stone-900 truncate block">
              {data.title}
            </span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-3.5 h-3.5" />
            </div>
            <span>Compartir por WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              copied
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${copied ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'}`}>
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </div>
              <span>{copied ? '¡Enlace copiado!' : 'Copiar enlace'}</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
