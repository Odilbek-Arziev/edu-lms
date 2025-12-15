export const flattenMenu = (items: any[], parent: string | null = null): any[] => {
    let result: any[] = [];

    items.forEach((item) => {
        result.push({
            id: item.id,
            title: item.title,
            url_path: item.url_path,
            status: item.status,
            parent: parent,
            roles: item.groups
        })

        if (item?.children && item.children?.length > 0) {
            result = result.concat(flattenMenu(item.children, item.title))
        }
    })

    return result
}
