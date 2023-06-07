import * as React from 'react';
import {Button, Typography, Box} from '@mui/material'
import Popover from '@mui/material/Popover';

interface Cate {
    category: {
        name: {
            'zh-CN': string;
            // 任意多个属性
            [propName: string]: any;
        }
    },
    children: any[]
}

const AddNode = ({comps}: { comps: Cate[] }) => {
    const onDragStart = (event: any, node: any) => {
        console.log('dragstart11111:', event);
        event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
        event.dataTransfer.effectAllowed = 'move';
    }
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return <>
        <Button
            aria-describedby={id}
            style={{position: 'absolute'}}
            sx={{zIndex: 100}}
            className={'left-4 top-10'}
            variant="outlined"
            onClick={handleClick}
        >
            添加
        </Button>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Box sx={{padding: 2, width: 300}}>
                <Typography>组件库</Typography>
                <div className='mt-2'>
                    {comps && comps.map((item: Cate, index: number) => (
                        <Box key={index} sx={{marginBottom: 2}}>
                            <Typography variant="body1" mt={2}>{item.category.name['zh-CN']}</Typography>
                            {item.children && item.children.map((child, i) => (
                                <Button
                                    draggable
                                    onDragStart={(event) => onDragStart(event, child)}
                                    variant="text" key={i}>{child.data.name['zh-CN']}</Button>
                            ))}
                        </Box>
                    ))}
                </div>

            </Box>

        </Popover>
    </>
}

export default AddNode