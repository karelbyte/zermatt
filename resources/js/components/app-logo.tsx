export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <img
                src="/olla.png"
                alt="Zermatt"
                className="size-22 shrink-0 rounded-md object-contain"
            />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Zermatt
                </span>
            </div>
        </div>
    );
}
