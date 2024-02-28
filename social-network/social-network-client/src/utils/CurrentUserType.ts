export interface CurrentUser {
    data: Data
}

export interface Data {
    id: string
    first_name: string
    last_name: string
    last_page: any
    email: string
    password: string
    location: any
    title: any
    description: any
    tags: any
    avatar: string
    language: any
    appearance: any
    theme_light: any
    theme_dark: any
    tfa_secret: any
    status: string
    role: string
}
