'use client'
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const SettingsPage = ({ isPage = true }: { isPage?: boolean }) => {
    return (
        <div className="p-6">
            {isPage && <ArrowLeft size={24} className="cursor-pointer" onClick={() => window.history.back()} />}
            {isPage && <p className="text-7xl font-thin mt-5">Settings</p>}


        </div>
    )
}

export default SettingsPage;