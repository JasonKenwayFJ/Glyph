import "./../../MainStyles/Components/SearcherStyle.scss"
type SearcherProp = {
    placeholder: string;
    value: string;
    setSearch: (value: string) => void;
};

export const Searcher = (props: SearcherProp) => {
    return (
        <div>
            <input
                className="SearcherInput"
                placeholder={props.placeholder}
                value={props.value}
                onChange={(e) => props.setSearch(e.target.value)}
            />
        </div>
    );
};