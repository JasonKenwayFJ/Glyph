import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import "./TextNode.css"
type TextNodeProps = {
    data: {
        label: string;
    };
};

export function TextNode({ data }: TextNodeProps) {
    const [text, setText] = useState(data.label);

    return (
        <div className="text-node">

            <Handle
                type="target"
                position={Position.Top}
            />

            <label style={{display: "flex", flexDirection: "column"}}>
                Text:

                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="nodrag"
                />
            </label>

            <Handle
                type="source"
                position={Position.Bottom}
            />

        </div>
    );
}