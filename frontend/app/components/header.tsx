import Image from 'next/image'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

export default function Header() {
    return (
        <header className="w-full h-20 fixed top-0 left-0 z-50 flex justify-between items-center px-[3%] py-4">
            {/* Logo + Title */}
            <div className="flex items-center gap-3">
                <Image
                    src="/images/logo.png"
                    width={40}
                    height={40}
                    alt="Sudoku Logo"
                />
                <h1 className="text-black font-bold text-xl font-semibold">Sudoku Solver 9x9</h1>
            </div>

            {/* GitHub Button */}
            <Link
                href="https://github.com/your-username/your-repo" // <- Change this to your real GitHub repo link
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white bg-black hover:bg-gray-800 px-4 py-2 rounded-lg transition"
            >
                <FaGithub className="text-xl" />
                <span className="hidden sm:inline">View on GitHub</span>
            </Link>
        </header>
    )
}
