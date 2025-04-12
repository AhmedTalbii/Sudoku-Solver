import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 text-black py-4">
      <div className="text-center">
        <p>
          Created by{' '}
          <a
            href="https://github.com/AhmedTalbii"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-900 hover:underline"
          >
            Ahmed Talbi{' '}
          </a>
           with ♥
        </p>
      </div>
    </div>
  );
};

export default Footer;
