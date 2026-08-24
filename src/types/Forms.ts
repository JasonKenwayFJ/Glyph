export type authForm = {
    email: string,
    password: string
}
export type registrationForm = authForm & {
    username: string,
}
