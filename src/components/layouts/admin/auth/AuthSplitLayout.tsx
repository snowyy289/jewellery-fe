import { ReactNode } from "react";

interface AuthSplitLayoutProps {
    leftPanel: ReactNode;
    rightPanel: ReactNode;
}

/**
 * AuthSplitLayout
 * Two-column layout: dark visual panel (hidden on mobile) + white form panel.
 * Usage: <AuthSplitLayout leftPanel={<AuthLeftPanel .../>} rightPanel={<AuthFormCard .../>} />
 */
export default function AuthSplitLayout({ leftPanel, rightPanel }: AuthSplitLayoutProps) {
    return (
        <main className="min-h-screen flex" style={{ background: "#f8fafc" }}>
            {/* Left: hidden on mobile/tablet, visible lg+ */}
            <div className="hidden lg:flex lg:w-1/2">
                {leftPanel}
            </div>
            {/* Right: full width on mobile, half on lg+ */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 relative">
                {/* Mobile background orb */}
                <div className="absolute inset-0 lg:hidden pointer-events-none overflow-hidden">
                    <div
                        className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full opacity-30"
                        style={{ background: "radial-gradient(circle, #e0e7ff, transparent)" }}
                    />
                    <div
                        className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full opacity-20"
                        style={{ background: "radial-gradient(circle, #fce7f3, transparent)" }}
                    />
                </div>
                <div className="w-full max-w-md relative z-10">
                    {rightPanel}
                </div>
            </div>
        </main>
    );
}
