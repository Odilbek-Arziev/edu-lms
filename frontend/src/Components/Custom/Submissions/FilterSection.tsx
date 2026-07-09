interface Props {
    text: string;
}

export function FilterSection({text}: Props) {
    return (
        <h6 className="text-uppercase fs-11 text-muted fw-semibold mt-4 mb-3 pb-2 border-bottom">
            {text}
        </h6>
    );
}