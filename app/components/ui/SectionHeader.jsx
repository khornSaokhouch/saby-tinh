"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

/* Helper Component for Countdown */
function CountdownTimer({ deadline }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(deadline).getTime() - now;
            
            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [deadline]);

    return (
        <div className="flex items-center gap-1.5 ml-4">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-lg">Ends In:</span>
            <div className="flex gap-1">
                {[
                    { label: 'd', value: timeLeft.days },
                    { label: 'h', value: timeLeft.hours },
                    { label: 'm', value: timeLeft.minutes },
                    { label: 's', value: timeLeft.seconds }
                ].map((unit, idx) => (
                    <div key={idx} className="flex flex-col items-center bg-slate-900 text-white min-w-[28px] py-1 rounded-lg shadow-sm border border-slate-700">
                        <span className="text-[11px] font-black tabular-nums leading-none">
                            {unit.value.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{unit.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function SectionHeader({ title, subtitle, icon: Icon, color, link, deadline, count }) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-2xl ${color} shadow-sm w-fit`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">{title}</h2>
                        {count !== undefined && (
                            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-md">
                                {count}
                            </span>
                        )}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{subtitle}</p>
                </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                {deadline && <CountdownTimer deadline={deadline} />}
                
                {link && (
                    <Link href={link} className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform border-l border-slate-200 pl-6 h-8">
                        View All <ChevronRight size={14} strokeWidth={3} />
                    </Link>
                )}
            </div>
        </div>
    );
}
