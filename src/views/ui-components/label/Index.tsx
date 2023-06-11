import {Typography} from "@mui/material";

const lang = 'en'
export default function LabelText({name, defaultValue}: { name: { [propName: string]: any }, defaultValue?: string }) {
    const keys = name ? Object.keys(name) : []
    if (!name) return <Typography>{defaultValue}</Typography>
    if (name[lang]) {
        return <Typography>{name[lang]}</Typography>
    } else if (!name[lang] && name[keys[0]]) {
        return <Typography>{name[keys[0]]}</Typography>
    } else {
        return <Typography>{defaultValue}</Typography>
    }
}