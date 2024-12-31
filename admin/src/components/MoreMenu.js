import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../components/Iconify';

// ----------------------------------------------------------------------

export default function MoreMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  function handleClick(event) {
    event.preventDefault()
    props.deleteHandler([props.id]);
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={(e) => handleClick(e)}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        { props.active ? ( <MenuItem sx={{ color: 'text.secondary' }} onClick={(e) => deactivateClick(e)}>
          <ListItemIcon>
            <Iconify icon="flat-color-icons:cancel" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Deactivate" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>) :
         (<MenuItem sx={{ color: 'text.secondary' }} onClick={(e) => activateClick(e)}>
          <ListItemIcon>
          <Iconify icon="subway:tick" color="#409c52" />
          </ListItemIcon>
          <ListItemText primary="Activate" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem> )
         }
        
      </Menu>
    </>
  );
}
