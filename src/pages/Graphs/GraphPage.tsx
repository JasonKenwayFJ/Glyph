
 const GraphPage = () => {


    return (
        <div className={"graphPage"}>
            <div className={"graphCanvas"} onContextMenu={(e) => {
                e.preventDefault();

                console.log("Правый клик");
            }}>

            </div>
            <button>

            </button>
        </div>
    )
}
export default GraphPage