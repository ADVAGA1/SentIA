"use client";

export default function Header() {
    return (
        <header className="bg-white pl-2 pt-2 pb-4">
            <nav className="flex items-center justify-left lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">SentIA</span>
                        <img className="h-24 w-auto" src="/logo.png" alt="" />
                    </a>
                </div>
                <div className="lg:flex lg:gap-x-12">
                    <a href="/dashboard" className="text-sm font-semibold leading-6 text-gray-900 border-xl rounded-lg p-2 hover:bg-gray-200">Dashboard</a>
                    <a href="/about" className="text-sm font-semibold leading-6 text-gray-900 border-xl rounded-lg p-2 hover:bg-gray-200">About</a>
                    <a href="/contact" className="text-sm font-semibold leading-6 text-gray-900 border-xl rounded-lg p-2 hover:bg-gray-200">Contact</a>
                </div>
            </nav>
        </header>
    )
}