import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import FreightQuoteForm from '@/components/FreightQuoteForm';

export function ButtonShowcasePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="inline-flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
                aria-label="Go back to home page"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-white">Freight Quote</h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <FreightQuoteForm />
      </main>
    </div>
  );
}