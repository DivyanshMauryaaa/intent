'use client'
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const Settings = () => {
    return (
        <div className="p-6">
            <ArrowLeft size={24} className="cursor-pointer" onClick={() => window.history.back()} />
            <p className="text-7xl font-thin mt-5">Settings</p>
        </div>
    )
}

export default Settings;