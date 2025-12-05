declare module "react-google-recaptcha" {
    import * as React from "react";

    export interface ReCAPTCHAProps {
        sitekey: string;
        onChange?: (token: string | null) => void;
        onErrored?: () => void;
        onExpired?: () => void;
        theme?: "light" | "dark";
        size?: "compact" | "normal" | "invisible";
        tabindex?: number;
        badge?: "bottomright" | "bottomleft" | "inline";
        className?: string;
    }

    export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {
        execute?: () => void;
        reset?: () => void;
    }
}
