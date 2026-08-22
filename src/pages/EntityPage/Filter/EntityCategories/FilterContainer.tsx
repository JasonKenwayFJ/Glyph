import "./FilterContainer.css"
import FilterItem from "../FilterItem.tsx";
import {useEffect, useState} from "react";
import type {baseCharacteristic, baseEntity, characteristicWithEntities} from "../../../../../types/Entities.ts";
import {categoryService} from "../../../../services/entityServices/categoryService.ts";
import {tagService} from "../../../../services/entityServices/tagService.ts";
import {IconCategory2, IconTag} from "@tabler/icons-react";

type EntitiesProps = {
    data: baseEntity[];
    onFilter: (filtered: baseEntity[]) => void;
};
const FilterContainer = (
    {data, onFilter}: EntitiesProps
) => {

    const [categories, setCategories] = useState<characteristicWithEntities[]>([]);
    const [tags, setTags] = useState<characteristicWithEntities[]>([]);



    useEffect(() => {
        async function load() {
            const cats = await categoryService.getAllLocally();

            setCategories(
                cats.map((cat: baseCharacteristic) => ({
                    id: cat.id,
                    title: cat.title,
                    isSelected: false
                }))
            );

            const tags = await tagService.getAllLocally();

            setTags(
                tags.map((tag) => ({
                    id: tag.id,
                    title: tag.title,
                    isSelected: false
                }))
            );
        }

        load()
    }, []);

    return (
        <aside className="EntityCategories">
            <div>
                <FilterItem label={"Все"}
                            quantity={data.length}
                            icon={"◉"} mode={"main"}
                            onFilter={() => {
                                const allEntities = data;
                                onFilter(allEntities)
                            }}
                />
                <FilterItem mode={"empty"} onFilter={() => {
                }}/>

            </div>
            <div>
                <FilterItem label={"Категории"} quantity={data.length} icon={"◉"} mode={"main"} onFilter={() => {
                }}/>
                {categories.map((category) => (
                    <FilterItem
                        key={category.id}
                        label={category.title}
                        quantity={data.filter((c) => c.category.some((cat) => cat.id === category.id)).length}
                        icon={<IconCategory2 stroke={2} />}
                        onFilter={() => {
                            const filtered = data.filter((entity) =>
                                entity.category.some((cat) => cat.id === category.id)
                            );
                            onFilter(filtered);
                        }}
                    />
                ))}


            </div>
            <div>
                <FilterItem label={"Теги"} quantity={data.length} icon={"◉"} mode={"main"} onFilter={() => {
                }}/>
                {tags.map((tag) => (
                    <FilterItem
                        key={tag.id}
                        label={tag.title}
                        quantity={data.filter((c) => c.tags.some((cat) => cat.id === tag.id)).length}
                        icon={<IconTag stroke={2} />}
                        onFilter={() => {
                            const filtered = data.filter(entity =>
                                entity.tags.some((t) => t.id === tag.id)
                            );

                            onFilter(filtered);
                        }}
                    />
                ))}

            </div>
        </aside>
    )
}

export default FilterContainer;