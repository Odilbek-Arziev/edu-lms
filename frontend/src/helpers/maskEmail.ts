export function maskEmail(email: string) {
    const [name, domain] = email.split("@");
    if (name.length <= 2) return email;
    return name[0] + "***" + name[name.length - 1] + "@" + domain;
}
