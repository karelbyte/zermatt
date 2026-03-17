import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type JsonViewerProps = {
    data: any;
    initialExpanded?: boolean;
    level?: number;
};

export function JsonViewer({ data, initialExpanded = false, level = 0 }: JsonViewerProps) {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    if (data === null) return <span className="text-red-400">null</span>;
    if (typeof data === 'undefined') return <span className="text-gray-400">undefined</span>;

    if (typeof data !== 'object') {
        if (typeof data === 'string') return <span className="text-black font-semibold">"{data}"</span>;
        if (typeof data === 'number') return <span className="text-blue-400">{data}</span>;
        if (typeof data === 'boolean') return <span className="text-yellow-400">{String(data)}</span>;
        return <span>{String(data)}</span>;
    }

    const isArray = Array.isArray(data);
    const keys = Object.keys(data);
    const isEmpty = keys.length === 0;

    if (isEmpty) {
        return <span>{isArray ? '[]' : '{}'}</span>;
    }

    return (
        <div className={cn("font-mono", level > 0 && "ml-4")}>
            <div 
                className="inline-flex items-center cursor-pointer hover:bg-muted/50 rounded px-1 -ml-1 transition-colors"
                onClick={toggleExpand}
            >
                {isExpanded ? <ChevronDown className="size-3 mr-1" /> : <ChevronRight className="size-3 mr-1" />}
                <span className="text-muted-foreground">{isArray ? '[' : '{'}</span>
                {!isExpanded && <span className="text-muted-foreground mx-1">...</span>}
                {!isExpanded && <span className="text-muted-foreground">{isArray ? ']' : '}'}</span>}
                {!isExpanded && <span className="text-[10px] ml-2 opacity-50">({keys.length})</span>}
            </div>

            {isExpanded && (
                <div className="border-l border-muted-foreground/20 ml-1.5 pl-2 my-1">
                    {keys.map((key, index) => (
                        <div key={key} className="flex flex-col py-0.5">
                            <div className="flex items-start">
                                {!isArray && (
                                    <span className="text-gray-600 font-semibold mr-2 shrink-0">
                                        {key}:
                                    </span>
                                )}
                                <div className="min-w-0 flex-1">
                                    <JsonViewer 
                                        data={data[key]} 
                                        initialExpanded={false} 
                                        level={level + 1} 
                                    />
                                    {index < keys.length - 1 && <span className="text-muted-foreground">,</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isExpanded && (
                <div className="text-muted-foreground">
                    {isArray ? ']' : '}'}
                </div>
            )}
        </div>
    );
}
