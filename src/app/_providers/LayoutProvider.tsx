import {ReactNode, useState} from "react";
import {useAtomValue} from "jotai";
import {useRouter} from "next/navigation";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';

import {currentUserAtom} from "@/atoms";
import { UserModel } from "@/models";

export interface PageConfig {
    name: string;
    requiredRole?: string;
}

interface ThemeProviderProps {
    pages: PageConfig[];
    links: {[name: string]: string};
    settings: Array<{label: string, onClick: () => void}>;
    children: ReactNode;
}

function filterPagesByUserRole(currentUser: UserModel | undefined, pages: PageConfig[]): string[] {
    const userRoles: string[] = currentUser?.roles ?? ['default'];

    const filteredPages = pages
        .filter(page => !page.requiredRole || userRoles.includes(page.requiredRole))
        .map(page => page.name)

    return filteredPages;
}

export const LayoutProvider = ({pages, links, settings, children}: ThemeProviderProps) => {
    const currentUser: UserModel | undefined = useAtomValue(currentUserAtom);
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const router = useRouter();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (page: string) => {
        const link: string = links[page];

        if (link) {
            router.push(link)
        }
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    console.log('Render LayoutProvider')

    const filteredPages: string[] = filterPagesByUserRole(currentUser, pages);

    return (<div>
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Mob Assist
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={!!anchorElNav}
                            onClose={() => handleCloseNavMenu('')}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {filteredPages.map((page: string) => (
                                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {filteredPages.map((page: string) => (
                            <Button
                                key={page}
                                onClick={() => handleCloseNavMenu(page)}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar>{userInitials(currentUser)}</Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={!!anchorElUser}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map(({label, onClick}) => (
                                <MenuItem key={label} onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center" onClick={onClick}>{label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
        <div style={{padding: '0 10px', margin: '0 auto'}}>
            {children}
        </div>
    </div>)
}

const userInitials = (user?: UserModel) => {
    if (!user) {
        return '--'
    }

    return user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase();
}
