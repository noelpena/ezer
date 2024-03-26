import {
	Menu,
	Group,
	Center,
	Burger,
	Container,
	Title,
	Button,
	Drawer,
	NavLink,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconLogout, IconLogout2 } from "@tabler/icons-react";
import Image from "next/image";
import classes from "@/styles/HeaderMenu.module.css";
import { MouseEventHandler } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LinksGroup } from "./NavbarLinksGroup";

import {
	IconArticle,
	IconClipboardData,
	IconFilePlus,
} from "@tabler/icons-react";
const links = [
	{
		label: "View",
		icon: IconArticle,
		links: [
			{ link: "/view/records", label: "Records" },
			{ link: "/view/deposits", label: "Deposits" },
			{ link: "/view/members", label: "Members" },
		],
	},
	{
		label: "Create New",
		icon: IconFilePlus,
		links: [
			{ link: "/new/record", label: "Record" },
			{ link: "/new/deposit", label: "Deposit" },
			{ link: "/new/member", label: "Member" },
		],
	},
	{
		label: "Reports",
		icon: IconFilePlus,
		links: [
			{ link: "/admin/reports/diezmo", label: "Diezmo Report" },
			{
				link: "/admin/reports/department",
				label: "Departamento & Sociedad Report",
			},
		],
	},
	{ link: "/admin", label: "Admin", icon: IconClipboardData },
];

type AppProps = {
	isLoggedIn: boolean;
	handleSignOut: MouseEventHandler<HTMLButtonElement | HTMLElement>;
};

const HeaderMenu = ({ isLoggedIn, handleSignOut }: AppProps) => {
	const [opened, { toggle }] = useDisclosure(false);
	const router = useRouter();

	const items = links.map((link) => {
		const menuItems = link.links?.map((item) => (
			<Menu.Item key={item.link}>
				<Link href={item.link.toString()}>{item.label}</Link>
			</Menu.Item>
		));

		if (menuItems) {
			return (
				<Menu
					key={link.label}
					trigger="hover"
					transitionProps={{ exitDuration: 0 }}
					withinPortal
				>
					<Menu.Target>
						<Link
							href={link.link || "#"}
							className={classes.link}
							// onClick={(event) => event.preventDefault()}
						>
							<Center>
								<span className={classes.linkLabel}>
									{link.label}
								</span>
								<IconChevronDown size="0.9rem" stroke={1.5} />
							</Center>
						</Link>
					</Menu.Target>
					<Menu.Dropdown>{menuItems}</Menu.Dropdown>
				</Menu>
			);
		}

		return (
			<Link
				key={link.label}
				href={link.link || "#"}
				className={classes.link}
				// onClick={(event) => event.preventDefault()}
			>
				{link.label}
			</Link>
		);
	});

	const mobileItems = links.map((item) => (
		<LinksGroup {...item} key={item.label} />
	));
	return (
		<header className={classes.header}>
			<Container size="lg">
				<div className={classes.inner}>
					<Link href="/dashboard">
						<Title order={1}>Ezer</Title>
					</Link>
					<Group gap={5} visibleFrom="sm">
						{items}
					</Group>
					<Burger
						opened={opened}
						onClick={toggle}
						size="sm"
						hiddenFrom="sm"
						className="order-last"
					/>
					{isLoggedIn ? (
						<Button
							variant="filled"
							color="gray"
							onClick={handleSignOut}
							className="!hidden md:!block"
							leftSection={<IconLogout2 size={18} />}
						>
							Log Out
						</Button>
					) : (
						<Group visibleFrom="sm">
							<Button
								variant="filled"
								onClick={() => router.push("/")}
							>
								Login
							</Button>
							<Button>Sign up</Button>
						</Group>
					)}
				</div>
			</Container>
			<Drawer
				size="75%"
				position="right"
				opened={opened}
				onClose={toggle}
				padding="0"
				withCloseButton={false}
				withinPortal={true}
			>
				<div className="flex flex-col justify-between h-svh">
					{/* <div> */}
					<div>{mobileItems}</div>
					{/* <div className={classes.footer + " relative -top-[120px]"}> */}
					<div>
						<NavLink
							active={true}
							variant="filled"
							color="gray"
							onClick={handleSignOut}
							label="Sign out"
							className="bg-gray-500 hover:bg-gray-300"
							leftSection={
								<IconLogout stroke={1.5} size="1.25rem" />
							}
						/>
					</div>
				</div>
			</Drawer>
		</header>
	);
};

export default HeaderMenu;
