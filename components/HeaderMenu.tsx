import {
	Menu,
	Group,
	Center,
	Burger,
	Container,
	Title,
	Button,
	Drawer,
	Flex,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	IconChevronDown,
	IconLogout,
	IconSwitchHorizontal,
} from "@tabler/icons-react";
import Image from "next/image";
import classes from "@/styles/HeaderMenu.module.css";
import { MouseEventHandler } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LinksGroup } from "./NavbarLinksGroup";

import {
	IconNotes,
	IconArticle,
	IconClipboardData,
	IconFilePlus,
} from "@tabler/icons-react";
const links = [
	// { link: "/view/records", label: "View Records" },
	{
		label: "View",
		icon: IconArticle,
		links: [
			{ link: "/view/records", label: "Records" },
			{ link: "/view/deposits", label: "Deposits" },
		],
	},
	{
		label: "Create New",
		icon: IconFilePlus,
		links: [
			{ link: "/new/record", label: "Record" },
			{ link: "/new/deposit", label: "Deposit" },
			{ link: "/resources", label: "Department" },
			{ link: "/community", label: "Member" },
			{ link: "/blog", label: "Balance" },
		],
	},
	{ link: "/about", label: "Reports", icon: IconClipboardData },
];

type AppProps = {
	isLoggedIn: boolean;
	handleSignOut: MouseEventHandler<HTMLButtonElement>;
};

const HeaderMenu = ({ isLoggedIn, handleSignOut }: AppProps) => {
	const [opened, { toggle }] = useDisclosure(false);
	// const [opened, { open, close }] = useDisclosure(false);
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

	// const mobileItems = links.map((item: any) => (
	// 	<LinksGroup {...item} key={item.label} />
	// ));
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
						>
							Sign out
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
				title="Menu"
			>
				<div className="flex flex-col justify-between h-svh relative">
					<div>{mobileItems}</div>
					<div className={classes.footer + " relative -top-[120px]"}>
						<Button
							variant="subtle"
							color="gray"
							onClick={handleSignOut}
						>
							Sign out
						</Button>
					</div>
				</div>
			</Drawer>
		</header>
	);
};

export default HeaderMenu;
