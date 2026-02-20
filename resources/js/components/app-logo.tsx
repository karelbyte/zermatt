export default function AppLogo() {
    return (
        <>
            <img
                src="/icono.png"
                alt="Zermatt"
                className="size-8 shrink-0 rounded-md object-contain"
            />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Zermatt
                </span>
            </div>
        </>
    );
}
