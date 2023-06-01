import * as React from 'react';
import {Button, Typography, Box} from '@mui/material'
import Popover from '@mui/material/Popover';

const AddNode = ({nodes}) => {
    console.log('nodes:', nodes)
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
            className={'left-4 top-20'}
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
                    {nodes.map((node, index) => (
                        <Button variant="outlined"
                                key={index}
                                onDragStart={(event) => onDragStart(event, node)}
                                draggable
                        >{node.name['en']}</Button>
                    ))}
                </div>

            </Box>

        </Popover>
    </>
}

export default AddNode