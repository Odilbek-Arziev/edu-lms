import {useEffect} from "react";

export default function SocialCallback() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const dataParam = params.get("data");

        if (dataParam) {
            try {
                const data = JSON.parse(decodeURIComponent(dataParam));

                const channel = new BroadcastChannel("social_auth");
                channel.postMessage(data);
                channel.close();

                setTimeout(() => window.close(), 300);
            } catch (err) {
                console.error("Ошибка парсинга данных", err);
            }
        }
    }, []);

    return <div>Авторизация через соцсеть...</div>;
}
