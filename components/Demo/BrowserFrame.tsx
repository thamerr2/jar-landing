import { ReactNode } from 'react';

export default function BrowserFrame({ children, title = 'jar.app' }: { children: ReactNode; title?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-2xl bg-white w-full">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <div className="flex-1 mx-3 flex items-center gap-2 bg-white rounded-full px-3 h-6 border border-gray-200">
          <svg className="w-3 h-3 text-gray-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-gray-400">{title}</span>
        </div>
      </div>
      <div className="overflow-auto max-h-[480px]">{children}</div>
    </div>
  );
}
