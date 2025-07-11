import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Logo from "../logo";

const Header = () => {
    const { data: session } = useSession();
    const [user, setUser] = useState<{ user: any } | null>(null);
    const [sticky, setSticky] = useState(false);
    const pathname = usePathname();

    const handleScroll = () => {
        setSticky(window.scrollY >= 80);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [pathname]);

    const handleSignOut = () => {
        localStorage.removeItem("user");
        signOut();
        setUser(null);
    };

    return (
        <header className={`fixed top-0 z-50 w-full border-t-4 border-primary transition-all duration-500 ease-in-out before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-0 before:bg-primary before:transition-all before:duration-500 before:ease-in-out ${sticky ? "before:h-full" : "before:h-0"}`}>
            <div className="container">
                <nav className={`relative flex item-center justify-between ${sticky ? 'py-5' : 'py-7'}`}>
                    <div className='flex items-center'>
                        <Logo sticky={sticky} />
                    </div>
                    <div className="flex items-center gap-7">
                        <div className="flex items-center gap-3">
                            {user?.user || session?.user ? (
                                <>
                                    <div className="relative group flex items-center justify-center">
                                        <Image
                                            src="/images/avatar/avatar_1.jpg"
                                            alt="Image"
                                            width={35}
                                            height={35}
                                            quality={100}
                                            className="rounded-full cursor-pointer "
                                        />
                                        <p
                                            className="absolute w-fit text-sm font-medium text-center z-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 bg-gray text-white py-1 px-2 min-w-28 rounded-full shadow-2xl top-full left-1/2 transform -translate-x-1/2 mt-3"
                                        >
                                            {user?.user || session?.user?.name}
                                        </p>
                                    </div>
                                    <button onClick={handleSignOut} className="ml-2 flex items-center gap-2 text-secondary hover:text-white dark:border dark:border-primary dark:hover:text-white bg-primary dark:hover:bg-transparent dark:hover:border dark:hover:border-white hover:bg-secondary text-sm font-bold rounded-full py-1.5 px-4.5 transition-all duration-300 ease-in-out">
                                        Sign Out
                                        <Icon icon="solar:logout-outline" width="20" height="20" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="https://flasti.com/login" className="ml-2 flex items-center gap-2 text-white text-sm font-bold rounded-full border border-white bg-transparent py-1.5 px-4.5 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200">
                                        Iniciar sesión
                                    </Link>
                                    <Link href="https://flasti.com/signup" className="ml-2 flex items-center gap-2 text-white text-sm font-bold rounded-full border border-white bg-transparent py-1.5 px-4.5 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200">
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;
