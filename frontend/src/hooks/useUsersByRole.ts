import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {User} from "../types/User";
import {usersThunks} from "../slices/users";

export function useUsersByRole(role: string) {
    const dispatch = useDispatch<any>()
    const [users, setUsers] = useState<User[]>([])
    const [usersLoaded, setUsersLoaded] = useState(false)

    useEffect(() => {
        dispatch(usersThunks.getUsers(role)).then((res: any) => {
            setUsers(res?.results || []);
            setUsersLoaded(true)
        });
    }, []);

    const usersOptions = users?.map((user: User) => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
    })) || [];

    return {users, usersOptions, usersLoaded}
}
