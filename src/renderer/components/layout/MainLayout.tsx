import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import { Toaster } from '../ui/toaster';
import { GuiltTripSystem } from '../ui/GuiltTripSystem';
import { EasterEggSystem } from '../ui/EasterEggSystem';

export const MainLayout = () => {
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
            <Toaster />
            <GuiltTripSystem />
            <EasterEggSystem />
        </div>
    );
};
