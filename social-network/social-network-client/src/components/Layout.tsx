import { ReactNode } from "react";
import Sidebar from "./Sidebar";

const Layout = ({children}: {children: ReactNode}) => {
    return (
        <>
            <aside>
                <Sidebar/>
            </aside>
            <main>
                {children}
            </main>
        </>
    );
}

export default Layout;