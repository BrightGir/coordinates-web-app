export const validateLoginUser = (user: string): string | null => {
    if(!user || !user.trim()) {
        return "Заполните имя пользователя";
    }

    return null;
}

export const validateLoginPassword = (password: string): string | null => {
    if(!password || !password.trim()) {
        return "Заполните пароль";
    }

    return null;
}

export const validateRegisterUser = (user: string): string | null => {
    if(!user || !user.trim()) {
        return "Заполните имя пользователя";
    }
    if(user.length < 4) {
        return "Имя пользователя должно содержать как минимум 4 символа";
    }
    if(user.length > 15) {
        return "Имя пользователя должно содержать не более 15 символов";
    }
    return null;
}

export const validateRegisterPassword = (password: string): string | null => {
    if(!password || !password.trim()) {
        return "Заполните пароль";
    }
    if(password.length < 6) {
        return "Пароль должен содержать как минимум 6 символов";
    }
    if(password.length > 30) {
        return "Пароль должен содержать не более 30 символов";
    }

    return null;
}

export const validateRegisterConfirmPassword = (firstPassword: string, secondPassword: string): string | null => {
    if(!secondPassword || !secondPassword.trim()) {
        return "Это обязательное поле";
    }
    if(firstPassword != secondPassword) {
        return "Пароли не совпадают"
    }
    return null;
}