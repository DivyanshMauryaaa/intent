'use client'
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const Automations = () => {
    return (
        <div className="p-6">
            <ArrowLeft size={24} className="cursor-pointer" onClick={() => window.history.back()} />
            <p className="text-7xl font-thin mt-5">My Saved Automations</p>
        </div>
    )
}

export default Automations;