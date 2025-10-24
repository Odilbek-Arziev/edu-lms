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
                window.close();

            } catch (err) {
                console.error("❌ Ошибка парсинга данных", err);
            }
        } else {
            console.error("⚠️ Параметр data не найден");
        }
    }, []);

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>✅ Авторизация успешна!</h2>
            <p>Окно закроется автоматически...</p>
        </div>
    );
}