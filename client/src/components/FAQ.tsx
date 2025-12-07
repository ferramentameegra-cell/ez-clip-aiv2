import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  const { isDark } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`p-6 rounded-lg border transition-all duration-300 ${
              isDark
                ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            } cursor-pointer`}
            onClick={() => setOpenIndex(isOpen ? null : i)}
          >
            <div className={`flex items-center justify-between ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <h3 className="font-bold text-left pr-4">{item.question}</h3>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${
                  isOpen ? 'rotate-180' : ''
                } ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              />
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
              }`}
            >
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

