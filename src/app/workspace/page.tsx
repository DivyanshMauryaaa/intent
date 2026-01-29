'use client'
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const Workspace = () => {
    return (
        <div className="p-6">
            <ArrowLeft size={24} className="cursor-pointer" onClick={() => window.history.back()} />
            <p className="text-7xl font-thin mt-5">Workspace</p>
        </div>
    )
}

export default Workspace;