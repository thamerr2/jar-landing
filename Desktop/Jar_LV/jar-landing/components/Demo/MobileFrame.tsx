import { ReactNode } from 'react';

export default function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-[280px]">
      <div className="relative rounded-[40px] bg-gray-900 p-3 shadow-2xl border-4 border-gray-800">
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-xl z-10" />
        {/* Screen */}
        <div className="relative rounded-[30px] overflow-hidden bg-white" style={{ minHeight: 480 }}>
          <div className="overflow-auto h-[480px]">{children}</div>
        </div>
        {/* Home indicator */}
        <div className="mt-2 mx-auto w-16 h-1 bg-gray-600 rounded-full" />
      </div>
    </div>
  );
}
