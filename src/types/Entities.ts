export type baseEntity = {
    id: string,
    projectId: string,
    title: string,
    description: string,
    content: string,
    imagePath: string,
    category: baseCharacteristic[],
    tags: baseCharacteristic[],
    hasImage: boolean,
    createdAt: string,
    updatedAt: string,
    extraFields: { title: string, value: string }[]
}

export type baseCharacteristic = {
    id: string,
    title: string
}
export type characteristicWithEntities = baseCharacteristic & {
    cards?: baseEntity[],
    documents?: baseEntity[]
}



export type authForm = {
    email: string,
    password: string
}
export type registrationForm = authForm & {
    username: string,
}

