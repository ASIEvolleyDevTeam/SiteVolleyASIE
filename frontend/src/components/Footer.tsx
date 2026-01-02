// FooterWithTooltips.tsx
import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={(e) => {
          // Ne pas masquer si la souris entre dans la boîte
          const tooltipElement = e.currentTarget.querySelector('.tooltip-content');
          if (tooltipElement && !tooltipElement.matches(':hover')) {
            setIsVisible(false);
          }
        }}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className="tooltip-content absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-white border border-gray-300 rounded-md shadow-lg z-50 text-sm"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content py-4 text-center text-sm">
      <p>
        Site développé par{' '}
        <Tooltip
          content={
            <div>
              <p className="font-semibold">Frédéric KAH</p>
              <p>Développeur web</p>
              <a
                href="https://www.linkedin.com/in/fr%C3%A9d%C3%A9ric-kah-7213a1354/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                LinkedIn
              </a>
            </div>
          }
        >
          <span className="font-semibold underline">Frédéric KAH</span>
        </Tooltip>{' '}
        et{' '}
        <Tooltip
          content={
            <div>
              <p className="font-semibold">Victor HALBITTE</p>
              <p>Développeur web</p>
              <a
                href="https://www.linkedin.com/in/victor-halbitte/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                LinkedIn
              </a>
            </div>
          }
        >
          <span className="font-semibold underline">Victor HALBITTE</span>
        </Tooltip>{' '}
        — ASIE Volley © {new Date().getFullYear()}
      </p>
      <div className="mt-1 space-x-4">
        <a
          href="https://www.linkedin.com/in/fr%C3%A9d%C3%A9ric-kah-7213a1354/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          LinkedIn
        </a>
        <a
          href="https://frkah.github.io/webdev_site_portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Portfolio
        </a>
      </div>
    </footer>
  );
};

export default Footer;
