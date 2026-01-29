'use client'
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import integrations from "@/lib/integrations";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Integrations = () => {
    return (
        <div className="p-6 space-y-5">
            <ArrowLeft size={24} className="cursor-pointer" onClick={() => window.history.back()} />
            <p className="text-7xl font-thin mt-5">Integrations</p>

            <div className="flex gap-3 flex-wrap">
                {integrations.map((integration: any, i: number) => (
                    <Card key={i} className="w-[400px]">
                        <CardHeader>
                            <Image 
                                src={integration.logo}
                                height={50}
                                width={50}
                                alt={integration.name}
                            />
                            <CardTitle>{integration.name}</CardTitle>
                            <CardDescription>{integration.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[50px] flex flex-wrap">
                            {integration.apps.map((app: any, i: number) => (
                                <p key={i}>{app}, &nbsp;</p>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button>Connect</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Integrations;