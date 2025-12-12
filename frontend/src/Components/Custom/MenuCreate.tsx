import React from 'react'
import MenuForm from "./MenuForm";

interface MenuCreateProps {
    onCancel: () => void;
    onSuccess: () => void;
}

export default function MenuCreate({onCancel, onSuccess}: MenuCreateProps) {
    async function onSubmit(data: any, actions: any) {
        // await request

        actions.resetForm()
        onSuccess()
    }

    return (
        <div>
            <b>Добавить новое меню</b><br/><br/>

            <MenuForm
                onSubmit={onSubmit}
                onCancel={onCancel}/>
        </div>
    )
}