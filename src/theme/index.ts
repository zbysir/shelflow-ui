import {createTheme} from '@mui/material/styles';
import colors from '../assets/scss/_themes-vars.module.scss'
import themePalette from './palette';

console.log("colors:",colors)
const themeOption = {
    darkTextPrimary: colors.paper,
    darkTextSecondary: colors.grey500,
}
const theme = createTheme({
    palette: themePalette(themeOption),
});

export default theme;