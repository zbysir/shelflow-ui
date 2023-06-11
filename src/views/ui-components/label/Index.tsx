import {Typography} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {TypographyProps} from "@mui/material/Typography/Typography";

interface LabelTextProps extends TypographyProps {
    name: Record<string, string>,
    defaultValue?: string,
}

const lang = 'en'
export default function LabelText({name, defaultValue, ...props}: LabelTextProps) {
    const keys = name ? Object.keys(name) : []
    if (!name) return <Typography>{defaultValue}</Typography>
    if (name[lang]) {
        return <Typography {...props}>{name[lang]}</Typography>
    } else if (!name[lang] && name[keys[0]]) {
        return <Typography {...props}>{name[keys[0]]}</Typography>
    } else {
        return <Typography {...props}>{defaultValue}</Typography>
    }
}