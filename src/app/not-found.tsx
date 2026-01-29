'use client'

import { Button } from "@/components/ui/button";

const notFound = () => {
    return (
        <div className="flex h-[99vh] flex-col items-center justify-center h-screen">
            <div className="w-[60%] m-auto h-auto">
                <p className="text-7xl font-thin">404</p>
                <p className="text-4xl font-thin">We're so sorry, the page you are looking for doesn't exist.</p>
                <Button onClick={() => window.history.back()} className="cursor-pointer">Take me back home...</Button>
            </div>
        </div>
    )
}

export default notFound;