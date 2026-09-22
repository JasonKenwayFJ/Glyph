export type ProjectDto = {
    title: string;
    description: string;
    imageSource: Source | null;
    thumbnail: string | null;
};
export type Source = "Url" | "File"; // подставь реальные варианты из Rust-enum Source