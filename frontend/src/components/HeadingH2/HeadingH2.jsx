function HeadingH2({children}) {
    return (
        <div className={`border-bottom border-warning border-3 pb-2 mb-3`}>
            <h2 className="text-primary">
                {children}
            </h2>
        </div>
    )
}

export default HeadingH2
