interface Props {
    name: Record<string, any>;
    defaultValue?: string;
    className?: string
}

const lang = 'en'
export default function LabelText({name, defaultValue, className}: Props) {
    const keys = name ? Object.keys(name) : []
    let text = ''
    if (name) {
        if (name[lang]) {
            text = name[lang]
        } else if (!name[lang] && name[keys[0]]) {
            text = name[keys[0]]
        } else {
            text = defaultValue || ''
        }
    } else {
        text = defaultValue || ''
    }
    return <p className={`text-neuter-foreground ${className}`}>{text}</p>
}