import { Link } from 'react-router-dom';
import { PropsWithChildren } from 'react';

type MainLayoutProps = PropsWithChildren<{}>;

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen text-gray-800">
      <header className="bg-blue-950 text-gray-300 p-4 border-b border-gray-900">
        <h1 className="text-xl">
          <Link to="/">HOME</Link>
        </h1>
      </header>
      <main className="bg-gray-100 flex-grow">{children}</main>
    </div>
  );
};
